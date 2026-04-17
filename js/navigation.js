/**
 * Global Navigation and Theme Logic Injection
 */

document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById('global-nav');
    if (!navPlaceholder) return;

    // Detect page depth to adjust relative paths
    const path = window.location.pathname;
    const isSubDir = path.includes('/blog/') || path.includes('/contact/') || path.includes('/help/') || 
                     path.includes('/compliance/') || path.includes('/privacy/') || path.includes('/terms/') ||
                     path.includes('/how-it-works/');
    const base = isSubDir ? '../' : '';

    const isHomePage = (path.endsWith('index.html') || path.endsWith('/')) && !isSubDir;

    const desktopMenu = isHomePage ? 
        `<li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li>` : 
        `<li><a href="${base}index.html">Home</a></li>`;

    const pillMenu = isHomePage ? 
        `<a href="#features">Features</a><a href="#pricing">Pricing</a>` : 
        `<a href="${base}index.html">Home</a>`;

    const navHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <ul class="nav-menu">
                    ${desktopMenu}
                    <li><a href="${base}how-it-works/">How it Works</a></li>
                    <li><a href="${base}blog.html">Community</a></li>
                    <li><a href="${base}contact.html">Contact</a></li>
                </ul>
            </div>
        </nav>

        <div class="floating-pill" id="floatingPill">
            ${pillMenu}<a href="${base}how-it-works/">How it Works</a><a href="${base}blog.html">Community</a><a href="${base}contact.html">Contact</a>
        </div>
    `;

    navPlaceholder.innerHTML = navHTML;

    // Initialize Scroll Logic
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
    }

    // Handle smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
