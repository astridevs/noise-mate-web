import re

# Append CSS to techy.css
with open("css/techy.css", "a") as f:
    f.write("""
/* Global Navbar & Floating Pill */
.navbar {
    position: fixed;
    top: 0;
    background: transparent !important;
    z-index: 1000;
    width: 100%;
    display: block;
    transition: all 0.3s ease;
    border-bottom: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

.navbar.scrolled {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-20px);
}

.floating-pill {
    position: fixed;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    padding: 1.1rem 2.5rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
    .floating-pill {
        background: rgba(15, 23, 42, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }
}

.floating-pill.active {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
}

.floating-pill:hover, .floating-pill.active:hover {
    transform: translateX(-50%) scale(1.08);
}

.floating-pill a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    white-space: nowrap;
}

.floating-pill a:hover {
    color: var(--primary);
}
""")

# Append JS to common.js
with open("js/common.js", "a") as f:
    f.write("""
// Global Floating Pill Logic
document.addEventListener("DOMContentLoaded", () => {
    const floatingPill = document.getElementById('floatingPill');
    const navbar = document.querySelector('.navbar');
    let pillVisible = false;

    if (floatingPill && navbar) {
        window.addEventListener('scroll', () => {
            const threshold = 150;
            const shouldShowPill = window.scrollY > threshold;
            
            if (shouldShowPill) {
                if (!pillVisible) {
                    pillVisible = true;
                    floatingPill.classList.add('active');
                    navbar.classList.add('scrolled');
                }
            } else {
                if (pillVisible) {
                    pillVisible = false;
                    floatingPill.classList.remove('active');
                    navbar.classList.remove('scrolled');
                }
            }
        });

        document.querySelectorAll('.floating-pill a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => {
                            pillVisible = false;
                            floatingPill.classList.remove('active');
                        }, 300);
                    }
                }
            });
        });
    }
});
""")
