import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {hash} from '../scripts/archive/io.mjs';
import {selectRecovery,preserveAsset} from '../scripts/archive/recovery-state.mjs';

const capture=(status,body,timestamp)=>({page:{recoveryStatus:status,content:`<p>${body}</p>`,archiveTimestamp:timestamp},html:'captured HTML'});
test('complete older capture beats longer partial newer capture',()=>{
  const newer=capture('partial','x'.repeat(2000),'20250102000000');const older=capture('complete','x'.repeat(1500),'20250101000000');
  assert.equal(selectRecovery(newer,older),older);
});

test('recovery inspects older bodies even when the newest opening has valid metadata',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'fz-captures-'));const json=async(file,value)=>{await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),JSON.stringify(value));};
  try{
    await mkdir(path.join(root,'reports'));await writeFile(path.join(root,'no-network.mjs'),'globalThis.fetch=async()=>{throw new Error("Network disabled");};const timer=globalThis.setTimeout;globalThis.setTimeout=(fn,ms,...args)=>timer(fn,0,...args);');
    const url='https://futuristikzone.com/original/';const timestamps=['20250102000000','20250101000000'];
    await json('.archive-cache/cdx-all.json',[['timestamp','original','statuscode'],...timestamps.map(t=>[t,url,'200'])]);await json('content/manifest.json',{});
    for(const [i,t] of timestamps.entries()){
      const archive=`https://web.archive.org/web/${t}id_/${url}`;const body='<html><h1 class="single-post-title">Özgün başlık</h1><meta property="article:published_time" content="2024-01-01T12:00:00Z"><div class="post-box-meta-single"><a href="/author/yazar/">Yazar</a></div><div class="penci-post-entry-inner"><p>'+('Özgün başlangıç. '.repeat(20))+(i?'Özgün son paragraflar. '.repeat(60):'')+'</p></div></html>';
      await json('.archive-cache/raw/'+hash(archive)+'.json',{url:archive,type:'text/html',body});
    }
    execFileSync(process.execPath,['--import',path.join(root,'no-network.mjs'),path.resolve('scripts/archive/recover.mjs')],{cwd:root,timeout:10000});
    const article=JSON.parse(await readFile(path.join(root,'content/articles/original.json')));assert.equal(article.archiveTimestamp,timestamps[1]);assert.match(article.content,/son paragraflar/);
  }finally{await rm(root,{recursive:true,force:true});}
});
test('a longer complete older body beats a truncated newer opening with valid metadata',()=>{
  const newer=capture('complete','Opening paragraph. '.repeat(20),'20250102000000');const older=capture('complete','Opening paragraph. '.repeat(20)+'Original ending. '.repeat(80),'20250101000000');
  assert.equal(selectRecovery(newer,older),older);
});
test('a failed or partial refresh preserves the previously verified body',()=>{
  const previous=capture('complete','Original full text. '.repeat(20),'20250101000000');
  assert.equal(selectRecovery(previous,null),previous);assert.equal(selectRecovery(previous,capture('partial','new incomplete '.repeat(30),'20250102000000')),previous);
});
test('failed image upgrades keep the existing local file and record the failure',()=>{
  const previous={status:'recovered',localPath:'/images/original.jpg',width:585,checksum:'verified'};const failure={status:'unavailable',originalUrl:'https://example.com/large.jpg',error:'HTTP 503'};
  const result=preserveAsset(previous,failure);assert.equal(result.status,'recovered');assert.equal(result.localPath,previous.localPath);assert.equal(result.checksum,previous.checksum);assert.equal(result.upgradeFailure.error,'HTTP 503');
});
test('documented cached-only recovery and catalog commands preserve committed data without caches',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'fz-recovery-'));const json=async(file,value)=>{await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),JSON.stringify(value));};
  try{
    await mkdir(path.join(root,'reports'));await mkdir(path.join(root,'content/articles'),{recursive:true});await writeFile(path.join(root,'no-network.mjs'),'globalThis.fetch=async()=>{throw new Error("Network disabled in regression fixture");};');await json('content/manifest.json',{});await json('content/categories/index.json',[{path:'/category/fizik/',name:'Fizik'}]);await json('content/authors.json',[{path:'/author/yazar/',name:'Yazar'}]);await json('content/listings.json',{'/':{posts:[{path:'/original/',title:'Original'}],source:'original capture'}});await json('content/site.json',{logo:'original.png'});
    const scripts=path.resolve('scripts/archive');
    execFileSync(process.execPath,['--import',path.join(root,'no-network.mjs'),path.join(scripts,'recover.mjs'),'--cached-only'],{cwd:root,timeout:10000});
    execFileSync(process.execPath,[path.join(scripts,'catalog.mjs')],{cwd:root,timeout:10000});
    assert.equal(JSON.parse(await readFile(path.join(root,'content/categories/index.json'))).length,1);assert.equal(JSON.parse(await readFile(path.join(root,'content/authors.json'))).length,1);assert.equal(JSON.parse(await readFile(path.join(root,'content/listings.json')))['/'].posts[0].title,'Original');
  }finally{await rm(root,{recursive:true,force:true});}
});
