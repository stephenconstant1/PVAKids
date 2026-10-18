const key='money-ops-arcade-scores-v01';
const cleanInitials=value=>String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3);

export function normalizeArcadeScores(value={}){
 const byLevel={};
 for(let lessonId=1;lessonId<=32;lessonId++){
  const entries=Array.isArray(value?.byLevel?.[lessonId])?value.byLevel[lessonId]:[];
  byLevel[lessonId]=entries.map(entry=>({
   initials:cleanInitials(entry.initials),score:Math.max(0,Math.round(Number(entry.score)||0)),lessonId,
   coins:Math.max(0,Math.round(Number(entry.coins)||0)),createdAt:Math.max(0,Math.round(Number(entry.createdAt)||0))
  })).filter(entry=>entry.initials.length>=2).sort((a,b)=>b.score-a.score||b.coins-a.coins||a.createdAt-b.createdAt).slice(0,10);
 }
 return {version:1,byLevel};
}

export function loadArcadeScores(){
 try{return normalizeArcadeScores(JSON.parse(localStorage.getItem(key)||'{}'));}
 catch{return normalizeArcadeScores();}
}

export function arcadeLeaders(scores,lessonId=null,limit=10){
 const normalized=normalizeArcadeScores(scores),entries=lessonId?normalized.byLevel[lessonId]||[]:Object.values(normalized.byLevel).flat();
 return [...entries].sort((a,b)=>b.score-a.score||b.coins-a.coins||a.createdAt-b.createdAt).slice(0,limit);
}

export function recordArcadeScore(scores,{initials,score,lessonId,coins=0,createdAt=Date.now()}){
 const clean=cleanInitials(initials),level=Math.max(1,Math.min(32,Math.round(Number(lessonId)||1)));
 if(clean.length<2)throw Error('Enter two or three initials');
 const normalized=normalizeArcadeScores(scores),prior=normalized.byLevel[level]||[],entry={initials:clean,score:Math.max(0,Math.round(Number(score)||0)),lessonId:level,coins:Math.max(0,Math.round(Number(coins)||0)),createdAt:Math.max(0,Math.round(Number(createdAt)||0))};
 const bestByPlayer=new Map();
 for(const candidate of [...prior,entry]){
  const current=bestByPlayer.get(candidate.initials);
  if(!current||candidate.score>current.score||(candidate.score===current.score&&candidate.coins>current.coins))bestByPlayer.set(candidate.initials,candidate);
 }
 normalized.byLevel[level]=[...bestByPlayer.values()].sort((a,b)=>b.score-a.score||b.coins-a.coins||a.createdAt-b.createdAt).slice(0,10);
 try{localStorage.setItem(key,JSON.stringify(normalized));}catch{}
 return normalized;
}

export const arcadeScoreStorageKey=key;
