import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RunnerArtwork} from '../src/runner-art.js';

test('missing or failed uploads retain fallback without requesting missing URLs',()=>{
 let requests=0;class FakeImage{set src(value){requests++;this.complete=true;this.naturalWidth=0;this.naturalHeight=0;}}
 const art=new RunnerArtwork({home:'assets/runner/learning/CMI_need-housing-home.png'},FakeImage);
 assert.equal(art.draw({},'toy',0,0,50),false);assert.equal(requests,0);
 assert.equal(art.draw({},'home',0,0,50),false);assert.equal(art.draw({},'home',0,0,50),false);assert.equal(requests,1);
});
test('uploaded objects preserve aspect ratio and use cached decoded images',()=>{
 let requests=0;class FakeImage{constructor(){this.complete=true;this.naturalWidth=200;this.naturalHeight=100;}set src(value){requests++;}}
 const art=new RunnerArtwork({toy:'assets/runner/learning/CMI_want-toy-teddy-bear.png'},FakeImage),calls=[],c={drawImage:(...args)=>calls.push(args)};
 assert(art.draw(c,'toy',10,20,60));assert.deepEqual(calls[0].slice(1),[10,35,60,30]);art.draw(c,'toy',0,0,64);assert.equal(requests,1);
});
test('platform artwork aligns with the existing landing surface without changing physics',()=>{
 class FakeImage{constructor(){this.complete=true;this.naturalWidth=1000;this.naturalHeight=300;}set src(value){}}
 const art=new RunnerArtwork({platform:'assets/runner/learning/CMI_sky-goal-floating-platform.png'},FakeImage),calls=[];
 assert(art.platform({drawImage:(...args)=>calls.push(args)},40,100,250));const [,x,y,w,h]=calls[0];assert.equal(x,40);assert.equal(w,250);assert.equal(y+h*.39,100);
});

import {UploadedActionArt} from '../src/uploaded-action-art.js';
import {uploadedActionCycles} from '../src/uploaded-action-cycles.js';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('supplied action sheets have eight non-overlapping measured cells and unchanged source bytes',()=>{
 assert.equal(Object.keys(uploadedActionCycles).length,5);
 for(const kinds of Object.values(uploadedActionCycles))for(const meta of Object.values(kinds)){
  const png=readFileSync(meta.image);assert.equal(createHash('sha256').update(png).digest('hex'),meta.sha256);assert.equal(png.readUInt32BE(16),meta.width);assert.equal(png.readUInt32BE(20),meta.height);assert.equal(meta.frames.length,8);
  for(let i=0;i<8;i++){const [x,y,w,h]=meta.frames[i].rect;assert(x>=0&&y>=0&&x+w<=meta.width&&y+h<=meta.height);assert(w>0&&h>0);if(i%4)assert.equal(meta.frames[i-1].rect[0]+meta.frames[i-1].rect[2],x);}
 }
});
test('action playback uses ordered source frames, mirrors without extra rotation, and rests under reduced motion',()=>{
 const previous=globalThis.Image;globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=1774;}set src(value){}};
 try{const art=new UploadedActionArt('jordan','flip'),calls=[],c={save(){},restore(){},scale:(...a)=>calls.push(['scale',...a]),drawImage:(...a)=>calls.push(['image',...a.slice(1)])};
 for(const progress of [0,.5,.99])assert(art.draw(c,124,progress,-1,false));assert(art.draw(c,124,.2,1,true));
 assert.deepEqual(calls.filter(a=>a[0]==='image').map(a=>a.slice(1,5)),[0,4,7,7].map(i=>art.meta.frames[i].rect));assert.deepEqual(calls.filter(a=>a[0]==='scale').map(a=>a[1]),[-1,-1,-1,1]);
 }finally{globalThis.Image=previous;}
});
test('a character without a supplied sheet keeps its existing action fallback',()=>{
 const art=new UploadedActionArt('sofia','flip');assert.equal(art.ready,false);assert.equal(art.draw({},124,.5),false);
});
