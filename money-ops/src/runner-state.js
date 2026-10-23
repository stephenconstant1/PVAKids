import {runnerConfig} from './runner-config.js';
import {depositCityCoins} from './city.js';

const zeroResult=()=>({completed:false,skipped:false,score:0,coins:0,collected:0,bonusMoney:0,xp:0,distance:0,avoided:0,survivalSeconds:0,powerUpsUsed:0,paychecks:0,paycheckCoins:0,cityCoins:0,extraLivesCollected:0,vocabularySeen:[]});

export function runnerProgress(profile,lessonId){
 const saved=profile?.runnerProgress?.[lessonId]||{};
 return {pre:{...zeroResult(),...saved.pre},lessonStarted:Boolean(saved.lessonStarted),lessonCompleted:Boolean(saved.lessonCompleted),post:{...zeroResult(),...saved.post},bestScore:Number(saved.bestScore)||0,characterId:saved.characterId||profile?.avatar||'maya'};
}

export function openRunner(profile,lessonId,phase='pre'){
 const config=runnerConfig(lessonId,phase),progress=runnerProgress(profile,lessonId);
 if(phase==='post'&&!progress.lessonCompleted)throw Error('Bonus run is locked until the lesson is complete');
 return {...profile,screen:'runner',runnerSession:{lessonId:Number(lessonId),phase,status:'intro',startedAt:null,targetCoins:config.targetCoins}};
}

export function markLessonStarted(profile,lessonId){
 const progress=runnerProgress(profile,lessonId);
 return {...profile,runnerProgress:{...(profile.runnerProgress||{}),[lessonId]:{...progress,lessonStarted:true,characterId:profile.avatar}}};
}

export function markLessonCompleted(profile,lessonId){
 const progress=runnerProgress(profile,lessonId);
 return {...profile,runnerProgress:{...(profile.runnerProgress||{}),[lessonId]:{...progress,lessonStarted:true,lessonCompleted:true,characterId:profile.avatar}}};
}

export function recordRunnerResult(profile,lessonId,phase,result={}){
 runnerConfig(lessonId,phase);
 if(profile.runnerSession?.status==='results'&&profile.runnerSession.lessonId===Number(lessonId)&&profile.runnerSession.phase===phase)return profile;
 const progress=runnerProgress(profile,lessonId),clean={...zeroResult(),...result,completed:true,score:Math.max(0,Math.round(Number(result.score)||0)),coins:Math.max(0,Math.round(Number(result.coins)||0)),collected:Math.max(0,Math.round(Number(result.collected)||0)),bonusMoney:Math.max(0,Math.round(Number(result.bonusMoney)||0)),xp:Math.max(0,Math.round(Number(result.xp)||0)),distance:Math.max(0,Math.round(Number(result.distance)||0)),avoided:Math.max(0,Math.round(Number(result.avoided)||0)),survivalSeconds:Math.max(0,Math.round(Number(result.survivalSeconds)||0)),powerUpsUsed:Math.max(0,Math.round(Number(result.powerUpsUsed)||0)),vocabularySeen:[...new Set((Array.isArray(result.vocabularySeen)?result.vocabularySeen:[]).map(String))].slice(0,40)};
 clean.paychecks=Math.min(clean.collected,Math.max(0,Math.floor(Number(result.paychecks)||0)));
 clean.paycheckCoins=Math.min(clean.paychecks*2,Math.max(clean.paychecks,Math.floor(Number(result.paycheckCoins)||0)));
 clean.cityCoins=clean.collected-clean.paychecks+clean.paycheckCoins;
 clean.extraLivesCollected=Math.max(0,Math.floor(Number(result.extraLivesCollected)||0));
 const next={...progress,[phase]:clean,bestScore:Math.max(progress.bestScore,clean.score),characterId:result.characterId||profile.avatar};
 const achievement=clean.score>=1000?`runner-${lessonId}-1000`:clean.avoided>=10?`runner-${lessonId}-dodger`:null;
 const achievements=[...new Set([...(profile.arcadeAchievements||[]),...(achievement?[achievement]:[])])];
 const bonusWallet=profile.bonusWallet||{available:0,saved:0,invested:0,budgeted:0,items:[]},careerBonus=profile.mode==='career'&&phase==='post'?clean.bonusMoney:0;
 const awarded={...profile,bonusWallet:{...bonusWallet,available:(bonusWallet.available||0)+careerBonus,items:bonusWallet.items||[]},arcadeCoins:(profile.arcadeCoins||0)+clean.coins,arcadeXp:(profile.arcadeXp||0)+clean.xp,arcadeAchievements:achievements,runnerProgress:{...(profile.runnerProgress||{}),[lessonId]:next},runnerSession:{lessonId:Number(lessonId),phase,status:'results',result:clean}};
 return depositCityCoins(awarded,clean.cityCoins);
}

export function runnerComparison(profile,lessonId){
 const progress=runnerProgress(profile,lessonId),pre=progress.pre,post=progress.post;
 return {pre,post,scoreChange:post.score-pre.score,coinsChange:post.coins-pre.coins,xpChange:post.xp-pre.xp,bestScore:progress.bestScore,longestSurvival:Math.max(pre.survivalSeconds,post.survivalSeconds)};
}
