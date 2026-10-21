import { lesson } from './lessons.js';
export const districts = [
    { id: 'school', name: 'Money Ops School', role: 'Learn and grow your skills', icon: '▤', color: '#f5c86a' },
    { id: 'homes', name: 'Breadside Homes', role: 'Homes and thoughtful housing plans', icon: '⌂', color: '#ef987f' },
    { id: 'shops', name: 'Market Street', role: 'Products, services and customers', icon: '▥', color: '#a79bea' },
    { id: 'park', name: 'Community Park', role: 'A place to play and help others', icon: '♧', color: '#8fc992' },
    { id: 'transit', name: 'City Transit', role: 'Help people get to work and school', icon: '↔', color: '#77c7d9' },
    { id: 'hospital', name: 'Community Hospital', role: 'Health and protection for neighbors', icon: '+', color: '#eea4bd' },
    { id: 'bank', name: 'Bread Bank', role: 'Savings and investment planning', icon: '▦', color: '#f5cf72' },
    { id: 'studio', name: 'Ideas Studio', role: 'Skills, ideas and new businesses', icon: '✦', color: '#9ac5de' }
];
export const jobs = [
    { id: 'service', name: 'Neighborhood helper', skill: 'Your Time', income: 100, cost: 0, detail: 'Complete a useful service. Earn 100 bread; no supply cost.' },
    { id: 'tutor', name: 'School tutor', skill: 'Your Skills', income: 130, cost: 10, detail: 'Help a neighbor learn. Earn 130 bread; learning materials cost 10.' },
    { id: 'creator', name: 'Studio creator', skill: 'Your Ideas', income: 155, cost: 25, detail: 'Create a product people need. Earn 155 bread; supplies cost 25.' }
];
export const plans = [
    { id: 'save', name: 'Save first', saved: 30, invested: 0, detail: 'Move 30 bread into savings. Keep the rest for city needs. No market exposure.' },
    { id: 'mix', name: 'Spread the investment', saved: 20, invested: 20, detail: 'Save 20. Invest 20 across city shops and transit. This week’s scenario can add 2 or lose 2 bread.' },
    { id: 'focus', name: 'One business project', saved: 10, invested: 40, detail: 'Save 10. Invest 40 in one city shop. This week’s scenario can add 8 or lose 8 bread. More concentration means a larger possible change.' }
];
const integer = (n) => Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) < 1e9;
export function freshCity(legacy = []) {
    return { version: 1, wallet: { available: 0, income: 0, spent: 0, saved: 0, invested: 0, investmentResult: 0 }, weeks: {},
        buildings: Object.fromEntries(districts.map(d => [d.id, d.id === 'school' ? 1 : 0])),
        condition: 60, notice: legacy.length ? 'Your earlier lessons are preserved. New city weeks start with the next unfinished lesson.' : 'Welcome! Start at school. Bread is the game’s name for money.', serial: 0, motion: 'none', legacy: [...legacy] };
}
export function validCity(value) {
    if (!value || typeof value !== 'object')
        return false;
    const s = value, w = s.wallet;
    if (s.version !== 1 || !w || !['available', 'income', 'spent', 'saved', 'invested'].every(k => integer(w[k])) || !Number.isSafeInteger(w.investmentResult))
        return false;
    if (w.available + w.saved + w.invested + w.spent !== w.income + w.investmentResult)
        return false;
    if (!['earn', 'build', 'allocate', 'reflect', 'none'].includes(s.motion) || !integer(s.serial) || !Number.isFinite(s.condition) || s.condition < 0 || s.condition > 100 || typeof s.notice !== 'string' || !s.buildings || !s.weeks || !Array.isArray(s.legacy) || s.legacy.some(id => !integer(id) || id < 1 || id > 32))
        return false;
    if (!districts.every(d => integer(s.buildings[d.id])) || Object.keys(s.buildings).some(key => !districts.some(d => d.id === key)) || new Set(s.legacy).size !== s.legacy.length)
        return false;
    return Object.entries(s.weeks).every(([id, r]) => Number.isInteger(Number(id)) && Number(id) >= 1 && Number(id) <= 32 && r && typeof r.lessonDone === 'boolean' && integer(r.earned) && integer(r.principal) && integer(r.projectCost) && typeof r.settled === 'boolean' && (!r.reflection || typeof r.reflection === 'string' && r.lessonDone && !!r.job && !!r.allocation && !!r.project && r.settled) && (!r.project || districts.some(d => d.id === r.project)));
}
export function attachCity(p) {
    if (p.mode === 'arcade')
        return p;
    if (p.moneybread) {
        if (validCity(p.moneybread))
            return p;
        throw Error('City save could not be read. Your Career lessons are preserved; export your save before resetting the city.');
    }
    // Old completed lessons stay complete, without receiving duplicate bread.
    return { ...p, moneybread: freshCity(p.completed) };
}
export function currentLevel(s) { return Array.from({ length: 32 }, (_, i) => i + 1).find(id => !s.legacy.includes(id) && !s.weeks[id]?.reflection) || 33; }
export function canOpen(s, id) { return Number.isInteger(id) && id >= 1 && id <= 32 && id <= currentLevel(s); }
export function week(s, id = currentLevel(s)) {
    return s.weeks[id] || { lessonDone: false, earned: 0, principal: 0, projectCost: 0, settled: false };
}
export function noteLesson(p, id) {
    if (!p.moneybread || !p.completed.includes(id) || p.active || id !== currentLevel(p.moneybread))
        return p;
    const s = structuredClone(p.moneybread), r = week(s, id);
    r.lessonDone = true;
    const records = p.decisions;
    r.lessonFeedback = (Array.isArray(records?.[id]) ? records[id] : []).map(d => [d.label, d.feedback].filter(Boolean).join(': ')).join(' ');
    s.weeks[id] = r;
    s.notice = `Lesson ${id} activity complete. Choose work, earn bread, and apply ${lesson(id).terms[0]} in Moneybread City.`;
    return { ...p, moneybread: s };
}
export function outcome(id, plan) {
    if (plan === 'save')
        return 0;
    const sign = id % 3 === 0 ? -1 : 1;
    return sign * (plan === 'mix' ? 2 : 8);
}
export function cityCondition(s) { return s.condition >= 80 ? 'Thriving' : s.condition >= 55 ? 'Finding its rhythm' : 'Services need support'; }
export function applyCity(s, action, completed) {
    if (!validCity(s))
        throw Error('City save needs review before continuing.');
    const out = structuredClone(s), id = currentLevel(s), r = week(out, id), w = out.wallet;
    if (action.type === 'reset') {
        // Rebuilding never erases completed lessons or reflections. No free bread.
        out.buildings = freshCity().buildings;
        out.lastProject = undefined;
        out.condition = 60;
        out.notice = 'City map rebuilt. Your wallet, lesson records, and weekly progress are preserved.';
        out.motion = 'build';
        out.serial++;
        return out;
    }
    if (id > 32)
        throw Error('All 32 levels are complete. Revisit a lesson to practice without changing your city wallet.');
    if (!completed.includes(id) || !r.lessonDone)
        throw Error('Complete this week’s original lesson activity at school first.');
    if (action.type === 'work') {
        if (r.job)
            throw Error('This week’s work is already paid. Next week brings a new job.');
        const j = jobs.find(j => j.id === action.job);
        if (!j)
            throw Error('Choose one of the available jobs.');
        r.job = j.id;
        r.earned = j.income - j.cost;
        w.income += j.income;
        w.spent += j.cost;
        w.available += r.earned;
        out.notice = `${j.name}: ${j.income} bread earned − ${j.cost} supplies = ${r.earned} bread available. You provided value through ${j.skill.toLowerCase()}.`;
        out.motion = 'earn';
    }
    else if (action.type === 'allocate') {
        if (!r.job || r.allocation)
            throw Error('Earn bread first. Each week has one allocation plan.');
        if (id < 5 && action.plan !== 'save')
            throw Error('Investment plans unlock with Lesson 5: Investing & Growing Your Money.');
        const plan = plans.find(p => p.id === action.plan);
        if (!plan || w.available < plan.saved + plan.invested)
            throw Error('This plan needs more available bread.');
        w.available -= plan.saved + plan.invested;
        w.saved += plan.saved;
        w.invested += plan.invested;
        r.allocation = plan.id;
        r.investment = plan.id;
        r.principal = plan.invested;
        out.notice = `${plan.saved} bread moved to savings and ${plan.invested} to investments. Available bread pays for the city. Investment result this week: ${outcome(id, plan.id) >= 0 ? '+' : ''}${outcome(id, plan.id)} bread at reflection. This is a fixed learning scenario, not a promise about real investments.`;
        out.motion = 'allocate';
    }
    else if (action.type === 'withdraw') {
        if (!r.allocation || w.saved < 10)
            throw Error('You need at least 10 saved bread to move a bundle.');
        w.saved -= 10;
        w.available += 10;
        out.notice = 'Moved 10 bread from savings to available. You can cover city costs, but your safety cushion is smaller.';
        out.motion = 'allocate';
    }
    else if (action.type === 'build') {
        if (!r.allocation || r.project)
            throw Error('Make a money plan first. Each week funds one city action.');
        const d = districts.find(d => d.id === action.district);
        if (!d)
            throw Error('Choose a city district.');
        const source = lesson(id), cost = action.district === source.district ? 40 : 50;
        if (w.available < cost)
            throw Error(`This project needs ${cost} available bread. Move a savings bundle or choose the 40-bread lesson project.`);
        w.available -= cost;
        w.spent += cost;
        out.buildings[d.id]++;
        out.lastProject = d.id;
        r.project = d.id;
        r.projectCost = cost;
        out.condition = Math.min(100, out.condition + 7);
        out.notice = `${d.name} improved for ${cost} bread. Your ${source.terms[0]} practice supports the city. Keep 10 available bread for this week’s service costs, or learn the trade-off at reflection.`;
        out.motion = 'build';
    }
    else if (action.type === 'reflect') {
        if (!r.project || !r.allocation || r.reflection)
            throw Error('Complete your lesson, work, money plan and city project first.');
        if (!lesson(id).terms.includes(action.term) || action.text.trim().length < 12 || action.text.length > 600)
            throw Error('Choose a word from this lesson and write at least 12 characters about your choice (up to 600).');
        const result = outcome(id, r.allocation);
        w.invested += result;
        w.investmentResult += result;
        r.settled = true;
        let service = '';
        if (w.available >= 10) {
            w.available -= 10;
            w.spent += 10;
            out.condition = Math.min(100, out.condition + 3);
            service = '10 bread funded city services.';
        }
        else {
            out.condition = Math.max(0, out.condition - 12);
            service = 'Fewer than 10 available bread: city services slowed. Next week, keep a cushion or move savings before reflecting.';
        }
        r.term = action.term;
        r.reflection = action.text.trim();
        out.notice = `Week ${id} saved. ${service} Investments changed by ${result >= 0 ? '+' : ''}${result} bread in this fixed scenario. ${id < 32 ? `Level ${id + 1} is now unlocked.` : 'All 32 Moneybread City levels are complete!'}`;
        out.motion = 'reflect';
    }
    out.weeks[id] = r;
    out.serial++;
    if (!validCity(out))
        throw Error('The city transaction could not be balanced. Your previous save is safe.');
    return out;
}
