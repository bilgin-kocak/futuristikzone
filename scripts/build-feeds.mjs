import { writeFile } from 'node:fs/promises';
import { articles, archiveRoutes, renderedBody } from '../src/lib/content.ts';
const escape=value=>String(value).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const origin='https://futuristikzone.com';
const routes=['/',...archiveRoutes.map(r=>r.path)];
await writeFile('out/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path=>`<url><loc>${escape(origin+path)}</loc></url>`).join('')}</urlset>`);
await writeFile('out/robots.txt',`User-agent: *\nAllow: /\nDisallow: /arama/\nDisallow: /__forms.html\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('out/rss.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>FuturistikZone</title><link>${origin}/</link><description>Geleceği Şekillendirin</description><language>tr</language>${articles.map(a=>`<item><title>${escape(a.title)}</title><link>${origin}${a.path}</link><guid isPermaLink="true">${origin}${a.path}</guid><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate><description>${escape(a.excerpt)}</description><content:encoded>${escape(renderedBody(a).replaceAll('src="/','src="'+origin+'/').replaceAll('href="/','href="'+origin+'/'))}</content:encoded></item>`).join('')}</channel></rss>`);
console.log(`Generated sitemap (${routes.length} URLs) and RSS (${articles.length} articles).`);
