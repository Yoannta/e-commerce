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

    // 3. Nexus Gate Morphing Logic
    const nexusPath = document.getElementById('nexus-path');
    const paths = [
        "M200,40 C110,40 40,110 40,200 C40,290 110,360 200,360 C290,360 360,290 360,200 C360,110 290,40 200,40 Z", // Circle
        "M200,60 C130,20 20,130 60,200 C100,270 130,380 200,340 C270,300 380,270 340,200 C300,130 270,100 200,60 Z", // Amoeba 1
        "M200,30 C100,30 30,150 40,220 C50,290 150,370 200,370 C250,370 350,290 360,220 C370,150 300,30 200,30 Z"  // Amoeba 2
    ];

    let currentPath = 0;
    function morphNexus() {
        currentPath = (currentPath + 1) % paths.length;
        gsap.to(nexusPath, {
            duration: 3,
            attr: { d: paths[currentPath] },
            ease: "sine.inOut",
            onComplete: morphNexus
        });
    }
    morphNexus();

    // 4. Fragments Magnetic Orbit
    const fragments = document.querySelectorAll('.fragment');

    // Float animation
    fragments.forEach((frag, i) => {
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
    });

    // Scroll Assembly Logic
    fragments.forEach((frag, i) => {
        const speed = parseFloat(frag.dataset.speed) || 1;

        gsap.to(frag, {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom center",
                scrub: speed,
            },
            x: -window.innerWidth * 0.4, // Pull towards the center/left content
            y: 300 + (i * 100),
            opacity: 0,
            scale: 0.5,
            ease: "power2.inOut"
        });
    });

    // 4.5 Focus-Stack Catalog Logic (Readability Correction)
    const slices = document.querySelectorAll('.slice');
    const slicesContainer = document.querySelector('.slices-container');

    if (slicesContainer && slices.length > 0) {
        const sliceTL = gsap.timeline({
            scrollTrigger: {
                trigger: slicesContainer,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: true,
                snap: {
                    snapTo: 1 / (slices.length - 1),
                    duration: { min: 0.4, max: 0.8 },
                    delay: 0.1,
                    ease: "power2.inOut"
                },
                anticipatePin: 1
            }
        });

        slices.forEach((slice, i) => {
            // Initial state
            gsap.set(slice, { opacity: 0, y: 100, scale: 0.8 });

            // Entrance
            sliceTL.to(slice, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power3.out"
            }, i * 2);

            // Exit (if not last)
            if (i < slices.length - 1) {
                sliceTL.to(slice, {
                    opacity: 0,
                    y: -100,
                    scale: 1.1,
                    duration: 1,
                    ease: "power3.in"
                }, (i * 2) + 1.2);
            }
        });
    }

    // 5. Liquid Depth Logic (Skew on scroll)
    const layers = document.querySelectorAll('.liquid-layer');
    lenis.on('scroll', (e) => {
        const velocity = e.velocity * 0.1;
        const skew = Math.min(Math.max(velocity, -1.5), 1.5);

        layers.forEach(layer => {
            gsap.to(layer, {
                skewY: skew,
                duration: 0.3,
                ease: 'power1.out'
            });
        });

        // Rotate Nexus on scroll
        gsap.to('.nexus-ring', {
            rotation: e.animatedScroll * 0.05,
            duration: 0.5
        });
    });

    // 6. Reveal animations on scroll
    const revealElements = document.querySelectorAll('.course-card, .section-header, .glass-card, .mentor-card, .about-content');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Stick Nav logic
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});
