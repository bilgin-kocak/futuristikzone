import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

export type Term = {name:string;path:string};
export type PostSummary = {path:string;title:string;publishedAt:string|null;author:Term|null;categories:Term[];excerpt:string;featuredImage:string|null;available?:boolean};
export type Article = PostSummary & {slug:string;content:string;tags:Term[];previous?:{path:string;title:string}|null;next?:{path:string;title:string}|null;authorDetails?:{bio:string;image:string|null;socials:string[]};originalUrl:string;archivedUrl:string;archiveTimestamp:string;recoveryStatus:'complete'|'partial'|'unavailable'};
type Asset={status:string;localPath?:string;width?:number;height?:number;originalUrl:string};
type Listing={posts:PostSummary[];source:string};
export type ArchiveRoute={path:string;kind:'article'|'page'|'archive';title:string;article?:Article;posts?:PostSummary[];base?:string;page?:number;pages?:number[]};
const read=<T,>(file:string):T=>JSON.parse(fs.readFileSync(path.join(process.cwd(),file),'utf8')) as T;
const loadDirectory=(directory:string)=>fs.readdirSync(path.join(process.cwd(),directory)).filter(f=>f.endsWith('.json')).map(f=>read<Article>(`${directory}/${f}`));
export const articles=loadDirectory('content/articles').filter(a=>a.recoveryStatus==='complete').sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''));
export const pages=loadDirectory('content/pages');
export const categories=read<Term[]>('content/categories/index.json').sort((a,b)=>a.name.localeCompare(b.name,'tr'));
export const site=read<{logo:string;slider:string[];environment:string[];feed:string[];popular:string[];socials:{name:string;url:string}[]}>('content/site.json');
export const listings=read<Record<string,Listing>>('content/listings.json');
const catalog=[...new Map(Object.values(listings).flatMap(l=>l.posts).map(p=>[p.path,p])).values()];
export const authors=[...new Map([...read<(Term&{bio?:string;image?:string})[]>('content/authors.json'),...catalog.flatMap(p=>p.author?[p.author]:[])].map(a=>[a.path,a])).values()];
const assets=read<Record<string,Asset>>('content/assets.json');
const byPath=new Map(articles.map(a=>[a.path,a]));
const identity=(url:string)=>{try{const u=new URL(url);return decodeURI(u.hostname.replace(/^www\./,'')+u.pathname).replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i,'');}catch{return url;}};
const byImage=new Map(Object.entries(assets).filter(([,a])=>a.status==='recovered').map(([url,a])=>[identity(url),a]));
export function imageFor(url:string|null|undefined):Asset|null {return url?byImage.get(identity(url))||null:null;}
export function articleFor(path:string) {return byPath.get(path);}
export function dateLabel(date:string|null) {return date?new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Istanbul'}).format(new Date(date)):'';}
export function summary(post:PostSummary):PostSummary {const body=byPath.get(post.path);return {...post,available:!!body,featuredImage:post.featuredImage||body?.featuredImage||null};}
export function selectPosts(paths:string[]) {return paths.flatMap(path=>{const article=byPath.get(path);return article?[summary(article)]:[];});}
export const homePosts=(listings['/']?.posts||selectPosts(site.feed)).map(summary);
export const environmentPosts=selectPosts(site.environment);
export const featuredPosts=selectPosts(site.slider);
export const latestPosts=articles.slice(0,5).map(summary);

const routes=new Map<string,ArchiveRoute>();
function register(route:ArchiveRoute){if(routes.has(route.path))throw new Error(`Duplicate route: ${route.path}`);routes.set(route.path,route);}
for(const article of articles)register({path:article.path,title:article.title,kind:'article',article});
for(const article of pages)register({path:article.path,title:article.title,kind:'page',article});
function addArchive(base:string,title:string,matching:PostSummary[]) {
  const original=listings[base]?.posts;
  const sourcePages=Object.keys(listings).filter(p=>p.startsWith(base+'page/'));
  const initial=original||matching.slice(0,8);
  const nums=[1,...sourcePages.map(p=>Number(p.match(/\/page\/(\d+)\//)?.[1])).filter(Boolean)];
  if(!original)for(let n=2;n<=Math.ceil(matching.length/8);n++)nums.push(n);
  const unique=[...new Set(nums)].sort((a,b)=>a-b);
  register({path:base,title,kind:'archive',posts:initial.map(summary),base,page:1,pages:unique});
  for(const n of unique.filter(n=>n>1)) {
    const pathname=`${base}page/${n}/`;
    register({path:pathname,title:`${title} — ${n}`,kind:'archive',posts:(listings[pathname]?.posts||matching.slice((n-1)*8,n*8)).map(summary),base,page:n,pages:unique});
  }
}
for(const c of categories)addArchive(c.path,c.name,articles.filter(a=>a.categories.some(t=>t.path===c.path)));
for(const a of authors)addArchive(a.path,a.name,[...new Map([...articles,...catalog].filter(p=>p.author?.path===a.path).map(p=>[p.path,p])).values()]);
const tags=[...new Map(articles.flatMap(a=>a.tags).map(t=>[t.path,t])).values()];
for(const t of tags)addArchive(t.path,t.name,articles.filter(a=>a.tags.some(x=>x.path===t.path)));
export const feedPages=[1,...Object.keys(listings).filter(p=>/^\/page\/\d+\/$/.test(p)).map(p=>Number(p.split('/')[2]))].sort((a,b)=>a-b);
for(const n of feedPages.filter(n=>n>1))register({path:`/page/${n}/`,title:`Son Teknoloji Gelişmeleri — ${n}`,kind:'archive',posts:listings[`/page/${n}/`].posts.map(summary),base:'/',page:n,pages:feedPages});
export const archiveRoutes=[...routes.values()];
export function routeFor(path:string){return routes.get(path);}
export const allPaths=new Set(['/', '/arama/', '/tesekkurler/', ...routes.keys()]);
export function renderedBody(article:Article):string {
  const $=cheerio.load(article.content,null,false);
  $('img').each((_,el)=>{const img=$(el),asset=imageFor(img.attr('src'));if(asset?.localPath){img.attr('src',asset.localPath).attr('loading','lazy').removeAttr('width').removeAttr('height');}else img.remove();});
  $('a[href]').each((_,el)=>{
    const anchor=$(el);const href=anchor.attr('href')||'';
    try{const u=new URL(href);if(/^(www\.)?futuristikzone\.com$/.test(u.hostname)){if(allPaths.has(u.pathname))anchor.attr('href',u.pathname+u.hash);else anchor.replaceWith(anchor.html()||anchor.text());}else anchor.attr('rel','noopener noreferrer');}catch{}
  });
  $('.wpcf7, .screen-reader-response').remove();
  return $.html();
}
export function searchIndex(){return articles.map(a=>({path:a.path,title:a.title,excerpt:a.excerpt,categories:a.categories}));}
