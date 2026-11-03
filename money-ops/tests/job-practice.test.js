import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJobPractice,jobTotals,jobFeedback,jobPlanError,jobStepDisabled,stepJobCost,MINIMUM_JOB_COSTS,jobReady} from '../src/moneybread/job-practice.js';
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
 const p=newJobPractice('creator'),copy=structuredClone(p);assert.match(jobFeedback(p,String),/not guaranteed profit/);assert.match(jobFeedback(p,String),/\$80 listed costs/);assert.deepEqual(p,copy);
});

test('checking the job requires planning materials, labor and overhead, without charging extra money',()=>{
 const plan=newJobPractice('tutor');assert(!jobReady(plan));for(const category of ['materials','labor','overhead']){plan.packed=[...(plan.packed||[]),category];if(plan.packed.length<3)assert(!jobReady(plan));}
 assert(jobReady(plan));assert.deepEqual(jobTotals(plan),{payment:100,total:80,remaining:20});assert(!jobReady({...plan,materials:46}));assert(!jobReady({...plan,packed:['materials','labor']}));
});
