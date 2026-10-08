import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage();
const references={home:['20260209013603','/'],article:['20250703113935','/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/'],category:['20250703113935','/category/yapay-zeka/'],about:['20250703113935','/hakkimizda/'],contact:['20250703113935','/iletisim/']};
const measurements={};await mkdir('archive-reference/screenshots',{recursive:true});
for(const [name,[timestamp,path]] of Object.entries(references)) {
  if(process.argv.includes('--home')&&name!=='home')continue;
  const url=`https://web.archive.org/web/${timestamp}/https://futuristikzone.com${path}`;
  try {
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(3500);
    await page.addStyleTag({content:'#wm-ipp-base,#wm-ipp-print,#donato{display:none!important}html{margin-top:0!important}body{margin-top:0!important}'});
    for(const width of name==='home'?[390,768,1440]:[1440,390]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}window.scrollTo(0,0);});
      await page.waitForTimeout(name==='home'?6000:600);
      await page.screenshot({path:`archive-reference/screenshots/${name}-${width}.png`,fullPage:true});
      measurements[`${name}-${width}`]=await page.evaluate(()=>{
        const selectors=['#navigation','#logo img','.container','.featured-area','.featured-area .item','.featured-area .penci-image-holder','.penci-featured-content-right','.feat-text-right','.featured-area h3','.penci-content-main','#main','#sidebar','.single-post-title','.post-entry','.penci-grid .list-post','.penci-border-arrow'];
        return {url:location.href,viewport:innerWidth,bodyFont:getComputedStyle(document.body).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth,elements:selectors.flatMap(selector=>{const el=document.querySelector(selector);if(!el)return [];const r=el.getBoundingClientRect(),s=getComputedStyle(el);return [{selector,x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,color:s.color}];})};
      });
      console.log(`Reference captured: ${name} ${width}`);
    }
  }catch(error){measurements[name]={url,error:error.message};console.log(`Reference unavailable: ${name}: ${error.message.slice(0,100)}`);}
}
await writeFile(process.argv.includes('--home')?'archive-reference/home-measurements.json':'archive-reference/measurements.json',JSON.stringify(measurements,null,2));await browser.close();
