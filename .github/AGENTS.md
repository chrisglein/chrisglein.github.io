# Agent Guide — chrisglein.github.io

Practical, hard-won notes for AI agents (and humans) working on this repository. Read this before making changes; it will save you the mistakes that were already made once.

> Location note: this file lives in `.github/`, which Jekyll ignores completely (any dot-folder is excluded from the build). That means it is **never published** to the live site and is **never Liquid-processed** — so the `{% ... %}` examples below are safe as literal text. Keep agent docs in `.github/`; do not move them to the repo root, where Jekyll would try to publish/process them.

## What this repo is

- A **Jekyll** static site deployed to **GitHub Pages** at **https://chrisglein.com** (see `CNAME`).
- Two kinds of content share the repo:
  - A **blog** (`_posts/`, tag pages, home feed, RSS).
  - A set of **board-game project pages** — each game has its own top-level folder (e.g. `dragon-family/`, `rum-runner/`, `heist/`, `studies-in-sorcery/`) with an `index.md`, rules, and a `media/` gallery.
- Ruby gems: `jekyll` + `jekyll-paginate` (see `Gemfile`). Jekyll 4.x.

## How it deploys (production)

- Pushing to the **`deploy` branch** triggers `.github/workflows/jekyll-gh-pages.yml`, which builds with **plain Jekyll** (`actions/jekyll-build-pages`, source `./`) and publishes to GitHub Pages.
- Production builds use **`_config.yml` only** — it does **not** apply `_config.dev.yml`. So anything you do in the dev config is local-only and never ships.

## Repository layout (the parts that matter)

| Path | What it is |
| --- | --- |
| `_config.yml` | Production config. `url: https://chrisglein.com`, `baseurl: /`, `paginate: 3`. Has **no `exclude` list** — leave it that way (see gotchas). |
| `_config.dev.yml` | **Local-only** fast-build overrides. Never used in production. |
| `_posts/` | Blog posts (`YYYY-MM-DD-slug.md`). ~180 of them. |
| `_layouts/` | `base` → `default`/`page`/`post`. `post` and `page` render inside `base`. |
| `_includes/` | `head`, `sidebar`, `footer`, `gallery`, `pagination`, `post-series`, `post-tags`, `post-related`, `tag-page`. |
| `tags/` | One page per surfaced tag: `tags/<slug>.md` containing `{% include tag-page.html tag="<slug>" %}`. |
| `topics.html` | The "browse every topic" index page. |
| `index.html` | Home page: three feature tiles + paginated post feed. |
| `media/` | Shared images. `media/home/` holds the home-tile images; `media/posts/` holds post images; `media/<icon>.png` are the play-badge icons. |
| `public/css/` | `poole.css`, `lanyon.css`, `syntax.css`, and **`site.css`** (all custom styling lives in `site.css`). |
| `<game>/media/images/` + `<game>/media/thumbnails/` | Full gallery images and their thumbnails (see Images). |
| `sw.js` | A service worker. It caches an **Offline** fallback — this bites you during local dev (see gotchas). |

## Local development

The site builds under **WSL (Ubuntu)** with Ruby/Bundler/Jekyll. From Windows:

```
wsl -d Ubuntu -- bash -lc "cd /mnt/c/Users/chris/source/repos/chrisglein.github.io ; bundle exec jekyll serve --config _config.yml,_config.dev.yml"
```

Then view at **http://localhost:4000** (a Playwright MCP browser can navigate and screenshot it).

- If gems are missing (`Bundler::GemNotFound`), run `bundle install` from the repo dir inside WSL first.
- The build is **slow** — the repo lives on the Windows-mounted `/mnt/c`, and WSL2 file I/O there is the bottleneck. A cold production-config build is ~180s. With `_config.dev.yml` it drops to ~40–70s.

### The fast dev config (`_config.dev.yml`)

It exists purely to make the local inner loop bearable. It does three things:

1. Sets `fast_dev: true`, which `_includes/footer.html` uses to **skip `post-related.html`** — an O(n²) "related posts" scan (it compares every document to every post) that is the single biggest build-time cost.
2. `exclude:`s the heavy game-media folders (`media`, `portfolio`, and each game project dir) so they aren't copied.
3. `include:`s just the handful of specific images the static chrome needs (home tiles, about photo) back in, since their parent `media/` dir is excluded.

Serve with `--config _config.yml,_config.dev.yml` to use it. **Consequences to expect locally:** game-project pages/galleries and post media 404 (excluded), and "related posts" won't appear. For full fidelity, serve with **`_config.yml` only** (slow).

## CRITICAL gotchas (these already cost real time)

1. **Never pass `--host 0.0.0.0`.** Jekyll sets `site.url` from `--host` during `serve`, so `absolute_url` emits `http://0.0.0.0:4000/public/css/...`. Browsers reject `0.0.0.0` as a client address (`ERR_ADDRESS_INVALID`) → the page renders **completely unstyled**. Just use the default host.
2. **Never set `limit_posts`.** `index.html` links a specific 2011 post via `{% post_url /2011-04-28-music-made-me %}`; pruning posts makes that `post_url` fail and **breaks the whole build**.
3. **Service worker caches an "Offline" page.** After a broken render, `sw.js` keeps serving the cached fallback (symptom: page title is `Offline · Chris Glein`). Fix in the browser: unregister service workers and clear caches, then reload. In Playwright: `navigator.serviceWorker.getRegistrations()` → unregister, `caches.keys()` → delete, then navigate again.
4. **WSL2 does not auto-rebuild on Windows-side edits.** inotify doesn't fire for changes VS Code makes to `/mnt/c` files, so `jekyll serve --watch` never regenerates. After editing, **kill and restart** the serve process to pick up changes.
5. **Config changes need a restart too.** Jekyll reads `_config*.yml` once at startup.
6. **Stale Jekyll processes hold port 4000.** Killing the VS Code terminal doesn't reliably kill the WSL-side process, so the next `serve` fails with `EADDRINUSE`. Clear them first: `wsl -d Ubuntu -- bash -lc "pkill -9 -f jekyll"`.
7. **Do not casually add an `exclude:` to `_config.yml`.** It currently has none, so Jekyll uses its defaults (which keep `Gemfile`, `vendor/`, `node_modules`, etc. out of the build). Setting `exclude` **replaces** those defaults — get it wrong and you start publishing `Gemfile`. If you must exclude something in production, replicate Jekyll's full default list too. (This is also why agent docs live in `.github/` instead.)

## Content conventions

### Sidebar (`_includes/sidebar.html`)

Three sections, in order:

- **Pages** — top-level pages with `sidebar_order` in front matter (Home, Game Design, Pedalboard, About). The loop deliberately skips pages that also have `sidebar: true` (those are topics).
- **Topics** — generated from `tags/*.md` pages that set `sidebar: true`, ordered by `sidebar_order`, with a live post count from `site.tags[node.tag]`. To surface a new topic in the sidebar, add this to its tag page's front matter — **no edit to `sidebar.html` needed**:

  ```yaml
  sidebar: true
  tag: board-games        # the tag slug, used for the count
  sidebar_order: 20
  ```

  The "Topics" heading links to `topics.html` (the full index).
- **Series** — a short, curated list. "Music Made Me" is resolved via `site.posts | where: "series", "Music Made Me" | first`; "Year in Review" links to its tag page. This is intentionally hand-curated, not generated.

### Posts

- Post footer (`_includes/footer.html`, rendered only for pages with `page.date`) shows **series nav** (`post-series.html`), **clickable tags** (`post-tags.html`), and **related posts** (`post-related.html`, skipped when `site.fast_dev`).
- **Series** are declared with `series: <Name>` in a post's front matter (e.g. `series: Music Made Me`). `post-series.html` builds prev/next-in-series nav from that.
- **Tag pages**: create `tags/<slug>.md` with `title`, `description`, and `{% include tag-page.html tag="<slug>" %}`. Add the `sidebar: true`/`tag:`/`sidebar_order:` trio if it should appear in the sidebar.

### Home tiles (`index.html`)

Three `.feature` cards, each with an `<img>` from **`media/home/<name>.jpg`** (`game-design.jpg`, `music-made-me.jpg`, `year-in-review.jpg`), styled by `.feature img` in `site.css` (uniform 16:10 crop via `object-fit: cover`). When you change a tile image, update `index.html` and the `include:` list in `_config.dev.yml` (so it previews locally).

### Pagination (`_includes/pagination.html` + `.index-pagination` in `site.css`)

The home/feed pager renders as two equal "Older | Newer" boxes filling each half of a 2-column grid, centered text. Disabled ends are a muted `<span>` (still boxed). Scoped via the `index-pagination` class so it doesn't affect the series prev/next styling.

## Images

### Game-project galleries are automatic

`_includes/gallery.html` (invoked as `{% include gallery.html folder="<game>/media/images" %}`) loops over **every** `.jpg`/`.png` static file in that folder (newest first) and renders each one's thumbnail from the page's `thumbsurl` folder. So to add a gallery image there are exactly two steps and **no list to edit**:

1. Put the full image in `<game>/media/images/`.
2. Put a **same-filename** thumbnail in `<game>/media/thumbnails/`.

The dragon-family thumbnails are all **267×200** (4:3). Match the existing convention for that game.

### Web-sizing targets

Source photos are often multi-MB iOS exports (2000–5000px). Downsize them:

| Use | Target | Notes |
| --- | --- | --- |
| Home tiles (`media/home/`) | **600×375** (16:10) | ~40–70 KB |
| About photo (`media/about/`) | **~700px wide** | goes full-width on mobile, so needs headroom; ~90 KB |
| Game gallery thumbnails | **267×200** (dragon-family convention) | ~15–30 KB |

There is no image build step — resize manually. A reusable cover-crop resize (run inline in PowerShell, do **not** stage a throwaway `.ps1`):

```powershell
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile($in)
$tw = 600; $th = 375                                   # target size (16:10 here)
$scale = [Math]::Max($tw/$src.Width, $th/$src.Height)  # cover
$sw = [int][Math]::Round($src.Width*$scale); $sh = [int][Math]::Round($src.Height*$scale)
$bmp = New-Object System.Drawing.Bitmap($tw, $th)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, [int](($tw-$sw)/2), [int](($th-$sh)/2), $sw, $sh)   # center-crop
$src.Dispose()                                          # release lock before saving to same path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
$bmp.Save($out, $enc, $ep); $g.Dispose(); $bmp.Dispose()
```

### Leave structural HTML alone when tidying posts

Old posts mix HTML into their Markdown. Converting inline `<a href>` → `[]()` and `<em>`/`<b>` → `*`/`**` is fine, but **do not touch** these — they have no clean Markdown equivalent:

- `<p class="playLine">` lines and their `<span class="playIcon ...">` badges (the "Played on / Watched on" rows).
- `<iframe>` embeds (Spotify, YouTube).
- `<a href="..."><img class="book" ...></a>` book-cover links (the `class` drives styling).

## Verifying changes

Use the local server + a browser (Playwright MCP works well) at `localhost:4000`. Remember: after any rebuild, clear the service worker if you get the Offline page; and the dev config hides game media, so preview game/gallery pages with the full (`_config.yml`-only) build when you need to see their imagery.
