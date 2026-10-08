import { dateLabel, imageFor, type PostSummary } from '@/lib/content';
export function Categories({terms}:{terms:PostSummary['categories']}){return <div className="category-labels">{terms.map(c=><a key={c.path} href={c.path}>{c.name}</a>)}</div>;}
export function PostMeta({post}:{post:PostSummary}){return <div className="post-meta">{post.author&&<span>by <a href={post.author.path}>{post.author.name}</a></span>}{post.publishedAt&&<time dateTime={post.publishedAt}>{dateLabel(post.publishedAt)}</time>}</div>;}
export function PostCard({post}:{post:PostSummary}){
  const image=imageFor(post.featuredImage);const available=post.available;
  const title=available?<a href={post.path}>{post.title}</a>:post.title;
  return <article className={`post-card ${image?.localPath?'has-thumbnail':''}`}>
    {image?.localPath&&<div className="card-thumbnail">{available?<a href={post.path}><img src={image.localPath} alt={post.title} width={image.width} height={image.height} loading="lazy"/></a>:<img src={image.localPath} alt={post.title} loading="lazy"/>}</div>}
    <div className="card-content"><Categories terms={post.categories}/><h2>{title}</h2><PostMeta post={post}/><p>{post.excerpt}</p>{!available&&<span className="excerpt-only">Tam metin mevcut değil</span>}</div>
  </article>;
}
export function Feed({posts}:{posts:PostSummary[]}){return <div className="feed">{posts.length?posts.map(p=><PostCard post={p} key={p.path}/>):<p>Bu kategoride şu anda erişilebilir yazı bulunmuyor.</p>}</div>;}
export function Pagination({base='/',current=1,pages}:{base?:string;current?:number;pages:number[]}){return pages.length>1?<nav className="pagination" aria-label="Sayfalar">{pages.map(n=>n===current?<span key={n} aria-current="page">{n}</span>:<a key={n} href={n===1?base:`${base}page/${n}/`}>{n}</a>)}{pages.indexOf(current)<pages.length-1&&<a aria-label="Sonraki sayfa" href={`${base}page/${pages[pages.indexOf(current)+1]}/`}>›</a>}</nav>:null;}
export function SectionTitle({children,center=false}:{children:React.ReactNode;center?:boolean}){return <h2 className={`section-title ${center?'center':''}`}><span>{children}</span></h2>;}
