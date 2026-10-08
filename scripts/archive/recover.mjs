import { readFile, writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';
import { CUTOFF, normalizeUrl, classifyUrl, extractPage, unarchiveUrl } from './core.mjs';
import { cachedPage, readJson, saveJson } from './io.mjs';

const manifest=await readJson('content/manifest.json',{});
let cdx=await readJson('.archive-cache/cdx-all.json',null);
if(!cdx) {
  try {
    const response=await cachedPage(`https://web.archive.org/cdx/search/cdx?url=futuristikzone.com&matchType=domain&output=json&filter=statuscode:200&filter=mimetype:text/html&to=${CUTOFF}`);
    cdx=JSON.parse(response.body);await saveJson('.archive-cache/cdx-all.json',cdx);
  } catch(error) {console.log('CDX unavailable, using link traversal:',error.message);cdx=await readJson('.archive-cache/discovery.json',[]);}
}
const captures=new Map();
for(const row of cdx.slice(1)) {
  const item=Object.fromEntries(cdx[0].map((key,i)=>[key,row[i]]));
  const url=normalizeUrl(item.original);
  if(!url || classifyUrl(url)==='ignore')continue;
  if(!captures.has(url))captures.set(url,[]);
  captures.get(url).push(item);
}
for(const value of captures.values())value.sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
captures.set('https://futuristikzone.com/',[{timestamp:'20260209013603',original:'https://futuristikzone.com/',statuscode:'200'},...(captures.get('https://futuristikzone.com/')||[])]);
const queue=[]; const queued=new Set();
function enqueue(url,source) {
  const normalized=normalizeUrl(url);if(!normalized || classifyUrl(normalized)==='ignore' || queued.has(normalized))return;
  queued.add(normalized);queue.push(normalized);
  manifest[normalized]??={originalUrl:normalized,type:classifyUrl(normalized),discoveredFrom:source,status:'pending',attempts:[]};
}
enqueue('https://futuristikzone.com/','primary reference');
for(const url of captures.keys())enqueue(url,'CDX domain index');
for(let i=2;i<=8;i++)enqueue(`https://futuristikzone.com/page/${i}/`,'homepage pagination');
for(const url of Object.keys(manifest))enqueue(url,manifest[url].discoveredFrom);

const categories=new Map(); const authors=new Map(); const pages=[]; const articles=[]; const assetUrls=new Map((await readJson('content/asset-sources.json',[])).map(a=>[a.url,a]));
let layout=await readJson('content/site.json',{});
function collect(page,html) {
  const details=extractPage(html,page.originalUrl,page.archivedUrl);
  page.previous=details.previous;page.next=details.next;page.authorDetails=details.authorDetails;
  for(const link of page.links)enqueue(link,page.originalUrl);
  for(const image of page.images)assetUrls.set(image.url,image);
  if(page.featuredImage)assetUrls.set(page.featuredImage,{url:page.featuredImage,alt:page.title});
  if(page.type==='article' && page.content){articles.push(page);for(const c of page.categories)categories.set(c.path,c);if(page.author)authors.set(page.author.path,page.author);}
  if(page.type==='page' && page.content)pages.push(page);
  const $=cheerio.load(html);
  if(page.type==='home') {
    const paths=selector=>[...new Set($(selector).toArray().map(el=>normalizeUrl($(el).attr('href'))).filter(Boolean).map(url=>new URL(url).pathname))];
    const logo=unarchiveUrl($('#logo img').first().attr('data-lazy-src')||$('#logo img').first().attr('src'));
    const socials=[];
    $('.footer-socials a, .widget-social a, #footer-section a').each((_,el)=>{const url=unarchiveUrl($(el).attr('href'));if(url && /(?:facebook|twitter|instagram|pinterest|linkedin|youtube|telegram)\.|t\.me\//.test(url) && new URL(url).pathname!=='/')socials.push({name:$(el).attr('title')||$(el).attr('aria-label')||$(el).text().trim(),url});});
    layout={logo,slider:paths('.penci-featured-content-right h3 a'),environment:paths('.home-featured-cat-content h3 a'),feed:paths('.penci-wrapper-data .entry-title a'),popular:paths('.penci_popular_news_widget h4 a'),socials:[...new Map(socials.map(s=>[s.url,s])).values()],source:page.archivedUrl};
    if(logo)assetUrls.set(logo,{url:logo,alt:'FuturistikZone'});
  }
  if(page.type==='category'&&!/\/page\//.test(page.path))categories.set(page.path,{name:$('.archive-box h1, .archive-box h2, .archive-box h3').first().text().replace(/^Kategori:\s*/i,'').trim()||page.title,path:page.path});
  if(page.type==='author'&&!/\/page\//.test(page.path)) {
    const existing=authors.get(page.path)||{};
    authors.set(page.path,{...existing,path:page.path,name:$('.post-author h5 a, .post-author h5, .author-title').first().text().trim()||existing.name||page.title,bio:$('.post-author .author-content p').text().trim(),image:page.images.find(i=>/avatar|gravatar/i.test(i.url))?.url||null});
  }
}
for(let i=0;i<queue.length;i++) {
  const url=queue[i];const entry=manifest[url];
  let result;
  const newest=captures.get(url)?.[0]?.timestamp;
  if(entry.status==='complete' && entry.cacheFile && (!newest || entry.archiveTimestamp>=newest)) {
    try{result=JSON.parse(await readFile(entry.cacheFile,'utf8'));}catch{}
  }
  if(!result) {
    if(process.argv.includes('--cached-only'))continue;
    const candidates=captures.get(url)||[{timestamp:'20260209013603',original:url}];
    let best;
    for(const candidate of candidates.slice(0,4)) {
      const archive=`https://web.archive.org/web/${candidate.timestamp}id_/${candidate.original}`;
      try {
        const fetched=await cachedPage(archive);
        const actualTimestamp=fetched.url.match(/\/web\/(\d+)/)?.[1]||candidate.timestamp;
        if(actualTimestamp>CUTOFF)throw new Error('Replay selected a capture after the cutoff');
        if(!/<(?:html|body)/i.test(fetched.body)||/Wayback Machine doesn't have that page|This URL has been excluded/i.test(fetched.body))throw new Error('No archived editorial HTML');
        const extracted=extractPage(fetched.body,url,fetched.url);
        if(/Wayback Machine|Internet Archive/.test(extracted.title))throw new Error('Archive error page');
        entry.attempts.push({archive,status:extracted.recoveryStatus});
        if(!best||extracted.content.length>best.page.content.length)best={page:extracted,html:fetched.body};
        if(extracted.recoveryStatus==='complete'||!['article','page'].includes(entry.type))break;
      }catch(error){entry.attempts.push({archive,error:error.message});}
    }
    result=best;
  }
  if(result) {
    collect(result.page,result.html);
    entry.status=['article','page'].includes(entry.type)?result.page.recoveryStatus:'complete';
    entry.archivedUrl=result.page.archivedUrl;entry.archiveTimestamp=result.page.archiveTimestamp;
    entry.cacheFile=`.archive-cache/extracted/${encodeURIComponent(new URL(url).pathname)}.json`;
    await saveJson(entry.cacheFile,result);
    if(result.page.type==='article'&&result.page.content)await saveJson(`content/articles/${result.page.slug}.json`,result.page);
    if(result.page.type==='page'&&result.page.content)await saveJson(`content/pages/${result.page.slug}.json`,result.page);
  } else {entry.status='unavailable';}
  if(i%10===0)await saveJson('content/manifest.json',manifest);
  console.log(`[${i+1}/${queue.length}] ${entry.status} ${new URL(url).pathname}`);
}
await saveJson('content/manifest.json',manifest);
await saveJson('content/categories/index.json',[...categories.values()]);
await saveJson('content/authors.json',[...authors.values()]);
await saveJson('content/site.json',layout);
await saveJson('content/asset-sources.json',[...assetUrls.values()]);
const entries=Object.values(manifest);
await writeFile('reports/recovery-summary.md',`# Content recovery\n\nDiscovered editorial URLs: ${entries.length}\n\nComplete articles: ${articles.filter(p=>p.recoveryStatus==='complete').length}\n\nPartial articles: ${articles.filter(p=>p.recoveryStatus==='partial').length}\n\nUnavailable URLs: ${entries.filter(p=>p.status==='unavailable').length}\n\nCutoff: 9 February 2026. Discovery combines the CDX domain index and links from homepage, pagination, categories, authors, tags, and articles. “Complete” refers to the available archived editorial body; an archive cannot prove every original page segment was captured.\n\n## Unavailable\n\n${entries.filter(p=>p.status==='unavailable').map(p=>`- ${p.originalUrl}`).join('\n')}\n`);
console.log(`Done: ${articles.length} article bodies, ${assetUrls.size} image URLs.`);
