# Portfolio — Jashanpreet Singh

Professional portfolio site for Jashanpreet Singh, Network Security Engineer
(Toronto, Canada): about, experience, skills, certifications, projects,
auto-updating lab notes (Medium series), and contact.

Live at: https://jashan-khaira.github.io/portfolio/

The site is plain static HTML/CSS/JS (`index.html`, `styles.css`, `app.js`).
- `posts.json` — lab-notes entries, newest first. Each entry:
  `{"date": "YYYY-MM-DD", "title": "...", "description": "...",
    "image": "photos/<hero-file>", "url": "<medium-url>" | null}`.
  A null `url` falls back to the Medium profile. New daily drafts append
  an entry here (see the publish-daily-on-medium goal notes).
- `photos/` — lab illustrations, reused as blog card thumbnails. Staged by
  `../stage.py` from the Medium files dir; see `../blogs.json` registry.
