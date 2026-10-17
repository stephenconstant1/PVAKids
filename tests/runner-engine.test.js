import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FinancialRunner} from '../src/runner.js';
import {runnerConfig} from '../src/runner-config.js';

function harness(lessonId=21,phase='pre'){
 const listeners=new Map(),noop=()=>{};
 globalThis.matchMedia=()=>({matches:false});
 globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=400;}set src(value){this._src=value;}};
 globalThis.window={devicePixelRatio:1,addEventListener:(name,fn)=>listeners.set(`w-${name}`,fn),removeEventListener:noop};
 globalThis.document={addEventListener:(name,fn)=>listeners.set(`d-${name}`,fn),removeEventListener:noop};
 globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=noop;
 const ctx=new Proxy({measureText:text=>({width:String(text).length*5})},{get(target,key){return key in target?target[key]:noop;},set(target,key,value){target[key]=value;return true;}});
 const canvas={style:{},getContext:()=>ctx,addEventListener:(name,fn)=>listeners.set(`c-${name}`,fn)};
 let result=null,updates=[];
 const runner=new FinancialRunner(canvas,runnerConfig(lessonId,phase),{onComplete:value=>{result=value;},onUpdate:value=>updates.push(value)});
 return {runner,listeners,get result(){return result;},updates};
}

test('three financial hazard collisions consume three lives and end the run',()=>{
 const game=harness();game.runner.running=true;game.runner.startedAt=Date.now();
 for(let index=0;index<3;index++){game.runner.invulnerable=0;game.runner.hitObstacle({x:200,y:240,w:50,h:50,done:false});}
 assert.equal(game.runner.lives,0);
 assert.equal(game.result.reason,'lives');
 assert.equal(game.result.completed,true);
});

test('the strict 60-second maximum expires even when a run is paused',()=>{
 const game=harness(1,'pre');game.runner.paused=true;game.runner.start(Date.now()-61_000);
 assert.equal(game.result.reason,'timer');
 assert.ok(game.result.survivalSeconds<=60);
 const bonus=harness(1,'post');
 assert.equal(bonus.runner.config.durationSeconds,180);
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
