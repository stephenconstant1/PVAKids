import {newGame} from './engine.js';
import {financialFields,normalizeFinances,validFinances} from './finance.js';

const key='money-ops-v02';
export let storageWarning='';

function migrate(p){
 if(p.version===2){
  p.version=3;
  if(p.completed?.includes(2)){
   p.completed=p.completed.map(id=>id===2?3:id);
   if(p.snapshots?.[2]){p.snapshots[3]=p.snapshots[2];delete p.snapshots[2];}
   p.history?.forEach(h=>{if(h.mission===2)h.mission=3;});
   if(p.active?.id===2)p.active.id=3;
  }
 }
 if(p.version===3){
  const defaults=newGame(p.name,p.avatar);
  for(const field of financialFields)if(!Number.isFinite(p[field]))p[field]=defaults[field];
  p.snapshots=Object.fromEntries(Object.entries(p.snapshots||{}).map(([id,wallet])=>[id,normalizeFinances(wallet)]));
  if(p.active){p.active.wallet=normalizeFinances(p.active.wallet);p.active.start=normalizeFinances(p.active.start);p.active.decisions||=[];}
  p.missionMedals||={};p.decisions||={};p.portfolio||={};p.business||={};p.goal||={};
  p.musicVolume??=.35;p.sfxVolume??=.7;p.version=4;
 }
 p.playerStyle||={accent:'#d9f577',emblem:'◈'};
 return p;
}

export function load(){try{
 const raw=localStorage.getItem(key);if(!raw)return null;
 const p=migrate(JSON.parse(raw)),ids=new Set(Array.from({length:32},(_,i)=>i+1));
 if(p.version!==4||typeof p.name!=='string'||!p.name.trim()||typeof p.avatar!=='string'||!validFinances(p)||!Number.isFinite(p.xp)||p.xp<0||!Array.isArray(p.completed)||p.completed.some(id=>!ids.has(id))||new Set(p.completed).size!==p.completed.length||!Array.isArray(p.badges)||!Array.isArray(p.history)||!p.snapshots||p.completed.some(id=>!validFinances(p.snapshots[id])))throw Error('Invalid save');
 const a=p.active;
 if(a&&(!ids.has(a.id)||!['brief','learn','choice','event','debrief'].includes(a.step)||!validFinances(a.wallet)||!validFinances(a.start)||(a.step==='event'&&(!a.choice||!a.event))||(a.step==='debrief'&&(!a.result||!a.choice))))throw Error('Invalid mission');
 return {...newGame(),...p,...normalizeFinances(p)};
 }catch{storageWarning='Your save could not be loaded. Start a new profile to continue.';return null;}}

export function save(p){try{localStorage.setItem(key,JSON.stringify(p));storageWarning='';return true;}catch{storageWarning='Local saving is unavailable. Keep this tab open; progress may be lost when you close it.';return false;}}
export function clear(){try{localStorage.removeItem(key);storageWarning='';return true;}catch{storageWarning='Your stored save could not be cleared. Local storage is unavailable.';return false;}}
