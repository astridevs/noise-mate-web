import glob
import re

html_files = glob.glob('*.html')

unified_nav = """    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html" style="display: flex; align-items: center; text-decoration: none;">
                    <img src="assets/logo.png" alt="Noise Mate Logo">
                </a>
            </div>
            <button class="hamburger-menu" id="hamburgerMenu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="index.html#features">Features</a></li>
                <li><a href="index.html#pricing">Pricing</a></li>
                <li><a href="blog.html">Community</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <div class="nav-auth-buttons">
                <a href="http://localhost:3000/login" class="nav-signin-btn">Sign In</a>
                <a href="http://localhost:3000/dashboard" class="nav-profile-icon" title="View Dashboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </a>
            </div>
        </div>
    </nav>

    <!-- Floating Pill Navigation -->
    <div class="floating-pill" id="floatingPill">
        <a href="index.html#features">Features</a>
        <a href="index.html#pricing">Pricing</a>
        <a href="blog.html">Community</a>
        <a href="contact.html">Contact</a>
    </div>"""

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # We will use regex to find from <!-- Navigation --> down to the end of <div class="floating-pill"...></div>
    # In some files, the floating pill might be separated.
    # We will extract <!-- Navigation --> down to </nav>
    content = re.sub(r'<!-- Navigation -->\s*<nav.*?<\/nav>', '<!-- Navigation -->\n    <nav>TMP_NAV</nav>', content, flags=re.DOTALL)
    
    # We will extract <div class="floating-pill"...>...</div>
    # First, let's find if it exists
    if 'class="floating-pill"' in content:
        content = re.sub(r'<div class="floating-pill".*?<\/div>', '<div class="floating-pill">TMP_PILL</div>', content, flags=re.DOTALL)
    
    # Now replace the temp markers. Wait, actually we can just replace the Navigation and Floating Pill blocks individually.
    # Replace nav block
    nav_only = unified_nav.split('<!-- Floating Pill Navigation -->')[0].strip()
    pill_only = '<!-- Floating Pill Navigation -->\n' + unified_nav.split('<!-- Floating Pill Navigation -->')[1].strip()
    
    content = re.sub(r'<!-- Navigation -->\s*<nav>TMP_NAV<\/nav>', nav_only, content)
    
    if '<div class="floating-pill">TMP_PILL</div>' in content:
        content = content.replace('<div class="floating-pill">TMP_PILL</div>', '\n    ' + pill_only + '\n')
    else:
        # If it didn't have a floating pill, insert it after the nav
        content = content.replace('</nav>', '</nav>\n\n    ' + pill_only)
        
    # Also fix index.html removing <!-- Website v... --> if it remained
    with open(f, 'w') as file:
        file.write(content)

print("Unified HTML applied.")
