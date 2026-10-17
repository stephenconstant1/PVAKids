import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,netWorth} from '../src/engine.js';
import {runnerConfig,runnerEnvironments,runnerLessons} from '../src/runner-config.js';
import {markLessonCompleted,markLessonStarted,openRunner,recordRunnerResult,runnerComparison,runnerProgress} from '../src/runner-state.js';

test('all 32 lessons have distinct runner hazards, rewards, and complete stage configuration',()=>{
 assert.equal(runnerLessons.length,32);
 assert.deepEqual(runnerLessons.map(item=>item.lessonId),Array.from({length:32},(_,index)=>index+1));
 assert.equal(new Set(runnerLessons.map(item=>item.obstacleSet.map(hazard=>hazard.label).join('|'))).size,32);
 assert.equal(new Set(runnerLessons.map(item=>item.collectibleSet.map(reward=>reward.label).join('|'))).size,32);
 const obstacleArt=runnerLessons.flatMap(item=>item.obstacleSet.map(hazard=>`${hazard.art.hue}-${hazard.art.pattern}-${hazard.art.variant}`));
 assert.equal(new Set(obstacleArt).size,64,'every financial hazard needs its own visual treatment');
 for(const lesson of runnerLessons){
  assert.ok(runnerEnvironments[lesson.environment],`week ${lesson.lessonId} needs an environment`);
  assert.ok(lesson.obstacleSet.length>=2,`week ${lesson.lessonId} needs hazards`);
  assert.ok(lesson.obstacleSet.every(hazard=>hazard.art&&Number.isFinite(hazard.art.hue)),`week ${lesson.lessonId} needs distinct hazard art`);
  assert.ok(lesson.collectibleSet.length>=3,`week ${lesson.lessonId} needs rewards`);
  assert.ok(lesson.powerUp.name&&lesson.powerUp.effect,`week ${lesson.lessonId} needs a power-up`);
  assert.equal(runnerConfig(lesson.lessonId,'pre').durationSeconds,90);
  assert.equal(runnerConfig(lesson.lessonId,'post').durationSeconds,180);
  assert.equal(lesson.pre.maxLives,3);
  assert.equal(lesson.post.maxLives,3);
 }
});

test('runner progression saves pre, lesson, and bonus stages without changing financial net worth',()=>{
 let profile=newGame('Runner','kai'),worth=netWorth(profile);
 profile=openRunner(profile,1,'pre');
 assert.equal(profile.runnerSession.status,'intro');
 profile=recordRunnerResult(profile,1,'pre',{score:220,coins:7,xp:30,distance:90,avoided:4,survivalSeconds:12});
 assert.equal(runnerProgress(profile,1).pre.completed,true);
 assert.equal(profile.arcadeCoins,7);
 assert.equal(profile.arcadeXp,30);
 assert.equal(netWorth(profile),worth);
 profile=markLessonStarted(profile,1);
 profile=markLessonCompleted(profile,1);
 profile=openRunner(profile,1,'post');
 profile=recordRunnerResult(profile,1,'post',{score:410,coins:12,xp:55,distance:160,avoided:8,survivalSeconds:25,powerUpsUsed:2});
 const comparison=runnerComparison(profile,1);
 assert.equal(comparison.scoreChange,190);
 assert.equal(comparison.bestScore,410);
 assert.equal(comparison.longestSurvival,25);
 assert.equal(profile.arcadeCoins,19);
 assert.equal(netWorth(profile),worth);
});

test('bonus runner remains locked until its lesson is completed',()=>{
 assert.throws(()=>openRunner(newGame(),1,'post'),/locked/i);
 assert.doesNotThrow(()=>openRunner(markLessonCompleted(newGame(),1),1,'post'));
 assert.throws(()=>runnerConfig(33,'pre'),/unknown/i);
});
