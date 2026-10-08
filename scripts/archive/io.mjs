import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const hash = value => createHash('sha256').update(value).digest('hex').slice(0,20);
export const sleep = ms => new Promise(r=>setTimeout(r,ms));
export async function request(url, {binary=false, retries=3, delay=700}={}) {
  let last;
  for(let attempt=0;attempt<retries;attempt++) {
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(45000),headers:{'User-Agent':'FuturistikZoneRestoration/1.0 (recovering owned publication; throttled archive access)'}});
      if([429,500,502,503,504].includes(response.status)) throw new Error(`HTTP ${response.status}`);
      if(!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`),{permanent:true});
      return {url:response.url,type:response.headers.get('content-type')||'',body:binary?Buffer.from(await response.arrayBuffer()):await response.text()};
    } catch(error) {last=error;if(error.permanent)break;if(attempt<retries-1)await sleep(delay*2**attempt);}
  }
  throw last;
}
export async function cachedPage(url) {
  const file=path.join('.archive-cache/raw',hash(url)+'.json');
  try{return JSON.parse(await readFile(file,'utf8'));}catch{}
  await mkdir(path.dirname(file),{recursive:true});
  await sleep(600);
  const result=await request(url);
  await writeFile(file,JSON.stringify(result));
  return result;
}
export async function saveJson(file,data) {await mkdir(path.dirname(file),{recursive:true});await writeFile(file,JSON.stringify(data,null,2)+'\n');}
export async function readJson(file,fallback) {try{return JSON.parse(await readFile(file,'utf8'));}catch{return fallback;}}
