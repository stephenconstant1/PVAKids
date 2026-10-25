import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ArrayTileMap,createBody,stepBody,launchJump,setCrouched,overlapsSolid,overlappedTiles,TILE,WALK_SPEED,RUN_SPEED} from '../src/moneybread/platform-physics.js';
const floor=()=>new ArrayTileMap(Array.from({length:13},(_,y)=>Array(80).fill(y===12?1:0)));
test('16px tiles, 12×26 stable body, row-first indexing and exact edge bounds',()=>{
 const b=createBody(3.25,8.75);assert.equal(TILE,16);assert.deepEqual([b.w,b.h],[12,26]);
 assert.deepEqual(overlappedTiles({x:16,y:32,w:16,h:16}),{left:1,right:1,top:2,bottom:2});
 const map=new ArrayTileMap([[0,0,0],[0,0,1]]);assert(map.solid(2,1));assert(!map.solid(1,2));assert(!map.solid(-1,1));
});
test('walk/run speeds and jump benchmarks remain consistent at 30/60/120/144 FPS',()=>{
 for(const fps of [30,60,120,144])for(const speed of [WALK_SPEED,RUN_SPEED]){
  const map=floor(),b=createBody(40,12*16-26);b.grounded=true;
  for(let i=0;i<fps;i++)stepBody(b,map,speed,1/fps);
  assert(Math.abs(b.vx-speed)<1e-8);assert(Math.abs(b.vx/60-(speed===WALK_SPEED?1.56:2.56))<1e-8);
  const x=b.x,y=b.y;assert(launchJump(b));let min=y,ticks=0,previous={x:b.x,y:b.y};let landingX=b.x;
  while(!b.grounded&&ticks++<fps*2){previous={x:b.x,y:b.y};stepBody(b,map,speed,1/fps);min=Math.min(min,b.y);landingX=b.x;}
  assert(b.grounded);assert.equal(b.y,12*16-26);assert(!overlapsSolid(b,map));
  const height=y-min,target=speed===WALK_SPEED?64:80;assert(Math.abs(height-target)<.8,`${fps} FPS height ${height}`);
  if(speed===RUN_SPEED){assert(landingX-x>=48&&landingX-x<=64,`${fps} FPS running distance ${landingX-x}`);}
 }
});
test('walls, ceilings, corners, negative coordinates and fast motion never tunnel',()=>{
 const level=Array.from({length:9},(_,y)=>Array.from({length:12},(_,x)=>y===8||x===7?1:0));
 for(const fps of [15,30,60,120]){
  const map=new ArrayTileMap(level),b=createBody(60,8*16-26);b.grounded=true;
  for(let i=0;i<fps;i++)stepBody(b,map,RUN_SPEED,1/fps);
  assert.equal(b.x,7*16-12);assert.equal(b.vx,0);assert(b.right);assert(!overlapsSolid(b,map));
  b.vx=5000;stepBody(b,map,5000,.1);assert.equal(b.x,7*16-12);assert(!overlapsSolid(b,map));
 }
 const ceiling=new ArrayTileMap([[0,1,1,1],[0,0,0,0],[0,0,0,0],[1,1,1,1]]);
 const b=createBody(18,48-26);b.grounded=true;launchJump(b);stepBody(b,ceiling,0,.03);assert(b.ceiling);assert(b.y>=16);assert(b.vy>=0);
 assert.deepEqual(overlappedTiles({x:-12,y:-16,w:12,h:16}),{left:-1,right:-1,top:-1,bottom:-1});
 const leftLevel=Array.from({length:9},(_,y)=>Array.from({length:12},(_,x)=>y===8||x===3?1:0));
 const leftMap=new ArrayTileMap(leftLevel),left=createBody(90,8*16-26);left.grounded=true;
 for(let i=0;i<60;i++)stepBody(left,leftMap,-RUN_SPEED,1/60);
 assert.equal(left.x,64);assert(left.left);assert.equal(left.vx,0);assert(!overlapsSolid(left,leftMap));
});
test('duck preserves feet and center and cannot stand into a low solid ceiling',()=>{
 const map=new ArrayTileMap([[0,0,0],[0,1,0],[0,0,0],[1,1,1]]),b=createBody(18,48-26);b.grounded=true;
 setCrouched(b,map,true);assert.equal(b.y+b.h,48);assert.equal(b.w,12);assert.equal(b.h,14);
 assert.equal(setCrouched(b,map,false),false);assert.equal(b.h,14);
 b.x=34;assert(setCrouched(b,map,false));assert.equal(b.h,26);assert.equal(b.y+b.h,48);
});
test('collision lookup cost depends on the overlapping tiles, not level area',()=>{
 const array=floor();let checked=0;const map={solid(x,y){checked++;return array.solid(x,y);}};
 const b=createBody(40,166);b.grounded=true;stepBody(b,map,WALK_SPEED,1/60);
 assert(checked<100);assert.equal(checked,b.tilesChecked);
});
