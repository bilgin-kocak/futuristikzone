'use client';
import {useEffect,useState} from 'react';
import {searchPosts,type Searchable} from '@/lib/search';
export default function Search({posts}:{posts:Searchable[]}){
  const [query,setQuery]=useState('');useEffect(()=>setQuery(new URLSearchParams(window.location.search).get('q')||''),[]);
  const results=searchPosts(posts,query);
  return <><form className="search-page-form" onSubmit={e=>{e.preventDefault();window.history.replaceState(null,'',`/arama/?q=${encodeURIComponent(query)}`);}}><label htmlFor="search-query">Yazılarda ara</label><div><input id="search-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Başlık, konu veya kategori..."/><button>Ara</button></div></form><div className="search-results" aria-live="polite">{query.trim()?<><p>{results.length} yazı bulundu.</p>{results.map(p=><article key={p.path}><h2><a href={p.path}>{p.title}</a></h2><p>{p.excerpt}</p></article>)}</>:<p>Aramak istediğiniz kelimeyi yazın.</p>}</div></>;
}
