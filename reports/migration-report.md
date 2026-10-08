# FuturistikZone migration report

## A. Implemented website

The Next.js App Router exports local static HTML with the original Turkish content and paths. The recovered Soledad layout includes the original logo, local Source Sans Pro/Work Sans fonts, six-story slider, Çevre & Enerji section, captured eight-post homepage feed, sidebar, popular-post drawer, newsletter and footer. There are 14 original categories, 10 author archives, About/Manifestomuz, Contact, client-side search and a custom 404. Archive routes use original captured ordering; derived routes use publication date order.

## B. Recovery coverage

| Measure | Result |
| --- | --- |
| Discovered editorial URLs | 108 |
| Discovered individual article URLs | 53 |
| Complete archived article bodies | 27 |
| Partial article bodies published | 0 |
| URLs with unavailable source captures | 56 |
| Discovered original paths without a local page | 37 |
| Unique verified original images | 13 |
| Distinct image identities investigated | 66 |
| Public static routes | 76 |
| Indexable sitemap URLs | 74 |

Discovery used the CDX domain index (all host/protocol variants), original homepage/category/author/tag/pagination/article links, historical homepages and the archived Atom feed. The primary homepage is [9 February 2026](https://web.archive.org/web/20260209013603/https://futuristikzone.com/). Most article bodies come from July 2025 captures; four additional bodies come from the [2 June 2022 Atom feed](https://web.archive.org/web/20220602191832/https://futuristikzone.com/feed/atom/). Article capture timestamps: 20220602191832, 20250703113935, 20250703115132, 20250703124214, 20250703125208, 20260112100921.

These totals describe available evidence, not the original publication's entire corpus. “Complete” means the editorial body in the available DOM/feed; the archive cannot prove that every original paragraph survived. No replacement prose, dates, authors or editorial images were generated.

The source manifest has 56 unavailable captures, while 37 original paths remain unpublished: some missing category/tag/author captures have enough verified article associations or original excerpts to produce local archives. Full article bodies are available for 27 of 53 discovered article URLs. Genuine excerpts are retained for other captured list entries and clearly labeled without dead article links.

### Original paths not reconstructed

- https://futuristikzone.com/page/4/ (pagination)
- https://futuristikzone.com/page/5/ (pagination)
- https://futuristikzone.com/page/6/ (pagination)
- https://futuristikzone.com/page/7/ (pagination)
- https://futuristikzone.com/yeni-nesil-ruzgar-turbinleri-yapay-zeka-destekli-havada-ruzgar-enerjisi-donusumu/ (article)
- https://futuristikzone.com/bir-kez-daha-aya-yolculuk/ (article)
- https://futuristikzone.com/metformin-genetige-bagli-olarak-saglikli-yaslanmayi-destektekleyevilir-mi/ (article)
- https://futuristikzone.com/depolama-tanklarinda-karistiricilarin-kullanimi/ (article)
- https://futuristikzone.com/parkinson-hastaligi-nedir/ (article)
- https://futuristikzone.com/gen-terapisi-ve-kok-hucreler/ (article)
- https://futuristikzone.com/bunlar-vucut-yaginizi-olcmenin-en-iyi-yollaridir/ (article)
- https://futuristikzone.com/google-musiclm-ai/ (article)
- https://futuristikzone.com/yapay-zekanin-guncel-gelisimleri-ve-son-teknolojiler/ (article)
- https://futuristikzone.com/yapay-zeka-ve-prompt-muhendisligi/ (article)
- https://futuristikzone.com/yapay-zeka-hizlaniyor/ (article)
- https://futuristikzone.com/akilli-yara-bandi-ile-hedefe-yonelik-tedavi/ (article)
- https://futuristikzone.com/turkiyenin-ilk-yerli-arabasi-togg/ (article)
- https://futuristikzone.com/author/bilginkocak/page/2/ (author)
- https://futuristikzone.com/kuantum-mekanigi-normal-olmayan-bir-dunyaya-giris/ (article)
- https://futuristikzone.com/mitnin-artirilmis-gerceklik-ile-x-ray-gorusu-saglayan-yeni-basligi/ (article)
- https://futuristikzone.com/endustri-4-0-ve-endustri-5-0-gelecegin-uretim-devrimleri/ (article)
- https://futuristikzone.com/akis-kaynakli-titresim/ (article)
- https://futuristikzone.com/author/sudebektasoglu/page/2/ (author)
- https://futuristikzone.com/teslanin-siberkabini-burada/ (article)
- https://futuristikzone.com/category/cevre-enerji/page/2/ (category)
- https://futuristikzone.com/category/genel/page/2/ (category)
- https://futuristikzone.com/category/genel/page/3/ (category)
- https://futuristikzone.com/mekanlarin-insan-psikolojisi-uzerindeki-etkileri/ (article)
- https://futuristikzone.com/yeni-gezegenler-yeni-dunyalar/ (article)
- https://futuristikzone.com/yeni-nesil-beton-malzemeleri-kendi-kendini-algilayan-akilli-yapilar/ (article)
- https://futuristikzone.com/europada-yasam-arayisi-vites-yukseltmek-uzere/ (article)
- https://futuristikzone.com/page/1/ (pagination)
- https://futuristikzone.com/iklim-degisikligi-nedenleri-eski-ve-yeni-dunya-arasindaki-farklar-ve-cozum-onerileri/ (article)
- https://futuristikzone.com/muhendislikte-lattice-yapilar-hafiflik-ve-mukavemetin-sinirlari/ (article)
- https://futuristikzone.com/dogecoinin-yaraticisi-artik-tum-kripto-para-birimlerinin-korkunc-olduguna-inandigini-soyledi/ (article)
- https://futuristikzone.com/yapay-kaslar-ile-surdurulebilir-robotik-teknolojisi/ (article)
- https://futuristikzone.com/tag/cevre/page/2/ (tag)

See [missing assets](missing-assets.md) for image failures and [manifest](../content/manifest.json) for every capture attempt. Pages 4–7 could not be recovered. Page 1 is the canonical homepage; /page/1/ is not separately published.

### Article provenance

| Article | Original publication time | Source capture |
| --- | --- | --- |
| [Google’ın Yeni Kuantum Çipi Willow: Paralel Evrenlerden Faydalanıyor mu?](https://futuristikzone.com/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/) | 2024-12-18T13:57:55+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/) |
| [Schrödinger’in Kedisi: Kuantum Paradoksu](https://futuristikzone.com/schrodingerin-kedisi-kuantum-paradoksu/) | 2024-11-22T10:15:55+00:00 | [20250703124214](https://web.archive.org/web/20250703124214id_/https://futuristikzone.com/schrodingerin-kedisi-kuantum-paradoksu/) |
| [Zamanın Geriye Aktığı Bir Evren: Olası Bir Gerçeklik mi?](https://futuristikzone.com/zamanin-geriye-aktigi-bir-evren-olasi-bir-gerceklik-mi/) | 2024-11-07T06:41:17+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/zamanin-geriye-aktigi-bir-evren-olasi-bir-gerceklik-mi/) |
| [Sağlık Teknolojilerinde Yenilikler: Gen Düzenleme ve Dijital Sağlık Çözümleri](https://futuristikzone.com/saglik-teknolojilerinde-yenilikler-gen-duzenleme-ve-dijital-saglik-cozumleri/) | 2024-11-06T14:01:05+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/saglik-teknolojilerinde-yenilikler-gen-duzenleme-ve-dijital-saglik-cozumleri/) |
| [Karbon Yakalama ve Yenilenebilir Enerji](https://futuristikzone.com/karbon-yakalama-ve-yenilenebilir-enerji/) | 2024-11-06T11:08:53+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/karbon-yakalama-ve-yenilenebilir-enerji/) |
| [Karanlık Enerji ve Kara Deliklerin Gizemli İlişkisi](https://futuristikzone.com/karanlik-enerji-ve-kara-deliklerin-gizemli-iliskisi/) | 2024-11-01T20:59:10+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/karanlik-enerji-ve-kara-deliklerin-gizemli-iliskisi/) |
| [Akıllı Şehirler: IoT ve Büyük Veri ile Dönüşen Kentler](https://futuristikzone.com/akilli-sehirler-iot-ve-buyuk-veri-ile-donusen-kentler/) | 2024-10-30T17:01:14+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/akilli-sehirler-iot-ve-buyuk-veri-ile-donusen-kentler/) |
| [Metaverse ve Sanal Gerçeklik: Dijital Dünyaların Geleceği](https://futuristikzone.com/metaverse-ve-sanal-gerceklik-dijital-dunyalarin-gelecegi/) | 2024-10-30T16:48:17+00:00 | [20260112100921](https://web.archive.org/web/20260112100921id_/https://futuristikzone.com/metaverse-ve-sanal-gerceklik-dijital-dunyalarin-gelecegi/) |
| [Yeşil Hidrojen: Temiz Enerjinin Geleceği](https://futuristikzone.com/yesil-hidrojen-temiz-enerjinin-gelecegi/) | 2023-10-14T16:59:09+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/yesil-hidrojen-temiz-enerjinin-gelecegi/) |
| [2025’te Dünyayı Etkileyecek Güneş Fırtınası](https://futuristikzone.com/2025te-dunyayi-etkileyecek-gunes-firtinasi/) | 2023-04-25T18:54:47+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/2025te-dunyayi-etkileyecek-gunes-firtinasi/) |
| [Lojistik Performansın İyileştirilmesi ve Enerji Kullanımının Azaltılması İçin Yeni Yaklaşımlar](https://futuristikzone.com/lojistik-performansin-iyilestirilmesi-ve-enerji-kullaniminin-azaltilmasi-icin-yeni-yaklasimlar/) | 2023-04-13T09:43:05+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/lojistik-performansin-iyilestirilmesi-ve-enerji-kullaniminin-azaltilmasi-icin-yeni-yaklasimlar/) |
| [Araştırmacılar Oksijen-İyon Pili Geliştiriyorlar](https://futuristikzone.com/arastirmacilar-oksijen-iyon-pili-gelistiriyorlar/) | 2023-04-04T19:08:57+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/arastirmacilar-oksijen-iyon-pili-gelistiriyorlar/) |
| [Yeni Matematiksel Model Güneş Enerjisini Daha Verimli Hale Getiriyor](https://futuristikzone.com/yeni-matematiksel-model-gunes-enerjisini-daha-verimli-hale-getiriyor/) | 2023-03-31T11:38:52+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/yeni-matematiksel-model-gunes-enerjisini-daha-verimli-hale-getiriyor/) |
| [Jeotermal Enerji: Daha Temiz Bir Gelecek İçin Karbon Emisyonlarını Azaltıyor](https://futuristikzone.com/jeotermal-enerji-daha-temiz-bir-gelecek-icin-karbon-emisyonlarini-azaltiyor/) | 2023-03-28T06:46:57+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/jeotermal-enerji-daha-temiz-bir-gelecek-icin-karbon-emisyonlarini-azaltiyor/) |
| [Lityum Metal Pillerinin Optimize Edilmesi Gelecekte Daha Yüksek Kapasiteli ve Güvenli Bataryaların Geliştirilmesine Katkı Sağlayabilir](https://futuristikzone.com/lityum-metal-pillerinin-optimize-edilmesi-gelecekte-daha-yuksek-kapasiteli-ve-guvenli-bataryalarin-gelistirilmesine-katki-saglayabilir/) | 2023-03-27T19:21:11+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/lityum-metal-pillerinin-optimize-edilmesi-gelecekte-daha-yuksek-kapasiteli-ve-guvenli-bataryalarin-gelistirilmesine-katki-saglayabilir/) |
| [PEM Yakıt Pili Teknolojisindeki Performansı Artırmak için Su Kullanımı](https://futuristikzone.com/pem-yakit-pili-teknolojisindeki-performansi-artirmak-icin-su-kullanimi/) | 2023-03-20T10:40:06+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/pem-yakit-pili-teknolojisindeki-performansi-artirmak-icin-su-kullanimi/) |
| [Atık Yönetiminde Yenilik: Elma Suyu Artıklarından Biyogaz Üretmek](https://futuristikzone.com/atik-yonetiminde-yenilik-elma-suyu-artiklarindan-biyogaz-uretmek/) | 2023-03-19T08:13:08+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/atik-yonetiminde-yenilik-elma-suyu-artiklarindan-biyogaz-uretmek/) |
| [Alibaba, Teslimat Robotları Sigara Molası Vermiyor](https://futuristikzone.com/alibaba-teslimat-robotlari-sigara-molasi-vermiyor/) | 2021-08-30T17:53:14+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/alibaba-teslimat-robotlari-sigara-molasi-vermiyor/) |
| [Bilim İnsanları Dünyanın İlk Karbonsuz Çeliğini Geliştirdi](https://futuristikzone.com/bilim-insanlari-dunyanin-ilk-karbonsuz-celigini-gelistirdi/) | 2021-08-21T19:52:28+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/bilim-insanlari-dunyanin-ilk-karbonsuz-celigini-gelistirdi/) |
| [Bir balık nefesini ne kadar tutabilir?](https://futuristikzone.com/bir-balik-nefesini-ne-kadar-tutabilir/) | 2021-08-21T09:41:07Z | [20220602191832](https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/) |
| [Bilim İnsanları Arktik Buzunun Düşündüğümüzden İki Kat Hızlı İnceldiğini Söyledi](https://futuristikzone.com/bilim-insanlari-arktik-buzunun-dusundugumuzden-iki-kat-hizli-inceldigini-soyledi/) | 2021-08-04T19:40:36Z | [20220602191832](https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/) |
| [Wikipedia’yı Kuran Adam Wikipedia’nın Güvenilmez olduğunu söylüyor](https://futuristikzone.com/wikipediayi-kuran-adam-wikipedianin-guvenilmez-oldugunu-soyluyor/) | 2021-07-23T15:17:12+00:00 | [20250703115132](https://web.archive.org/web/20250703115132id_/https://futuristikzone.com/wikipediayi-kuran-adam-wikipedianin-guvenilmez-oldugunu-soyluyor/) |
| [Amazon yağmur ormanı, emdiğinden daha fazla karbon salıyor](https://futuristikzone.com/amazon-yagmur-ormani-emdiginden-daha-fazla-carbon-saliyor/) | 2021-07-17T10:48:52+00:00 | [20250703125208](https://web.archive.org/web/20250703125208id_/https://futuristikzone.com/amazon-yagmur-ormani-emdiginden-daha-fazla-carbon-saliyor/) |
| [Microsoft’un Teknolojisi Hologramınızın Başka Bir Dil Konuşmasını Sağlayabilir](https://futuristikzone.com/microsoftun-teknolojisi-holograminizin-baska-bir-dil-konusmasini-saglayabilir/) | 2021-07-16T13:51:21+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/microsoftun-teknolojisi-holograminizin-baska-bir-dil-konusmasini-saglayabilir/) |
| [RUSYA, MARS’TA NÜKLEER SANTRAL KURMAYI ÖNERIYOR](https://futuristikzone.com/rusya-marsta-nukleer-santral-kurmayi-oneriyor/) | 2021-07-16T13:40:22+00:00 | [20250703113935](https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/rusya-marsta-nukleer-santral-kurmayi-oneriyor/) |
| [Yeni AI Ses Teknolojisi Video Oyunu Ses Oyuncularını Tehdit Edebilir](https://futuristikzone.com/yeni-ai-ses-teknolojisi-video-oyunu-ses-oyuncularini-tehdit-edebilir/) | 2021-07-15T19:39:22Z | [20220602191832](https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/) |
| [Bilim İnsanları, Dünyanın Plastik Kirliliğinde Geri Dönüşümü Olmayan “Devrilme Noktasına” Yaklaştığını Söyledi](https://futuristikzone.com/bilim-insanlari-dunyanin-plastik-kirliliginde-geri-donusumu-olmayan-devrilme-noktasina-yaklastigini-soyledi/) | 2021-07-15T17:28:28Z | [20220602191832](https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/) |

## C. Quality verification

- **npm run build**: successful static compilation, strict TypeScript, feed generation and export validation.
- **npm test**: 19 passing unit tests covering extraction, Atom prose, Turkish paths/search, cutoff selection, adjacent links/author metadata, retry behavior, asset validation, content rewriting, and regression cases for cache loss, truncated captures, failed refreshes, invalid metadata and failed image upgrades.
- **npm run test:browser**: 7 passing Playwright tests covering Willow content/search, original pagination, desktop/mobile navigation, keyboard dismissal, 404, loaded viewport images and no horizontal overflow at 1440/768/390 px.
- Export validator: 76 public HTML pages checked; no missing local links/images or duplicate canonicals. Every published article has required provenance/metadata. No runtime Wayback or WordPress resources.
- Full browser route walk: 76 URLs returned HTTP 200 with no JavaScript page errors.
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
