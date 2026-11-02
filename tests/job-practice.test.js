import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJobPractice,jobTotals,jobFeedback,customerNeeds} from '../src/moneybread/job-practice.js';
import {jobs} from '../src/moneybread/simulation.js';
test('practice starts with original payments and supplies, without pricing unspecified labor or overhead',()=>{
 for(const job of jobs){const p=newJobPractice(job.id);assert.deepEqual(jobTotals(p),{payment:job.income,total:job.cost,remaining:job.income-job.cost});assert.equal(p.labor,0);assert.equal(p.overhead,0);assert(customerNeeds[job.id].value);}
});
test('all categories contribute once; remaining can be positive, zero or negative',()=>{
 for(const job of jobs)for(const [materials,labor,overhead] of [[10,40,15],[job.income,0,0],[10000,10000,10000]]){
 const p={...newJobPractice(job.id),materials,labor,overhead},copy=structuredClone(p);assert.deepEqual(jobTotals(p),{payment:job.income,total:materials+labor+overhead,remaining:job.income-materials-labor-overhead});assert.deepEqual(p,copy);
 assert.match(jobFeedback(p,String),/remaining/);
 }
});
test('invalid or incomplete estimates cannot produce misleading totals',()=>{
 for(const value of [NaN,Infinity,-1,.5,10001])for(const category of ['materials','labor','overhead'])assert.equal(jobTotals({...newJobPractice('service'),[category]:value}),null);
 assert.equal(jobTotals({...newJobPractice('service'),job:'unknown'}),null);
});
test('feedback identifies changed supplies, omitted estimates and shortfalls without promising profit',()=>{
 const p={...newJobPractice('tutor'),materials:10,labor:40,overhead:15};assert.deepEqual(jobTotals(p),{payment:130,total:65,remaining:65});assert.match(jobFeedback(p,String),/not guaranteed profit/);
 assert.match(jobFeedback({...p,materials:130,labor:0,overhead:0},String),/nothing remains/);
 assert.match(jobFeedback({...p,labor:200},String),/exceed the payment/);
 assert.match(jobFeedback({...p,materials:0},String),/original job lists 10/);
});
