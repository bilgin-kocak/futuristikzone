import * as cheerio from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
import { cachedPage, readJson, saveJson } from './io.mjs';
import { normalizeUrl, classifyUrl, extractAtom } from './core.mjs';
const manifest=await readJson('content/manifest.json',{});
const assets=await readJson('content/asset-sources.json',[]);
const knownImages=new Map(assets.map(a=>[a.url,a]));
const index=new Map((await readJson('content/indexed-articles.json',[])).map(p=>[p.path,p]));
const cdx=await readJson('.archive-cache/cdx-all.json',[]);
const history=cdx.slice(1).filter(row=>normalizeUrl(row[2])==='https://futuristikzone.com/').map(row=>row[1]);
for(const timestamp of [...new Set(['20260209013603',...history])]) {
  try {
    const response=await cachedPage(`https://web.archive.org/web/${timestamp}id_/https://futuristikzone.com/`);
    const $=cheerio.load(response.body);
    $('a[href]').each((_,el)=>{const url=normalizeUrl($(el).attr('href'));if(url&&classifyUrl(url)!=='ignore')manifest[url]??={originalUrl:url,type:classifyUrl(url),discoveredFrom:response.url,status:'pending',attempts:[]};});
    $('article.hentry, .mag-post-box').each((_,el)=> {
      const node=$(el);const titleLink=node.find('h2 a, h3 a').first();const url=normalizeUrl(titleLink.attr('href'));if(!url)return;
      const candidate=node.find('[data-src],img[data-lazy-src]').first().attr('data-src')||node.find('img').first().attr('data-lazy-src');
      const image=candidate&&/\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?|$)/i.test(candidate)?candidate:null;
      if(image)knownImages.set(image,{url:image,alt:titleLink.text().trim()});
      index.set(new URL(url).pathname,{path:new URL(url).pathname,title:titleLink.text().trim(),featuredImage:image||null,publishedAt:node.find('time').first().attr('datetime')||null,source:response.url});
    });
    console.log(`Historical discovery: ${timestamp}`);
  }catch(error){console.log(`Historical capture unavailable: ${timestamp}: ${error.message}`);}
}
const feed=await cachedPage('https://web.archive.org/web/20220602191832id_/https://futuristikzone.com/feed/atom/');
const pages=extractAtom(feed.body,feed.url,await readJson('content/authors.json',[]),await readJson('content/categories/index.json',[]));
for(const page of pages) {
  const entry=manifest[page.originalUrl];
  if(entry?.status==='complete')continue;
  const discovered=index.get(page.path);if(discovered?.featuredImage)page.featuredImage=discovered.featuredImage;
  await saveJson(`content/articles/${page.slug}.json`,page);
  const cacheFile=`.archive-cache/extracted/${encodeURIComponent(page.path)}.json`;
  await saveJson(cacheFile,{page,html:`<html><body></body></html>`});
  manifest[page.originalUrl]={originalUrl:page.originalUrl,type:'article',discoveredFrom:feed.url,status:page.recoveryStatus,attempts:entry?.attempts||[],archivedUrl:feed.url,archiveTimestamp:page.archiveTimestamp,cacheFile};
  for(const image of page.images)knownImages.set(image.url,image);
  console.log(`Feed recovery: ${page.slug}`);
}
await saveJson('content/manifest.json',manifest);await saveJson('content/asset-sources.json',[...knownImages.values()]);await saveJson('content/indexed-articles.json',[...index.values()]);
