import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,netWorth} from '../src/engine.js';
import {buildCity,cityLandmarks,cityStops,cityTotals,depositCityCoins} from '../src/city.js';
import {recordRunnerResult} from '../src/runner-state.js';

test('Grand Financial City has 32 destinations and eight four-stage landmarks',()=>{
 assert.equal(cityStops.length,32);
 assert.equal(new Set(cityStops.map(stop=>stop.name)).size,32);
 assert.equal(cityLandmarks.length,8);
 assert.equal(cityTotals(newGame()).built,0);
 assert.equal(cityTotals(newGame()).remaining,32);
});

test('every collected runner coin enters the City Bank without changing net worth',()=>{
 const start=newGame('Builder','maya'),worth=netWorth(start);
 const result=recordRunnerResult(start,1,'pre',{collected:100,coins:5,xp:10});
 assert.equal(result.city.bank,100);
 assert.equal(result.city.lifetimeCoins,100);
 assert.equal(netWorth(result),worth);
});

test('a 100-coin Arcade run immediately funds one town-building stage',()=>{
 let profile={...newGame('Arcade Builder','kai'),mode:'arcade'};
 profile=recordRunnerResult(profile,1,'pre',{collected:100,coins:20,score:500});
 assert.equal(cityTotals(profile).city.bank,100);
 profile=buildCity(profile,'town-center');
 assert.equal(cityTotals(profile).city.upgrades['town-center'],1);
 assert.equal(cityTotals(profile).city.bank,0);
});

test('career construction costs 100 coins and requires one completed lesson per stage',()=>{
 let profile=depositCityCoins(newGame('Builder','jordan'),400);
 profile=buildCity(profile,'town-center');
 assert.equal(cityTotals(profile).built,0);
 assert.match(profile.city.notice,/complete another lesson/i);
 profile={...profile,completed:[1]};
 profile=buildCity(profile,'town-center');
 assert.equal(profile.city.bank,300);
 assert.equal(profile.city.upgrades['town-center'],1);
 profile=buildCity(profile,'town-center');
 assert.equal(profile.city.upgrades['town-center'],1,'one lesson issues one construction permit');
});

test('four 100-coin stages complete the Town Center and Arcade needs no lesson permits',()=>{
 let profile={...newGame('Arcade','ruby'),mode:'arcade'};
 for(let stage=1;stage<=4;stage++){
  profile=depositCityCoins(profile,100);
  profile=buildCity(profile,'town-center');
  assert.equal(profile.city.upgrades['town-center'],stage);
 }
 assert.equal(profile.city.bank,0);
 assert.match(profile.city.notice,/stage 4 of 4/i);
});

test('32 lesson permits can complete all 32 city stages',()=>{
 let profile={...newGame('Builder','eli'),completed:Array.from({length:32},(_,index)=>index+1)};
 profile=depositCityCoins(profile,3200);
 for(const landmark of cityLandmarks)for(let stage=0;stage<4;stage++)profile=buildCity(profile,landmark.id);
 const totals=cityTotals(profile);
 assert.equal(totals.built,32);
 assert.equal(totals.complete,true);
 assert.equal(totals.city.bank,0);
});
