# FuturistikZone restoration

Static reconstruction of the original WordPress publication, based on Internet Archive evidence. Next.js 16.4, React 19.3, strict TypeScript, local JSON content and assets. No database or archive requests at runtime.

## Recovery and verification

- 108 discovered editorial URLs; 27 full article bodies, 0 partial bodies published.
- 13 verified original images, including the logo and two author avatars.
- 14 original categories, 10 author archives, About, Contact, tag archives, and captured homepage pagination through pages 2, 3 and 8.
- 76 public static routes; 74 indexable sitemap URLs; RSS contains all 27 articles.
- Build, 12 unit tests, 7 browser tests, and export integrity checks pass.

“Full” means the editorial body present in the archived source. The archive cannot prove that every original segment survived. Some listings retain original excerpts whose article bodies are unavailable. Those excerpts have no article link and are labeled in Turkish.

See [migration report](reports/migration-report.md), [source manifest](content/manifest.json), [recovery summary](reports/recovery-summary.md), [missing assets](reports/missing-assets.md), and [visual comparisons](reports/visual-comparison.md). Open `reports/visual-comparison.html` for all screenshot pairs.

## Local commands

Requires Node.js 22.18 or newer (the build scripts use native TypeScript stripping) and npm.

```bash
npm ci
npm run dev
```

Development runs at `http://localhost:3000`. To verify and preview the actual static export:

```bash
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run preview
```

Static preview: `http://127.0.0.1:4173`. `npm run build` exports to `out/`, emits sitemap/robots/RSS, then validates routes, links, images, canonicals and article metadata. Playwright starts the preview server automatically if it is not running.

## Content recovery

The committed `content/` and `public/` files are sufficient to build. Archive access is only needed to recover additional material:

```bash
npm run recover:all
```

The pipeline queries the CDX domain index across HTTP/HTTPS and `www`, traverses original links, tries captures on or before 9 February 2026, explores historical homepages, supplements bodies from the archived Atom feed, and downloads verified images. Requests are sequential, throttled, retried with exponential backoff, and cached under ignored `.archive-cache/`. A rerun updates files by original slug rather than duplicating posts. Missing source pages remain in the manifest.

```bash
node scripts/archive/recover.mjs --cached-only
node scripts/archive/recover-assets.mjs --retry-missing
npm run audit:archive
node scripts/capture-local.mjs
node scripts/compare-screenshots.mjs
```

Browser audit commands require installed Chromium. The local capture command requires the static preview server. Article JSON preserves the original body and source URLs; rendering removes missing images, converts recovered internal destinations to local routes, and leaves the text of unavailable internal links unlinked. External editorial citations remain intact.

## Deploy to Netlify

1. In Netlify, choose **Add new project → Import an existing project → GitHub** and select `bilgin-kocak/futuristikzone`.
2. Deploy branch `main`. The committed `netlify.toml` sets build command `npm run build`, publish directory `out`, and Node 22.
3. This is a static export; no Next.js server runtime is required. `NETLIFY_NEXT_PLUGIN_SKIP=true` keeps deployment focused on the exported files. See [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).
4. Verify the assigned `*.netlify.app` URL, an article URL, `/page/2/`, `/sitemap.xml`, `/feed.xml`, and a 404 before connecting the domain.
5. Add `futuristikzone.com` as the primary domain and `www.futuristikzone.com` as its alias. The config redirects `www` to the apex with HTTP 301. Static routes use trailing slashes.
6. After DNS resolves, verify Netlify's automatic HTTPS certificate covers both names.

Deployment has not been performed in this checkout. An authenticated Netlify account/site connection is needed. No DNS records were changed.

### GoDaddy DNS and business email

Keep the current nameservers. Use the exact values shown by **your** Netlify domain setup rather than copying a guessed IP or site name. Follow [Netlify external DNS instructions](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/).

| Record | Website change after Netlify supplies values |
| --- | --- |
| `@` | Set the A/ALIAS/ANAME record recommended by Netlify and supported by the DNS provider. |
| `www` | Set CNAME to the assigned Netlify site hostname. |
| MX | Preserve existing mail provider records. |
| SPF/DKIM/DMARC TXT or CNAME | Preserve existing email authentication records. |

Review existing web records for conflicts when making these changes. Website hosting does not create a mailbox such as `bilgin@futuristikzone.com`; configure mail separately with your chosen provider.

### Contact

The original contact introduction is recovered. The lost WordPress form is removed. By default, the page clearly says that its form is unavailable and links to the original Instagram destination. No working mailbox was present in the archive; supply a confirmed address to enable a mailto fallback.

A Netlify Forms integration is prepared. To enable it:

1. Enable Netlify form detection for the site.
2. Set build environment variable `NEXT_PUBLIC_CONTACT_FORM_ENABLED=true` and redeploy.
3. Confirm Netlify lists the `contact` form. `public/__forms.html` provides static detection markup, and the visible form includes the matching name, fields, honeypot and hidden `form-name`.
4. Submit a real test message and verify it appears in Netlify Forms. Configure delivery notifications there. If this fails, remove the variable and redeploy.

See [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/). Submission has not been tested against a deployed Netlify site, so the form stays inactive in the delivered build.

### Newsletter

The original interface is inactive by default. For a provider that accepts a public HTML POST form, set `NEWSLETTER_FORM_ACTION` to its HTTPS form URL and, if needed, `NEWSLETTER_EMAIL_FIELD` to its email field name (default `EMAIL`). Rebuild and test a subscription at the provider before enabling it publicly. Providers requiring additional fields or JavaScript need a small integration change. Never put private API keys into these public form settings.

## Maintenance

- Editorial content: `content/articles/`, `content/pages/`, `content/listings.json`.
- Asset provenance and dimensions: `content/assets.json`.
- URL discovery/capture status: `content/manifest.json`.
- Route registry, local links and search index: `src/lib/content.ts`.
- Original theme measurements: `archive-reference/inspection.md` and measurement JSON.

Optional future work: recover the missing material from a surviving backup/export, configure contact and newsletter delivery, and verify DNS/HTTPS after deployment. Keep these improvements separate from any future redesign.
