# FuturistikZone Restoration Implementation Plan

> **For agentic workers:** Implement this plan task by task after the user reviews it. Keep a recovery log and verify each milestone before moving to the next.

**Goal:** Restore the original FuturistikZone publication from Internet Archive captures as a static, indexable Next.js site ready for Netlify.

**Architecture:** A resumable offline recovery pipeline discovers original URLs, selects captures, extracts editorial content and assets, and writes a provenance manifest plus local content files. The App Router reads those files at build time and exports HTML for every recovered route. A small client-side search index supplies search without an application server.

**Tech stack:** Latest stable Next.js at implementation time, React, strict TypeScript, npm, CSS Modules/global CSS, Playwright, static JSON or Markdown content, Netlify static hosting.

**Specification:** The user's pasted brief at `/Users/bilginkocak/.codex/attachments/73a85447-9315-4ec9-b720-c971c188a7d0/Pasted text.txt`.

## Current findings and constraints

- The project directory is empty and has no Git repository. Repository initialization is part of implementation, not this planning step.
- The [9 February 2026 homepage capture](https://web.archive.org/web/20260209013603/https://futuristikzone.com/) opens in the browser. It identifies WordPress theme `soledad-ver-7-9-4`, uses Source Sans Pro for body text, and shows a large image slider, a Çevre & Enerji section, a Son Teknoloji Gelişmeleri feed, a right sidebar, newsletter area, and footer. The feed displays pagination through page 8. These are preliminary observations; measurements and responsive screenshots remain in the first implementation milestone.
- The [Willow article capture](https://web.archive.org/web/20250703113935/https://futuristikzone.com/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/) exposes the full sample body, date, author, categories, tags, and original upload URL. This confirms that structured extraction is feasible for at least one post.
- Direct shell DNS resolution for `web.archive.org` failed, and the browser blocked the CDX endpoint during this planning pass. Archived HTML pages were accessible through the browser. The first implementation milestone must establish a repeatable way to fetch or export archive pages; if CDX stays unavailable, crawl linked archive pages and record discovery coverage explicitly.
- Do not infer corpus size from the visible sidebar category counts, because posts can belong to multiple categories and captures may be incomplete.

## Global constraints

- Restore the archived appearance and Turkish editorial content; do not redesign, invent text, invent metadata, or substitute unrelated stock images.
- Use `output: 'export'` and `trailingSlash: true`. Every published article and category must have static, indexable HTML.
- Keep the site independent of WordPress, Wayback, and a database at runtime.
- Preserve original paths, dates, authors, categories, tags, provenance, and image aspect ratios whenever recoverable.
- Prefer the latest successful capture on or before **9 February 2026** for each URL. Record any exception and its reason.
- Exclude Wayback chrome, rewritten archive links, archive scripts, dead WordPress forms, and unverified social destinations from the rebuilt site.
- Do not alter GoDaddy DNS or existing MX, SPF, DKIM, or DMARC records. Do not provision paid services.

## File map

| Path | Responsibility |
| --- | --- |
| `archive-reference/` | Archived screenshots at 1440, 768, and 390 px; HTML/CSS notes and measurements. |
| `scripts/archive/` | URL normalization, capture selection, fetch/cache, crawl, extraction, asset download, and reporting. |
| `content/articles/` | One source file per recovered article, named by original slug. |
| `content/categories/` | Verified category names, slugs, and hierarchy. |
| `content/pages/` | Recovered About and Contact editorial content. |
| `content/manifest.json` | Every discovered original URL, type, capture attempts, chosen capture, and recovery status. |
| `content/assets.json` | Original asset URL, chosen capture, local file, checksum, dimensions, and status. |
| `public/images/archive/` | Verified local copies of recovered editorial assets. |
| `src/lib/content/` | Typed schemas, build-time loading, sorting, pagination, and search-index generation. |
| `src/components/` | Archive-matched header, slider, cards, sidebar widgets, footer, article body, and search UI. |
| `src/app/` | Static homepage, article, category, author, tag if warranted, paginated feed, About, Contact, search, and 404 routes. |
| `src/styles/` | Measured colors, type, spacing, and responsive rules. |
| `tests/` | Extraction fixtures, route/link/content checks, and focused browser tests. |
| `reports/` | Recovery totals, missing pages/assets, capture provenance, visual comparison notes, and migration report. |
| `netlify.toml`, `README.md` | Static deployment configuration and operating instructions. |

## Milestone 1 — Archive audit and access proof

**Deliverable:** `archive-reference/` with reference screenshots and a written layout/content inventory before any frontend implementation.

1. Open the February 2026 homepage and the supplied article, About, Contact, AI category, and page 2 captures. Inspect available author and other category pages by following original links. Try the latest successful capture no later than 9 February 2026 where a supplied URL points to an older capture.
2. Capture desktop, tablet, and mobile screenshots at approximately 1440, 768, and 390 px, excluding the Wayback toolbar from measurements. Record header/logo dimensions, fonts and weights, grid widths, column ratio, slider and card image ratios, breakpoints, spacing, sidebar order, footer, and mobile behavior. Save the archive URL and timestamp beside each reference.
3. Determine an archive ingestion method usable by scripts. Try CDX once for each relevant host/protocol family, then archived sitemap or WordPress sitemap paths, pagination/category/author traversal, and links inside articles. Record which methods succeeded and failed. Verify one article HTML capture and one original image can be saved locally with their source URLs and valid content types.
4. Build a short visual inventory that identifies Soledad structures to reproduce and WordPress/Wayback behavior to omit. Note any missing capture or conflicting snapshots rather than guessing.

**Gate:** A rerunnable archive fetch path and at least one article-plus-image extraction are demonstrated. If programmatic network access remains blocked, document the blocker and use browser-assisted export for the available corpus before claiming broad recovery is feasible.

## Milestone 2 — Discovery and recovery pipeline

**Deliverable:** A rerunnable command that populates `content/manifest.json`, `content/articles/`, `content/categories/`, `content/pages/`, and `reports/recovery-summary.md` without duplicates.

1. Normalize HTTP/HTTPS and `www` variants to canonical original paths while retaining exact path spelling and trailing slash. Classify homepage pagination, articles, categories, author archives, tags, About, Contact, assets, and irrelevant WordPress endpoints. Test percent-encoded Turkish paths, query strings, duplicate captures, and paths containing dates.
2. Discover URLs from CDX when reachable, then crawl homepage pages 1–8, every linked category page and its pagination, author pages, tag pages, and article cross-links. Add a URL to the manifest before attempting recovery so failures remain visible. Store discovery source and timestamp.
3. For each URL, choose the latest successful HTML capture on or before the cutoff. If that body is partial or damaged, inspect older captures and retain the most complete legitimate body. Record the chosen capture and rejected alternatives. Use bounded concurrency, retry with backoff, cache responses, and resume from the manifest.
4. Extract titles, slugs, publication dates, authors, category URLs, tag URLs, excerpts, article body blocks, headings, lists, quotes, links, captions, image references, SEO fields where present, and provenance. Strip archive rewrite prefixes and WordPress-generated interactive markup without altering original prose. Preserve UTF-8 and semantic heading order.
5. Validate each article against a typed schema. Mark `complete` only when the title, original path, date, author, body, and ending are supported by the capture; mark `partial` with a reason when any body segment appears missing; otherwise mark `unavailable`. Do not publish a page masquerading as recovered content.
6. Produce counts for unique discovered URLs, complete and partial articles, unavailable pages, capture dates used, and discovery coverage. Review a sample of early, middle, and late posts manually against archived HTML.

**Focused tests:** URL normalization; idempotent rerun; capture selection around the cutoff; retry after 429/5xx; malformed HTML; mixed Turkish diacritics; duplicated homepage/card links; an article containing lists, inline links, images, and captions.

## Milestone 3 — Original assets

**Deliverable:** `public/images/archive/` plus `content/assets.json` and `reports/missing-assets.md`.

1. Enumerate logo, featured/thumbnail and inline article images, avatars, icons, and reusable font files from recovered pages and CSS. Prefer original upload URLs, deduplicated across resized variants.
2. Find the nearest usable archived image capture, download it once, verify MIME signature and dimensions, calculate checksum, and store original-to-local mapping. Reject archived HTML error pages disguised as images. Keep original aspect ratios; convert only where the result remains visually equivalent.
3. Resolve image references inside article bodies and metadata to local paths. Record missing assets and the affected routes. Avoid fabricated images; choose an honest text-only presentation when the original image cannot be recovered.

**Focused tests:** Duplicate image references yield one file; invalid MIME content is rejected; every published local image path exists; aspect ratio metadata matches the downloaded image.

## Milestone 4 — Static frontend and routes

**Deliverable:** A complete static Next.js export with the recovered editorial pages and archive-matched responsive shell.

1. Initialize npm, Next.js App Router, strict TypeScript, CSS, Playwright, and Git. Configure static export and trailing slashes. Implement typed build-time content loaders and static parameter generation. Fail the build on duplicate canonical paths or invalid published records.
2. Recreate the measured logo/header/navigation, image slider, Çevre & Enerji section, Son Teknoloji Gelişmeleri feed, cards, sidebar widgets, newsletter presentation, and footer in the archived order. Use local assets and exact original labels/links where verified.
3. Implement the reusable article template with category labels, author/date, featured image, full sanitized body, tags, author block, related and previous/next posts only where supported, sidebar, and footer. Retain the original URL slug.
4. Implement original category and subcategory slugs, category pagination, author archives, homepage pagination, About, Contact, search, and custom 404. Generate tag pages only for verified tag URLs with recoverable associations. Use archived ordering where known and a documented date order otherwise.
5. Implement client-side search over titles, excerpts, and categories using a generated static index. Use a real Netlify Forms integration only if static export detection and submission can be verified; otherwise use an explicit `mailto:` fallback. Keep newsletter signup visibly inactive or configurable until a provider is supplied. Remove nonfunctional comment submission.
6. Make navigation keyboard usable and responsive. Ensure mobile menus, slider controls, labels, focus styles, and image alt text are accessible without changing the original visual character.

**Focused tests:** Static generation for every complete article and supported archive route; known Willow slug; category membership and pagination; search results for Turkish case and diacritics; working internal navigation; no Wayback or WordPress runtime URLs.

## Milestone 5 — SEO, reports, and integrity

**Deliverable:** Indexable static metadata and a migration report with explicit coverage limits.

1. Generate unique title, description, canonical, Open Graph, and Twitter metadata from recovered facts. Use `https://futuristikzone.com` for canonicals. Emit Article JSON-LD only when its required fields are supported; emit Website/Organization data without invented business claims.
2. Generate `sitemap.xml`, `robots.txt`, and RSS from published routes. Include only routes that actually export. Make search and 404 non-indexable where appropriate.
3. Check the manifest against generated routes. Report discovered original paths that were not reconstructed, missing images, partial articles, capture dates, and any original internal links that lack local destinations. Do not silently route missing articles to the homepage.
4. Validate every exported HTML link and local image path, unique canonicals, and article metadata. Document any deliberate deviations from the archive.

## Milestone 6 — Visual and functional verification

**Deliverable:** `reports/visual-comparison.md` with archived/local screenshot pairs and a passing build/test record.

1. Use Playwright to compare homepage desktop/mobile, Willow article desktop/mobile, an AI category page, About, and Contact. Capture at the same viewport widths used in the archive audit. Compare header/logo, typography, slider, image crops, card spacing, sidebar placement, footer, and stacking. Iterate CSS against measured differences.
2. Run `npm run build`, the focused tests, route and asset integrity checks, and browser smoke tests. Verify no horizontal overflow at 390 and 768 px, no meaningful browser console errors, search, pagination, menu operation, and contact fallback or Netlify Forms behavior.
3. Record remaining visual differences and their causes, especially missing original assets or captures. Avoid smoothing over missing evidence with invented design elements.

## Milestone 7 — Netlify readiness and handoff

**Deliverable:** `netlify.toml`, `README.md`, and deployment/domain instructions.

1. Set build command to `npm run build` and publish directory to `out`. Verify the exported output contains routes, sitemap, robots, RSS, and any form-detection HTML required by the selected contact approach.
2. Document local install, recovery, test, and build commands; GitHub-to-Netlify connection; primary domain and `www` redirect; automatic HTTPS; and trailing-slash behavior.
3. Provide DNS instructions only after Netlify supplies the relevant values. Preserve all existing mail MX, SPF, DKIM, and DMARC records. Do not modify GoDaddy DNS during this work.
4. At completion, report discovered URL count, complete/partial article count, recovered image count, missing pages/assets, source captures, tested routes, remaining visual gaps, and the exact user actions needed to put the site online.

## Review focus

- **Archive availability:** A blocked CDX request must not erase discovered URLs; the crawler and manifest must still make progress and show coverage limits.
- **Capture quality:** An older complete article should beat a newer truncated one, with the choice recorded and no invented ending.
- **Path fidelity:** `www`, HTTP, Turkish encoding, and archive rewrite variants must converge on one original canonical path without altering the slug.
- **Asset validity:** A Wayback error document must never be saved or published as an image.
- **Publication integrity:** Every indexed URL must have exported HTML, valid content provenance, a unique canonical, and working local navigation.

## Completion criteria

The project is ready for deployment when the archive audit is documented, the recovery pipeline is rerunnable, every publishable recovered article has full local content and a static route, original images are locally served where recovered, the required pages and navigation work, visual comparisons are recorded, `npm run build` succeeds, integrity/browser checks pass, and Netlify configuration and domain/email-safe instructions are complete. The recovery report must state unavailable material and any remaining visual differences plainly.
