import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arcadeLeaders,arcadeScoreStorageKey,loadArcadeScores,recordArcadeScore} from '../src/arcade-scores.js';

function storage(){
 const values=new Map();
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 return values;
}

test('Arcade initials retain only each player’s best score per level',()=>{
 const values=storage();
 let scores=loadArcadeScores();
 scores=recordArcadeScore(scores,{initials:'ab',score:400,lessonId:1,coins:100,createdAt:2});
 scores=recordArcadeScore(scores,{initials:'AB',score:300,lessonId:1,coins:100,createdAt:3});
 scores=recordArcadeScore(scores,{initials:'xyz',score:700,lessonId:1,coins:100,createdAt:1});
 assert.deepEqual(arcadeLeaders(scores,1).map(entry=>[entry.initials,entry.score]),[['XYZ',700],['AB',400]]);
 assert.ok(values.has(arcadeScoreStorageKey));
});

test('Arcade leaderboard keeps ten highest scores and combines all levels',()=>{
 storage();
 let scores=loadArcadeScores();
 for(let index=0;index<12;index++)scores=recordArcadeScore(scores,{initials:`A${index.toString(36)}`,score:index*100,lessonId:2,coins:100});
 scores=recordArcadeScore(scores,{initials:'TOP',score:5000,lessonId:32,coins:100});
 assert.equal(arcadeLeaders(scores,2).length,10);
 assert.equal(arcadeLeaders(scores)[0].initials,'TOP');
 assert.equal(arcadeLeaders(scores)[0].lessonId,32);
});

test('Arcade score entry requires two or three initials',()=>{
 storage();
 assert.throws(()=>recordArcadeScore(loadArcadeScores(),{initials:'!',score:10,lessonId:1}),/two or three initials/i);
});
