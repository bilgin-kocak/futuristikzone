# Archived design inspection

Source: February 9, 2026 homepage; July 3, 2025 article, category, About, and Contact captures. Exact URLs and viewport measurements are in `measurements.json`. Screenshots exclude Wayback controls.

- Theme identification in original HTML: Soledad 7.9.4. Body font: Source Sans Pro; headings: Work Sans, weight 700. Local font packages retain the original font families and avoid runtime font requests.
- White background; text #313131; muted metadata #888; accent #304ffe; borders #eee. Image holders have 10px corners.
- Desktop container is 1170px. Header is 82px; logo element 350x80 with the original transparent 500x80 image. Main editorial width 780px; sidebar 340px; gap 50px.
- Homepage: featured slider, then a two-column main/sidebar layout. Main begins with Çevre & Enerji, a lead card plus four small stories. The latest feed has eight posts per captured page. Each standard list card uses an image on the left and title/metadata/excerpt on the right, separated by light rules.
- Slider is driven by the six original newest stories and has circular pagination controls. Its current slide varies in archived screenshots because autoplay continues during capture.
- Mobile header is 60px, with menu, centered logo, and search. Content at 390px has 20px side margins and 350px width. List cards stack image above text; sidebar stacks below the feed. At 768px the main width is 726px and the sidebar stacks below.
- Article heading is left aligned, 30px at desktop. Category labels precede it. Date/author appear below. The article body preserves source headings (including h4), quotes, lists, external links, and images.
- About title is Manifestomuz, followed by the recovered original manifesto list. Contact uses the original introduction and a wide layout.
- Footer newsletter is centered on a pale gray background, followed by a black social/copyright area. Restore the interface with an honest unavailable state until a provider is configured.
- Archived image loading is inconsistent. A missing or unloaded image in a screenshot is not evidence that the original design had no image. Use recovered asset metadata and HTML to distinguish these cases.
- Comments and newsletter submissions depend on lost WordPress integrations; functional behavior must follow the specification's fallback rules.
