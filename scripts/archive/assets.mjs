import sharp from 'sharp';
export async function imageInfo(buffer) {
  if(/^\s*(?:<!doctype|<html)/i.test(buffer.toString('utf8',0,100)))throw new Error('HTML response is not an image');
  const info=await sharp(buffer).metadata();
  if(!info.width||!info.height)throw new Error('Image has no dimensions');
  return {width:info.width,height:info.height,format:info.format};
}
export function assetIdentity(url) {
  const parsed=new URL(url);return decodeURI(parsed.hostname.replace(/^www\./,'')+parsed.pathname).replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i,'');
}
export function rankAssetCaptures(captures) {
  const pixels=url=>{const size=url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i);return size?Number(size[1])*Number(size[2]):Number.MAX_SAFE_INTEGER;};
  return [...captures].sort((a,b)=>pixels(b.original)-pixels(a.original)||b.timestamp.localeCompare(a.timestamp));
}
