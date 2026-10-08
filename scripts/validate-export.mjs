import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { articles,allPaths } from '../src/lib/content.ts';
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const errors=[];let checked=0;const canonicals=new Set();
for(const file of (await files('out')).filter(f=>f.endsWith('.html')&&!f.includes('/_next/'))){
  if(file.endsWith('404.html')||file.endsWith('404/index.html')||file.includes('_not-found')||file.endsWith('__forms.html'))continue;
  checked++;const html=await readFile(file,'utf8');const $=cheerio.load(html);
  const canonical=$('link[rel="canonical"]').attr('href');
  if(!canonical)errors.push(`${file}: no canonical`);else if(canonicals.has(canonical))errors.push(`${file}: duplicate canonical ${canonical}`);else canonicals.add(canonical);
  $('a[href],img[src]').each((_,el)=>{const href=$(el).attr(el.name==='img'?'src':'href');if(!href||!href.startsWith('/')||href.startsWith('//')||href.startsWith('/_next/'))return;const target=decodeURIComponent(href.split(/[?#]/)[0]);const filePath=path.join('out',target.endsWith('/')?target+'index.html':target);try{if(!statSyncSafe(filePath))errors.push(`${file}: missing ${target}`);}catch{errors.push(`${file}: missing ${target}`);}});
  $('img[src],script[src],link[rel="stylesheet"]').each((_,el)=>{const url=$(el).attr('src')||$(el).attr('href')||'';if(/^https?:/.test(url))errors.push(`${file}: runtime remote resource ${url}`);});
  if(/web\.archive\.org|wp-content\/uploads/.test($('img').toString()))errors.push(`${file}: archive image dependency`);
}
import fs from 'node:fs';
function statSyncSafe(file){return fs.existsSync(file);}
for(const a of articles)if(!a.title||!a.publishedAt||!a.author||!a.content||!a.archivedUrl)errors.push(`${a.path}: missing metadata`);
for(const route of allPaths)if(!fs.existsSync(path.join('out',route,'index.html')))errors.push(`Route not exported: ${route}`);
await writeFile('reports/export-validation.json',JSON.stringify({checkedPages:checked,articles:articles.length,errors},null,2));
if(errors.length){console.error(errors.slice(0,30).join('\n'));process.exit(1);}console.log(`Validated ${checked} HTML pages: no broken internal links, local images, duplicate canonicals, or runtime archive dependencies.`);
