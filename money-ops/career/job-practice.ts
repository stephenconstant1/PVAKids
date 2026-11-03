import {jobs} from './simulation.js';
export interface JobPractice {job:string;materials:number;labor:number;overhead:number;checked:boolean;reflection:string;allocation?:Record<MoneyBucket,number>;completed?:boolean}
export const customerNeeds:Record<string,{customer:string;need:string;value:string;materials:string;labor:string;overhead:string}>={
 service:{customer:'A neighbor with yard work to finish',need:'The yard needs useful work completed.',value:'Your time provides a useful service for your neighbor.',materials:'Materials needed for yard work',labor:'Time spent doing the yard work',overhead:'Transportation or equipment used across several jobs'},
 tutor:{customer:'A neighbor who needs help learning',need:'The neighbor needs schoolwork explained.',value:'Your skills help someone understand their schoolwork.',materials:'Learning materials',labor:'Time spent preparing and explaining',overhead:'Transportation or equipment shared across tutoring jobs'},
 creator:{customer:'A customer who needs a product',need:'The customer needs something useful created.',value:'Your ideas create a product people need.',materials:'Supplies used to make the product',labor:'Time spent designing and making',overhead:'Equipment or workspace supplies used across several jobs'}
};
export const JOB_PRACTICE_PAYMENT=100;
export const MINIMUM_JOB_COSTS=Object.freeze({materials:25,labor:40,overhead:15} as const);
export const practiceBudget=JOB_PRACTICE_PAYMENT;
export const minimumCosts=MINIMUM_JOB_COSTS;
export const practiceError='Enter whole dollars: materials at least $25, labor at least $40, and overhead at least $15.';
export function canCheckJob(plan:JobPractice):boolean {return !jobPlanError(plan);}
export type JobCostCategory=keyof typeof MINIMUM_JOB_COSTS;
const costCategories=Object.keys(MINIMUM_JOB_COSTS) as JobCostCategory[];
export function newJobPractice(job:string):JobPractice {const j=jobs.find(j=>j.id===job)||jobs[0];return {job:j.id,...MINIMUM_JOB_COSTS,checked:false,reflection:''};}
export function jobTotals(plan:JobPractice):{payment:number;total:number;remaining:number}|null {
 if(!jobs.some(j=>j.id===plan.job)||!costCategories.every(key=>Number.isSafeInteger(plan[key])&&plan[key]>=MINIMUM_JOB_COSTS[key]&&plan[key]<=JOB_PRACTICE_PAYMENT))return null;
 const total=plan.materials+plan.labor+plan.overhead;return {payment:JOB_PRACTICE_PAYMENT,total,remaining:JOB_PRACTICE_PAYMENT-total};
}
export function jobPlanError(plan:JobPractice):string {
 if(!jobs.some(j=>j.id===plan.job))return 'Choose one of the available practice jobs.';
 for(const category of costCategories){const amount=plan[category],minimum=MINIMUM_JOB_COSTS[category];
  if(!Number.isSafeInteger(amount))return 'Enter a whole-number cost in every category.';
  if(amount<minimum)return `${category[0].toUpperCase()+category.slice(1)} must be at least $${minimum}.`;
  if(amount>JOB_PRACTICE_PAYMENT)return 'No single cost can exceed the $100 practice budget.';
 }
 const totals=jobTotals(plan)!;return totals.remaining<0?`Your plan is $${-totals.remaining} over the $100 budget. Reduce costs above their minimums before checking the job.`:'';
}
export function jobStepDisabled(plan:JobPractice,category:JobCostCategory,direction:number):boolean {
 if(direction<0)return Number.isFinite(plan[category])&&plan[category]<=MINIMUM_JOB_COSTS[category];
 const other=costCategories.filter(key=>key!==category).reduce((sum,key)=>sum+(Number.isFinite(plan[key])?Math.max(MINIMUM_JOB_COSTS[key],plan[key]):MINIMUM_JOB_COSTS[key]),0);
 return Number.isFinite(plan[category])&&plan[category]>=JOB_PRACTICE_PAYMENT-other;
}
export function stepJobCost(plan:JobPractice,category:JobCostCategory,direction:number):number {
 const current=Number.isFinite(plan[category])?plan[category]:MINIMUM_JOB_COSTS[category];
 if(jobStepDisabled(plan,category,direction))return current;
 return Math.max(MINIMUM_JOB_COSTS[category],Math.min(JOB_PRACTICE_PAYMENT,Math.floor(current)+direction));
}
export type MoneyBucket='needs'|'wants'|'invest';
export const moneyBuckets:MoneyBucket[]=['needs','wants','invest'];
export function allocationTotals(plan:JobPractice):{assigned:number;unassigned:number}|null {
 const totals=jobTotals(plan);if(!totals||jobPlanError(plan))return null;
 const values=moneyBuckets.map(key=>plan.allocation?.[key]??0);
 if(!values.every(value=>Number.isSafeInteger(value)&&value>=0))return null;
 const assigned=values.reduce((a,b)=>a+b,0);return {assigned,unassigned:totals.remaining-assigned};
}
export function allocationReady(plan:JobPractice):boolean {return plan.checked&&allocationTotals(plan)?.unassigned===0;}
export function jobBoardAsset(job:string):string {return job==='tutor'?'assets/crew/run-job-tutor.png':job==='creator'?'assets/crew/run-job-creator.png':'assets/crew/lesson-one-run-the-job.jpg';}
const jobDetails:Record<string,{title:string;need:string;costs:string[]}>={
 service:{title:'Neighborhood Helper',need:'Help a neighbor finish yard work.',costs:['Gloves, seeds & bags','Time doing yard work','Shared tools & transport']},
 tutor:{title:'School Tutor',need:'Help a student understand schoolwork.',costs:['Pencils & learning cards','Preparing & explaining','Shared books & equipment']},
 creator:{title:'Studio Creator',need:'Make something useful for a customer.',costs:['Paper & art supplies','Designing & making','Shared tools & workspace']}
};
function dollars(value:number|undefined):string {return value===undefined||!Number.isFinite(value)?'—':value<0?`-$${-value}`:`$${value}`;}
function sceneCrop(asset:string,box:string,label:string):string {return `<svg class="job-mobile-art" viewBox="${box}" role="img" aria-label="${label}"><image href="${asset}" width="1280" height="720" preserveAspectRatio="none"/></svg>`;}
function allocationMarkup(plan:JobPractice):string {
 const totals=jobTotals(plan)!,allocation=allocationTotals(plan),a=plan.allocation||{needs:0,wants:0,invest:0};
 return `<section class="job-leftover" aria-labelledby="job-leftover-title" tabindex="-1"><h2 id="job-leftover-title">Plan your $${totals.remaining} remaining</h2><p>Choose where every remaining dollar goes.</p><div class="job-money-buckets">${moneyBuckets.map((key,i)=>`<article><label for="job-money-${key}">${['Needs','Wants','Invest / Future'][i]}</label><p>${['Things you must pay for, such as obligations or supplies.','Something you would like, such as shoes.','Save for a future goal or put back into the business.'][i]}</p><div class="job-bucket-tools"><button data-action="job-money-step" data-bucket="${key}" data-direction="-1" ${a[key]<=0?'disabled':''} aria-label="Move one dollar out of ${key}">−</button><input id="job-money-${key}" data-job-money="${key}" type="number" min="0" max="${totals.remaining}" step="1" inputmode="numeric" value="${a[key]}" aria-describedby="job-money-status"/><button data-action="job-money-step" data-bucket="${key}" data-direction="1" ${(allocation?.unassigned??0)<=0?'disabled':''} aria-label="Put one dollar into ${key}">+</button></div></article>`).join('')}</div><p id="job-money-status" role="status" tabindex="-1">${plan.completed?'✓ Every dollar has a job! You created value and planned your money.':allocation?`$${allocation.unassigned} still to plan.`:'Use whole dollars, zero or more.'}</p><small>Money remaining is after the listed costs, not guaranteed profit.</small><div class="job-leftover-actions"><button class="mb-button" data-action="job-money-back">← Job costs</button><button class="mb-button primary" data-action="job-money-finish" ${allocationReady(plan)?'':'disabled'}>${plan.completed?'✓ Plan complete':'Finish my plan →'}</button></div></section>`;
}
export function renderJobPractice(plan:JobPractice,_guide:string,e:(v:unknown)=>string):string {
 const job=jobs.find(j=>j.id===plan.job)||jobs[0],detail=jobDetails[job.id],asset=jobBoardAsset(job.id),totals=jobTotals(plan);
 return `<section class="job-practice job-picture-only" aria-labelledby="job-practice-title"><h1 class="sr" id="job-practice-title" tabindex="-1">Run the Job · Lesson 1</h1><div class="job-simple-toolbar"><div class="job-plan-choices" role="group" aria-label="Choose your job skill">${jobs.map(j=>`<button class="mb-button ${plan.job===j.id?'selected':''}" data-action="job-plan-${j.id}" aria-pressed="${plan.job===j.id}">${jobDetails[j.id].title}</button>`).join('')}</div><button class="mb-button job-replay" data-action="job-comic-replay">Replay comic ↻</button></div><div class="job-picture-board" data-job-board="${job.id}" style="background-image:linear-gradient(transparent 75px,#fff1cb 115px),url('${asset}')"><img class="job-board-bg" src="${asset}" width="1280" height="720" alt="Moneybread City Run the Job: ${detail.title}, with matching materials, labor and overhead illustrations."/><div class="job-live-board"><div class="job-live-heading">${sceneCrop(asset,'575 278 250 105',detail.title+' customer scene')}<div><h2>${detail.title}</h2><p>${e(detail.need)}</p></div><p class="job-fixed-payment">Customer pays <output data-job-payment>$100</output></p></div><div class="job-live-costs" ${plan.checked?'inert':''}>${costCategories.map((category,index)=>`<section class="job-live-cost job-live-${category}"><h3>${['Materials','Labor','Overhead'][index]}</h3>${sceneCrop(asset,`${580+index*176} 437 140 88`,detail.costs[index])}<p class="job-cost-description">${detail.costs[index]}<span class="job-caption-min">Minimum $${MINIMUM_JOB_COSTS[category]}</span>${category==='overhead'?'<span>Shared across jobs</span>':''}</p><label for="job-${category}" class="job-live-value"><output data-picture-cost="${category}">${dollars(plan[category])}</output><small>Minimum $${MINIMUM_JOB_COSTS[category]}</small></label><div class="job-cost-tools"><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="-1" ${jobStepDisabled(plan,category,-1)?'disabled':''} aria-label="Decrease ${category} cost">−</button><input id="job-${category}" aria-label="${category} cost in dollars" data-job-cost="${category}" type="number" min="${MINIMUM_JOB_COSTS[category]}" max="100" step="1" inputmode="numeric" value="${Number.isFinite(plan[category])?plan[category]:''}" aria-describedby="job-cost-error"/><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="1" ${jobStepDisabled(plan,category,1)?'disabled':''} aria-label="Increase ${category} cost">+</button></div></section>`).join('')}</div><div class="job-live-remaining"><span>Money left</span><output data-job-remaining>${dollars(totals?.remaining)}</output></div><div class="job-totals job-live-total"><span>Total cost<output data-job-total>${dollars(totals?.total)}</output></span></div><button class="job-live-check mb-button primary" data-action="job-plan-check" ${jobPlanError(plan)?'disabled':''}>Check the Job ▶</button><p id="job-cost-error" role="status">${e(jobPlanError(plan))}</p><div class="job-plan-feedback sr" role="status" tabindex="-1"></div>${plan.checked&&!jobPlanError(plan)?allocationMarkup(plan):''}</div></div></section>`;
}
export function jobFeedback(plan:JobPractice,e:(v:unknown)=>string):string {
 const error=jobPlanError(plan);if(error)return `<p><b>Review your budget.</b> ${e(error)}</p>`;
 const t=jobTotals(plan)!;
 return `<p><b>Your plan fits the $100 practice budget.</b> ${e(customerNeeds[plan.job].value)}</p><p>${t.payment} payment − (${plan.materials} materials + ${plan.labor} labor + ${plan.overhead} overhead) = ${t.remaining} dollars remaining.</p><p>Materials, labor, and overhead each meet their minimum cost.</p><p>${t.remaining===0?'The payment covers exactly the listed costs; nothing remains.':'This is what is left after the listed costs. It is not guaranteed profit; other costs may still need to be considered.'}</p>`;
}
