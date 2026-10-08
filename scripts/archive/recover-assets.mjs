import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { imageInfo, assetIdentity,rankAssetCaptures } from './assets.mjs';
import { request, readJson, saveJson, hash, sleep } from './io.mjs';
import {preserveAsset} from './recovery-state.mjs';
const sources=await readJson('content/asset-sources.json',[]);
let cdx=await readJson('.archive-cache/cdx-images.json',null);
if(!cdx){cdx=JSON.parse((await request('https://web.archive.org/cdx/search/cdx?url=futuristikzone.com&matchType=domain&output=json&filter=statuscode:200&filter=mimetype:image/.*&to=20260209235959&collapse=digest')).body);await saveJson('.archive-cache/cdx-images.json',cdx);}
const available=cdx.slice(1).map(row=>Object.fromEntries(cdx[0].map((key,i)=>[key,row[i]])));
const assets=await readJson('content/assets.json',{}); const groups=new Map();
await mkdir('public/images/archive',{recursive:true});
for(const source of sources) {
  const identity=assetIdentity(source.url);
  if(!groups.has(identity))groups.set(identity,[]);groups.get(identity).push(source);
}
let index=0;
for(const [identity,variants] of groups) {
  index++;
  const existing=variants.map(v=>assets[v.url]).find(v=>v?.status==='recovered');
  const candidates=rankAssetCaptures(available.filter(a=>assetIdentity(a.original)===identity));
  const exact=variants.sort((a,b)=>a.url.length-b.url.length)[0];
  if(!candidates.length)candidates.push({original:exact.url,timestamp:'20260209013603'});
  if(existing&&assetIdentity(existing.originalUrl)===identity&&decodeURI(existing.originalUrl)===decodeURI(candidates[0].original)){for(const v of variants)assets[v.url]=existing;continue;}
  if(!existing&&variants.every(v=>assets[v.url]?.status==='unavailable')&&!process.argv.includes('--retry-missing'))continue;
  let record;
  for(const candidate of candidates.slice(0,3)) {
    const archive=`https://web.archive.org/web/${candidate.timestamp}id_/${candidate.original}`;
    try {
      await sleep(600);
      const response=await request(archive,{binary:true,retries:2});
      const info=await imageInfo(response.body);
      const extension={jpeg:'jpg',png:'png',webp:'webp',gif:'gif',svg:'svg',avif:'avif'}[info.format]||info.format;
      const localPath=`/images/archive/${hash(identity)}.${extension}`;
      await writeFile(`public${localPath}`,response.body);
      record={status:'recovered',originalUrl:candidate.original,archivedUrl:response.url,localPath,...info,checksum:createHash('sha256').update(response.body).digest('hex')};break;
    }catch(error){record={status:'unavailable',originalUrl:candidate.original,archivedUrl:archive,error:error.message};}
  }
  record=preserveAsset(existing,record);
  for(const variant of variants)assets[variant.url]=record;
  await saveJson('content/assets.json',assets);
  console.log(`[${index}/${groups.size}] ${record.status} ${identity}`);
}
const recovered=[...new Map(Object.values(assets).filter(a=>a.status==='recovered').map(a=>[a.localPath,a])).values()];
await writeFile('reports/missing-assets.md',`# Image recovery\n\n${recovered.length} unique verified images recovered. WordPress resized versions map to a recovered image from the same original filename. Missing images are omitted rather than replaced.\n\n${Object.entries(assets).filter(([,a])=>a.status==='unavailable').map(([url])=>`- ${url}`).join('\n')}\n`);
console.log(`Recovered ${recovered.length} unique images.`);
