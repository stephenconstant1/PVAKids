import {missions,events} from './content.js';
export const ranks=[['Rookie',0],['Earner',140],['Saver',400],['Investor',1000],['Entrepreneur',1800],['Wealth Builder',3000],['Financially Free',5000]];
export const rank=xp=>ranks.filter(r=>xp>=r[1]).at(-1)[0];
export const nextRank=xp=>ranks.find(r=>r[1]>xp);
export const netWorth=p=>p.cash+p.savings+p.investments+p.assets-p.debt;
export const finances=p=>Object.fromEntries(['cash','savings','investments','debt','assets','monthlyIncome','monthlyExpenses','creditScore'].map(k=>[k,p[k]]));
export function newGame(name='Strategist',avatar='◈'){return {version:3,name,avatar,cash:0,savings:0,investments:0,debt:0,assets:0,monthlyIncome:0,monthlyExpenses:0,creditScore:650,xp:0,completed:[],badges:[],history:[],snapshots:{},active:null,screen:'base',muted:true,eventUsed:false};}
export function begin(p,id){
 const mission=missions.find(m=>m.id===id),previous=id-1;
 if(!mission||(!p.completed.includes(id)&&id>1&&!p.completed.includes(previous)))throw Error('Mission is locked');
 const practice=p.completed.includes(id);
 const wallet=practice?structuredClone(p.snapshots[id]):finances(p);
 return {...p,screen:'mission',active:{id,step:'brief',practice,wallet,start:structuredClone(wallet),choice:null,event:null,result:null}};
}
export function earn(wallet,choice){return {...wallet,cash:wallet.cash+choice.gross-choice.cost};}
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
 return {wallet:{...wallet,cash:0,savings:wallet.savings+totalSaved,investments:wallet.investments+invested,monthlyIncome:2500,monthlyExpenses:needs},available,needs,wants:2500-needs-saved-invested,saved,invested,earnedSaved,totalSaved};
}
export function applyEvent(wallet,event){
 const w={...wallet}; let savingsUsed=0,cashUsed=0,borrowed=0;
 if(event.amount>=0)w.cash+=event.amount;
 else {let due=-event.amount;savingsUsed=Math.min(w.savings,due);w.savings-=savingsUsed;due-=savingsUsed;cashUsed=Math.min(w.cash,due);w.cash-=cashUsed;due-=cashUsed;borrowed=due;w.debt+=borrowed;}
 return {wallet:w,savingsUsed,cashUsed,borrowed,event};
}
export function choose(p,value){
 const a=structuredClone(p.active);
 if(a.step!=='choice')return p;
 if(a.id===1){const c=missions[0].choices.find(c=>c.id===value);if(!c)throw Error('Unknown project');a.choice=c;a.wallet=earn(a.wallet,c);a.result={title:'Value delivered.',explanation:c.explanation,xp:c.xp};a.step='debrief';}
 else if(a.id===2){if(value==='streams'){a.choice={title:'Three income streams',amount:missions[1].income};a.wallet={...a.wallet,cash:a.wallet.cash+missions[1].income};a.result={title:'More ways to earn.',explanation:'Helping, making, and sharing useful ideas can each create income.',xp:180};a.step='debrief';}else {a.choice=budget(a.wallet,Number(value));a.wallet=a.choice.wallet;a.event=events[0];a.step='event';}}
 else if(a.id===3){a.choice=budget(a.wallet,typeof value==='string'?Number(value):value);a.wallet=a.choice.wallet;a.event=events[0];a.step='event';}
 else {if(value!=='budget')throw Error('Unknown budget');const saved=missions.find(m=>m.id===4).budgetSave;a.choice={title:'A balanced money map',saved};a.wallet={...a.wallet,savings:a.wallet.savings+saved};a.result={title:'Every dollar has a job.',explanation:'You covered needs, saved part first, and left room for a want.',xp:220};a.step='debrief';}
 return {...p,active:a};
}
export function resolve(p){if(p.active?.step!=='event')return p;const a=structuredClone(p.active);const outcome=applyEvent(a.wallet,a.event);a.wallet=outcome.wallet;a.result={...outcome,title:outcome.borrowed?'A lesson. A new plan.':'Your buffer held.',xp:outcome.borrowed?180:300,explanation:outcome.borrowed?`Your fund covered $${outcome.savingsUsed}. With your spending money already used, you borrowed $${outcome.borrowed}. Debt reduces net worth and can add interest. Saving more before spending would have reduced the loan.`:`Your savings covered the $600 repair. You kept $${a.wallet.savings} in reserve and added no debt. Savings did not stop the surprise; they gave you a way to pay for it.`};a.step='debrief';return {...p,active:a};}
export function finish(p){
 const a=p.active;if(a?.step!=='debrief')return p;
 const out=structuredClone(p);const oldRank=rank(p.xp);
 if(!a.practice){Object.assign(out,a.wallet);out.xp+=a.result.xp;out.completed.push(a.id);out.snapshots[a.id]=a.start;if(a.id===1)out.badges.push('earner');if(a.id===2){if(a.event&&!a.result.borrowed)out.badges.push('buffer');else out.badges.push('streams');}if(a.id===3&&!a.result.borrowed)out.badges.push('buffer');if(a.id===4)out.badges.push('planner');}
 else if(!out.badges.includes('practice'))out.badges.push('practice');
 out.history.unshift({mission:a.id,practice:a.practice,worth:netWorth(a.wallet),choice:a.choice?.title||(a.id===3?`Saved $${a.choice.totalSaved??a.choice.saved}`:'Money mission'),borrowed:a.result.borrowed||0});out.history=out.history.slice(0,12);out.active=null;out.screen='base';out.lastReward={xp:a.practice?0:a.result.xp,rankUp:oldRank!==rank(out.xp)?rank(out.xp):null};return out;
}
export function randomEvent(p,rng=Math.random){if((!p.completed.includes(3)&&!p.completed.includes(2))||p.eventUsed)return p;const event=events[1+Math.floor(rng()*(events.length-1))];const outcome=applyEvent(p,event);return {...p,...outcome.wallet,eventUsed:true,lastEvent:outcome};}
