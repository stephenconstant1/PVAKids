import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runCycles,jumpCycles,runFrame,jumpFrame,runMotion} from '../src/moneybread/run-cycle.js';

test('all six measured atlases include 16 ordered poses and verified originals',()=>{
 assert.deepEqual(Object.keys(runCycles).sort(),['eli','jordan','kai','maya','ruby','sofia']);
 for(const [id,c] of Object.entries(runCycles)){
  assert.equal(c.frameCount,16);assert.equal(c.columns,8);
  assert.deepEqual(c.frames.map(f=>f.index),Array.from({length:16},(_,i)=>i));
  const png=readFileSync(c.image);
  assert.equal(png.readUInt32BE(16),c.cellWidth*8);
  assert.equal(png.readUInt32BE(20),c.cellHeight*2);
  assert.equal(png[25],6,'transparent RGBA atlas required');
  const source=JSON.parse(readFileSync('career/run-cycles.json'))[id];
  assert.equal(createHash('sha256').update(readFileSync(source.source)).digest('hex'),source.sourceSha256);
  for(const f of c.frames){
   assert.equal(f.anchorX,c.anchorX);assert(f.groundY>=c.groundY);
   const [x,y,w,h]=f.contentRect;
   assert(x>=0&&y>=0&&x+w<=c.cellWidth&&y+h<=c.cellHeight);
   assert.equal(y+h,c.groundY,'all poses share the measured foot baseline');
   const [sx,sy,sw,sh]=f.sourceRect;
   assert(sx>=0&&sy>=0&&sx+sw<=source.sourceSize[0]&&sy+sh<=source.sourceSize[1]);
  }
  const seen=new Set();for(let ms=0;ms<runMotion.durationMs;ms+=2)seen.add(runFrame(c,ms));assert.equal(seen.size,16);assert.equal(runFrame(c,runMotion.durationMs),0);
  assert.equal(runFrame(c,100000,true),0);
 }
});

test('jump sheets preserve all six identities and one-shot phase order',()=>{
 assert.deepEqual(Object.keys(jumpCycles).sort(),Object.keys(runCycles).sort());
 const sources=JSON.parse(readFileSync('career/jump-cycles.json'));
 for(const [id,c] of Object.entries(jumpCycles)){
  assert.equal(c.name,runCycles[id].name);assert.equal(c.frames.length,16);
  const source=sources[id];
  assert.equal(createHash('sha256').update(readFileSync(source.source)).digest('hex'),source.sourceSha256);
  const png=readFileSync(c.image);assert.equal(png.readUInt32BE(16),c.cellWidth*8);assert.equal(png.readUInt32BE(20),c.cellHeight*2);
  for(const f of c.frames){const [x,y,w,h]=f.contentRect;assert(x>=0&&x+w<=c.cellWidth&&y>=0);assert.equal(y+h,c.groundY);}
 }
 const motion={elapsedMs:0,flightMs:900,landed:false,landingMs:0};
 const observed=[];
 for(let i=0;i<10;i++){motion.elapsedMs=(i+.05)*90;observed.push(jumpFrame(motion));}
 motion.landed=true;
 for(let i=0;i<6;i++){motion.landingMs=(i+.05)*40;observed.push(jumpFrame(motion));}
 assert.deepEqual(observed,Array.from({length:16},(_,i)=>i));
 motion.landingMs=100000;assert.equal(jumpFrame(motion),15,'one-shot must never wrap');
 assert.equal(jumpFrame(motion,true),15);motion.landed=false;assert.equal(jumpFrame(motion,true),5);
});


test('running uses the measured FBX cadence and a stable body height instead of snapping airborne feet down',()=>{
 for(const [id,c] of Object.entries(runCycles)){
  assert.equal(c.fps,16*1000/runMotion.durationMs);
  const tops=c.frames.map(f=>(f.contentRect[1]-f.groundY)*124/c.designHeight);
  assert(Math.max(...tops)-Math.min(...tops)<8,`${id} body must not jump between poses`);
  assert(c.frames.every(f=>f.groundY===c.groundY),'updated sheets keep a consistent ground contact line');
 }
});

test('FBX reference is reproducible and has a continuous hand-and-foot phase',()=>{
 assert.equal(createHash('sha256').update(readFileSync(runMotion.source)).digest('hex'),runMotion.sourceSha256);
 assert.equal(runMotion.samples.length,20);assert.equal(runMotion.fps,30);
 assert(Math.abs(runMotion.durationMs-633.3333333)<.001);
 assert.equal(runMotion.phase[0],0);assert.equal(runMotion.phase.at(-1),1);
 assert(runMotion.phase.every((p,i)=>i===0||p>runMotion.phase[i-1]));
});

test('running phase is delta-independent at phone and desktop refresh rates',()=>{
 for(const c of Object.values(runCycles))for(const fps of [30,60,120,144]){
 let time=0;for(let i=0;i<fps*10;i++)time+=1000/fps;
 assert.equal(runFrame(c,time),runFrame(c,10000));
 assert.equal(runFrame(c,time,true),0);
 }
});
