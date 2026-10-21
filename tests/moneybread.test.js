import {test} from 'node:test';
import assert from 'node:assert/strict';
import {missions} from '../src/content.js';
import {newGame,begin} from '../src/engine.js';
import {load,save} from '../src/persistence.js';
import {attachCity,applyCity,currentLevel,noteLesson,canOpen,validCity,freshCity} from '../src/moneybread/simulation.js';
import {lessons,missingLessons} from '../src/moneybread/lessons.js';

test('all 32 editable city lessons preserve the original order, titles, ideas and vocabulary',()=>{
 assert.equal(lessons.length,32);assert.deepEqual(missingLessons,[]);
 lessons.forEach((l,i)=>{assert.equal(l.id,i+1);assert.equal(l.title,missions[i].title);assert.equal(l.coreIdea,missions[i].coreIdea);assert.deepEqual(l.terms,missions[i].terms);assert.deepEqual(l.decision,missions[i].decision||null);});
});
test('work, city spending and investment settlement balance over all 32 weeks without reward farming',()=>{
 let p=attachCity(newGame('Builder','maya'));
 for(const l of lessons){
  assert.equal(currentLevel(p.moneybread),l.id);assert.equal(canOpen(p.moneybread,l.id+1),false);
  assert.throws(()=>applyCity(p.moneybread,{type:'work',job:'service'},p.completed),/activity/);
  p=noteLesson({...p,completed:[...p.completed,l.id]},l.id);
  p.moneybread=applyCity(p.moneybread,{type:'work',job:'creator'},p.completed);
  assert.throws(()=>applyCity(p.moneybread,{type:'work',job:'creator'},p.completed),/already paid/);
  p.moneybread=applyCity(p.moneybread,{type:'allocate',plan:l.id<5?'save':l.id%2?'mix':'focus'},p.completed);
  p.moneybread=applyCity(p.moneybread,{type:'build',district:l.district},p.completed);
  assert.throws(()=>applyCity(p.moneybread,{type:'reflect',term:'made up term',text:'I funded our community.'},p.completed),/lesson/);
  const text=`I practiced ${l.terms[0]} and kept bread for our city services.`;
  p.moneybread=applyCity(p.moneybread,{type:'reflect',term:l.terms[0],text},p.completed);
  assert.equal(validCity(p.moneybread),true);assert.equal(currentLevel(p.moneybread),l.id+1);
  const w=p.moneybread.wallet;assert.equal(w.available+w.saved+w.invested+w.spent,w.income+w.investmentResult);
 }
 assert.equal(currentLevel(p.moneybread),33);assert.equal(Object.keys(p.moneybread.weeks).length,32);
 assert.throws(()=>applyCity(p.moneybread,{type:'work',job:'service'},p.completed),/complete/);
});
test('reflection gates the next original activity; invalid city transactions do not mutate state',()=>{
 let p=attachCity(newGame());p=noteLesson({...p,completed:[1]},1);
 assert.throws(()=>begin(p,2),/reflection/);
 const previous=structuredClone(p.moneybread);
 assert.throws(()=>applyCity(p.moneybread,{type:'build',district:'park'},p.completed),/plan/);
 assert.deepEqual(p.moneybread,previous);
});
test('legacy progress is migrated without erasing lessons or issuing backdated bread',()=>{
 const p=attachCity({...newGame(),completed:[1,2,3]});assert.equal(currentLevel(p.moneybread),4);
 assert.equal(p.moneybread.wallet.income,0);assert.deepEqual(p.completed,[1,2,3]);
 const arcade={...newGame(),mode:'arcade'};assert.equal(attachCity(arcade),arcade);
});
test('saving a partly completed city week can resume without repeating work',()=>{
 let stored;globalThis.localStorage={setItem:(k,v)=>{stored=v;},getItem:()=>stored};
 let p=attachCity(newGame());p.moneybread.weeks[1]={lessonDone:true,earned:0,principal:0,projectCost:0,settled:false};
 // The original financial snapshots are required by the existing save validator.
 p.completed=[1];p.snapshots[1]={...p};delete p.snapshots[1].snapshots;
 p.moneybread=applyCity(p.moneybread,{type:'work',job:'service'},p.completed);
 assert.equal(save(p),true);const resumed=load();assert.ok(resumed);assert.deepEqual(resumed.moneybread,p.moneybread);
 assert.throws(()=>applyCity(resumed.moneybread,{type:'work',job:'service'},resumed.completed),/already paid/);
});
test('investment losses, service shortfalls and rebuilding have visible bounded consequences',()=>{
 let s=freshCity([1,2,3,4,5]);s.weeks[6]={lessonDone:true,earned:0,principal:0,projectCost:0,settled:false};
 s=applyCity(s,{type:'work',job:'service'},[1,2,3,4,5,6]);s=applyCity(s,{type:'allocate',plan:'focus'},[1,2,3,4,5,6]);
 s=applyCity(s,{type:'build',district:'school'},[1,2,3,4,5,6]);const before=s.condition;
 s=applyCity(s,{type:'reflect',term:lessons[5].terms[0],text:'I chose saving before spending to protect the city.'},[1,2,3,4,5,6]);
 assert.equal(s.wallet.investmentResult,-8);assert.equal(s.condition,before-12);assert.match(s.notice,/services slowed/);
 const reset=applyCity(s,{type:'reset'},[1,2,3,4,5,6]);assert.deepEqual(reset.wallet,s.wallet);assert.deepEqual(reset.weeks,s.weeks);assert.equal(currentLevel(reset),7);
 const bad=structuredClone(s);bad.wallet.available=-1;assert.equal(validCity(bad),false);
 bad.wallet.available=0;bad.wallet.income+=1;assert.equal(validCity(bad),false);
});
