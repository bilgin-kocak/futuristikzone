import { articles,categories,latestPosts,imageFor,site } from '@/lib/content';
export default function Sidebar(){return <aside className="sidebar" aria-label="Yan sütun">
  <form action="/arama/" className="sidebar-search"><label className="sr-only" htmlFor="sidebar-query">Yazılarda ara</label><input id="sidebar-query" name="q" placeholder="Yazın ve enter tuşuna basın..."/><button aria-label="Ara"><span className="search-icon"/></button></form>
  <section className="widget"><h3>Son Yazılar</h3><ul className="recent-links">{latestPosts.map(p=><li key={p.path}><a href={p.path}>{p.title}</a></li>)}</ul></section>
  <section className="widget"><h3>Son Yorumlar</h3></section>
  <section className="widget"><h3>İrtibatta Olalım</h3><div className="social-widget">{site.socials.map(s=><a key={s.url} href={s.url} rel="noopener noreferrer"><span aria-hidden="true">{s.name.slice(0,1)}</span>{s.name}</a>)}</div></section>
  <section className="widget"><h3>Yakın Zamandaki Gönderiler</h3>{latestPosts.slice(0,4).map(p=>{const image=imageFor(p.featuredImage);return <article className="recent-feature" key={p.path}>{p.featuredImage&&<a href={p.path}>{image?.localPath?<img src={image.localPath} alt="" loading="lazy"/>:<div className="missing-image"/>}</a>}<h4><a href={p.path}>{p.title}</a></h4></article>;})}</section>
  <section className="widget"><h3>Kategoriler</h3><ul className="category-list">{categories.map(c=><li className={c.path.includes('/yapay-zeka/makine')?'subcategory':''} key={c.path}><a href={c.path}>›&nbsp; {c.name}</a><span>({articles.filter(a=>a.categories.some(t=>t.path===c.path)).length})</span></li>)}</ul></section>
</aside>;}
