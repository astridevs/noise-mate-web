import sys

with open("blog.html", "r") as f:
    content = f.read()

# Replace CSS
css_start = content.find("        /* Consistency with Mobile/App Style previously requested */")
css_end = content.find("    </style>")
if css_start == -1 or css_end == -1:
    print("CSS block not found")
    sys.exit(1)

css_new = """        /* Clean Glassmorphic Blog Card */
        .blog-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            height: 100%;
        }

        .blog-card:hover {
            transform: translateY(-8px);
            border-color: var(--primary);
            box-shadow: 0 20px 40px var(--shadow-color);
        }

        .blog-card-content {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            flex: 1;
        }

        /* Inline Header: Avatar, Name, Date */
        .blog-meta-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }

        .blog-avatar {
            width: 48px;
            height: 48px;
            background: rgba(22, 76, 120, 0.1);
            border-radius: 50%; /* Circle avatar for feed */
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.2rem;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        .blog-card:hover .blog-avatar {
            background: var(--primary);
            color: white;
            transform: scale(1.05);
        }

        .blog-meta-details {
            display: flex;
            flex-direction: column;
        }

        .blog-meta-name {
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--text-color);
            letter-spacing: 0.2px;
        }

        .blog-meta-date {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        /* Main Content Typography */
        .blog-header h3 {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--text-color);
            line-height: 1.3;
            letter-spacing: -0.5px;
            margin-bottom: 0.5rem;
        }

        .gallery-container {
            border-radius: 16px;
            overflow: hidden;
            display: grid;
            gap: 4px;
            margin: 0.5rem 0;
        }

        .gallery-1 { height: 260px; }
        .gallery-2 { height: 200px; grid-template-columns: 1fr 1fr; }
        .gallery-3 { height: 200px; grid-template-columns: 1.8fr 1fr; }

        .gallery-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .blog-card:hover .gallery-container img {
            transform: scale(1.03);
        }

        .blog-excerpt {
            color: var(--text-muted);
            font-size: 1rem;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex: 1; /* Pushes the read-more link to the bottom */
        }

        .read-more-link {
            margin-top: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary);
            font-weight: 700;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .blog-card:hover .read-more-link {
            color: var(--text-color);
        }

        .read-more-link i {
            transition: transform 0.3s ease;
        }

        .blog-card:hover .read-more-link i {
            transform: translateX(6px);
            color: var(--primary);
        }

        @media (max-width: 1024px) {
            .hero-title { font-size: 4rem; }
            .blog-grid { grid-template-columns: 1fr; }
        }
"""
content = content[:css_start] + css_new + content[css_end:]

# Replace JS Card String
js_start = content.find("                        <div class=\"blog-card-content\">")
js_end = content.find("                    `;")
if js_start == -1 or js_end == -1:
    print("JS string not found")
    sys.exit(1)

js_new = """                        <div class="blog-card-content">
                            <div class="blog-meta-header">
                                <div class="blog-avatar"><i class="fas ${iconClass}"></i></div>
                                <div class="blog-meta-details">
                                    <span class="blog-meta-name">${authorName}</span>
                                    <span class="blog-meta-date">${date}</span>
                                </div>
                            </div>
                            <div class="blog-header">
                                <h3>${post.title}</h3>
                                ${post.subtitle ? `<p style="font-size: 0.95rem; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">${post.subtitle}</p>` : ''}
                            </div>
                            ${renderGallery(post.image_urls, post.cover_image_url)}
                            <p class="blog-excerpt">${post.content}</p>
                            <div class="read-more-link">Read post <i class="fas fa-arrow-right"></i></div>
                        </div>
"""
content = content[:js_start] + js_new + content[js_end:]

with open("blog.html", "w") as f:
    f.write(content)

print("blog.html updated successfully!")
