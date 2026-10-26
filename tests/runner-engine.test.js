import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {FinancialRunner} from '../src/runner.js';
import {WALK_SPEED,RUN_SPEED,GRAVITY} from '../src/moneybread/platform-physics.js';
import {RUNNER_ZOOM} from '../src/moneybread/runner-physics.js';
import {runnerConfig} from '../src/runner-config.js';
import {ROUTE_METRICS,overheadClearance,encounterGap,jumpEnvelope,fallingOnto,encounterBag} from '../src/moneybread/waterfront-route.js';

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

test('jump sheet follows existing normal/boots physics and recovers once',()=>{
 for(const phase of ['pre','post'])for(const boots of [false,true]){
  const r=harness(2,phase,{ownedItems:boots?['boots']:[]}).runner;
  r.start();r.spawnIn=r.rewardIn=r.powerIn=r.boxIn=r.lifeIn=999;
  r.jump();assert(r.player.vy<0);assert.equal(r.physics.w,12);assert.equal(r.physics.h,26);
  assert.equal(r.jumpMotion.flightMs,2*Math.abs(r.physics.vy)/GRAVITY*1000);
  const first=r.jumpMotion;r.jump();assert.equal(r.jumpMotion,first,'no double jump');
  let ticks=0;while(!r.player.grounded&&ticks++<200)r.update(.01,ticks*.01);
  assert(r.player.grounded);assert.equal(r.player.y,r.ground-r.player.h);
  assert(r.jumpMotion.landed);assert.equal(r.state,'landing');
  for(let i=0;i<26;i++)r.update(.01,2+i*.01);
  assert.equal(r.jumpMotion,null);assert.equal(r.state,'running');
  r.jump();assert(r.jumpMotion&&!r.jumpMotion.landed,'next jump starts a fresh one-shot');r.destroy();
 }
});

test('all six playable students have right-facing runner artwork',()=>{
 for(const id of ['jordan','maya','kai','sofia','eli','ruby'])assert.equal(existsSync(new URL(`../assets/runner/${id}-right.png`,import.meta.url)),true,`${id} needs a directional runner asset`);
});

test('the three updated boys have distinct high-resolution transparent portrait and runner art',()=>{
 const dimensions=url=>{const png=readFileSync(url);return {width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25]};};
 for(const id of ['jordan','kai','eli']){
  const portrait=dimensions(new URL(`../assets/cast/${id}.png`,import.meta.url));
  const runner=dimensions(new URL(`../assets/runner/${id}-right.png`,import.meta.url));
  assert.equal(portrait.width,1024,`${id} portrait canvas width`);
  assert.equal(portrait.height,1536,`${id} portrait canvas height`);
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

test('other lessons still end when the player collects the 100th reward',()=>{
 const game=harness(21,'pre');game.runner.running=true;game.runner.startedAt=Date.now();
 for(let count=0;count<100;count++)game.runner.collect({label:'Paycheck',definition:'Money earned for work.',value:1,kind:'dollar',x:200,y:100,done:false});
 assert.equal(game.result.reason,'goal');
 assert.equal(game.result.collected,100);
 assert.equal(game.runner.config.targetCoins,100);
 assert.ok(game.result.vocabularySeen.includes(game.runner.config.vocabulary[0].term));
});

test('the selected character art is loaded and the kid-friendly pace accelerates gently',()=>{
 const game=harness(1,'pre').runner;
 assert.match(game.image._src,/assets\/runner\/maya-right\.png\?v=[\d.]+$/);
 assert.equal(game.player.w,82);
 assert.equal(game.player.h,124);
 assert.equal(game.speed,WALK_SPEED*RUNNER_ZOOM);
 game.distance=900;
 game.update(.1,1);
 assert.ok(game.speed<RUN_SPEED*RUNNER_ZOOM,'the early run should remain approachable');
 game.collected=80;game.update(.1,2);
 assert.ok(game.speed>WALK_SPEED*RUNNER_ZOOM,'collecting rewards should increase the pace');
});

test('Arcade intensity keeps Rookie slow and makes Expert 1.5 times faster',()=>{
 const rookie=harness(1,'pre',{intensityLevel:0}).runner;
 const standard=harness(1,'pre',{intensityLevel:1}).runner;
 const expert=harness(1,'pre',{intensityLevel:1.5}).runner;
 assert.equal(rookie.intensityLevel,0);
 assert.equal(rookie.snapshot().speedStage,0);
 assert.equal(standard.speed,WALK_SPEED*RUNNER_ZOOM);
 assert.equal(expert.speed,WALK_SPEED*RUNNER_ZOOM*1.5);
 rookie.update(.25,0);const rookieSpeed=rookie.speed;
 rookie.collected=100;rookie.distance=5000;rookie.update(.01,1);
 assert.equal(rookie.speed,rookieSpeed,'Rookie pace must stay slow instead of accelerating');
 standard.distance=900;expert.distance=900;
 standard.update(.25,1);expert.update(.25,1);
 assert.equal(expert.speedMultiplier,1.5);assert(Math.abs(expert.speed/standard.speed-1.5)<.001,'Expert retains its multiplier as distance-driven pace advances');
});

test('Money Boxes add bonus dollars and owned items change play',()=>{
 const game=harness(4,'post',{characterId:'ruby',ownedItems:['boots','magnet','companion']});
 game.runner.running=true;game.runner.startedAt=Date.now();
 game.runner.openMoneyBox({x:240,y:100,done:false});
 assert.equal(game.runner.bonusMoney,5);
 assert.equal(game.runner.player.vy,120);
 game.runner.player.grounded=true;game.runner.jump();
 assert(Math.abs(game.runner.player.vy)>Math.sqrt(2*GRAVITY*64)*RUNNER_ZOOM,'jump boots increase jump height');
 assert.equal(game.runner.companionShield,true);
 game.runner.invulnerable=0;game.runner.hitObstacle({x:200,y:240,w:50,h:50,done:false});
 assert.equal(game.runner.lives,3,'the original companion blocks one collision');
 assert.match(game.runner.image._src,/assets\/runner\/ruby-right\.png\?v=[\d.]+$/);
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
 game.player.grounded=false;game.player.y=80;game.player.vy=-20;game.state='jumping';
 game.entities=[{...game.config.obstacleSet[1],type:'obstacle',x:game.player.x+12,y:game.ground-58,baseY:game.ground-58,w:48,h:58,seed:0,passed:false,done:false}];
 game.update(.01,1);
 assert.equal(game.lives,3,'jumping player must clear the compounding-debt hazard');
 game.entities[0].x=game.player.x-60;game.update(.01,1.1);
 assert.equal(game.avoided,1);
 game.collect({value:1,kind:'dollar',x:200,y:100,done:false});
 game.collect({value:5,kind:'gold',x:200,y:100,done:false});
 assert.equal(game.coins,6,'dollar is +1 and gold coin is +5');
});

test('Lesson 1 doubles its goal to 200 and continues until the player banks or loses all lives',()=>{
 const game=harness(1,'pre');game.runner.running=true;game.runner.startedAt=Date.now();
 assert.equal(game.runner.config.targetCoins,200);
 for(let i=0;i<205;i++)game.runner.collect({label:'Paycheck',value:1,kind:'dollar',x:200,y:100,done:false});
 assert.equal(game.result,null);assert.equal(game.runner.goalReached,true);assert.equal(game.runner.collected,205);
 assert.equal(game.runner.paychecks,205);assert.equal(game.runner.paycheckCoins,205);
 game.runner.finish('manual');assert.equal(game.result.collected,205);assert.equal(game.result.paychecks,205);
});
test('collectible hearts add up to two reserve lives and can replenish lost lives',()=>{
 const game=harness(1,'pre').runner;game.running=true;game.startedAt=Date.now();
 game.spawnLife();assert.equal(game.entities.at(-1).type,'life');
 for(let i=0;i<3;i++)game.collectLife({x:200,y:100,done:false});
 assert.equal(game.lives,5);assert.equal(game.extraLivesCollected,2);
 game.invulnerable=0;game.hitObstacle({x:200,y:230,done:false});assert.equal(game.lives,4);
 const heart={x:200,y:100,done:false};game.collectLife(heart);game.collectLife(heart);
 assert.equal(game.lives,5);assert.equal(game.extraLivesCollected,3);
 assert.equal(game.snapshot().lifeCap,5);
});


test('all six runners hold/release duck, pass overhead hazards and reject airborne duck',()=>{
 for(const phase of ['pre','post'])for(const characterId of ['jordan','maya','kai','sofia','eli','ruby']){
  const r=harness(1,phase,{characterId}).runner;r.start();r.spawnIn=r.rewardIn=r.powerIn=r.boxIn=r.lifeIn=999;
  r.keyDown({code:'ArrowDown',preventDefault(){}});assert(r.player.duck);assert.equal(r.state,'ducking');
  r.holdDuck('pointer:1');r.keyUp({code:'ArrowDown'});assert(r.player.duck,'other held input remains active');
  r.releaseDuck('pointer:1');assert(!r.player.duck);assert.equal(r.state,'running');
  r.duck(.02);r.holdDuck('keyboard');r.update(.03,0);assert(r.player.duck,'expired swipe must not cancel held key');
  const box=r.playerBox();assert.equal(box.y+box.h,r.ground);assert(box.y>=r.ground-62,'duck clears bottom of overhead obstacle');
  r.config={...r.config,obstacleSet:[r.config.obstacleSet.find(e=>e.behavior==='overhead')]};r.entities=[];r.spawnObstacle();r.entities[0].x=r.player.x;const actual=r.entities[0];
  const art=JSON.parse(readFileSync('career/duck-cycles.json'))[characterId];assert(r.ground-art.maxDrawHeight>actual.y+actual.h,'full-size duck art must clear the actual bar');
  r.update(.01,0);assert.equal(r.lives,3,'held duck avoids overhead collision');
  r.releaseAllDuck();r.update(.01,0);assert(r.player.duck,'release beneath a bar must retain low hitbox');assert.equal(r.lives,3);r.entities=[];r.update(.01,0);assert(!r.player.duck,'stand automatically once the bar clears');
  r.jump();const vy=r.player.vy,motion=r.jumpMotion;r.holdDuck('keyboard');r.duck();assert(!r.player.duck);assert.equal(r.player.vy,vy);assert.equal(r.jumpMotion,motion);
  r.player.grounded=true;r.holdDuck('keyboard');r.setPaused(true);assert(!r.player.duck);r.setPaused(false);assert(!r.player.duck,'pause clears stale held state');
  r.holdDuck('keyboard');r.destroy();assert(!r.player.duck);
 }
});

test('route boxes have a forgiving real jump window at every intensity and mode',()=>{
 for(const phase of ['pre','post'])for(const intensityLevel of [0,1,1.5]){
  const r=harness(1,phase,{intensityLevel}).runner;
  r.config={...r.config,obstacleSet:[r.config.obstacleSet.find(e=>e.behavior!=='overhead')]};
  r.spawnObstacle();const obstacle=r.entities[0],speed=r.speed;
  // Measure actual trajectories rather than checking the formula against itself.
  let safeStarts=0;
  for(let lead=0;lead<180;lead+=2){
   r.entities=[];r.player.y=r.ground-r.player.h;r.player.grounded=true;r.player.vy=0;
   r.syncPhysicsFromPlayer();r.physics.vx=speed/RUNNER_ZOOM;r.running=true;r.jump();
   let x=r.playerBox().x+r.playerBox().w+lead,hit=false;
   for(let n=0;n<100;n++){
    // Keep route generation out of this isolated maneuver test.
    r.routeGapRemaining=1e9;r.update(1/240,n/240);x-=speed/240;
    const b=r.playerBox();if(b.x<x+obstacle.w&&b.x+b.w>x&&b.y<obstacle.y+obstacle.h&&b.y+b.h>obstacle.y)hit=true;
    if(x+obstacle.w<b.x)break;
   }
   if(!hit)safeStarts++;
  }
  assert(safeStarts>=4,`${phase}/${intensityLevel}: needs multiple successful jump timings, got ${safeStarts}`);r.destroy();
 }
});

test('spaced coin arcs require jumping and are reachable',()=>{
 for(const phase of ['pre','post'])for(const intensityLevel of [0,1,1.5]){
  const make=()=>{const r=harness(1,phase,{intensityLevel}).runner;r.routeBag=[0];r.routeGapRemaining=0;r.updateWaterfrontRoute(0,r.speed);r.routeGapRemaining=1e9;return r;};
  const sample=make();assert(sample.entities.every(e=>e.y+e.h<sample.playerBox().y),'standing must miss every coin');sample.destroy();
  let best=0;
  for(let lead=-60;lead<180;lead+=3){
   const r=make(),speed=r.speed;r.running=true;r.physics.vx=speed/RUNNER_ZOOM;
   const first=r.entities[0].x,offset=first-r.playerBox().x-r.playerBox().w-lead;
   for(const e of r.entities)e.x-=offset;
   r.jump();for(let t=0;t<150;t++){r.routeGapRemaining=1e9;r.update(1/240,t/240);}
   best=Math.max(best,r.collected);r.destroy();
  }
  assert(best>=3,`${phase}/${intensityLevel}: one jump should collect the airborne reward, got ${best}`);
 }
});

test('duck release checks moving overhead hazards and blocks concurrent jump in both modes',()=>{
 for(const phase of ['pre','post'])for(const intensityLevel of [0,1,1.5]){
  const r=harness(1,phase,{intensityLevel}).runner;r.running=true;r.routeGapRemaining=1e9;
  r.holdDuck('keyboard');const feet=r.physics.y+r.physics.h;
  r.jump();assert(r.player.duck&&r.player.grounded);assert.equal(r.jumpMotion,null);
  r.entities=[{type:'obstacle',behavior:'overhead',x:r.playerBox().x-10,y:r.ground-160,w:110,h:66,done:false}];
  r.releaseDuck('keyboard');assert(r.player.duck);assert.equal(r.physics.y+r.physics.h,feet);
  r.jump();assert.equal(r.jumpMotion,null,'blocked standing cannot become a jump');
  r.entities[0].x=-200;r.update(.01,0);assert(!r.player.duck);assert.equal(r.physics.h,26);
  r.jump();assert(!r.player.grounded);assert.equal(r.physics.h,26,'jump keeps standing hitbox');
  r.holdDuck('keyboard');assert(!r.player.duck,'airborne duck rejected');r.destroy();
 }
});

 test('overhead metric clears duck artwork and hitbox but requires standing players to duck',()=>{
 const m=ROUTE_METRICS,gap=overheadClearance();
 assert(gap>=m.duckHeight+m.ceilingBuffer);assert(gap>=m.duckArtHeight+m.ceilingBuffer);assert(gap<m.standingHeight);
 });

test('recovery gaps allow a full flight, landing and one safe second even at maximum speed',()=>{
 for(const intensity of [.68,1,1.5])for(const difficulty of [1,1.08]){
 const speed=RUN_SPEED*RUNNER_ZOOM*intensity*difficulty;
 const safe=encounterGap(speed,()=>0)/speed-48/speed-jumpEnvelope(speed).flight*Math.sqrt(1.35)-.24;
 assert(safe>=1-1e-9);
 }
});
test('jump and duck introductions are isolated before mixed hazards',()=>{
 const r=harness(1).runner;const kinds=[];for(let i=0;i<4;i++){r.spawnObstacle();kinds.push(r.entities.at(-1).behavior==='overhead'?'duck':'jump');}
 assert.deepEqual(kinds.slice(0,2),['jump','duck']);r.destroy();
});
test('stomp requires downward top crossing; side and rising contacts do damage',()=>{
 const obstacle={x:100,y:200,w:50,h:80};
 assert(fallingOnto({x:110,y:140,w:20,h:40},{x:110,y:170,w:20,h:40},obstacle,200));
 assert(!fallingOnto({x:70,y:190,w:20,h:40},{x:110,y:190,w:20,h:40},obstacle,200));
 assert(!fallingOnto({x:110,y:180,w:20,h:40},{x:110,y:160,w:20,h:40},obstacle,-200));
 const r=harness().runner;r.stompObstacle({...obstacle});assert(r.player.vy<0);assert.equal(r.lives,3);assert.equal(r.avoided,1);r.destroy();
});
test('all 32 Arcade and Bonus routes complete at all three intensities without unavoidable encounters',()=>{
 for(let lesson=1;lesson<=32;lesson++)for(const phase of ['pre','post'])for(const intensityLevel of [0,1,1.5]){
 const r=harness(lesson,phase,{intensityLevel}).runner;r.running=true;r.startedAt=Date.now();
 let ticks=0;
 while(!r.completed&&r.collected<r.config.targetCoins&&ticks<90000){
 const b=r.playerBox(),next=r.entities.filter(e=>!e.done&&['obstacle','moneybox','collectible'].includes(e.type)&&e.x+e.w>b.x).sort((a,b)=>a.x-b.x)[0];
 const duck=next?.behavior==='overhead'&&next.x<b.x+310;
 if(duck)r.holdDuck('bot');else r.releaseDuck('bot');
 if(next&&!duck&&next.x<b.x+b.w+(next.type==='collectible'?-20:r.speed*(next.type==='moneybox'?.035:.11))&&r.player.grounded)r.jump();
 r.update(.02,ticks*.02);ticks++;
 }
 assert(r.collected>=r.config.targetCoins&&r.lives>0,`Lesson ${lesson}/${phase}/${intensityLevel}: ${r.collected} coins, ${r.lives} lives at ${ticks*.02}s`);r.destroy();
 }
});

test('slow frames cannot skip through a ground hazard at Expert speed',()=>{
 const r=harness(1,'pre',{intensityLevel:1.5}).runner;r.running=true;r.routeGapRemaining=1e9;r.physics.vx=RUN_SPEED*1.5;
 r.entities=[{type:'obstacle',behavior:'ground',x:220,y:r.ground-88,baseY:r.ground-88,w:20,h:88,done:false,passed:false}];
 r.update(.25,1);assert.equal(r.lives,2);assert(r.entities.every(e=>e.done||e.type!=='obstacle'));r.destroy();
});

test('readable action cues distinguish clear running, jumps, and ducks',()=>{
 const r=harness(1).runner;assert.match(r.snapshot().actionCue,/CLEAR PATH/);
 r.entities=[{type:'obstacle',behavior:'overhead',x:500,w:110,done:false}];assert.match(r.snapshot().actionCue,/DUCK/);
 r.entities[0].behavior='ground';assert.match(r.snapshot().actionCue,/JUMP/);r.destroy();
});

test('slide crushes ground boxes without losing life and never activates in the air',()=>{
 for(const phase of ['pre','post'])for(const characterId of ['jordan','maya','kai','sofia','eli','ruby']){
 const r=harness(1,phase,{characterId}).runner;r.running=true;r.routeGapRemaining=1e9;
 r.keyDown({code:'KeyS',preventDefault(){}});assert(r.slideRemaining>0&&r.player.duck);assert.equal(r.duckAnimation.variant,2);
 const b=r.playerBox();r.entities=[{type:'obstacle',behavior:'ground',x:b.x,y:r.ground-88,baseY:r.ground-88,w:32,h:88,done:false,passed:false}];
 r.update(.01,0);assert.equal(r.lives,3);assert.equal(r.avoided,1);assert.equal(r.entities.length,0);
 r.update(.25,0);r.update(.25,0);assert(!r.player.duck);r.jump();r.slide();assert.equal(r.slideRemaining,0);r.destroy();
 }
});

test('encounter bags retain balance without a fixed repeating order',()=>{
 assert.deepEqual([...encounterBag(()=>.3)].sort(),[0,1,2,3]);
 assert.notDeepEqual(encounterBag(()=>0),encounterBag(()=>.99));
});
