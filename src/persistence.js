import {newGame} from './engine.js';
const key='money-ops-v02';
const amounts=['cash','savings','investments','debt','assets','monthlyIncome','monthlyExpenses','creditScore'];
export let storageWarning='';
function validWallet(p){return p&&amounts.every(k=>Number.isFinite(p[k])&&p[k]>=0)&&p.creditScore<=850;}
export function load(){try {
 const raw=localStorage.getItem(key);if(!raw)return null;const p=JSON.parse(raw);
 if(p.version===2){p.version=3;if(p.completed?.includes(2)){p.completed=p.completed.map(id=>id===2?3:id);if(p.snapshots?.[2]){p.snapshots[3]=p.snapshots[2];delete p.snapshots[2];}p.history?.forEach(h=>{if(h.mission===2)h.mission=3;});if(p.active?.id===2)p.active.id=3;}}
 if(p.version!==3||typeof p.name!=='string'||!p.name.trim()||typeof p.avatar!=='string'||!validWallet(p)||!Number.isFinite(p.xp)||p.xp<0||!Array.isArray(p.completed)||p.completed.some(id=>![1,2,3,4].includes(id))||new Set(p.completed).size!==p.completed.length||!Array.isArray(p.badges)||!Array.isArray(p.history)||!p.snapshots||p.completed.some(id=>!validWallet(p.snapshots[id])))throw Error('Invalid save');
 const a=p.active;
 if(a&&(![1,2,3,4].includes(a.id)||!['brief','learn','choice','event','debrief'].includes(a.step)||!validWallet(a.wallet)||!validWallet(a.start)||(a.step==='event'&&(!a.choice||!a.event))||(a.step==='debrief'&&(!a.result||!a.choice))))throw Error('Invalid mission');
 return {...newGame(),...p};
 }catch{storageWarning='Your save could not be loaded. Start a new profile to continue.';return null;}}
export function save(p){try{localStorage.setItem(key,JSON.stringify(p));storageWarning='';return true;}catch{storageWarning='Local saving is unavailable. Keep this tab open; progress may be lost when you close it.';return false;}}
export function clear(){try{localStorage.removeItem(key);storageWarning='';return true;}catch{storageWarning='Your stored save could not be cleared. Local storage is unavailable.';return false;}}
