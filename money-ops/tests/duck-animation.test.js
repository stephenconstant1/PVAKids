import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDuck,duckFrame,duckVariations} from '../src/moneybread/duck-animation.js';
import {duckCycles} from '../src/moneybread/run-cycle.js';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('six independently selectable duck variations randomize once with no consecutive repeats',()=>{
 assert.equal(duckVariations.length,6);
 assert.deepEqual(Array.from({length:6},(_,i)=>createDuck(-1,()=>i/6).variant),[0,1,2,3,4,5]);
 for(let previous=0;previous<6;previous++)for(let i=0;i<5;i++)assert.notEqual(createDuck(previous,()=>i/5).variant,previous);
 for(let variant=0;variant<6;variant++){
  const m=createDuck(-1,()=>variant/6);assert.equal(duckFrame(m),variant);
  m.elapsedMs=1000;assert.equal(duckFrame(m),6+variant);
  m.releasing=true;assert.equal(duckFrame(m),12+variant);
  assert.equal(duckFrame({...m,releasing:false,elapsedMs:0},true),6+variant);
 }
});
test('all six characters have separate 18-pose duck atlases fitting existing overhead clearance',()=>{
 assert.equal(Object.keys(duckCycles).length,6);
 const metadata=JSON.parse(readFileSync('career/duck-cycles.json'));
 for(const [id,c] of Object.entries(duckCycles)){
  assert.equal(c.columns,6);assert.equal(c.frameCount,18);
  const png=readFileSync(c.image);assert.equal(png.readUInt32BE(16),c.cellWidth*6);assert.equal(png.readUInt32BE(20),c.cellHeight*3);
  assert.equal(createHash('sha256').update(readFileSync(metadata[id].source)).digest('hex'),metadata[id].sourceSha256);
  for(const f of c.frames){const [x,y,w,h]=f.contentRect;assert.equal(y+h,c.groundY);assert(h*124/c.designHeight<=58.01);assert(x>=0&&x+w<=c.cellWidth);}
 }
});
