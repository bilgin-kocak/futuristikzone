'use client';
import { useEffect, useState } from 'react';
import type { PostSummary } from '@/lib/content';
type Slide=PostSummary&{image:string|null;date:string};
export default function FeaturedSlider({posts}:{posts:Slide[]}) {
  const [active,setActive]=useState(0),[paused,setPaused]=useState(false);
  useEffect(()=>{if(paused||posts.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setActive(i=>(i+1)%posts.length),6500);return()=>clearInterval(timer);},[paused,posts.length]);
  const post=posts[active];if(!post)return null;
  return <section className="featured-slider container" aria-label="Öne çıkan yazılar" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)}>
    {post.image&&<img className="slider-image" src={post.image} alt=""/>}<div className="slider-shade"/>
    <div className="slider-copy"><div className="slider-categories">{post.categories.map(c=><a key={c.path} href={c.path}>{c.name}</a>)}</div><h2><a href={post.path}>{post.title}</a></h2><div className="slider-meta">{post.date}<span>0 yorum</span></div><p>{post.excerpt}</p><a className="read-more" href={post.path}>Devamını oku</a></div>
    <div className="slider-dots">{posts.map((p,i)=><button key={p.path} aria-label={`${i+1}. yazı: ${p.title}`} aria-pressed={i===active} className={i===active?'active':''} onClick={()=>{setActive(i);setPaused(true);}}/>)}</div>
    <button className="sr-only slider-pause" onClick={()=>setPaused(!paused)}>{paused?'Slaytları oynat':'Slaytları durdur'}</button>
  </section>;
}
