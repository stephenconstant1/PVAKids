import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/engine.js';
import {missions} from '../src/content.js';
import {classroomSummary,missionOutcomeRecords,recordsToCsv,studentSummary} from '../src/teacher.js';

function completedProfile(name='Ari, Jr.'){
 const profile=newGame(name,'★');
 Object.assign(profile,{studentId:'student-7',xp:600,cash:25,checking:75,savings:200,emergencyFund:50,investments:100,stocks:40,etfs:60,debt:30,loans:20});
 profile.completed=[2,1,2];
 profile.badges=['earner','earner','planner'];
 profile.arcadeXp=45;profile.arcadeCoins=12;
 profile.runnerProgress={1:{pre:{completed:true,skipped:false,score:120},post:{completed:true,skipped:false,score:220}},2:{pre:{completed:true,skipped:true,score:0},post:{completed:false,skipped:false,score:0}}};
 profile.missionMedals={1:'gold',2:'silver'};
 profile.decisions={
  1:[{stage:'choice',label:'Your skills',feedback:'A customer said "yes".',effects:{cash:25,totalIncome:25}}],
  2:[{stage:'choice',label:'Save first',feedback:'Built a buffer.',effects:{savings:50,cash:-50}}]
 };
 profile.history=[
  {mission:2,practice:false,worth:500,choice:'Save first',borrowed:0},
  {mission:1,practice:true,worth:120,choice:'Your time',borrowed:0},
  {mission:1,practice:false,worth:210,choice:'Your skills',borrowed:5}
 ];
 return profile;
}

test('student summary normalizes campaign and money metrics without mutating the profile',()=>{
 const profile=completedProfile(),before=structuredClone(profile),summary=studentSummary(profile);
 assert.equal(summary.studentId,'student-7');
 assert.equal(summary.rank,'Saver');
 assert.equal(summary.missionsCompleted,2);
 assert.equal(summary.missionsTotal,missions.length);
 assert.equal(summary.completionPercent,Math.round(2/missions.length*10000)/100);
 assert.equal(summary.nextMissionId,3);
 assert.equal(summary.cash,100);
 assert.equal(summary.savings,250);
 assert.equal(summary.investments,200);
 assert.equal(summary.debt,50);
 assert.equal(summary.netWorth,500);
 assert.equal(summary.badgeCount,2);
 assert.equal(summary.preRunsCompleted,1);
 assert.equal(summary.bonusRunsCompleted,1);
 assert.equal(summary.arcadeXp,45);
 assert.equal(summary.arcadeCoins,12);
 assert.deepEqual(profile,before);
});

test('mission outcomes are flat, ordered, and prefer the campaign result over practice history',()=>{
 const records=missionOutcomeRecords(completedProfile());
 assert.deepEqual(records.map(record=>record.missionId),[1,2]);
 assert.equal(records[0].choice,'Your skills');
 assert.equal(records[0].practice,false);
 assert.equal(records[0].borrowed,5);
 assert.equal(records[0].medal,'gold');
 assert.equal(records[0].preRunCompleted,true);
 assert.equal(records[0].bonusRunCompleted,true);
 assert.equal(records[0].preRunScore,120);
 assert.equal(records[0].bonusRunScore,220);
 assert.equal(records[0].decisionSummary,'choice: Your skills');
 assert.equal(records[0].effectSummary,'cash +25 | totalIncome +25');
 for(const record of records)for(const value of Object.values(record))assert.ok(value===null||['string','number','boolean'].includes(typeof value));
});

test('classroom summary aggregates students and handles an empty roster',()=>{
 const first=completedProfile('Ari'),second=newGame('Bo');
 second.xp=7200;
 const summary=classroomSummary([first,second]);
 assert.equal(summary.studentCount,2);
 assert.equal(summary.missionCompletions,2);
 assert.equal(summary.averageXp,3900);
 assert.equal(summary.financiallyFreeStudents,1);
 assert.equal(summary.preRunParticipations,1);
 assert.equal(summary.bonusRunParticipations,1);
 assert.equal(summary.totalArcadeXp,45);
 assert.equal(summary.students[1].nextMissionId,1);
 assert.deepEqual(classroomSummary([]),{studentCount:0,missionCompletions:0,averageCompletionPercent:0,averageXp:0,preRunParticipations:0,bonusRunParticipations:0,totalArcadeXp:0,averageNetWorth:0,financiallyFreeStudents:0,students:[]});
});

test('CSV export quotes commas, quotes, and line breaks with stable headers',()=>{
 const records=missionOutcomeRecords(completedProfile());
 const csv=recordsToCsv(records);
 assert.match(csv,/^studentId,studentName,missionId,/);
 assert.match(csv,/"Ari, Jr\."/);
 assert.match(csv,/"A customer said ""yes""\."/);
 assert.equal(csv.split('\r\n').length,3);
 assert.equal(recordsToCsv([]),'');
});
