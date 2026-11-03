import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJobPractice,jobTotals,jobFeedback,jobPlanError,jobStepDisabled,stepJobCost,MINIMUM_JOB_COSTS} from '../src/moneybread/job-practice.js';
import {jobs} from '../src/moneybread/simulation.js';
test('every practice job starts at the required $80 cost within the same $100 budget',()=>{
 for(const job of jobs){const p=newJobPractice(job.id);assert.deepEqual(jobTotals(p),{payment:100,total:80,remaining:20});for(const [key,value] of Object.entries(MINIMUM_JOB_COSTS))assert.equal(p[key],value);assert.equal(jobPlanError(p),'');}
 assert.deepEqual(jobs.map(j=>[j.income,j.cost]),[[100,0],[130,10],[155,25]],'saved city-job rules stay unchanged');
});
test('minimums reject blanks, fractions, below-floor amounts and invalid jobs',()=>{
 for(const [category,minimum] of Object.entries(MINIMUM_JOB_COSTS))for(const value of [NaN,Infinity,-1,0,minimum-1,minimum+.5,101]){
 const p={...newJobPractice('service'),[category]:value};assert.equal(jobTotals(p),null);assert(jobPlanError(p));assert.match(jobFeedback(p,String),/Review your budget/);
 }
 assert.equal(jobTotals({...newJobPractice('service'),job:'unknown'}),null);
});
test('exact-budget and over-budget plans calculate honestly, but overspending cannot pass',()=>{
 for(const job of jobs){const p={...newJobPractice(job.id),materials:45};assert.deepEqual(jobTotals(p),{payment:100,total:100,remaining:0});assert.equal(jobPlanError(p),'');assert.match(jobFeedback(p,String),/nothing remains/);
 const over={...p,materials:46};assert.deepEqual(jobTotals(over),{payment:100,total:101,remaining:-1});assert.match(jobPlanError(over),/\$1 over the \$100 budget/);assert.match(jobFeedback(over,String),/Review your budget/);assert(!jobFeedback(over,String).includes('Your plan fits'));
 }
});
test('plus/minus buttons cannot bypass a minimum or spend beyond the remaining budget',()=>{
 for(const category of Object.keys(MINIMUM_JOB_COSTS)){
 const p=newJobPractice('service');assert(jobStepDisabled(p,category,-1));assert.equal(stepJobCost(p,category,-1),MINIMUM_JOB_COSTS[category]);
 for(let i=0;i<25;i++){p[category]=stepJobCost(p,category,1);assert(jobTotals(p).remaining>=0);}
 assert.equal(p[category],MINIMUM_JOB_COSTS[category]+20);for(const key of Object.keys(MINIMUM_JOB_COSTS))assert(jobStepDisabled(p,key,1));
 for(let i=0;i<25;i++)p[category]=stepJobCost(p,category,-1);assert.equal(p[category],MINIMUM_JOB_COSTS[category]);
 }
});
test('feedback describes remaining money without guaranteeing profit or modifying the plan',()=>{
 const p=newJobPractice('creator'),copy=structuredClone(p);assert.match(jobFeedback(p,String),/not guaranteed profit/);assert.match(jobFeedback(p,String),/25 materials \+ 40 labor \+ 15 overhead/);assert.deepEqual(p,copy);
});

test('remaining dollars must all be assigned once, with no negative, fractional or over-budget allocation',async()=>{
 const {allocationTotals,allocationReady,jobBoardAsset}=await import('../src/moneybread/job-practice.js');
 const plan={...newJobPractice('tutor'),checked:true,allocation:{needs:10,wants:5,invest:5}};
 assert.deepEqual(allocationTotals(plan),{assigned:20,unassigned:0});assert(allocationReady(plan));assert(!allocationReady({...plan,checked:false}));
 for(const value of [-1,NaN,Infinity,1.5]){assert.equal(allocationTotals({...plan,allocation:{...plan.allocation,invest:value}}),null);}
 assert(!allocationReady({...plan,allocation:{needs:10,wants:5,invest:6}}));assert(!allocationReady({...plan,allocation:{needs:0,wants:0,invest:0}}));
 assert(allocationReady({...plan,materials:45,allocation:{needs:0,wants:0,invest:0}}));assert(!allocationReady({...plan,materials:46}));
 assert.equal(new Set(['service','tutor','creator'].map(jobBoardAsset)).size,3);
});
