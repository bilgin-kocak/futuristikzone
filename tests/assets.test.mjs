import test from 'node:test';
import assert from 'node:assert/strict';
import { imageInfo, assetIdentity, rankAssetCaptures } from '../scripts/archive/assets.mjs';
test('rejects HTML masquerading as an archived image', async()=>{await assert.rejects(()=>imageInfo(Buffer.from('<html>Archive error</html>')));});
test('validates image dimensions and groups WordPress resize variants',async()=>{
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=','base64');
  const info=await imageInfo(png);assert.equal(info.width,1);assert.equal(info.height,1);
  assert.equal(assetIdentity('http://futuristikzone.com/wp-content/uploads/2024/11/cat-585x390.webp'),'futuristikzone.com/wp-content/uploads/2024/11/cat.webp');
});
test('prefers the original crop and larger archived images over newer small thumbnails',()=>{
  const captures=[{original:'https://futuristikzone.com/chip-585x390.png',timestamp:'20250703113929'},{original:'https://futuristikzone.com/chip-1170x660.png',timestamp:'20250703113925'}];
  assert.equal(rankAssetCaptures(captures)[0].original,'https://futuristikzone.com/chip-1170x660.png');
});
