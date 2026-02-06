document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Initialization
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP & ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    // 3. Liquid Depth Logic (Skew on scroll)
    const layers = document.querySelectorAll('.liquid-layer');
    lenis.on('scroll', (e) => {
        const velocity = e.velocity * 0.1; // Scale down the effect
        const skew = Math.min(Math.max(velocity, -1.5), 1.5);

        layers.forEach(layer => {
            gsap.to(layer, {
                skewY: skew,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });

    // 4. Parallax Hero Elements
    gsap.to('.main-card', {
        y: -100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    gsap.to('.top-right', {
        y: -150,
        x: 50,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // 5. Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.course-card, .section-header, .glass-card, .mentor-card');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Animate bars in hero card on load
    const bars = document.querySelectorAll('.bar');
    setTimeout(() => {
        bars.forEach(bar => {
            const height = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
            }, 100);
        });
    }, 500);

    // Sticky Nav Shadow
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

// CSS for reveal animations
const style = document.createElement('style');
style.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
