export interface Searchable { path:string; title:string; excerpt:string; categories:{name:string}[] }
const fold=(value:string)=>value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
export function searchPosts<T extends Searchable>(posts:T[],query:string):T[] {
  const terms=fold(query.trim()).split(/\s+/).filter(Boolean);if(!terms.length)return [];
  return posts.map(post=>{
    const title=fold(post.title),category=fold(post.categories.map(c=>c.name).join(' ')),excerpt=fold(post.excerpt);
    const all=`${title} ${category} ${excerpt}`;
    const score=terms.every(t=>all.includes(t))?terms.reduce((sum,t)=>sum+(title.includes(t)?3:category.includes(t)?2:1),0):0;
    return {post,score};
  }).filter(p=>p.score>0).sort((a,b)=>b.score-a.score).map(p=>p.post);
}
