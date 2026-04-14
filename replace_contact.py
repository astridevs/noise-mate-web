import sys

with open("contact.html", "r") as f:
    content = f.read()

# Replace CSS
css_start = content.find("        /* Bento Grid for Contact Methods */")
css_end = content.find("    </style>")
if css_start == -1 or css_end == -1:
    print("CSS block not found")
    sys.exit(1)

css_new = """        /* Split Layout Grid */
        .contact-split {
            max-width: 1200px;
            margin: 0 auto 6rem;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 5rem;
            align-items: start;
            position: relative;
            z-index: 2;
        }

        /* Left Side: Contact Info */
        .contact-info {
            padding-top: 2rem;
        }

        .contact-info h2 {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            letter-spacing: -1.5px;
            color: var(--text-color);
        }

        .contact-info > p {
            font-size: 1.15rem;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 3.5rem;
        }

        .info-list {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .info-icon {
            width: 56px;
            height: 56px;
            background: rgba(22, 76, 120, 0.08); /* Derived from primary */
            color: var(--primary);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        .info-item:hover .info-icon {
            background: var(--primary);
            color: white;
            transform: scale(1.05) rotate(-5deg);
        }

        .info-text h4 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            color: var(--text-color);
        }

        .info-text p, .info-text a {
            font-size: 1rem;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .info-text a:hover {
            color: var(--primary);
        }

        /* Right Side: Form Card */
        .form-section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 32px;
            padding: 3.5rem;
            box-shadow: 0 20px 40px var(--shadow-color);
            transition: all 0.3s ease;
        }

        .form-header {
            margin-bottom: 2.5rem;
        }

        .form-header h2 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
        }

        .contact-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        .form-group.full { grid-column: span 2; }

        .form-label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.75rem;
            color: var(--text-muted);
        }

        .form-input, .form-textarea, .form-select {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid transparent;
            border-radius: 16px;
            padding: 1.25rem;
            font-family: inherit;
            font-size: 1rem;
            color: var(--text-color);
            transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
            outline: none;
            border-color: var(--primary);
            background: var(--bg-secondary);
            box-shadow: 0 0 0 4px rgba(22, 76, 120, 0.1);
        }

        .form-textarea {
            height: 150px;
            resize: none;
        }

        .submit-btn {
            grid-column: span 2;
            background: var(--primary);
            color: white;
            padding: 1.25rem;
            border-radius: 100px;
            border: none;
            font-weight: 800;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.75rem;
        }

        .submit-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(22, 76, 120, 0.3);
        }

        @media (max-width: 1024px) {
            .contact-split {
                grid-template-columns: 1fr;
                gap: 4rem;
                max-width: 800px;
            }
            .contact-info {
                padding-top: 0;
                text-align: center;
            }
            .contact-info > p {
                margin: 0 auto 2.5rem;
            }
            .info-list {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                gap: 2rem;
            }
            .info-item {
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                text-align: center;
                min-width: 150px;
            }
        }

        @media (max-width: 640px) {
            .contact-form { grid-template-columns: 1fr; }
            .form-group.full { grid-column: span 1; }
            .submit-btn { grid-column: span 1; }
            .info-list { flex-direction: column; gap: 1.5rem; align-items: stretch; }
            .info-item { flex-direction: row; text-align: left; }
            .contact-info h2 { font-size: 2.5rem; }
            .form-section { padding: 2.5rem 1.5rem; border-radius: 24px; }
        }
"""
content = content[:css_start] + css_new + content[css_end:]

# Replace HTML
html_start = content.find("    <main class=\"container\">")
html_end = content.find("    <!-- Footer -->")
if html_start == -1 or html_end == -1:
    print("HTML block not found")
    sys.exit(1)

html_new = """    <main class="contact-split">
        <!-- Left Side: Contact Information -->
        <div class="contact-info">
            <h2>Let's talk about your project</h2>
            <p>Our team is dedicated to providing you with the best environmental noise monitoring solutions. Get in touch with us today.</p>
            
            <div class="info-list">
                <a href="mailto:support@noisemate.co.uk" class="info-item" style="text-decoration: none;">
                    <div class="info-icon"><i class="fas fa-envelope"></i></div>
                    <div class="info-text">
                        <h4>Email Us</h4>
                        <p>support@noisemate.co.uk</p>
                    </div>
                </a>
                
                <a href="tel:+441234567890" class="info-item" style="text-decoration: none;">
                    <div class="info-icon"><i class="fas fa-phone"></i></div>
                    <div class="info-text">
                        <h4>Call Us</h4>
                        <p>+44 (0) 123 456 7890</p>
                    </div>
                </a>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
                    <div class="info-text">
                        <h4>Location</h4>
                        <p>United Kingdom HQ</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Contact Form -->
        <section class="form-section">
            <div class="form-header">
                <h2>Send a Message</h2>
                <p style="color: var(--text-muted);">Fill out the form below and we'll reply within 24 hours.</p>
            </div>
            <form id="contact-form" class="contact-form">
                <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input type="text" id="firstName" class="form-input" placeholder="John" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Last Name</label>
                    <input type="text" id="lastName" class="form-input" placeholder="Doe">
                </div>
                <div class="form-group full">
                    <label class="form-label">Email Address *</label>
                    <input type="email" id="email" class="form-input" placeholder="john@example.com" required>
                </div>
                <div class="form-group full">
                    <label class="form-label">How did you hear about us? *</label>
                    <select id="source" class="form-select" required>
                        <option value="" disabled selected>Select an option</option>
                        <option value="Search Engine">Search Engine</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend/Colleague">Friend/Colleague</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group full">
                    <label class="form-label">Your Message *</label>
                    <textarea id="message" class="form-textarea" placeholder="Tell us how we can help..." required></textarea>
                </div>
                <button type="submit" id="submit-btn" class="submit-btn">
                    <span id="submit-text">Send Message</span>
                    <i class="fas fa-paper-plane" style="font-size: 0.9em; margin-left: 4px;"></i>
                </button>
            </form>
            <div id="form-message" style="display:none; margin-top: 2rem; padding: 1rem; border-radius: 12px; text-align: center; font-weight: 700;"></div>
        </section>
    </main>

"""
content = content[:html_start] + html_new + content[html_end:]

with open("contact.html", "w") as f:
    f.write(content)

print("contact.html updated successfully!")
