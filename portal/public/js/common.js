/**
 * Noise Mate - Global Interactions
 * Handles mouse tracking for dynamic background & theme coordination
 */

// 1. Mouse Tracking for Dynamic Background Spotlight
// This updates CSS variables --mouse-x and --mouse-y on the root element
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
});

// 2. Service Worker Registration for Image Caching & Performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// 3. Global Page Transitions (Fade Out / Fade In)
// Intercept clicks on internal links to trigger fade-out animation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    // Check if it's a valid internal link navigating to a new page
    if (link && 
        link.href && 
        link.target !== '_blank' && 
        link.hostname === window.location.hostname && 
        !link.href.includes('#') && 
        !link.hasAttribute('download') &&
        !link.getAttribute('href').startsWith('javascript:')) {
            
        e.preventDefault();
        const targetUrl = link.href;
        
        document.body.classList.add('page-exiting');
        
        // Wait for fade-out animation to complete (300ms) before navigating
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 300); 
    }
});

// For Safari/Firefox back-forward cache compatibility
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        document.body.classList.remove('page-exiting');
    }
});
