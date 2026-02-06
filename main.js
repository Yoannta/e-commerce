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

    // 3. Nexus Gate Morphing Logic (Restored)
    const nexusPath = document.getElementById('nexus-path');
    const paths = [
        "M200,40 C110,40 40,110 40,200 C40,290 110,360 200,360 C290,360 360,290 360,200 C360,110 290,40 200,40 Z",
        "M200,60 C130,20 20,130 60,200 C100,270 130,380 200,340 C270,300 380,270 340,200 C300,130 270,100 200,60 Z",
        "M200,30 C100,30 30,150 40,220 C50,290 150,370 200,370 C250,370 350,290 360,220 C370,150 300,30 200,30 Z"
    ];

    let currentPath = 0;
    function morphNexus() {
        if (!nexusPath) return;
        currentPath = (currentPath + 1) % paths.length;
        gsap.to(nexusPath, {
            duration: 3,
            attr: { d: paths[currentPath] },
            ease: "sine.inOut",
            onComplete: morphNexus
        });
    }
    morphNexus();

    // 4. Fragments Magnetic Orbit (Restored)
    const fragments = document.querySelectorAll('.fragment');
    fragments.forEach((frag, i) => {
        // Floating animation
        gsap.to(frag, {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            rotation: "random(-5, 5)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
        });

        // Scroll assembly
        const speed = parseFloat(frag.dataset.speed) || 1;
        gsap.to(frag, {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom center",
                scrub: speed,
            },
            x: -window.innerWidth * 0.4,
            y: 300 + (i * 100),
            opacity: 0,
            scale: 0.5,
            ease: "power2.inOut"
        });
    });

    // 5. Ghost UI / Bento Interactivity
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

        // Rotate Nexus on scroll (Restored)
        gsap.to('.nexus-ring', {
            rotation: e.animatedScroll * 0.05,
            duration: 0.5
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
