import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {cityStops} from '../src/city.js';
import {missions} from '../src/content.js';
import {destinations,destination,missingDestinations} from '../src/moneybread/destinations.js';
import {stridePose,strideJoints,runnerRigs} from '../src/moneybread/runner-stride.js';

test('all 32 destination mappings preserve the existing stop names and source lessons',()=>{
 assert.equal(destinations.length,32);assert.deepEqual(missingDestinations,[]);
 for(let id=1;id<=32;id++){
  const d=destination(id);assert.equal(d.lessonId,id);assert.equal(d.title,missions[id-1].title);
  assert.equal(d.name,cityStops[id-1].name);assert.equal(d.sourceLocation,missions[id-1].location||missions[id-1].sector);
  assert(d.x>=0&&d.x<=100&&d.y>=0&&d.y<=100);
 }
 assert.equal(destination(1).title,'Earning & Creating Value');assert.equal(destination(1).name,'Value Village');
 assert.equal(destination(33),undefined);
});
test('both legs exchange the forward position, with opposite arm swings, for every crew member',()=>{
 const a=Math.PI/2*120,b=Math.PI*1.5*120;
 assert(stridePose(a).leftLeg>0&&stridePose(a).rightLeg<0);
 assert(stridePose(a).leftArm<0&&stridePose(a).rightArm>0);
 for(const id of Object.keys(runnerRigs)){
  const first=strideJoints(id,150,124,a),second=strideJoints(id,150,124,b);
  assert(first.leftLeg.end[0]<first.rightLeg.end[0],`${id}: left leg should trail in first half`);
  assert(second.leftLeg.end[0]>second.rightLeg.end[0],`${id}: left leg must move ahead in second half`);
  assert(first.leftArm.upper<first.rightArm.upper&&second.leftArm.upper>second.rightArm.upper,`${id}: arm swing must reverse`);
  assert.notEqual(first.leftLeg.lower-first.leftLeg.upper,second.leftLeg.lower-second.leftLeg.upper,`${id}: knees must articulate`);
 }
});
test('animation rigs use all six original images without changing their faces or source artwork',()=>{
 assert.deepEqual(Object.keys(runnerRigs).sort(),['eli','jordan','kai','maya','ruby','sofia']);
 for(const rig of Object.values(runnerRigs)){
  assert.equal(createHash('sha256').update(readFileSync(rig.source)).digest('hex'),rig.sourceSha256);
  for(const chain of Object.values(rig.bones)){assert.equal(chain.length,3);for(const [x,y] of chain)assert(x>=0&&x<=1&&y>=0&&y<=1);}
 }
});
