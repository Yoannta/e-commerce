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

    // 3. Ghost UI / Bento Interactivity
    const bentoCards = document.querySelectorAll('.bento-card');

    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Entrance animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: Math.random() * 0.3
        });
    });

    // 4. Liquid Depth Logic (Subtle Skew on scroll)
    const layers = document.querySelectorAll('.liquid-layer');
    lenis.on('scroll', (e) => {
        const velocity = e.velocity * 0.05;
        const skew = Math.min(Math.max(velocity, -1), 1);

        layers.forEach(layer => {
            gsap.to(layer, {
                skewY: skew,
                duration: 0.4,
                ease: 'power1.out'
            });
        });
    });

    // 5. Reveal animations on other elements
    const revealElements = document.querySelectorAll('.section-header, .glass-card, .mentor-card, .about-content');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Stick Nav logic
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
});
