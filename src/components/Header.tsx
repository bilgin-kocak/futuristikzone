'use client';
import { useRef, useState } from 'react';
export default function Header({logo,popular}:{logo:string;popular:{path:string;title:string}[]}) {
  const [open,setOpen]=useState(false),[search,setSearch]=useState(false),[drawerOpen,setDrawerOpen]=useState(false);
  const drawer=useRef<HTMLDialogElement>(null);
  return <header className="site-header"><div className="header-inner">
    <button className="menu-toggle" aria-label={open?'Menüyü kapat':'Menüyü aç'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}><span/><span/><span/></button>
    <a className="brand" href="/" aria-label="FuturistikZone ana sayfa"><img src={logo} width="500" height="80" alt="FuturistikZone"/></a>
    <nav id="main-navigation" aria-label="Ana menü" className={open?'main-nav is-open':'main-nav'}><a href="/">Ana Sayfa</a><a href="/hakkimizda/">Hakkımızda</a><a href="/iletisim/">İletişim</a></nav>
    <button className="desktop-menu" aria-label="Gezinme menüsü" aria-expanded={drawerOpen} aria-controls="navigation-drawer" onClick={()=>{drawer.current?.showModal();setDrawerOpen(true);}}><span/><span/><span/></button>
    <button className="search-toggle" aria-label="Aramayı aç" aria-expanded={search} onClick={()=>setSearch(!search)}><span className="search-icon"/></button>
  </div>{search&&<form className="header-search" action="/arama/"><label className="sr-only" htmlFor="header-query">Yazılarda ara</label><input id="header-query" name="q" placeholder="Yazın ve enter tuşuna basın..." autoFocus/><button>Ara</button></form>}
  <dialog ref={drawer} id="navigation-drawer" className="navigation-drawer" aria-label="Gezinme menüsü" onClose={()=>setDrawerOpen(false)} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)drawer.current?.close();}}}>
    <button className="drawer-close" aria-label="Gezinme menüsünü kapat" onClick={()=>drawer.current?.close()}>×</button><a href="/"><img src={logo} width="500" height="80" alt="FuturistikZone"/></a>
    <nav aria-label="Ek gezinme"><a href="/">Ana Sayfa</a><a href="/hakkimizda/">Hakkımızda</a><a href="/iletisim/">İletişim</a></nav>
    <section><h2>Popular Posts</h2><ol>{popular.map(p=><li key={p.path}><a href={p.path}>{p.title}</a></li>)}</ol></section>
  </dialog></header>;
}
