import {test} from 'node:test';
import assert from 'node:assert/strict';
import {begin,choose,finish,newGame,netWorth,rank,resolve,missionScore,passingScore} from '../src/engine.js';
import {curriculum,missions} from '../src/content.js';
import {curriculumLanguage} from '../src/curriculum-language.js';
import {financialFields,validFinances} from '../src/finance.js';
import {load,save} from '../src/persistence.js';

const advancedFields=['location','brief','concepts','dialogue','decision','event','takeaway'];
const cast=new Set(['maya','jordan','sofia','kai']);

function atChoice(profile,id){
 const started=begin(profile,id);
 return {...started,active:{...started.active,step:'choice'}};
}

function completeMission(profile,id,decisionIndex=0,eventIndex=0){
 let next=atChoice(profile,id);
 if(id===1)next=choose(next,missions[0].choices[2].id);
 else if(id===2)next=choose(next,'streams');
 else if(id===3){next=choose(next,{saved:750,invested:0});next=resolve(next);}
 else if(id===4)next=choose(next,'budget');
 else {
  next=choose(next,missions[id-1].decision.options[decisionIndex].id);
  assert.equal(next.active.step,'event',`mission ${id} must expose its consequence and second decision`);
  assert.equal(next.active.decisions.length,1);
  next=choose(next,missions[id-1].event.options[eventIndex].id);
 }
 assert.equal(next.active.step,'debrief',`mission ${id} must reach a debrief`);
 return finish(next);
}

function assertValidMoney(profile,label='profile'){
 assert.equal(validFinances(profile),true,`${label} must have valid finances`);
 for(const field of financialFields){
  assert.equal(Number.isFinite(profile[field]),true,`${label}.${field} must be finite`);
  assert.ok(profile[field]>=0,`${label}.${field} must not be negative`);
 }
 assert.ok(profile.creditScore>=300&&profile.creditScore<=850,`${label}.creditScore must stay in range`);
 assert.equal(Number.isFinite(netWorth(profile)),true,`${label} net worth must be finite`);
}

function memoryStorage(){
 const data=new Map();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{
  getItem:key=>data.get(key)??null,
  setItem:(key,value)=>data.set(key,value),
  removeItem:key=>data.delete(key)
 }});
 return data;
}

test('campaign content defines 32 ordered, playable mission schemas',()=>{
 assert.equal(curriculum.length,32);
 assert.equal(missions.length,32);
 assert.deepEqual(missions.map(m=>m.id),Array.from({length:32},(_,index)=>index+1));
 assert.equal(new Set(missions.map(m=>m.id)).size,32);

 for(const mission of missions){
  assert.equal(typeof mission.title,'string',`mission ${mission.id} needs a title`);
  assert.ok(mission.title.trim(),`mission ${mission.id} title cannot be blank`);
  assert.equal(typeof mission.topic,'string',`mission ${mission.id} needs a topic`);
  assert.ok(mission.topic.trim(),`mission ${mission.id} topic cannot be blank`);
  assert.equal(typeof mission.icon,'string',`mission ${mission.id} needs an icon`);
  assert.ok(mission.terms?.length>=3,`mission ${mission.id} needs prompt-aligned lesson terms`);
  assert.ok(mission.scripture?.reference?.trim(),`mission ${mission.id} needs a scripture reference`);
  assert.ok(mission.scripture?.text?.trim(),`mission ${mission.id} needs the scripture text, not only its reference`);
  assert.ok(mission.title===curriculum[mission.id-1]||mission.topic===curriculum[mission.id-1],`mission ${mission.id} must retain its curriculum title or topic`);

  if(mission.id<5)continue;
  for(const field of advancedFields)assert.ok(mission[field],`mission ${mission.id} needs ${field}`);
  assert.ok(mission.concepts.length>=2,`mission ${mission.id} needs multiple concepts`);
  assert.ok(mission.dialogue.length>=2,`mission ${mission.id} needs recurring-character dialogue`);
  for(const line of mission.dialogue){
   assert.ok(cast.has(line.speaker),`mission ${mission.id} uses an unknown speaker`);
   assert.ok(line.text?.trim(),`mission ${mission.id} has empty dialogue`);
  }
  for(const stage of ['decision','event']){
   const group=mission[stage];
   assert.ok(group.prompt?.trim(),`mission ${mission.id} ${stage} needs a prompt`);
   assert.ok(group.options.length>=2,`mission ${mission.id} ${stage} needs at least two choices`);
   assert.equal(new Set(group.options.map(option=>option.id)).size,group.options.length,`mission ${mission.id} ${stage} option IDs must be unique`);
   for(const option of group.options){
    for(const field of ['id','label','icon','detail','feedback'])assert.ok(option[field]?.trim(),`mission ${mission.id} ${stage} option needs ${field}`);
    assert.ok(option.effects&&Object.keys(option.effects).length,`mission ${mission.id} ${stage} option needs a financial consequence`);
    for(const [field,value] of Object.entries(option.effects)){
     assert.ok(financialFields.includes(field),`mission ${mission.id} uses unknown finance field ${field}`);
     assert.equal(Number.isFinite(value),true,`mission ${mission.id} ${field} effect must be finite`);
    }
   }
  }
 }
});

test('week one teaches build value and get paid without promising payment for helping',()=>{
 const weekOne=JSON.stringify(missions[0]).toLowerCase();
 assert.match(weekOne,/build value/);
 assert.match(weekOne,/get paid/);
 assert.doesNotMatch(weekOne,/help someone[^.]*they pay|helped someone[^.]*earned/);
});

test('all rendered lesson titles, core ideas, and terms use the canonical curriculum language',()=>{
 for(const mission of missions){
  const canonical=curriculumLanguage[mission.id];
  assert.equal(mission.title,canonical.title,`mission ${mission.id} title drifted from the supplied lesson`);
  assert.equal(mission.coreIdea,canonical.coreIdea,`mission ${mission.id} core idea was paraphrased`);
  assert.deepEqual(mission.terms,canonical.terms,`mission ${mission.id} terminology was interpreted`);
 }
 assert.equal(missions[16].title,'Supply, Demand & Why Prices Change');
 assert.equal(missions[19].title,'Credit Scores & Building Strong Credit');
 assert.ok(missions[22].terms.includes('GROSS PAY ≠ TAKE-HOME PAY'));
 assert.ok(missions[24].terms.includes('PROFIT = REVENUE - EXPENSES'));
});

test('all 32 missions complete sequentially with finite, nonnegative persistent finances',()=>{
 let profile=newGame('Full Campaign Tester','★');
 assertValidMoney(profile,'new game');

 for(let id=1;id<=32;id++){
  if(id<32)assert.throws(()=>begin(profile,id+1),/locked/i,`mission ${id+1} must remain locked before mission ${id}`);
  const before=profile;
  profile=completeMission(profile,id);
  assert.notEqual(profile,before);
  assert.deepEqual(profile.completed,Array.from({length:id},(_,index)=>index+1));
  assert.equal(profile.active,null);
  assert.equal(profile.screen,'base');
  assert.ok(profile.snapshots[id],`mission ${id} needs a replay snapshot`);
  assertValidMoney(profile,`mission ${id} result`);
  assertValidMoney(profile.snapshots[id],`mission ${id} snapshot`);
  assert.ok(profile.missionMedals[id],`mission ${id} needs a completion medal`);
  if(id>=5)assert.equal(profile.decisions[id].length,2,`mission ${id} must save both decisions`);
 }

 assert.equal(profile.completed.length,32);
 assert.equal(rank(profile.xp),'Financially Free');
 assert.ok(profile.badges.includes('freedom'));
 assert.equal(profile.history.length,32);
});

test('advanced missions require both decision stages before completion',()=>{
 let profile=newGame();
 for(const id of [5,16,23,32]){
  profile.completed=Array.from({length:id-1},(_,index)=>index+1);
  let play=atChoice(profile,id);
  const untouched=finish(play);
  assert.deepEqual(untouched,play,'a mission cannot finish at its first decision');
  assert.throws(()=>choose(play,'missing-option'),/unknown/i);

  const first=missions[id-1].decision.options[0];
  play=choose(play,first.id);
  assert.equal(play.active.step,'event');
  assert.equal(play.active.choice.id,first.id);
  assert.equal(play.active.decisions.length,1);
  assert.deepEqual(finish(play),play,'a mission cannot finish before the event response');

  const second=missions[id-1].event.options.at(-1);
  play=choose(play,second.id);
  assert.equal(play.active.step,'debrief');
  assert.equal(play.active.decisions.length,2);
  assert.equal(play.active.decisions[0].stage,'choice');
  assert.equal(play.active.decisions[1].stage,'event');
  assertValidMoney(play.active.wallet,`mission ${id} preview`);

  profile=finish(play);
 }
});

test('each level calculates a score and requires 70 points to pass',()=>{
 const profile={...newGame(),completed:[1,2,3,4]};
 let play=atChoice(profile,5);
 play=choose(play,missions[4].decision.options.at(-1).id);
 play=choose(play,missions[4].event.options.at(-1).id);
 assert.equal(play.active.step,'debrief');
 assert.equal(missionScore(play.active),60);
 assert.equal(passingScore,70);
 const blocked=finish(play);
 assert.equal(blocked.active.step,'debrief');
 assert.equal(blocked.completed.includes(5),false);
});

test('locks require every prior mission, including after a migrated gap',()=>{
 const fresh=newGame();
 assert.throws(()=>begin(fresh,2),/locked/i);
 assert.throws(()=>begin(fresh,33),/locked/i);
 const gapped={...fresh,completed:[1,3],snapshots:{3:{...fresh}}};
 assert.throws(()=>begin(gapped,4),/locked/i);
 assert.doesNotThrow(()=>begin(gapped,2));
 assert.doesNotThrow(()=>begin(gapped,3),'an already-completed mission remains available for practice');
});

test('advanced practice uses its original snapshot and cannot farm money, XP, or medals',()=>{
 let profile=newGame();
 for(let id=1;id<=5;id++)profile=completeMission(profile,id);
 const campaign=structuredClone(profile);

 let practice=atChoice(profile,5);
 assert.equal(practice.active.practice,true);
 assert.deepEqual(practice.active.wallet,profile.snapshots[5]);
 practice=choose(practice,missions[4].decision.options.at(-1).id);
 practice=choose(practice,missions[4].event.options.at(-1).id);
 practice=finish(practice);

 for(const field of financialFields)assert.equal(practice[field],campaign[field],`practice changed ${field}`);
 assert.equal(practice.xp,campaign.xp);
 assert.deepEqual(practice.completed,campaign.completed);
 assert.deepEqual(practice.missionMedals,campaign.missionMedals);
 assert.deepEqual(practice.decisions,campaign.decisions);
 assert.equal(practice.history[0].practice,true);
 assert.ok(practice.badges.includes('practice'));
});

test('persistence restores an unfinished second-stage decision and a completed campaign',()=>{
 memoryStorage();
 let profile=newGame('Persistent Player','◆');
 for(let id=1;id<=5;id++)profile=completeMission(profile,id);
 let mission6=atChoice(profile,6);
 mission6=choose(mission6,missions[5].decision.options[1].id);
 assert.equal(mission6.active.step,'event');
 assert.equal(save(mission6),true);
 assert.deepEqual(load(),mission6);

 mission6=choose(load(),missions[5].event.options[1].id);
 profile=finish(mission6);
 for(let id=7;id<=32;id++)profile=completeMission(profile,id);
 assert.equal(save(profile),true);
 const restored=load();
 assert.deepEqual(restored,profile);
 assertValidMoney(restored,'restored campaign');
});
