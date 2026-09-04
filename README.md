# CISSP Study Site

https://dagadjno.github.io/cissp-study-site/

Static, offline-capable PWA with CISSP study notes, flashcards, and practice
questions. Served via GitHub Pages.

Content under `data/` is synced automatically from a private study repo —
don't edit it here; it gets overwritten on the next sync.

- `data/domains/` — notes per CISSP domain (markdown)
- `data/flashcards/` — curated flashcard decks (JSON)
- `data/quizzes/` — curated practice questions (JSON)
- `data/index.json` — generated manifest the app reads

App shell: `index.html`, `css/`, `js/`, `sw.js` (service worker, offline cache).

Deploy rule: when changing app code (html/css/js), bump the `?v=` on the
css/js links in `index.html` AND the `CACHE` name in `sw.js` together —
that keeps html and assets in lockstep across the Pages CDN and the
service-worker cache. Data-only changes (`data/`) need no bump.
