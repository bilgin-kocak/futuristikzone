import test from 'node:test';
import assert from 'node:assert/strict';
import { routeFor,renderedBody } from '../src/lib/content.ts';
test('authors discovered only in original archive listings still have valid local archives',()=>{
  assert.equal(routeFor('/author/hazalruzgar/')?.kind,'archive');
  assert.equal(routeFor('/author/deryaodabas/')?.kind,'archive');
});
test('rendered body retains original text without broken local links or unavailable remote images',()=>{
  const body=renderedBody({content:'<p>Özgün <a href="https://futuristikzone.com/missing-original/">metin</a></p><img src="https://futuristikzone.com/wp-content/uploads/missing.png">'});
  assert.match(body,/Özgün metin/);assert.doesNotMatch(body,/<img|missing-original/);
});
