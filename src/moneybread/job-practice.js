import { jobs } from './simulation.js';
export const customerNeeds = {
    service: { customer: 'A neighbor with yard work to finish', need: 'The yard needs useful work completed.', value: 'Your time provides a useful service for your neighbor.', materials: 'Materials needed for yard work', labor: 'Time spent doing the yard work', overhead: 'Transportation or equipment used across several jobs' },
    tutor: { customer: 'A neighbor who needs help learning', need: 'The neighbor needs schoolwork explained.', value: 'Your skills help someone understand their schoolwork.', materials: 'Learning materials', labor: 'Time spent preparing and explaining', overhead: 'Transportation or equipment shared across tutoring jobs' },
    creator: { customer: 'A customer who needs a product', need: 'The customer needs something useful created.', value: 'Your ideas create a product people need.', materials: 'Supplies used to make the product', labor: 'Time spent designing and making', overhead: 'Equipment or workspace supplies used across several jobs' }
};
export const JOB_PRACTICE_PAYMENT = 100;
export const MINIMUM_JOB_COSTS = Object.freeze({ materials: 25, labor: 40, overhead: 15 });
export const practiceBudget = JOB_PRACTICE_PAYMENT;
export const minimumCosts = MINIMUM_JOB_COSTS;
export const practiceError = 'Enter whole dollars: materials at least $25, labor at least $40, and overhead at least $15.';
export function canCheckJob(plan) { return !jobPlanError(plan); }
const costCategories = Object.keys(MINIMUM_JOB_COSTS);
export function newJobPractice(job) { const j = jobs.find(j => j.id === job) || jobs[0]; return { job: j.id, ...MINIMUM_JOB_COSTS, checked: false, reflection: '' }; }
export function jobTotals(plan) {
    if (!jobs.some(j => j.id === plan.job) || !costCategories.every(key => Number.isSafeInteger(plan[key]) && plan[key] >= MINIMUM_JOB_COSTS[key] && plan[key] <= JOB_PRACTICE_PAYMENT))
        return null;
    const total = plan.materials + plan.labor + plan.overhead;
    return { payment: JOB_PRACTICE_PAYMENT, total, remaining: JOB_PRACTICE_PAYMENT - total };
}
export function jobPlanError(plan) {
    if (!jobs.some(j => j.id === plan.job))
        return 'Choose one of the available practice jobs.';
    for (const category of costCategories) {
        const amount = plan[category], minimum = MINIMUM_JOB_COSTS[category];
        if (!Number.isSafeInteger(amount))
            return 'Enter a whole-number cost in every category.';
        if (amount < minimum)
            return `${category[0].toUpperCase() + category.slice(1)} must be at least $${minimum}.`;
        if (amount > JOB_PRACTICE_PAYMENT)
            return 'No single cost can exceed the $100 practice budget.';
    }
    const totals = jobTotals(plan);
    return totals.remaining < 0 ? `Your plan is $${-totals.remaining} over the $100 budget. Reduce costs above their minimums before checking the job.` : '';
}
export function jobStepDisabled(plan, category, direction) {
    if (direction < 0)
        return Number.isFinite(plan[category]) && plan[category] <= MINIMUM_JOB_COSTS[category];
    const other = costCategories.filter(key => key !== category).reduce((sum, key) => sum + (Number.isFinite(plan[key]) ? Math.max(MINIMUM_JOB_COSTS[key], plan[key]) : MINIMUM_JOB_COSTS[key]), 0);
    return Number.isFinite(plan[category]) && plan[category] >= JOB_PRACTICE_PAYMENT - other;
}
export function stepJobCost(plan, category, direction) {
    const current = Number.isFinite(plan[category]) ? plan[category] : MINIMUM_JOB_COSTS[category];
    if (jobStepDisabled(plan, category, direction))
        return current;
    return Math.max(MINIMUM_JOB_COSTS[category], Math.min(JOB_PRACTICE_PAYMENT, Math.floor(current) + direction));
}
function pictureTools(plan) {
    const t = jobTotals(plan), name = jobs.find(j => j.id === plan.job)?.name || '';
    const step = (category, direction, left) => `<button class="picture-step picture-${category}-${direction}" style="left:${left / 12.8}%;top:78.9%" data-action="job-cost-step" data-job-step="${category}" data-direction="${direction}" ${jobStepDisabled(plan, category, direction) ? 'disabled' : ''} aria-label="${direction > 0 ? 'Increase' : 'Decrease'} ${category} estimate">${direction > 0 ? '+' : '−'}</button>`;
    return `<div class="job-picture-board"><img src="assets/crew/lesson-one-run-the-job.jpg" width="1280" height="720" alt="Supplied Moneybread City Run the Job artwork, with the waterfront, all six characters, materials, labor and overhead tools."><div class="picture-tools"><span class="picture-job-name">${name}</span><output class="picture-payment" data-job-payment>${t?.payment ?? '—'}</output>${['materials', 'labor', 'overhead'].map((category, i) => `${step(category, -1, 577 + i * 176)}<output class="picture-cost-value picture-cost-${category}" data-picture-cost="${category}" style="left:${(591 + i * 176) / 12.8}%;top:71.6%">${Number.isFinite(plan[category]) ? plan[category] : '—'}</output><input class="picture-cost-input" style="left:${(623 + i * 176) / 12.8}%;top:79%" type="number" min="${MINIMUM_JOB_COSTS[category]}" max="${JOB_PRACTICE_PAYMENT}" step="1" inputmode="numeric" data-job-cost="${category}" value="${Number.isFinite(plan[category]) ? plan[category] : ''}" aria-label="${category} practice estimate in bread">${step(category, 1, 689 + i * 176)}`).join('')}<output class="picture-total" data-job-total>${t?.total ?? '—'}</output><output class="picture-remaining" data-job-remaining>${t?.remaining ?? '—'}</output><button class="picture-check" data-action="job-plan-check" ${jobPlanError(plan) ? 'disabled' : ''}>Check the Job ▶</button></div><button class="picture-mobile-tools" data-action="job-tools-open">Use live job tools ↓<small>Calculate your selected job below</small></button></div><p class="picture-caption">Your supplied illustration with live practice tools. Every practice job uses the same $100 budget in simulated dollars. On smaller screens, use the large controls below.</p>`;
}
export function renderJobPractice(plan, guide, e) {
    const job = jobs.find(j => j.id === plan.job) || jobs[0], need = customerNeeds[job.id], totals = jobTotals(plan);
    return `<section class="job-practice" aria-labelledby="job-practice-title"><small>LESSON 1 · EARNING &amp; CREATING VALUE</small><h2 id="job-practice-title">Run the job</h2>${pictureTools(plan)}<p>Identify a customer need. Choose a product or service. Plan what the work requires, then compare payment with the listed costs.</p><div class="job-plan-choices" role="group" aria-label="Choose a practice job">${jobs.map(j => `<button class="mb-button ${plan.job === j.id ? 'selected' : ''}" data-action="job-plan-${j.id}" aria-pressed="${plan.job === j.id}"><b>${j.name}</b><span>${j.skill}</span><small>$100 practice budget · minimum costs apply</small></button>`).join('')}</div><div class="job-customer"><h3>Customer: ${e(need.customer)}</h3><p><b>Need:</b> ${e(need.need)}</p><p><b>Value you create:</b> ${e(need.value)}</p></div><div class="job-guide ${plan.checked ? 'job-checked' : ''}">${guide}<p>What does it take to finish this job? Materials + labor + overhead.</p></div><p id="job-estimate-note"><strong>Practice planning, not a new price list.</strong> The practice customer pays $100. Materials must cost at least $25, labor at least $40, and overhead at least $15. That commits $80 and leaves $20 to budget. You may increase costs, but the total must stay within $100 before you can check the job. These practice minimums do not change saved city-job earnings, wallet balances, or scores.</p><div class="job-cost-grid">${['materials', 'labor', 'overhead'].map(category => `<div class="job-cost-card"><label for="job-${category}">${category === 'materials' ? 'Materials' : category === 'labor' ? 'Labor' : 'Overhead'} <span>($)</span></label><p>${e(need[category])}. Minimum $${MINIMUM_JOB_COSTS[category]}.</p><div class="job-cost-tools"><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="-1" ${jobStepDisabled(plan, category, -1) ? 'disabled' : ''} aria-label="Decrease ${category} estimate">−</button><input id="job-${category}" data-job-cost="${category}" type="number" min="${MINIMUM_JOB_COSTS[category]}" max="${JOB_PRACTICE_PAYMENT}" step="1" inputmode="numeric" value="${Number.isFinite(plan[category]) ? plan[category] : ''}" aria-describedby="job-estimate-note job-cost-error"><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="1" ${jobStepDisabled(plan, category, 1) ? 'disabled' : ''} aria-label="Increase ${category} estimate">+</button></div></div>`).join('')}</div><p>Overhead means shared costs that help the business operate, rather than materials used up on just this job. Do not count the same supply twice.</p><p id="job-cost-error" role="status">${e(jobPlanError(plan))}</p><div class="job-totals" aria-live="polite" aria-atomic="true"><span>Customer payment <output data-job-payment>${totals?.payment ?? '—'}</output><small>simulated dollars</small></span><span>Total listed cost <output data-job-total>${totals?.total ?? '—'}</output><small>dollars</small></span><span>Money remaining <output data-job-remaining>${totals?.remaining ?? '—'}</output><small>dollars</small></span></div><button class="mb-button primary job-check-primary" data-action="job-plan-check" ${jobPlanError(plan) ? 'disabled' : ''}>Check the Job</button><div class="job-plan-feedback" role="status" tabindex="-1">${plan.checked && !jobPlanError(plan) ? jobFeedback(plan, e) : 'Change an estimate, then check what your plan means.'}</div><label for="job-value-reflection">How did your business create value for the customer?</label><textarea id="job-value-reflection" data-job-reflection rows="3" maxlength="600" placeholder="Our customer needed… Our work helped by…">${e(plan.reflection)}</textarea><p>Your note carries into the city reflection, where you can review and save it before continuing. Practice estimates stay on this screen and reset if you reload.</p></section>`;
}
export function jobFeedback(plan, e) {
    const error = jobPlanError(plan);
    if (error)
        return `<p><b>Review your budget.</b> ${e(error)}</p>`;
    const t = jobTotals(plan);
    return `<p><b>Your plan fits the $100 practice budget.</b> ${e(customerNeeds[plan.job].value)}</p><p>${t.payment} payment − (${plan.materials} materials + ${plan.labor} labor + ${plan.overhead} overhead) = ${t.remaining} dollars remaining.</p><p>Materials, labor, and overhead each meet their minimum cost.</p><p>${t.remaining === 0 ? 'The payment covers exactly the listed costs; nothing remains.' : 'This is what is left after the listed costs. It is not guaranteed profit; other costs may still need to be considered.'}</p>`;
}
