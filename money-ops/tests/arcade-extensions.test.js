import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FinancialRunner} from '../src/runner.js';
import {WaterfrontClimb} from '../src/waterfront-climb.js';
import {runnerConfig} from '../src/runner-config.js';
test('word cards retain the correct terms for all 32 lessons without money or score effects',()=>{
 for(let lesson=1;lesson<=32;lesson++){
 const r=Object.create(FinancialRunner.prototype);Object.assign(r,{config:runnerConfig(lesson,'pre'),wordCursor:0,entities:[],width:960,ground:292,completed:false,vocabularyCollected:[],vocabularySeen:[],vocabSerial:0,coins:12,collected:9,score:88,xp:7,bonusMoney:5,burst(){}});
 for(const word of r.config.vocabulary){r.spawnVocabulary();const card=r.entities.at(-1);assert.equal(card.label,word.term);assert.equal(card.definition,word.definition);r.collectVocabulary(card);r.collectVocabulary(card);}
 assert.deepEqual(r.vocabularyCollected,r.config.vocabulary.map(w=>w.term));assert.deepEqual([r.coins,r.collected,r.score,r.xp,r.bonusMoney],[12,9,88,7,5]);
 }
});
test('each recurring deck resets only its separate practice allocation',()=>{
 const r={distance:10,width:960,ground:292,entities:[],score:10,coins:20},c=new WaterfrontClimb(r);c.spawn();c.allocated.add('needs');c.remaining=50;c.reachedTop=true;r.distance=1000;c.spawn();assert.equal(c.count,2);assert.equal(c.nextDistance,1850);assert.equal(c.remaining,100);assert.deepEqual([...c.allocated],[]);assert.equal(c.reachedTop,false);assert.equal(r.score,10);assert.equal(r.coins,20);
});
test('non-contact kick combo changes presentation without modifying collision bounds',()=>{
 const r=Object.create(FinancialRunner.prototype);Object.assign(r,{arcade:true,running:true,paused:false,completed:false,player:{grounded:false,duck:false},flourish:null,flourishDirection:1});assert(r.startFlourish('flip'));assert.equal(r.flourish.direction,1);r.startFlourish('kick');assert(r.flourish.queuedKick);r.stepFlourish(.51);assert.equal(r.flourish.kind,'kick');assert.equal(r.flourish.direction,-1);assert.deepEqual(r.player,{grounded:false,duck:false});r.stepFlourish(.31);assert.equal(r.flourish,null);r.arcade=false;assert.equal(r.startFlourish('kick'),false);
});
