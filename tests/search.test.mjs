import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPosts } from '../src/lib/search.ts';
test('search folds Turkish casing and finds categories without blank-query results',()=>{
  const posts=[{path:'/willow/',title:'Google’ın Kuantum Çipi Willow',excerpt:'Yeni hesaplama',categories:[{name:'Quantum'}]},{path:'/robot/',title:'İnsan ve Robot',excerpt:'Özgün metin',categories:[{name:'Yapay Zeka'}]}];
  assert.deepEqual(searchPosts(posts,'KUANTUM').map(p=>p.path),['/willow/']);
  assert.deepEqual(searchPosts(posts,'yapay zeka').map(p=>p.path),['/robot/']);
  assert.deepEqual(searchPosts(posts,'insan').map(p=>p.path),['/robot/']);
  assert.deepEqual(searchPosts(posts,'  '),[]);
});
