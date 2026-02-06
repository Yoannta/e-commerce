document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
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

    // Apply reveal to elements
    const revealElements = document.querySelectorAll('.course-card, .hero-content, .hero-visual');
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

    // Sticky Nav shadow on scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});

// CSS for reveal animations (to be injected or added to style.css)
const style = document.createElement('style');
style.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
