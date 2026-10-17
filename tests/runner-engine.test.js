import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {FinancialRunner} from '../src/runner.js';
import {runnerConfig} from '../src/runner-config.js';

function harness(lessonId=21,phase='pre',options={}){
 const listeners=new Map(),noop=()=>{};
 globalThis.matchMedia=()=>({matches:false});
 globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=500;this.naturalHeight=600;}set src(value){this._src=value;}};
 globalThis.window={devicePixelRatio:1,addEventListener:(name,fn)=>listeners.set(`w-${name}`,fn),removeEventListener:noop};
 globalThis.document={addEventListener:(name,fn)=>listeners.set(`d-${name}`,fn),removeEventListener:noop};
 globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=noop;
 const ctx=new Proxy({measureText:text=>({width:String(text).length*5})},{get(target,key){return key in target?target[key]:noop;},set(target,key,value){target[key]=value;return true;}});
 const canvas={style:{},getContext:()=>ctx,addEventListener:(name,fn)=>listeners.set(`c-${name}`,fn)};
 let result=null,updates=[];
 const runner=new FinancialRunner(canvas,runnerConfig(lessonId,phase),{...options,onComplete:value=>{result=value;},onUpdate:value=>updates.push(value)});
 return {runner,listeners,get result(){return result;},updates};
}

test('all six playable students have right-facing runner artwork',()=>{
 for(const id of ['jordan','maya','kai','sofia','eli','ruby'])assert.equal(existsSync(new URL(`../assets/runner/${id}-right.png`,import.meta.url)),true,`${id} needs a directional runner asset`);
});

test('the three updated boys have distinct high-resolution transparent portrait and runner art',()=>{
 const dimensions=url=>{const png=readFileSync(url);return {width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25]};};
 for(const id of ['jordan','kai','eli']){
  const portrait=dimensions(new URL(`../assets/cast/${id}.png`,import.meta.url));
  const runner=dimensions(new URL(`../assets/runner/${id}-right.png`,import.meta.url));
  assert.ok(portrait.width>=800&&portrait.height>=1500,`${id} needs high-resolution portrait art`);
  assert.ok(runner.width>=1300&&runner.height>=1100,`${id} needs high-resolution runner art`);
  assert.equal(portrait.colorType,6,`${id} portrait needs transparency`);
  assert.equal(runner.colorType,6,`${id} runner needs transparency`);
 }
});

test('three financial hazard collisions consume three lives and end the run',()=>{
 const game=harness();game.runner.running=true;game.runner.startedAt=Date.now();
 for(let index=0;index<3;index++){game.runner.invulnerable=0;game.runner.hitObstacle({x:200,y:240,w:50,h:50,done:false});}
 assert.equal(game.runner.lives,0);
 assert.equal(game.result.reason,'lives');
 assert.equal(game.result.completed,true);
});

test('the run ends when the player collects the 100th reward',()=>{
 const game=harness(1,'pre');game.runner.running=true;game.runner.startedAt=Date.now();
 for(let count=0;count<100;count++)game.runner.collect({label:'Paycheck',definition:'Money earned for work.',value:1,kind:'dollar',x:200,y:100,done:false});
 assert.equal(game.result.reason,'goal');
 assert.equal(game.result.collected,100);
 assert.equal(game.runner.config.targetCoins,100);
 assert.ok(game.result.vocabularySeen.includes('time'));
});

test('the selected character art is loaded and the kid-friendly pace accelerates gently',()=>{
 const game=harness(1,'pre').runner;
 assert.match(game.image._src,/assets\/runner\/maya-right\.png\?v=43\.3$/);
 assert.equal(game.player.w,82);
 assert.equal(game.player.h,124);
 assert.equal(game.speed,155);
 game.distance=900;
 game.update(.01,1);
 assert.ok(game.speed<300,'the early run should remain approachable');
 game.collected=80;game.update(.01,2);
 assert.ok(game.speed>300,'collecting rewards should increase the pace');
});

test('Money Boxes add bonus dollars and owned items change play',()=>{
 const game=harness(4,'post',{characterId:'ruby',ownedItems:['boots','magnet','companion']});
 game.runner.running=true;game.runner.startedAt=Date.now();
 game.runner.openMoneyBox({x:240,y:100,done:false});
 assert.equal(game.runner.bonusMoney,5);
 assert.equal(game.runner.player.vy,120);
 game.runner.player.grounded=true;game.runner.jump();
 assert.equal(game.runner.player.vy,-720,'jump boots increase jump height');
 assert.equal(game.runner.companionShield,true);
 game.runner.invulnerable=0;game.runner.hitObstacle({x:200,y:240,w:50,h:50,done:false});
 assert.equal(game.runner.lives,3,'the original companion blocks one collision');
 assert.match(game.runner.image._src,/assets\/runner\/ruby-right\.png\?v=43\.3$/);
});

test('runner events publish lesson vocabulary for the side stream',()=>{
 const game=harness(10,'pre').runner;game.running=true;game.startedAt=Date.now();
 game.collect({...game.config.collectibleSet[0],x:200,y:100,done:false});
 assert.equal(game.vocabEvent.action,'COLLECTED');
 assert.equal(game.vocabEvent.term,game.config.vocabulary[0].term);
 assert.ok(game.vocabEvent.definition.length>20);
 game.rememberVocabulary(game.config.obstacleSet[0],'CLEARED');
 assert.equal(game.vocabEvent.object,game.config.obstacleSet[0].label);
 assert.equal(game.vocabEvent.term,game.config.vocabulary[1].term);
});

test('keyboard and touch-facing controls trigger jump, duck, and pause states',()=>{
 const game=harness(7,'pre');game.runner.running=true;game.runner.startedAt=Date.now();game.runner.endAt=Date.now()+60_000;
 game.runner.jump();assert.equal(game.runner.state,'jumping');assert.ok(game.runner.player.vy<0);
 game.runner.player.grounded=true;game.runner.duck(99);assert.equal(game.runner.player.duck,true);
 game.runner.togglePause();assert.equal(game.runner.paused,true);
 game.runner.togglePause();assert.equal(game.runner.paused,false);
 assert.match(game.runner.config.obstacleSet.map(item=>item.label).join(' '),/APR|Late Fee/);
});

test('lesson power-ups change runner play instead of acting as labels only',()=>{
 const income=harness(1,'post').runner;
 income.activePower={effect:'income',until:Date.now()+5_000};
 income.collect({value:5,kind:'gold',x:200,y:100,done:false});
 assert.equal(income.coins,10,'Income Boost doubles fictional game coins');
 const warning=harness(15,'post').runner;
 warning.activatePower({...warning.config.powerUp,x:200,y:100,done:false});
 assert.equal(warning.activePower.effect,'warning');
 assert.doesNotThrow(()=>warning.drawEntity({...warning.config.obstacleSet[0],type:'obstacle',x:300,y:230,w:55,h:62}));
});

test('a jump clears a debt hazard and collectibles use the exact arcade values',()=>{
 const game=harness(21,'pre').runner;
 game.running=true;game.startedAt=Date.now();game.endAt=Date.now()+60_000;
 game.player.grounded=false;game.player.y=110;game.player.vy=-20;game.state='jumping';
 game.entities=[{...game.config.obstacleSet[1],type:'obstacle',x:game.player.x+12,y:game.ground-58,baseY:game.ground-58,w:48,h:58,seed:0,passed:false,done:false}];
 game.update(.01,1);
 assert.equal(game.lives,3,'jumping player must clear the compounding-debt hazard');
 game.entities[0].x=game.player.x-60;game.update(.01,1.1);
 assert.equal(game.avoided,1);
 game.collect({value:1,kind:'dollar',x:200,y:100,done:false});
 game.collect({value:5,kind:'gold',x:200,y:100,done:false});
 assert.equal(game.coins,6,'dollar is +1 and gold coin is +5');
});
