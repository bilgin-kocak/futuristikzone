import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const cases=['home-1440','home-768','home-390','article-1440','article-390','category-1440','category-390','about-1440','about-390','contact-1440','contact-390'];
await mkdir('reports/comparisons',{recursive:true});
for(const name of cases){
  const width=Number(name.split('-')[1]);const panel=width>768?720:width;
  const paths=[`archive-reference/screenshots/${name}.png`,`reports/screenshots/${name}.png`];
  const inputs=await Promise.all(paths.map(p=>sharp(p).resize({width:panel}).png().toBuffer({resolveWithObject:true})));
  await sharp({create:{width:panel*2,height:Math.max(...inputs.map(i=>i.info.height)),channels:3,background:'#fff'}}).composite(inputs.map((i,n)=>({input:i.data,left:panel*n,top:0}))).png().toFile(`reports/comparisons/${name}.png`);
}
await writeFile('reports/visual-comparison.html',`<!doctype html><html lang="en"><meta charset="utf-8"><title>FuturistikZone visual comparisons</title><style>body{font:16px system-ui;margin:30px;background:#eee}section{margin:40px 0}h1,h2{text-align:center}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}figure{margin:0}figcaption{padding:10px;font-weight:600}img{width:100%;display:block;background:white}@media(max-width:600px){body{margin:10px}.pair{gap:5px}}</style><h1>Archived / restored FuturistikZone</h1><p>Each pair uses the same viewport. Archive lazy-loading and missing assets affect some comparisons. Autoplay slides vary. See visual-comparison.md for findings.</p>${cases.map(name=>`<section><h2>${name}</h2><div class="pair"><figure><figcaption>Archived</figcaption><img src="../archive-reference/screenshots/${name}.png" alt="Archived ${name}"></figure><figure><figcaption>Restored</figcaption><img src="screenshots/${name}.png" alt="Restored ${name}"></figure></div></section>`).join('')}</html>`);
console.log(`Generated ${cases.length} side-by-side comparisons.`);
