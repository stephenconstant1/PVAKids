import {test} from 'node:test';import assert from 'node:assert/strict';
import {newGame,begin} from '../src/engine.js';
import {attachCity,currentLevel,validCity} from '../src/moneybread/simulation.js';
import {newJobPractice} from '../src/moneybread/job-practice.js';
import {completeJobJourney,startJobRun,jobRunActive} from '../src/job-journey.js';
import {finances} from '../src/finance.js';
const ready=job=>({...newJobPractice(job),checked:true,allocation:{needs:5,wants:7,invest:8}});
test('a valid job plan completes Lesson 1, unlocks Lesson 2 and opens the existing bonus run without awarding example money',()=>{
 for(const job of ['service','tutor','creator']){
 const p=attachCity(newGame('Student','maya')),copy=structuredClone(p),plan=ready(job),done=completeJobJourney(p,plan);
 assert.deepEqual(p,copy);assert.deepEqual(done.completed,[1]);assert.equal(currentLevel(done.moneybread),2);assert(validCity(done.moneybread));assert.deepEqual(finances(done),finances(p));assert.equal(done.xp,p.xp);assert.deepEqual(done.moneybread.wallet,p.moneybread.wallet);assert.deepEqual(done.snapshots[1],finances(p));assert(done.runnerProgress[1].lessonCompleted);
 assert.deepEqual(completeJobJourney(done,plan).completed,[1]);const run=startJobRun(done);assert(jobRunActive(run));assert.equal(run.runnerSession.phase,'post');assert.equal(run.runnerSession.status,'intro');assert.equal(begin(done,2).active.id,2);
 }
});
test('invalid or incomplete allocations never complete a lesson',()=>{const p=attachCity(newGame());for(const plan of [newJobPractice('service'),{...ready('service'),materials:0},{...ready('service'),allocation:{needs:0,wants:0,invest:0}},{...ready('service'),allocation:{needs:10,wants:10,invest:10}}])assert.equal(completeJobJourney(p,plan),p);});
test('revisiting the activity preserves later progress, city transactions and the saved Lesson 1 snapshot',()=>{const p=attachCity(newGame());p.completed=[1,2];p.moneybread.legacy=[1,2];p.snapshots={1:finances(p),2:finances(p)};p.active={id:3};const done=completeJobJourney(p,ready('creator'));assert.deepEqual(done.completed,[1,2]);assert.equal(currentLevel(done.moneybread),3);assert.deepEqual(done.moneybread.wallet,p.moneybread.wallet);assert.equal(done.snapshots[1],p.snapshots[1]);assert.equal(done.active,p.active);});
