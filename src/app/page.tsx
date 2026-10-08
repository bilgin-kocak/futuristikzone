import type {Metadata} from 'next';
import FeaturedSlider from '@/components/FeaturedSlider';
import Sidebar from '@/components/Sidebar';
import {Feed,Pagination,PostMeta,SectionTitle} from '@/components/Posts';
import {dateLabel,environmentPosts,featuredPosts,feedPages,homePosts,imageFor} from '@/lib/content';
export const metadata:Metadata={alternates:{canonical:'/'}};
export default function Home(){const [lead,...small]=environmentPosts;return <>
  <FeaturedSlider posts={featuredPosts.map(p=>({...p,image:imageFor(p.featuredImage)?.localPath||null,date:dateLabel(p.publishedAt),excerpt:homePosts.find(h=>h.path===p.path)?.excerpt||p.excerpt}))}/>
  <div className="site-columns container"><main id="main-content">
    <section className="environment-section"><SectionTitle>Çevre &amp; Enerji</SectionTitle><div className="environment-grid">{lead&&<article className="environment-lead">{imageFor(lead.featuredImage)?.localPath&&<a href={lead.path}><img src={imageFor(lead.featuredImage)!.localPath} alt={lead.title}/></a>}<h3><a href={lead.path}>{lead.title}</a></h3><PostMeta post={lead}/><p>{homePosts.find(p=>p.path===lead.path)?.excerpt||lead.excerpt.slice(0,190)+'…'}</p></article>}<div className="environment-small">{small.map(p=><article key={p.path}>{imageFor(p.featuredImage)?.localPath&&<a className="small-image" href={p.path}><img src={imageFor(p.featuredImage)!.localPath} alt="" loading="lazy"/></a>}<div><h3><a href={p.path}>{p.title}</a></h3><time dateTime={p.publishedAt||undefined}>{dateLabel(p.publishedAt)}</time></div></article>)}</div></div></section>
    <SectionTitle center>Son Teknoloji Gelişmeleri</SectionTitle><Feed posts={homePosts}/><Pagination pages={feedPages}/>
  </main><Sidebar/></div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'FuturistikZone',url:'https://futuristikzone.com'}).replace(/</g,'\\u003c')}}/>
  </>;}
