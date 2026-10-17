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
