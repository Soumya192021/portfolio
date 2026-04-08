// Tailwind Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "on-secondary-fixed-variant": "#2f2ebe",
                "secondary-fixed-dim": "#c0c1ff",
                "tertiary-fixed-dim": "#ddb7ff",
                "on-tertiary-fixed": "#2c0051",
                "on-error-container": "#ffdad6",
                "on-tertiary-container": "#400071",
                "on-secondary-fixed": "#07006c",
                "on-surface": "#dae2fd",
                "surface-tint": "#7bd0ff",
                "tertiary-container": "#b76dff",
                "secondary": "#c0c1ff",
                "error-container": "#93000a",
                "on-primary-fixed-variant": "#004c69",
                "on-primary-fixed": "#001e2c",
                "surface-variant": "#2d3449",
                "error": "#ffb4ab",
                "primary-container": "#009bd1",
                "on-secondary-container": "#b0b2ff",
                "surface-container-low": "#131b2e",
                "tertiary": "#ddb7ff",
                "secondary-fixed": "#e1e0ff",
                "primary-fixed-dim": "#7bd0ff",
                "surface-container-highest": "#2d3449",
                "inverse-primary": "#00668a",
                "on-tertiary": "#490080",
                "primary-fixed": "#c4e7ff",
                "surface": "#0b1326",
                "on-surface-variant": "#c2c6d6",
                "tertiary-fixed": "#f0dbff",
                "outline-variant": "#424754",
                "on-error": "#690005",
                "on-secondary": "#1000a9",
                "on-primary": "#00354a",
                "on-tertiary-fixed-variant": "#6900b3",
                "surface-bright": "#31394d",
                "background": "#0b1326",
                "surface-container-high": "#222a3d",
                "surface-container-lowest": "#060e20",
                "surface-dim": "#0b1326",
                "inverse-surface": "#dae2fd",
                "on-primary-container": "#002d40",
                "outline": "#8c909f",
                "inverse-on-surface": "#283044",
                "on-background": "#dae2fd",
                "secondary-container": "#3131c0",
                "surface-container": "#171f33",
                "primary": "#7bd0ff"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "fontFamily": {
                "headline": ["Manrope"],
                "body": ["Inter"],
                "label": ["Inter"]
            }
        },
    },
};

// ScrollSpy Interaction for the Dock
const scrollSpy = () => {
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".dock-item");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${current}`) {
                item.classList.add("active");
            }
        });
    });
};

// Reveal Animation on Scroll
const revealOnScroll = () => {
    const reveals = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
};

// Typing Effect
const initTypingEffect = () => {
    const textElement = document.getElementById("typing-text");
    if (!textElement) return;

    const words = ["Digital Space", "Portfolio"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 150;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500;
        }

        setTimeout(type, typeDelay);
    };

    setTimeout(type, 1000);
};

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
    scrollSpy();
    revealOnScroll();
    initTypingEffect();
});
