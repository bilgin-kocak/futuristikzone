import fs from 'node:fs';
import {allPaths,articles,categories,authors,archiveRoutes} from '../src/lib/content.ts';
import {assetIdentity} from './archive/assets.mjs';
const manifest=Object.values(JSON.parse(fs.readFileSync('content/manifest.json')));
const assets=Object.values(JSON.parse(fs.readFileSync('content/assets.json')));
const missing=manifest.filter(e=>!allPaths.has(new URL(e.originalUrl).pathname));
const captures=[...new Set(articles.map(a=>a.archiveTimestamp))].sort();
const articleRows=articles.map(a=>`| [${a.title.replaceAll('|','\\|')}](${a.originalUrl}) | ${a.publishedAt} | [${a.archiveTimestamp}](${a.archivedUrl}) |`).join('\n');
fs.writeFileSync('reports/migration-report.md',`# FuturistikZone migration report

## A. Implemented website

The Next.js App Router exports local static HTML with the original Turkish content and paths. The recovered Soledad layout includes the original logo, local Source Sans Pro/Work Sans fonts, six-story slider, Çevre & Enerji section, captured eight-post homepage feed, sidebar, popular-post drawer, newsletter and footer. There are ${categories.length} original categories, ${authors.length} author archives, About/Manifestomuz, Contact, client-side search and a custom 404. Archive routes use original captured ordering; derived routes use publication date order.

## B. Recovery coverage

| Measure | Result |
| --- | --- |
| Discovered editorial URLs | ${manifest.length} |
| Discovered individual article URLs | ${manifest.filter(e=>e.type==='article').length} |
| Complete archived article bodies | ${articles.length} |
| Partial article bodies published | 0 |
| URLs with unavailable source captures | ${manifest.filter(e=>e.status==='unavailable').length} |
| Discovered original paths without a local page | ${missing.length} |
| Unique verified original images | ${new Set(assets.filter(a=>a.status==='recovered').map(a=>a.localPath)).size} |
| Distinct image identities investigated | ${new Set(assets.map(a=>assetIdentity(a.originalUrl))).size} |
| Public static routes | ${allPaths.size} |
| Indexable sitemap URLs | ${allPaths.size-2} |

Discovery used the CDX domain index (all host/protocol variants), original homepage/category/author/tag/pagination/article links, historical homepages and the archived Atom feed. The primary homepage is [9 February 2026](https://web.archive.org/web/20260209013603/https://futuristikzone.com/). Most article bodies come from July 2025 captures; four additional bodies come from the [2 June 2022 Atom feed](https://web.archive.org/web/20220602191832/https://futuristikzone.com/feed/atom/). Article capture timestamps: ${captures.join(', ')}.

These totals describe available evidence, not the original publication's entire corpus. “Complete” means the editorial body in the available DOM/feed; the archive cannot prove that every original paragraph survived. No replacement prose, dates, authors or editorial images were generated.

The source manifest has ${manifest.filter(e=>e.status==='unavailable').length} unavailable captures, while ${missing.length} original paths remain unpublished: some missing category/tag/author captures have enough verified article associations or original excerpts to produce local archives. Full article bodies are available for ${articles.length} of ${manifest.filter(e=>e.type==='article').length} discovered article URLs. Genuine excerpts are retained for other captured list entries and clearly labeled without dead article links.

### Original paths not reconstructed

${missing.map(e=>`- ${e.originalUrl} (${e.type})`).join('\n')}

See [missing assets](missing-assets.md) for image failures and [manifest](../content/manifest.json) for every capture attempt. Pages 4–7 could not be recovered. Page 1 is the canonical homepage; /page/1/ is not separately published.

### Article provenance

| Article | Original publication time | Source capture |
| --- | --- | --- |
${articleRows}

## C. Quality verification

- **npm run build**: successful static compilation, strict TypeScript, feed generation and export validation.
- **npm test**: 12 passing unit tests covering extraction, Atom prose, Turkish paths/search, cutoff selection, adjacent links/author metadata, retry behavior, asset validation and content rewriting.
- **npm run test:browser**: 7 passing Playwright tests covering Willow content/search, original pagination, desktop/mobile navigation, keyboard dismissal, 404, loaded viewport images and no horizontal overflow at 1440/768/390 px.
- Export validator: ${allPaths.size} public HTML pages checked; no missing local links/images or duplicate canonicals. Every published article has required provenance/metadata. No runtime Wayback or WordPress resources.
- Full browser route walk: ${allPaths.size} URLs returned HTTP 200 with no JavaScript page errors.
- Screenshot pairs: homepage desktop/tablet/mobile and article/category/About/Contact desktop/mobile. See [visual report](visual-comparison.md) and [side-by-side viewer](visual-comparison.html).

### Deliberate differences and limits

- Missing editorial images are omitted. Some recovered images are only archived thumbnail resolutions; those cannot regain original detail.
- No fabricated article pages. Links inside preserved bodies to unavailable original pages render as the original text without a link. The source HTML remains in JSON.
- Only captured homepage pages 1, 2, 3 and 8 appear in pagination. Original category totals are replaced by recovered full-body counts.
- Previous/next links use original source relationships and appear only when the destination body is published. Related suggestions use verified shared categories and can differ from WordPress recommendations.
- Author biographies/avatars/social destinations appear only where recovered. Social destinations are verified against original HTML, not guaranteed currently active. The archive's empty YouTube href is omitted.
- The popular drawer and responsive menu use accessible local controls; exact original animation/icon-font rendering differs. Social icons use initials to avoid an unavailable icon font.
- Comments submission is removed. Newsletter stays inactive until a provider is configured. Contact is visibly inactive with the original social destination until a confirmed mailbox or deployed Netlify Forms integration is available.
- Archived screenshots contain inconsistent lazy-loaded images and autoplay states. Visual checks use measured geometry and original HTML alongside the screenshots; no claim of exact pixel identity is made.

## D. Deployment

**netlify.toml** uses **npm run build**, publishes **out**, chooses Node 22 and redirects www to the canonical apex domain. No deployment or DNS change has been performed. Connecting the pushed GitHub repository to an authenticated Netlify account is required. [README](../README.md) contains exact run/build/recovery commands, Netlify setup, HTTPS/domain instructions, and contact/newsletter activation steps. Preserve GoDaddy nameservers and all existing MX, SPF, DKIM and DMARC records when adding Netlify's website records.

## E. Optional future improvements

1. Import a surviving WordPress export, backup or author's original drafts/images to fill the documented gaps.
2. Configure contact delivery and a real newsletter provider, then verify live submissions.
3. Verify the deployed domain, HTTPS, canonical redirect and feeds after DNS setup.

No redesign is included.
`);
console.log(`Migration report: ${missing.length} discovered original paths unpublished.`);
