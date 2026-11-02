import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJobPractice,jobTotals,jobFeedback,customerNeeds,canCheckJob,minimumCosts} from '../src/moneybread/job-practice.js';
import {jobs} from '../src/moneybread/simulation.js';
test('every practice job starts with a separate fixed $100 budget and $80 costs',()=>{
 for(const job of jobs){const p=newJobPractice(job.id);assert.deepEqual(jobTotals(p),{payment:100,total:80,remaining:20});for(const key of Object.keys(minimumCosts))assert.equal(p[key],minimumCosts[key]);assert(canCheckJob(p));assert(customerNeeds[job.id].value);}
});
test('costs contribute once; only plans within the budget can pass',()=>{
 for(const [materials,labor,overhead] of [[25,40,15],[45,40,15],[46,40,15],[10000,10000,10000]]){
 const p={...newJobPractice('tutor'),materials,labor,overhead},copy=structuredClone(p),total=materials+labor+overhead;
 assert.deepEqual(jobTotals(p),{payment:100,total,remaining:100-total});assert.equal(canCheckJob(p),total<=100);assert.deepEqual(p,copy);
 assert.match(jobFeedback(p,String),total>100?/Over budget/:/remaining/);
 }
});
test('invalid and below-minimum estimates cannot produce totals or pass',()=>{
 for(const category of Object.keys(minimumCosts))for(const value of [NaN,Infinity,-1,.5,10001,minimumCosts[category]-1]){const p={...newJobPractice('service'),[category]:value};assert.equal(jobTotals(p),null);assert.equal(canCheckJob(p),false);}
 assert.equal(jobTotals({...newJobPractice('service'),job:'unknown'}),null);
});
test('feedback distinguishes exact budget, remaining money and over-budget retry',()=>{
 const p=newJobPractice('creator');assert.match(jobFeedback(p,String),/not guaranteed profit/);assert.match(jobFeedback({...p,materials:45},String),/nothing remains/);assert.doesNotMatch(jobFeedback({...p,labor:200},String),/You planned work/);
});
