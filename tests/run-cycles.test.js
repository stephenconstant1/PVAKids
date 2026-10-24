import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runCycles,jumpCycles,runFrame,jumpFrame} from '../src/moneybread/run-cycle.js';

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
   assert.equal(f.anchorX,c.anchorX);assert.equal(f.groundY,c.groundY);
   const [x,y,w,h]=f.contentRect;
   assert(x>=0&&y>=0&&x+w<=c.cellWidth&&y+h<=c.cellHeight);
   assert.equal(y+h,c.groundY,'all poses share the measured foot baseline');
   const [sx,sy,sw,sh]=f.sourceRect;
   assert(sx>=0&&sy>=0&&sx+sw<=source.sourceSize[0]&&sy+sh<=source.sourceSize[1]);
  }
  for(let i=0;i<32;i++)assert.equal(runFrame(c,(i+.05)*1000/c.fps),i%16);
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
