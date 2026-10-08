import test from 'node:test';
import assert from 'node:assert/strict';
import {request} from '../scripts/archive/io.mjs';
test('archive requests retry transient errors and stop on permanent missing pages',async(t)=>{
  let calls=0;const fetch=t.mock.method(globalThis,'fetch',async()=>new Response(++calls<3?'Rate limited':'Original HTML',{status:calls<3?429:200,headers:{'Content-Type':'text/html'}}));
  const result=await request('https://example.com/archive',{delay:0});
  assert.equal(calls,3);assert.equal(result.body,'Original HTML');
  fetch.mock.mockImplementation(async()=>{calls++;return new Response('Missing',{status:404});});calls=0;
  await assert.rejects(request('https://example.com/missing',{delay:0}),/HTTP 404/);assert.equal(calls,1);
});
