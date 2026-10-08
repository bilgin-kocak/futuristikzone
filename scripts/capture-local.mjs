import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import { allPaths } from '../src/lib/content.ts';
const browser=await chromium.launch();const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const references={home:'/',article:'/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/',category:'/category/yapay-zeka/',about:'/hakkimizda/',contact:'/iletisim/'};
await mkdir('reports/screenshots',{recursive:true});
for(const [name,route] of Object.entries(references))for(const width of name==='home'?[1440,768,390]:[1440,390]) {
  await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:4173${route}`);await page.evaluate(()=>document.fonts.ready);
  if(name==='home')await page.getByRole('button',{name:'1. yazı:',exact:false}).click();
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=900){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}window.scrollTo(0,0);});
  await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
  await page.screenshot({path:`reports/screenshots/${name}-${width}.png`,fullPage:true,style:'.skip-link:not(:focus){visibility:hidden}'});console.log(`Captured ${name} ${width}`);
}
let routes=0;for(const route of allPaths){const r=await page.goto(`http://127.0.0.1:4173${route}`);if(r?.status()!==200)errors.push(`${route}: ${r?.status()}`);routes++;}
await writeFile('reports/browser-validation.json',JSON.stringify({routesChecked:routes,pageErrors:errors},null,2));await browser.close();if(errors.length)throw new Error(errors.join('\n'));console.log(`All ${routes} public routes returned HTTP 200; no page errors.`);
