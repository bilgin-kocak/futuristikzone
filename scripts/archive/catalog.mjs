import { readdir, readFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';
import { normalizeUrl, unarchiveUrl } from './core.mjs';
import { readJson, saveJson } from './io.mjs';
const listings=await readJson('content/listings.json',{});const manifest=await readJson('content/manifest.json',{});
for(const entry of Object.values(manifest)) {
  if(entry.status!=='complete'||!entry.cacheFile||['article','page'].includes(entry.type))continue;
  const cached=await readJson(entry.cacheFile,null);if(!cached)continue;
  const $=cheerio.load(cached.html);const posts=[];
  $('.penci-wrapper-data article, .penci-grid article').each((_,el)=> {
    const node=$(el),a=node.find('.entry-title a,h2 a').first();const url=normalizeUrl(a.attr('href'));if(!url)return;
    const categories=node.find('.cat a').toArray().map(c=>({name:$(c).text().trim(),path:new URL(normalizeUrl($(c).attr('href'))).pathname}));
    const author=node.find('a[href*="/author/"]').first();const authorUrl=normalizeUrl(author.attr('href'));
    const img=node.find('.thumbnail [data-src],.thumbnail img').first();
    posts.push({path:new URL(url).pathname,title:a.text().trim(),publishedAt:node.find('time[datetime]').first().attr('datetime')||null,author:authorUrl?{name:author.text().trim(),path:new URL(authorUrl).pathname}:null,categories,excerpt:node.find('.item-content p').first().text().trim(),featuredImage:unarchiveUrl(img.attr('data-src')||img.attr('data-lazy-src')||img.attr('src')),source:entry.archivedUrl});
  });
  if(posts.length)listings[new URL(entry.originalUrl).pathname]={posts,source:entry.archivedUrl};
}
await saveJson('content/listings.json',listings);
const articles=[];for(const f of await readdir('content/articles').catch(()=>[]))if(f.endsWith('.json'))articles.push(await readJson(`content/articles/${f}`,null));
const assets=await readJson('content/assets.json',{});
console.log(`${Object.keys(listings).length} original listings, ${articles.length} full article bodies; ${Object.values(assets).filter(a=>a.status==='recovered').length} mapped image references.`);
