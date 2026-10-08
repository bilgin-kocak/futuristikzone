import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, classifyUrl, chooseCapture, extractPage, extractAtom } from '../scripts/archive/core.mjs';

test('archive and host variants converge without changing Turkish paths', () => {
  assert.equal(normalizeUrl('https://web.archive.org/web/20250703113935mp_/http://www.futuristikzone.com/category/yapay-zeka/'), 'https://futuristikzone.com/category/yapay-zeka/');
  assert.equal(normalizeUrl('https://futuristikzone.com/%C3%A7evre/?utm_source=x#comments'), 'https://futuristikzone.com/%C3%A7evre/');
  assert.equal(classifyUrl('https://futuristikzone.com/category/yapay-zeka/page/2/'), 'category');
  assert.equal(classifyUrl('https://futuristikzone.com/wp-json/'), 'ignore');
});

test('recovers missing article text and original dates from Atom without rewriting prose',()=>{
  const xml='<feed><entry><title><![CDATA[Bilim&#8217;in Geleceği]]></title><link rel="alternate" href="https://futuristikzone.com/bilim/"/><published>2021-08-30T17:53:14Z</published><author><name>Bilgin Koçak</name></author><category term="Yapay Zeka"/><content><![CDATA[<p>Özgün metin ve sonuç.</p><ul><li>İlk madde</li></ul>]]></content></entry></feed>';
  const pages=extractAtom(xml,'https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/',[{name:'Bilgin Koçak',path:'/author/bilginkocak/'}],[{name:'Yapay Zeka',path:'/category/yapay-zeka/'}]);
  assert.equal(pages[0].title,'Bilim’in Geleceği');assert.equal(pages[0].publishedAt,'2021-08-30T17:53:14Z');assert.match(pages[0].content,/<li>İlk madde<\/li>/);assert.equal(pages[0].author.path,'/author/bilginkocak/');
});

test('capture choice excludes later captures and non-success responses', () => {
  assert.equal(chooseCapture([{ timestamp: '20250703113935', statuscode: '200' }, { timestamp: '20260210000000', statuscode: '200' }, { timestamp: '20260208000000', statuscode: '404' }]).timestamp, '20250703113935');
});

test('extracts original editorial text, metadata, and links without archive UI', () => {
  const html = '<title>Başlık - FuturistikZone</title><meta property="article:published_time" content="2024-12-18T08:00:00+00:00"><body class="single-post"><h1 class="single-post-title">Çip ve Evren</h1><div class="post-box-meta-single"><a href="/author/mirbeymercan/">Mirbey Mercan</a><time datetime="2024-12-18">18 Aralık 2024</time></div><div class="penci-standard-cat"><a href="/category/fizik/">Fizik</a></div><div class="penci-post-entry-inner"><p>Türkçe özgün içerik.</p><h4>Alt başlık</h4><ul><li>Bir madde</li></ul><figure><img data-lazy-src="https://futuristikzone.com/wp-content/uploads/image.png" alt="Özgün"><figcaption>Açıklama</figcaption></figure><script>alert(1)</script><a href="https://web.archive.org/web/20250703113935/https://example.com/">Kaynak</a></div></body>';
  const p = extractPage(html, 'https://futuristikzone.com/cip/', 'https://web.archive.org/web/20250703113935id_/https://futuristikzone.com/cip/');
  assert.equal(p.title, 'Çip ve Evren');
  assert.equal(p.author.name, 'Mirbey Mercan');
  assert.equal(p.categories[0].path, '/category/fizik/');
  assert.match(p.content, /Türkçe özgün içerik/);
  assert.match(p.content, /<h4>Alt başlık<\/h4>/);
  assert.match(p.content, /https:\/\/example.com\//);
  assert.doesNotMatch(p.content, /<script|web\.archive/);
  assert.equal(p.images[0].alt, 'Özgün');
});

test('preserves original adjacent posts and author biography instead of deriving them',()=>{
  const html='<h1>Titre</h1><div class="post-pagination"><div class="prev-post"><a href="https://futuristikzone.com/onceki/">Özgün önceki</a></div><div class="next-post"><a href="/sonraki/">Özgün sonraki</a></div></div><div class="post-author"><div class="author-img"><img data-lazy-src="//secure.gravatar.com/avatar/abc?s=100"/></div><div class="author-content"><h5>Yazar</h5><p>Özgün biyografi.</p><a class="author-social" href="https://instagram.com/yazar">Instagram</a></div></div>';
  const p=extractPage(html,'https://futuristikzone.com/yazi/','https://web.archive.org/web/20250101000000id_/https://futuristikzone.com/yazi/');
  assert.equal(p.previous.path,'/onceki/');assert.equal(p.next.path,'/sonraki/');
  assert.equal(p.authorDetails.bio,'Özgün biyografi.');assert.equal(p.authorDetails.image,'https://secure.gravatar.com/avatar/abc?s=100');assert.equal(p.authorDetails.socials[0],'https://instagram.com/yazar');
});
