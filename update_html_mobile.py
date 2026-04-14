#!/usr/bin/env python3
import re
import os

# Define the files to update
files = [
    "/Users/davidmadienguela/Documents/Vscode/Flutter/noise_mate/Website/contact.html",
    "/Users/davidmadienguela/Documents/Vscode/Flutter/noise_mate/Website/compliance.html",
    "/Users/davidmadienguela/Documents/Vscode/Flutter/noise_mate/Website/blog.html",
    "/Users/davidmadienguela/Documents/Vscode/Flutter/noise_mate/Website/help-center.html",
    "/Users/davidmadienguela/Documents/Vscode/Flutter/noise_mate/Website/index.html",
]

# Hamburger menu CSS to add
hamburger_css = """        /* Mobile Menu */
        .hamburger-menu {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0.5rem;
            z-index: 1001;
        }

        .hamburger-menu span {
            width: 25px;
            height: 3px;
            background: var(--text-color);
            border-radius: 2px;
            transition: all 0.3s ease;
        }

        .hamburger-menu.active span:nth-child(1) {
            transform: rotate(45deg) translate(10px, 10px);
        }

        .hamburger-menu.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger-menu.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
"""

# Media queries to add
media_queries = """        @media (min-width: 769px) {
            .hamburger-menu {
                display: none !important;
            }

            .nav-links {
                position: relative !important;
                top: auto !important;
                right: auto !important;
                width: auto !important;
                height: auto !important;
                background: transparent !important;
                flex-direction: row;
                padding: 0 !important;
                gap: 2rem !important;
                border-top: none !important;
                transition: none !important;
            }
        }

        @media (max-width: 768px) {
            html { font-size: 15px; }
            
            body { font-size: 15px; }

            .hamburger-menu {
                display: flex;
            }

            .nav-container {
                padding: 1rem 1.2rem;
                gap: 1rem;
            }

            .nav-logo {
                font-size: 1.2rem;
            }

            .nav-links {
                position: fixed;
                top: 56px;
                right: -100%;
                width: 100%;
                height: calc(100vh - 56px);
                background: var(--bg-primary);
                flex-direction: column;
                padding: 2rem 1.5rem;
                gap: 1.5rem;
                border-top: 1px solid var(--border-color);
                list-style: none;
                transition: right 0.3s ease;
                z-index: 1000;
                overflow-y: auto;
            }

            .nav-links.active {
                right: 0;
            }

            .nav-links a {
                display: block;
                padding: 0.5rem 0;
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            html { font-size: 14px; }
            
            body { font-size: 14px; }
        }
"""

# JavaScript to add before </body>
js_code = """
    <script>
        // Hamburger Menu Toggle
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navLinks = document.getElementById('navLinks');

        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', function() {
                hamburgerMenu.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    hamburgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.navbar')) {
                    hamburgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    </script>
"""

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    
    # Step 1: Add hamburger menu CSS after .btn-primary-small:hover
    if ".btn-primary-small:hover" in content and ".hamburger-menu {" not in content:
        pattern = r'(\.btn-primary-small:hover[^}]*\})'
        match = re.search(pattern, content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + '\n\n' + hamburger_css + content[insert_pos:]
    
    # Step 2: Add media queries before </style>
    if "@media (min-width: 769px)" not in content:
        content = content.replace('    </style>', '\n' + media_queries + '    </style>')
    
    # Step 3: Update navbar HTML
    # For files with .nav-links div:
    if '<div class="nav-links">' in content and 'hamburger-menu' not in content:
        # Add hamburger button after nav-logo
        content = re.sub(
            r'(<a href="[^"]*" class="nav-logo">[^<]*</a>)',
            r'\1\n            <button class="hamburger-menu" id="hamburgerMenu">\n                <span></span>\n                <span></span>\n                <span></span>\n            </button>',
            content
        )
        # Update nav-links to have id
        content = content.replace('            <div class="nav-links">', '            <div class="nav-links" id="navLinks">')
    
    # For files with ul.nav-menu instead of div.nav-links:
    elif '<ul class="nav-menu">' in content and 'hamburger-menu' not in content:
        # Add hamburger button after nav-logo
        content = re.sub(
            r'(<a href="[^"]*" class="nav-logo">[\s\S]*?</a>)',
            r'\1\n            <button class="hamburger-menu" id="hamburgerMenu">\n                <span></span>\n                <span></span>\n                <span></span>\n            </button>',
            content
        )
        # Update nav-menu to nav-links and add id
        content = content.replace('<ul class="nav-menu">', '<ul class="nav-links" id="navLinks">')
        # Update CSS references
        content = content.replace('.nav-menu {', '.nav-links {')
        content = content.replace('.nav-menu a', '.nav-links a')
    
    # Step 4: Add JavaScript before </body>
    if "Hamburger Menu Toggle" not in content:
        content = content.replace('</body>', js_code + '\n</body>')
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

# Process all files
updated_count = 0
for filepath in files:
    if os.path.exists(filepath):
        if process_file(filepath):
            filename = filepath.split('/')[-1]
            print(f"✅ Updated: {filename}")
            updated_count += 1
        else:
            filename = filepath.split('/')[-1]
            print(f"⏭️  Already updated: {filename}")
    else:
        print(f"❌ File not found: {filepath}")

print(f"\n✅ Total files updated: {updated_count}/5")
