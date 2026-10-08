import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
  if(req.url==='/__health'){res.writeHead(200).end('ready');return;}
  let requested;try{requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  const file=path.resolve(root,`.${requested.endsWith('/')?requested+'index.html':requested}`);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(body);}catch{res.writeHead(404,{'Content-Type':'text/html'}).end(await readFile(path.join(root,'404.html')).catch(()=>Buffer.from('404')));}
}).listen(4173,'127.0.0.1',()=>console.log('Static preview: http://127.0.0.1:4173'));
