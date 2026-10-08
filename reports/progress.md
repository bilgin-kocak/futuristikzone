# Restoration ledger — plan: docs/superpowers/plans/2026-10-08-futuristikzone-restoration.md

- User approved implementation and pushing main to bilgin-kocak/futuristikzone.
- Ruling: Initialize and build in this empty workspace on main — user explicitly requested this repository and branch; no existing checkout requires isolation.
- Pre-flight: recovery outputs feed content loaders, asset mapping feeds body rewriting, route inventory feeds sitemap and export validation. Use original canonical paths as the shared identity.
- Ruling: Use a permanent recovery ledger instead of the skill task parser — the approved plan has milestones rather than parser-compatible Task sections; this preserves progress without rewriting the plan.
- Archive HTML fetch succeeds with network access outside the restricted shell; GitHub remote is empty.

## Milestones

- [x] Archive audit — original DOM/CSS measured; 11 archived screenshots captured at desktop/tablet/mobile widths.
- [x] Discovery and extraction — 108 URLs discovered, 27 archived article bodies, 0 partial bodies published; 4 bodies recovered from Atom.
- [x] Local assets — 13 unique verified original images; dimensions/checksums and failures recorded.
- [x] Static frontend and routes — 76 public routes, original categories/authors/slugs and captured pagination, search/menu/slider implemented.
- [x] SEO and integrity — 74 sitemap URLs, RSS, Article metadata; exported local links/images/canonicals validated.
- [x] Browser and visual verification — 12 unit tests and 7 Playwright tests pass; all 76 routes returned 200 with no page errors; 11 comparison pairs captured.
- [ ] Commit and push

## Decisions and evidence

- Ruling: Publish genuine captured excerpts without article links when bodies are missing — preserves original list evidence and avoids invented article pages; cost if wrong is reduced navigation and incomplete archive coverage.
- Ruling: Keep contact visibly inactive with the original social destination until a mailbox or deployed Forms integration is confirmed — no email destination exists in the archive and the requested business address is an example; cost is that direct email contact awaits configuration.
- Netlify configuration and DNS/email-preserving instructions are ready. No authenticated Netlify deployment has been established and no DNS/mail records were changed.
- Source-derived previous/next paths and author details added after comparing article DOM; focused extraction test observed failing then passing.
- Desktop popular-post drawer added after browser test observed failing then passing; keyboard Escape verified.
- Higher-resolution original image variants preferred over small thumbnails; invalid historical data-src article URL removed from featured-image metadata.
- Final pre-review gate: npm test 12/12, npm run build succeeds, export validator 76 pages / 0 errors, Playwright 7/7, dependency audit 0 vulnerabilities.
- Final review: one fresh reviewer; six Important recovery findings and one RSS documentation correction. Findings and scope judgments recorded in code-review.md.
- Final: fixed registry/listing loss — actual cached-only recovery/catalog fixture RED→GREEN.
- Final: fixed capture precedence/truncated-body choice — complete/partial fixtures and actual recovery command RED→GREEN.
- Final: fixed invented metadata and equivalent Turkish encoding identities — null URL, invalid date/author and path normalization fixtures RED→GREEN.
- Final: fixed failed refresh downgrade — prior verified body regression RED→GREEN.
- Final: fixed failed image upgrade downgrade — preserved image mapping/checksum regression RED→GREEN.
- Final gate after review fixes: npm test 19/19. Build/browser checks rerun before push.
- User chose to handle Netlify deployment themselves; delivery scope ends at the pushed repository and deployment instructions.
