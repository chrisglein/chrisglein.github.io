# Copilot instructions — chrisglein.github.io

This repo is a **Jekyll** static site (blog + board-game portfolio) deployed to **GitHub Pages** at **https://chrisglein.com**. It builds under WSL and deploys automatically when you push the **`deploy`** branch.

**Read the full agent guide before making changes: [AGENTS.md](AGENTS.md) (in this `.github/` folder).** It covers local dev, the fast-build config, content conventions (sidebar/topics/series/tiles), image sizing, and the galleries.

Do-not-break quick reference:

- Serve locally in WSL: `bundle exec jekyll serve --config _config.yml,_config.dev.yml`, then open `localhost:4000`. Production uses `_config.yml` only — `_config.dev.yml` is a local fast-build override that skips the O(n²) related-posts include and heavy game media.
- **Never** pass `--host 0.0.0.0` (makes `absolute_url` emit `0.0.0.0`, so CSS 404s and the page renders unstyled). **Never** set `limit_posts` (breaks a `{% post_url %}` on the home page → build fails).
- WSL doesn't auto-rebuild on Windows-side edits — **kill and restart** the serve process to pick up changes (config changes too). If port 4000 is stuck: `wsl -d Ubuntu -- bash -lc "pkill -9 -f jekyll"`.
- If a page renders as `Offline · Chris Glein`, it's the service worker (`sw.js`) — unregister service workers + clear caches in the browser, then reload.
- Do **not** add an `exclude:` to `_config.yml` (it has none; setting one replaces Jekyll's defaults and can start publishing `Gemfile`/`vendor`). Keep agent docs in `.github/`, which Jekyll ignores.
- Sidebar topics are data-driven: add `sidebar: true` + `tag:` + `sidebar_order:` to a `tags/<slug>.md` page — no template edit needed.
- Game galleries auto-discover images: drop the full image in `<game>/media/images/` and a same-filename thumbnail (dragon-family uses 267×200) in `<game>/media/thumbnails/`.
