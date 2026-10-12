import {missions,events} from './content.js';
import {applyEffects,defaultFinances,finances,netWorth,normalizeFinances} from './finance.js';

export {finances,netWorth};
export const ranks=[['Rookie',0],['Earner',140],['Saver',550],['Investor',1400],['Entrepreneur',2800],['Wealth Builder',4800],['Financially Free',7200]];
export const rank=xp=>ranks.filter(r=>xp>=r[1]).at(-1)[0];
export const nextRank=xp=>ranks.find(r=>r[1]>xp);
export const passingScore=70;
export function missionScore(active){
 if(!active)return 0;
 if(active.id===1)return active.choice?.id==='product'?100:active.choice?.id==='skill'?95:90;
 if(active.id===2||active.id===4)return 100;
 if(active.id===3)return active.result?.borrowed?75:100;
 const qualities=(active.decisions||[]).map(decision=>decision.quality).filter(Number.isFinite);
 return qualities.length?Math.round(40+(qualities.reduce((sum,value)=>sum+value,0)/qualities.length)*20):0;
}

export function newGame(name='Strategist',avatar='maya',playerStyle={}){
 return {version:4,name,avatar,playerStyle:{accent:playerStyle.accent||'#d9f577',emblem:playerStyle.emblem||'◈'},...defaultFinances(),xp:0,completed:[],badges:[],missionMedals:{},decisions:{},history:[],snapshots:{},portfolio:{},business:{},goal:{},active:null,screen:'base',muted:true,musicVolume:.35,sfxVolume:.7,eventUsed:false};
}

export function begin(p,id){
 const mission=missions.find(m=>m.id===id),practice=p.completed.includes(id);
 const missingPrerequisite=id>1&&Array.from({length:id-1},(_,index)=>index+1).some(required=>!p.completed.includes(required));
 if(!mission||(!practice&&missingPrerequisite))throw Error('Mission is locked');
 const source=practice?p.snapshots[id]:p;
 const wallet=finances(source||p);
 return {...p,screen:'mission',active:{id,step:'brief',practice,wallet,start:structuredClone(wallet),choice:null,event:null,result:null,decisions:[]}};
}

export function earn(wallet,choice){return {...wallet,cash:wallet.cash+choice.gross-choice.cost,totalIncome:(wallet.totalIncome||0)+choice.gross};}

export function budget(wallet,plan){
 const saved=typeof plan==='number'?plan:plan?.saved??0;
 const invested=typeof plan==='number'?0:plan?.invested??0;
 const allowed=missions.find(m=>m.id===3).savings;
 if(!allowed.includes(saved)||!allowed.includes(invested)||!allowed.includes(saved+invested))throw Error('Invalid money plan');
 const earnedSaved=wallet.cash;
 const available=earnedSaved+2500;
 const needs=1750;
 if(saved+invested+needs>2500)throw Error('Money plan exceeds payday money');
 const totalSaved=earnedSaved+saved;
 return {wallet:{...wallet,cash:0,savings:wallet.savings+totalSaved,investments:wallet.investments+invested,monthlyIncome:2500,monthlyExpenses:needs,totalIncome:(wallet.totalIncome||0)+2500},available,needs,wants:2500-needs-saved-invested,saved,invested,earnedSaved,totalSaved};
}

export function applyEvent(wallet,event){
 const w=normalizeFinances(wallet);let savingsUsed=0,cashUsed=0,borrowed=0;
 if(event.amount>=0){w.cash+=event.amount;w.totalIncome+=event.amount;}
 else {let due=-event.amount;savingsUsed=Math.min(w.savings,due);w.savings-=savingsUsed;due-=savingsUsed;cashUsed=Math.min(w.cash,due);w.cash-=cashUsed;due-=cashUsed;borrowed=due;w.debt+=borrowed;}
 return {wallet:w,savingsUsed,cashUsed,borrowed,event};
}

function advancedChoice(p,value){
 const a=structuredClone(p.active),mission=missions.find(m=>m.id===a.id);
 const group=a.step==='choice'?mission.decision:a.step==='event'?mission.event:null;
 if(!group)return p;
 const option=group.options.find(option=>option.id===value);
 if(!option)throw Error('Unknown mission decision');
 const outcome=applyEffects(a.wallet,option.effects);
 a.wallet=outcome.wallet;
 const optionIndex=group.options.indexOf(option);
 const record={stage:a.step,label:option.label,feedback:option.feedback,effects:outcome.applied,quality:option.quality??Math.max(1,3-optionIndex)};
 a.decisions=[...(a.decisions||[]),record];
 if(a.step==='choice'){
  a.choice={title:option.label,id:option.id};
  a.firstOutcome=record;
  a.event={title:mission.event.title,description:mission.event.prompt};
  a.step='event';
 }else{
  a.secondOutcome=record;
  a.result={title:mission.finale?'Financial Freedom Challenge complete!':'Mission complete!',explanation:mission.takeaway,xp:mission.finale?500:220+mission.id*5};
  a.step='debrief';
 }
 return {...p,active:a};
}

export function choose(p,value){
 const original=p.active;
 if(!original)return p;
 if(original.id>=5)return advancedChoice(p,value);
 if(original.step!=='choice')return p;
 const a=structuredClone(original);
 if(a.id===1){const c=missions[0].choices.find(c=>c.id===value);if(!c)throw Error('Unknown project');a.choice=c;a.wallet=earn(a.wallet,c);a.result={title:'Value delivered.',explanation:c.explanation,xp:c.xp};a.step='debrief';}
 else if(a.id===2){if(value==='streams'){a.choice={title:'Time, skills, and ideas',amount:missions[1].income};a.wallet={...a.wallet,cash:a.wallet.cash+missions[1].income,totalIncome:(a.wallet.totalIncome||0)+missions[1].income};a.result={title:'More ways to earn.',explanation:'Your time, your skills, and your ideas can each create value and earn money.',xp:180};a.step='debrief';}else {a.choice=budget(a.wallet,Number(value));a.wallet=a.choice.wallet;a.event=events[0];a.step='event';}}
 else if(a.id===3){a.choice=budget(a.wallet,typeof value==='string'?Number(value):value);a.wallet=a.choice.wallet;a.event=events[0];a.step='event';}
 else {if(value!=='budget')throw Error('Unknown budget');const saved=missions.find(m=>m.id===4).budgetSave;a.choice={title:'A balanced money map',saved};a.wallet={...a.wallet,savings:a.wallet.savings+saved};a.result={title:'Every dollar has a job.',explanation:'You covered needs, saved part first, and left room for a want.',xp:220};a.step='debrief';}
 return {...p,active:a};
}

export function resolve(p){
 if(p.active?.step!=='event'||p.active.id>=5)return p;
 const a=structuredClone(p.active),outcome=applyEvent(a.wallet,a.event);a.wallet=outcome.wallet;
 a.result={...outcome,title:outcome.borrowed?'A lesson. A new plan.':'Your buffer held.',xp:outcome.borrowed?180:300,explanation:outcome.borrowed?`Your fund covered $${outcome.savingsUsed}. With your spending money already used, you borrowed $${outcome.borrowed}. Debt reduces net worth and can add interest. Saving more before spending would have reduced the loan.`:`Your savings covered the $600 repair. You kept $${a.wallet.savings} in reserve and added no debt. Savings did not stop the surprise; they gave you a way to pay for it.`};
 a.step='debrief';return {...p,active:a};
}

function awardBadges(out,a){
 const add=id=>{if(!out.badges.includes(id))out.badges.push(id);};
 if(a.id===1)add('earner');
 if(a.id===2)add('streams');
 if(a.id===3&&!a.result.borrowed)add('buffer');
 if(a.id===4)add('planner');
 if(a.id===5)add('investor');
 if(a.id===8)add('founder');
 if(a.id===16)add('analyst');
 if(a.id===23)add('paycheck');
 if(a.id===29)add('giver');
 if(a.id===32)add('freedom');
}

function decisionMedal(decisions=[]){
 const scores=decisions.map(decision=>decision.quality).filter(Number.isFinite);
 const average=scores.length?scores.reduce((sum,score)=>sum+score,0)/scores.length:2;
 return average>=2.5?'gold':average>=1.5?'silver':'bronze';
}

export function finish(p){
 const a=p.active;if(a?.step!=='debrief')return p;
 if(!a.practice&&missionScore(a)<passingScore)return p;
 const out=structuredClone(p),oldRank=rank(p.xp);
 if(!a.practice){
  Object.assign(out,a.wallet);out.xp+=a.result.xp;out.completed.push(a.id);out.snapshots[a.id]=a.start;
  out.decisions[a.id]=a.decisions||[{stage:'choice',label:a.choice?.title||'Money mission',feedback:a.result.explanation,effects:{}}];
  out.missionMedals[a.id]=a.result.borrowed?'bronze':a.id>=5?decisionMedal(a.decisions):'silver';
  awardBadges(out,a);
 }else if(!out.badges.includes('practice'))out.badges.push('practice');
 const mission=missions.find(m=>m.id===a.id);
 out.history.unshift({mission:a.id,practice:a.practice,worth:netWorth(a.wallet),choice:a.choice?.title||(a.id===3?`Saved $${a.choice.totalSaved??a.choice.saved}`:'Money mission'),borrowed:a.result.borrowed||0,title:mission?.title});
 out.history=out.history.slice(0,40);out.active=null;out.screen='base';out.lastReward={xp:a.practice?0:a.result.xp,rankUp:oldRank!==rank(out.xp)?rank(out.xp):null};return out;
}

export function randomEvent(p,rng=Math.random){
 if(!p.completed.includes(3)||p.eventUsed)return p;
 const event=events[1+Math.floor(rng()*(events.length-1))],outcome=applyEvent(p,event);
 return {...p,...outcome.wallet,eventUsed:true,lastEvent:outcome};
}
