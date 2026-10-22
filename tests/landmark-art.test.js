import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {landmarkArt,landmarkArtwork,constructionStages} from '../src/moneybread/landmark-art.js';
import {cityLandmarks,cityBuilderMarkup,cityBuildCelebrationMarkup,buildCity,depositCityCoins,cityTotals} from '../src/city.js';
import {newGame} from '../src/engine.js';
const button=(text,action,cls='',extra='')=>`<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
const escape=String;
test('every existing landmark, including the last card, has its own source-art tile',()=>{
 assert.deepEqual(landmarkArt.map(a=>a.id),cityLandmarks.map(a=>a.id));
 assert.equal(new Set(landmarkArt.map(a=>a.tile)).size,8);
 assert(landmarkArt.every(a=>Number.isInteger(a.tile)&&a.tile>=0&&a.tile<8));
 const bytes=readFileSync('assets/crew/moneybread-landmarks.png');assert.equal(bytes.subarray(1,4).toString(),'PNG');
 const profile=newGame('Art review','maya'),markup=cityBuilderMarkup(profile,button,escape);
 assert.equal((markup.match(/class="city-landmark-art"/g)||[]).length,8);
 assert.doesNotMatch(markup,/EMPTY LOT/);
 for(const landmark of cityLandmarks){assert(markup.includes(`data-landmark="${landmark.id}"`));assert(markup.includes(landmark.name));}
});
test('each purchase progresses the matching artwork, costs 100 coins, and shows it in the celebration',()=>{
 let profile=depositCityCoins({...newGame('Art review','maya'),completed:Array.from({length:32},(_,i)=>i+1)},3200);
 for(const landmark of cityLandmarks){
  const stages=new Set();
  for(let stage=0;stage<=4;stage++){
   const art=landmarkArtwork(landmark.id,landmark.name,stage);stages.add(art);
   assert(art.includes(`data-construction-stage="${stage}"`));assert(art.includes(constructionStages[stage]));
   if(stage<4){const before=cityTotals(profile).city.bank;profile=buildCity(profile,landmark.id);assert.equal(cityTotals(profile).city.bank,before-100);
    const modal=cityBuildCelebrationMarkup(profile,button,escape);assert(modal.includes(`data-landmark="${landmark.id}"`));assert(modal.includes(`data-construction-stage="${stage+1}"`));}
  }
  assert.equal(stages.size,5);assert.equal(cityTotals(profile).city.upgrades[landmark.id],4);
 }
 assert.equal(cityTotals(profile).built,32);assert.equal(cityTotals(profile).city.bank,0);
});
