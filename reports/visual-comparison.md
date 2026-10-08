# Visual comparison

Eleven archived/restored pairs are saved in [the side-by-side viewer](visual-comparison.html) and `comparisons/`. The original screenshots are in `archive-reference/screenshots/`; local screenshots are in `reports/screenshots/`. Each uses the same viewport width and a 1000 px browser height, with full-page capture.

Chromium's full-page screenshot capture painted the negative-position fixed skip link into the mobile header even though normal viewport screenshots showed it correctly offscreen. The capture command hides that unfocused link only during screenshots; keyboard focus behavior remains unchanged in the application.

| Page | Widths | Comparison |
| --- | --- | --- |
| Homepage | 1440, 768, 390 | [Desktop](comparisons/home-1440.png), [tablet](comparisons/home-768.png), [mobile](comparisons/home-390.png) |
| Willow article | 1440, 390 | [Desktop](comparisons/article-1440.png), [mobile](comparisons/article-390.png) |
| Yapay Zeka category | 1440, 390 | [Desktop](comparisons/category-1440.png), [mobile](comparisons/category-390.png) |
| Manifestomuz | 1440, 390 | [Desktop](comparisons/about-1440.png), [mobile](comparisons/about-390.png) |
| Contact | 1440, 390 | [Desktop](comparisons/contact-1440.png), [mobile](comparisons/contact-390.png) |

## Adjustments made from the evidence

- Matched 1170 px desktop container, 82 px header, 780/340 px editorial/sidebar widths and 50 px gap.
- Matched original logo proportions, font families, colors, 10 px image corners, category labels and sidebar order.
- Set slider to 550 px desktop, 399 px tablet and 215 px mobile, including the archived mobile blue title block and circular controls.
- Matched the 60 px gap below the slider, environment lead/small-story dimensions, standard article list layout, and mobile stacking.
- Used original larger Willow and Schrödinger assets after discovering archived higher-resolution variants. Preserved the article image's source aspect ratio.
- Preserved original article h4 headings, paragraphs, lists, quotes and inline links rather than flattening the body.
- Used full-width text cards when an original editorial image is unavailable.

## Remaining differences

Archive image loading and slider animation sometimes fail during reference capture. Local images load reliably, so their visibility can differ from a screenshot. Five recovered editorial images are available only as 585 px thumbnails and may appear softer when enlarged. Other original images, including Contact's banner, are unavailable and omitted.

Unrecovered full bodies remain original excerpt-only cards; related-post selection and recovered category totals differ from WordPress. Source Sans Pro and Work Sans are locally hosted open font distributions, which can produce small metric differences from the original font version. Social icons and drawer/menu animation are approximate. Disabled contact/newsletter messaging adds space to the archived layout.

These comparisons establish close structural fidelity, not pixel identity or complete recovery of the original database.
