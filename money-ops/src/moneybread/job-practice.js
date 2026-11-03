import { jobScenes, jobSceneArt } from './job-scenes.js';
import { lesson } from './lessons.js';
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
export function jobMoney(value) { return value === undefined || !Number.isFinite(value) ? '—' : value < 0 ? `-$${-value}` : `$${value}`; }
export function jobReady(plan) { return !jobPlanError(plan) && costCategories.every(category => plan.packed?.includes(category)); }
export function renderJobIntro(step, e) {
    const source = lesson(1), index = Math.max(0, Math.min(3, step));
    const beats = [
        { title: 'A customer needs help!', text: source.brief, character: 'jordan', name: 'Kanyon' },
        { title: 'Create value for your customer.', text: source.coreIdea, character: 'maya', name: 'Maya' },
        { title: 'What does the work need?', text: 'Materials are used on the job. Labor is our time and effort. Overhead includes tools or equipment shared across jobs.', character: 'sofia', name: 'Sofia' },
        { title: 'Your turn: run the job!', text: 'The customer pays $100. Plan at least $25 for materials, $40 for labor, and $15 for overhead. That leaves $20 to plan. Build your job kit, then check your job.', character: 'ruby', name: 'Ruby' }
    ], beat = beats[index];
    return `<section class="job-opening-comic" aria-labelledby="job-opening-title"><small>LESSON 1 · ${e(source.title)}</small><div class="job-comic-heading"><h1 id="job-opening-title">Why run the job?</h1><span role="status">Panel ${index + 1} of 4</span></div><article class="job-comic-panel" data-job-intro-panel tabindex="-1" aria-labelledby="job-opening-caption"><div class="job-comic-cast"><img src="assets/cast/${beat.character}.png?v=45.6" alt="${beat.name}"/><b>${beat.name}</b></div><div class="job-comic-story"><h2>${e(beat.title)}</h2><p id="job-opening-caption">${e(beat.text)}</p>${index === 0 ? jobSceneArt('service') : index === 1 ? `<div class="job-comic-examples">${['service', 'tutor', 'creator'].map(job => `<div>${jobSceneArt(job)}<b>${jobScenes[job].title}</b></div>`).join('')}</div>` : index === 2 ? '<div class="job-comic-concepts"><span>Materials<br><b>What we use</b></span><i>+</i><span>Labor<br><b>Our work</b></span><i>+</i><span>Overhead<br><b>Shared costs</b></span></div>' : '<div class="job-comic-equation">$100 − $80 = <b>$20 left to plan</b></div>'}</div></article><nav class="job-comic-controls" aria-label="Run the Job comic"><button class="mb-button" data-action="job-intro-back" ${index === 0 ? 'disabled' : ''}>← Back</button><button class="mb-button primary" data-action="job-intro-next">${index === 3 ? 'Choose my job →' : 'Next panel →'}</button><button class="mb-button" data-action="job-intro-skip">Go to the job</button></nav></section>`;
}
export function renderJobPractice(plan, _guide, e) {
    const job = jobs.find(j => j.id === plan.job) || jobs[0], scene = jobScenes[job.id], totals = jobTotals(plan), packed = plan.packed || [];
    const guideText = plan.checked ? 'You planned work that helps a customer!' : plan.lastPacked === 'materials' ? `Materials are used for this job: ${scene.items[0].toLowerCase()}.` : plan.lastPacked === 'labor' ? `Labor is our time and effort: ${scene.items[1].toLowerCase()}.` : plan.lastPacked === 'overhead' ? `Overhead is shared across jobs: ${scene.items[2].toLowerCase()}. We plan this job’s share here.` : 'Choose each part of your plan. Use + and − to plan the cost.';
    return `<section class="job-practice job-game" aria-labelledby="job-practice-title"><div class="job-game-heading"><div><small>LESSON 1 · EARNING &amp; CREATING VALUE</small><h1 id="job-practice-title">Run the job</h1></div><button class="mb-button" data-action="job-intro-replay">Replay comic ↻</button></div><div class="job-play-board" tabindex="-1"><img class="job-board-backdrop" src="assets/crew/lesson-one-run-the-job.jpg" width="1280" height="720" alt="Moneybread City waterfront and the six original characters."/><aside class="job-board-guide ${plan.checked ? 'job-checked' : ''}"><img src="assets/cast/${scene.mentor}.png?v=45.6" alt="${scene.name}, your ${scene.title} guide"/><div aria-live="polite" aria-atomic="true"><b>${scene.name}</b><p>${e(guideText)}</p></div></aside><div class="job-board-panel"><div class="job-plan-choices" role="group" aria-label="Choose your job">${jobs.map(j => `<button class="mb-button ${job.id === j.id ? 'selected' : ''}" data-action="job-plan-${j.id}" aria-pressed="${job.id === j.id}">${jobScenes[j.id].title}</button>`).join('')}</div><div class="job-customer"><div class="job-customer-picture">${jobSceneArt(job.id)}</div><div><h2>${scene.title}</h2><p><b>Your customer:</b> ${e(scene.need)}</p><small>${e(scene.value)}</small></div><div class="job-customer-payment">CUSTOMER PAYS<output data-job-payment>$100</output></div></div><p class="job-game-instruction">Build the job plan <b data-job-packed role="status">${packed.length} / 3 ready</b></p><div class="job-cost-grid">${costCategories.map((category, index) => `<article class="job-cost-card ${packed.includes(category) ? 'is-packed' : ''}" data-job-card="${category}"><h3>${category === 'materials' ? 'Materials' : category === 'labor' ? 'Labor' : 'Overhead'}</h3>${jobSceneArt(job.id, index)}<p>${scene.items[index]}</p><button class="mb-button job-pack" data-action="job-plan-pack-${category}" aria-pressed="${packed.includes(category)}">${packed.includes(category) ? '✓ Ready' : scene.tasks[index]}</button><small>Minimum $${MINIMUM_JOB_COSTS[category]}</small><div class="job-cost-tools"><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="-1" ${jobStepDisabled(plan, category, -1) ? 'disabled' : ''} aria-label="Decrease ${category} cost">−</button><label class="sr" for="job-${category}">${category} cost in dollars</label><input id="job-${category}" data-job-cost="${category}" type="number" min="${MINIMUM_JOB_COSTS[category]}" max="100" step="1" inputmode="numeric" value="${Number.isFinite(plan[category]) ? plan[category] : ''}" aria-describedby="job-cost-error"/><button class="mb-button" data-action="job-cost-step" data-job-step="${category}" data-direction="1" ${jobStepDisabled(plan, category, 1) ? 'disabled' : ''} aria-label="Increase ${category} cost">+</button></div></article>`).join('<span class="job-flow-arrow" aria-hidden="true">+</span>')}</div><p id="job-cost-error" role="status">${e(jobPlanError(plan))}</p><div class="job-totals" aria-live="polite" aria-atomic="true"><span>Total cost<output data-job-total>${jobMoney(totals?.total)}</output></span><i class="job-flow-arrow" aria-hidden="true">→</i><span>Money remaining<output data-job-remaining>${jobMoney(totals?.remaining)}</output></span><button class="mb-button primary job-check-primary" data-action="job-plan-check" ${jobReady(plan) ? '' : 'disabled'}>Check the Job ▶</button></div><div class="job-plan-feedback" role="status" tabindex="-1">${plan.checked && jobReady(plan) ? jobFeedback(plan, e) : 'The customer pays $100. Choose all 3 parts and keep the total within $100.'}</div>${plan.checked ? `<label class="job-reflection-label" for="job-value-reflection">How did your work help this customer?</label><textarea id="job-value-reflection" data-job-reflection rows="2" maxlength="600" placeholder="Our work helped by…">${e(plan.reflection)}</textarea>` : ''}<small class="job-money-note">Classroom dollars. Your saved city money and score stay unchanged.</small></div></div></section>`;
}
export function jobFeedback(plan, e) {
    const error = jobPlanError(plan);
    if (error)
        return `<p><b>Review your budget.</b> ${e(error)}</p>`;
    const t = jobTotals(plan);
    return `<p><b>Job plan ready!</b> ${e(jobScenes[plan.job].value)} $100 − $${t.total} listed costs = <b>$${t.remaining} remaining.</b> ${t.remaining === 0 ? 'You used the whole payment; nothing remains.' : 'Money remaining is not guaranteed profit.'}</p>`;
}
