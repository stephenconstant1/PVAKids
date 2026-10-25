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
  m.elapsedMs=1000;assert.equal(duckFrame(m),variant);
  m.releasing=true;assert.equal(duckFrame(m),variant);
  assert.equal(duckFrame({...m,releasing:false,elapsedMs:0},true),variant);
 }
});
test('all six characters have separate 6-pose duck atlases fitting existing overhead clearance',()=>{
 assert.equal(Object.keys(duckCycles).length,6);
 const metadata=JSON.parse(readFileSync('career/duck-cycles.json'));
 for(const [id,c] of Object.entries(duckCycles)){
  assert.equal(c.columns,3);assert.equal(c.frameCount,6);
  const ref=metadata[id].headReference;assert(Math.abs(ref.runPixels-ref.duckPixels)<.01,'duck head must match running head without shrink-to-fit');
  const png=readFileSync(c.image);assert.equal(png.readUInt32BE(16),c.cellWidth*3);assert.equal(png.readUInt32BE(20),c.cellHeight*2);
  assert.equal(createHash('sha256').update(readFileSync(metadata[id].source)).digest('hex'),metadata[id].sourceSha256);
  for(const f of c.frames){const [x,y,w,h]=f.contentRect;assert.equal(y+h,c.groundY);assert(h*124/c.designHeight<90);assert(x>=0&&x+w<=c.cellWidth);}
 }
});
