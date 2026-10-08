import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

export const CUTOFF = '20260209235959';
export function extractAtom(xml, archivedUrl, authors=[], categories=[]) {
  const $=cheerio.load(xml,{xmlMode:true});
  return $('entry').toArray().flatMap(el=>{
    const entry=$(el);const url=normalizeUrl(entry.find('link[rel="alternate"]').attr('href'));
    if(!url)return [];
    const title=cheerio.load(entry.find('title').text()).text();
    const author=authors.find(a=>a.name===entry.find('author name').text());
    const cats=entry.find('category').toArray().map(c=>categories.find(v=>v.name=== $(c).attr('term'))).filter(Boolean);
    const root=cheerio.load('<h1 class="single-post-title"></h1><div class="post-box-meta-single"></div><div class="penci-standard-cat"></div><div class="penci-post-entry-inner"></div>');
    root('h1').text(title);
    root('.post-box-meta-single').append(root('<time></time>').attr('datetime',entry.find('published').text()));
    if(author)root('.post-box-meta-single').append(root('<a></a>').attr('href',author.path).text(author.name));
    for(const c of cats)root('.penci-standard-cat').append(root('<a></a>').attr('href',c.path).text(c.name));
    const content=cheerio.load(entry.find('content').text(),null,false);
    content('p').each((_,p)=>{if(content(p).text().startsWith('The post '))content(p).remove();});
    root('.penci-post-entry-inner').html(content.html());
    const page=extractPage(root.html(),url,archivedUrl);
    page.recoveryNote='Full editorial body recovered from the archived Atom feed; author and category paths resolved against archived site metadata.';
    return [page];
  });
}
export function unarchiveUrl(input, base = 'https://futuristikzone.com/') {
  let value = input?.trim() || '';
  value = value.replace(/^https?:\/\/web\.archive\.org\/web\/\d+(?:[a-z]+_)?\//, '');
  value = value.replace(/^\/web\/\d+(?:[a-z]+_)?\//, '');
  if (value.startsWith('//')) value = `https:${value}`;
  try { return new URL(value, base).href; } catch { return null; }
}
export function normalizeUrl(input) {
  const original = unarchiveUrl(input);
  if (!original) return null;
  const url = new URL(original);
  if (!/^(www\.)?futuristikzone\.com$/i.test(url.hostname)) return null;
  let path = url.pathname.replace(/\/+/g, '/');
  if (!/\.[a-z0-9]{2,5}$/i.test(path) && !path.endsWith('/')) path += '/';
  return `https://futuristikzone.com${path}`;
}
export function classifyUrl(url) {
  const path = new URL(url).pathname;
  if (/^\/(wp-|feed\/|amp\/|xmlrpc|comments\/|attachment\/)/.test(path)) return 'ignore';
  if (path === '/') return 'home';
  if (/^\/page\/\d+\/$/.test(path)) return 'pagination';
  if (path.startsWith('/category/')) return 'category';
  if (path.startsWith('/author/')) return 'author';
  if (path.startsWith('/tag/')) return 'tag';
  if (['/hakkimizda/', '/iletisim/'].includes(path)) return 'page';
  if (/\.[a-z0-9]+$/i.test(path)) return 'ignore';
  return path.split('/').filter(Boolean).length === 1 ? 'article' : 'ignore';
}
export function chooseCapture(captures) {
  return captures.filter(x => x.timestamp <= CUTOFF && String(x.statuscode) === '200').sort((a,b) => b.timestamp.localeCompare(a.timestamp))[0] || null;
}
export function extractPage(html, originalUrl, archivedUrl) {
  const $ = cheerio.load(html);
  const type = classifyUrl(originalUrl);
  const path = new URL(originalUrl).pathname;
  const cleanText = s => String(s || '').replace(/\s+/g, ' ').trim();
  const title = cleanText($('.single-post-title, h1.post-title, .page-title').first().text()) || cleanText($('h1').first().text()) || cleanText($('title').text().replace(/\s*[-–]\s*FuturistikZone.*$/, ''));
  const links = [...new Set($('a[href]').toArray().map(el=>normalizeUrl($(el).attr('href'))).filter(Boolean))];
  const images = [];
  const imageUrl = el => unarchiveUrl($(el).attr('data-lazy-src') || $(el).attr('data-src') || $(el).attr('src'), originalUrl);
  $('img, [data-src]').each((_,el) => {
    const url = imageUrl(el);
    if (url && !url.startsWith('data:')) images.push({ url, alt: $(el).attr('alt') || '', caption: cleanText($(el).closest('figure').find('figcaption').text()) });
  });
  let body = $('.penci-post-entry-inner').first();
  if (!body.length) body = $('.post-entry .inner-post-entry, .post-entry').first();
  const contentRoot = cheerio.load(body.html() || '', null, false);
  contentRoot('script, style, form, noscript, .post-tags, #wm-ipp-base, .sharedaddy').remove();
  contentRoot('img').each((_,el) => {
    const node = contentRoot(el);
    const src = unarchiveUrl(node.attr('data-lazy-src') || node.attr('data-src') || node.attr('src'), originalUrl);
    if (src && !src.startsWith('data:')) node.attr('src', src); else node.remove();
    node.removeAttr('srcset').removeAttr('sizes');
  });
  contentRoot('a[href]').each((_,el) => {
    const node=contentRoot(el); const dest=unarchiveUrl(node.attr('href'), originalUrl);
    if (dest) node.attr('href', normalizeUrl(dest) || dest);
  });
  const content = sanitizeHtml(contentRoot.html(), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: { a:['href','title'], img:['src','alt','width','height'], '*':['class'], td:['colspan','rowspan'], th:['colspan','rowspan'] },
    allowedSchemes: ['https','http','mailto'],
  });
  const authorEl=$('.post-box-meta-single a[href*="/author/"], .author-post a[href*="/author/"], .author.vcard a').first();
  const authorUrl=normalizeUrl(authorEl.attr('href'));
  const categories = [];
  $('.penci-standard-cat a[href*="/category/"], .cat a[href*="/category/"]').each((_,el)=> {
    const url=normalizeUrl($(el).attr('href'));
    if(url && !categories.some(c=>c.path===new URL(url).pathname)) categories.push({name:cleanText($(el).text()),path:new URL(url).pathname});
  });
  const tags=[];
  $('.post-tags a[href*="/tag/"]').each((_,el)=> {const url=normalizeUrl($(el).attr('href'));if(url)tags.push({name:cleanText($(el).text()),path:new URL(url).pathname});});
  const adjacent=selector=>{const el=$(selector).first();const url=normalizeUrl(el.attr('href'));return url?{path:new URL(url).pathname,title:cleanText(el.text())}:null;};
  const authorDetails={bio:cleanText($('.post-author .author-content p').first().text()),image:$('.post-author .author-img img').length?imageUrl($('.post-author .author-img img').first()[0]):null,socials:$('.post-author a.author-social[href]').toArray().map(el=>unarchiveUrl($(el).attr('href'),originalUrl)).filter(url=>url&&/^https?:/.test(url))};
  const publishedAt = $('meta[property="article:published_time"]').attr('content') || $('time.published, time[datetime]').first().attr('datetime') || null;
  const featuredImage = unarchiveUrl($('meta[property="og:image"]').attr('content') || $('.post-image img').first().attr('data-lazy-src') || $('.post-image img').first().attr('src'), originalUrl);
  const excerpt = cleanText($('meta[name="description"]').attr('content')) || cleanText(body.find('p').first().text());
  const archiveTimestamp=archivedUrl.match(/\/web\/(\d+)/)?.[1] || null;
  const bodyText=cleanText(cheerio.load(content).text());
  const recoveryStatus = content && (type !== 'article' || (publishedAt && authorUrl && bodyText.length > 150)) ? 'complete' : (bodyText ? 'partial' : 'unavailable');
  return {
    type,path,slug:path.split('/').filter(Boolean).at(-1) || '',title,publishedAt,
    author: authorUrl ? {name:cleanText(authorEl.text()),path:new URL(authorUrl).pathname} : null,
    categories,tags,excerpt,content,featuredImage,images,links,originalUrl,archivedUrl,archiveTimestamp,recoveryStatus,
    previous:adjacent('.post-pagination .prev-post a'),next:adjacent('.post-pagination .next-post a'),authorDetails,
    recoveryNote: recoveryStatus==='complete' ? 'Editorial body extracted from the archived DOM; completeness is relative to the available capture.' : 'Missing body or required original metadata; inspect other captures.',
    seo:{description:excerpt,title:cleanText($('title').text())},
  };
}
