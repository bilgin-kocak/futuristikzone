import * as cheerio from 'cheerio';
const rank={unavailable:0,partial:1,complete:2};
export const bodyCharacters=page=>cheerio.load(page.content||'',null,false).text().replace(/\s+/g,' ').trim().length;
export function selectRecovery(existing,candidate){
  if(!candidate)return existing;
  if(!existing)return candidate;
  const previousRank=rank[existing.page.recoveryStatus]||0,nextRank=rank[candidate.page.recoveryStatus]||0;
  if(nextRank!==previousRank)return nextRank>previousRank?candidate:existing;
  const previousLength=bodyCharacters(existing.page),nextLength=bodyCharacters(candidate.page);
  if(nextLength!==previousLength)return nextLength>previousLength?candidate:existing;
  return (candidate.page.archiveTimestamp||'')>(existing.page.archiveTimestamp||'')?candidate:existing;
}
export function preserveAsset(existing,candidate){
  if(existing?.status==='recovered'&&candidate?.status!=='recovered')return {...existing,upgradeFailure:candidate||{error:'No usable replacement capture'}};
  return candidate||existing;
}
