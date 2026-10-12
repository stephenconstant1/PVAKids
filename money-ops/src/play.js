import {missions} from './content.js';
import {choose,netWorth,rank,resolve} from './engine.js';
import {effectLabels} from './finance.js';
import {character,portrait,castPortraits} from './characters.js';
const money=n=>'$'+n.toLocaleString('en-US');
export const shapes=['star','circle','heart'];
const symbols={star:'★',circle:'●',heart:'♥'};
const artTools=['PAINT','CRAYONS','MARKERS'];
const svg=(body,cls='')=>`<svg class="play-art ${cls}" viewBox="0 0 300 190" aria-hidden="true">${body}</svg>`;
function supplyIcon(i){
 if(i===0)return '<svg class="art-supply-icon" viewBox="0 0 90 65" aria-hidden="true"><ellipse cx="35" cy="38" rx="27" ry="20" fill="#ffe7aa" stroke="#5c553e" stroke-width="3"/><circle cx="25" cy="32" r="5" fill="#ef635b"/><circle cx="42" cy="27" r="5" fill="#4bb6df"/><circle cx="48" cy="43" r="5" fill="#70b85a"/><path d="m62 7 9 8-32 34-9 3 3-10z" fill="#9c663f" stroke="#493b30" stroke-width="3"/><path d="m62 7 9 8 8-10-9-4z" fill="#82c9e9"/></svg>';
 if(i===1)return '<svg class="art-supply-icon" viewBox="0 0 90 65" aria-hidden="true"><g stroke="#554433" stroke-width="2"><path d="m18 53 8-42 10 2-8 42z" fill="#ef635b"/><path d="m37 54 5-44 10 1-5 44z" fill="#f0c84b"/><path d="m56 54 2-43 10 1-2 43z" fill="#5a9de1"/></g><path d="m24 11 7-8 5 10m6-3 6-8 4 9m6 0 6-8 4 9" fill="#fff0c4" stroke="#554433" stroke-width="2"/></svg>';
 return '<svg class="art-supply-icon" viewBox="0 0 90 65" aria-hidden="true"><g stroke="#3f4a49" stroke-width="3"><path d="M15 47 50 12l10 10-35 35z" fill="#73c7e9"/><path d="m50 12 9-8 10 10-9 8z" fill="#243d4a"/><path d="M39 52 66 25l10 10-27 27z" fill="#ec6f8d"/><path d="m66 25 8-8 10 10-8 8z" fill="#243d4a"/></g></svg>';
}
function createdArt(i){
 if(i===0)return svg('<rect x="45" y="24" width="210" height="142" rx="10" fill="#fff2c8" stroke="#78583d" stroke-width="7"/><circle cx="194" cy="65" r="25" fill="#ffd34d"/><path d="M48 150 108 92l39 35 30-25 75 48" fill="#79b95d"/><path d="m65 37 17 12m-9-19 3 23" stroke="#6fc1e8" stroke-width="7"/>','paint-picture');
 if(i===1)return svg('<rect x="45" y="24" width="210" height="142" rx="10" fill="#fff8e4" stroke="#78583d" stroke-width="7"/><path d="M74 143a77 77 0 0 1 154 0" fill="none" stroke="#ef635b" stroke-width="14"/><path d="M88 143a63 63 0 0 1 126 0" fill="none" stroke="#f0c84b" stroke-width="14"/><path d="M102 143a49 49 0 0 1 98 0" fill="none" stroke="#62b96b" stroke-width="14"/><path d="M116 143a35 35 0 0 1 70 0" fill="none" stroke="#5a9de1" stroke-width="14"/>','crayon-picture');
 return svg('<rect x="45" y="24" width="210" height="142" rx="10" fill="#eaf8ff" stroke="#436378" stroke-width="7"/><path d="m150 42 13 28 31 3-23 21 7 31-28-16-28 16 7-31-23-21 31-3z" fill="#ffd34d" stroke="#e56576" stroke-width="7"/><path d="M77 145h146" stroke="#5a9de1" stroke-width="10"/><circle cx="79" cy="53" r="9" fill="#70b85a"/><circle cx="220" cy="54" r="9" fill="#ec6f8d"/>','marker-picture');
}
export function art(kind){
 if(kind==='value')return svg('<circle cx="65" cy="55" r="35" fill="#ffe17c"/><path d="M65 33v44m-16-22h32" stroke="#47604b" stroke-width="8"/><path d="M118 34h62v70h-62z" fill="#edf4dc" stroke="#567563" stroke-width="6"/><path d="m149 34v70m-23-49h46m-46 19h46" stroke="#81a172" stroke-width="4"/><path d="m225 27 9 20 22 2-17 15 5 22-19-12-20 12 6-22-17-15 22-2z" fill="#ed8da0"/><path d="M34 139h232" stroke="#d9f577" stroke-width="10"/><circle cx="65" cy="139" r="17" fill="#ffe17c"/><circle cx="149" cy="139" r="17" fill="#9bd2e4"/><circle cx="234" cy="139" r="17" fill="#ed8da0"/>','value-art');
 if(kind==='time')return svg('<path d="M0 150Q150 100 300 150v40H0" fill="#385e42"/><path d="M205 137V50m-28 20 28-37 28 37" fill="none" stroke="#f1c992" stroke-width="9"/><path d="M175 49q30-54 60 0q15 34-30 31q-45 3-30-31" fill="#88b65b"/><g class="leaf-drift" fill="#d9f577"><path d="M45 134q30-30 38 0q-20 26-38 0"/><path d="M110 151q30-30 38 0q-20 26-38 0"/></g><path d="M90 25l62 122m-15-16 35-17m-37 12 11 21m0-25 11 21m0-26 11 21" stroke="#d6e4bb" stroke-width="5"/>');
 if(kind==='skill')return svg('<path d="M30 128h240v13H30zM48 141v40m204-40v40" stroke="#c5cdb3" stroke-width="8"/><path d="M80 38q35-17 70 0q35-17 70 0v85q-35-17-70 0q-35-17-70 0z" fill="#e2eccd"/><path d="M150 38v85" stroke="#74915d" stroke-width="3"/><g class="book-spark" fill="#547044"><circle cx="115" cy="65" r="9"/><path d="M102 91h26v6h-26M177 64h24v6h-24M186 55h6v24h-6M175 93h28v6h-28"/></g>');
 if(kind==='product')return svg('<path d="M65 162 140 19l85 143M97 101h93" stroke="#c7aa7d" stroke-width="8" fill="none"/><path d="M89 40h122v105H89z" fill="#e6ecd5"/><g class="art-stamp"><circle cx="173" cy="70" r="16" fill="#f2bd72"/><path d="m99 127 35-40 22 23 16-13 29 30" fill="#689c6a"/></g><path d="M243 63l-22 77" stroke="#b4d3ca" stroke-width="7"/>');
 if(kind==='car')return svg('<path d="m46 112 31-48h126l38 48 24 9v32H30v-32z" fill="#91b8a3"/><path d="m86 73-20 35h67V73zm57 0v35h76l-26-35z" fill="#1c3932"/><circle cx="80" cy="151" r="22" fill="#192822"/><circle cx="220" cy="151" r="22" fill="#192822"/><g class="car-trouble" stroke="#f5b78a" stroke-width="5" fill="none"><path d="m258 91 8-15-11-15 11-15"/><path d="m25 90-8-15 11-15-11-15"/></g>');
 return svg('<path d="M81 75h138v93H81z" fill="#355b46" stroke="#b5d57e" stroke-width="4"/><path d="M68 50h164v28H68z" fill="#b5d57e"/><path d="M125 48V30h50v18" fill="none" stroke="#b5d57e" stroke-width="6"/><g class="coin-bob"><circle cx="150" cy="118" r="29" fill="#d9f577"/><path d="M150 97v42m14-31c-18-18-39 3-14 10s1 28-14 8" fill="none" stroke="#405534" stroke-width="4"/></g>');
}
export function playAction(p,action){
 const a=p.active;if(!a||a.step!=='choice')return null;
 if(action.startsWith('job-')){const project=action.slice(4);if(!missions[0].choices.some(c=>c.id===project)||a.id!==1)return null;return {...p,active:{...a,project,workDone:[],hint:''}};}
 if(action==='change-job'&&a.id===1)return {...p,active:{...a,project:null,workDone:[],hint:''}};
 if(action.startsWith('work-')&&a.id===1&&a.project){const value=Number(action.slice(5)),done=a.workDone||[];if(done.length>=3)return null;
  if(a.project==='skill'){if(![0,1,2].includes(value)||done.includes(value))return {...p,active:{...a,hint:'Try another picture!'}};}
  else if(![0,1,2].includes(value)||done.includes(value))return null;
  const workDone=[...done,value];
  const hint=a.project==='time'?`You helped! ${workDone.length} of 3.`:a.project==='skill'?`You shared what you know! ${workDone.length} of 3.`:`${artTools[value]} picture done! ${workDone.length} of 3.`;
  const next={...p,active:{...a,workDone,hint}};return workDone.length===3?choose(next,a.project):next;
 }
 if(action.startsWith('stream-')&&a.id===2){const value=Number(action.slice(7)),done=a.streamDone||[];if(![0,1,2].includes(value)||done.includes(value))return {...p,active:{...a,hint:'Try a different money maker!'}};const streamDone=[...done,value],next={...p,active:{...a,streamDone,hint:''}};return streamDone.length===3?choose(next,'streams'):next;}
 if(action.startsWith('save-')&&[2,3].includes(a.id)&&a.jobBanked){const n=Number(action.slice(5));if(!missions.find(m=>m.id===3).savings.includes(n)||1750+n>2500)return null;return {...p,active:{...a,planned:n,invested:n===0?0:a.invested,savedCoins:n===0?[]:a.savedCoins}};}
 if(action==='pack-budget'&&[2,3].includes(a.id)&&a.jobBanked)return choose(p,a.id===3?{saved:a.planned??0,invested:a.invested??0}:String(a.planned??0));
 if(action.startsWith('map-')&&a.id===4){const value=Number(action.slice(4)),done=a.mapDone||[];if(![0,1,2,3,4].includes(value)||done.includes(value))return null;const mapDone=[...done,value],next={...p,active:{...a,mapDone,hint:''}};return mapDone.length===5?choose(next,'budget'):next;}
 return null;
}
function coins(count=7){return `<div class="flying-coins" aria-hidden="true">${Array.from({length:count},(_,i)=>`<i style="--i:${i}">$</i>`).join('')}</div>`;}
function sparkles(count=8){return `<div class="action-sparkles" aria-hidden="true">${Array.from({length:count},(_,i)=>`<i style="--i:${i}">★</i>`).join('')}</div>`;}
const repairTools=[['wrench','Wrench','M7 20 17 10a6 6 0 0 0-7-7L5 8a6 6 0 0 0 7 7L2 25'],['wheel','Wheel','M15 4a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8'],['bolt','Power','m16 2-8 13h7l-2 11 9-15h-7z']];
function toolIcon(path){return `<svg viewBox="0 0 30 30" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function buddy(cls=''){return `<div class="journey-buddy ${cls}" aria-hidden="true"><span>●‿●</span><i></i></div>`;}
function storyRail(a){
 const current=a.id===1?(a.step==='debrief'?1:0):a.id===2?2:a.id===3?3:4;
 const steps=[['♥','VALUE'],['$','EARN'],['✦','BUILD'],['◈','SAVE'],['⌁','PLAN']];
 return `<div class="story-rail" aria-label="Money adventure: create value, earn, build income, save, plan">${steps.map(([icon,label],i)=>`<div class="story-node ${i<current?'done':i===current?'current':''}" ${i===current?'aria-current="step"':''}><span aria-hidden="true">${i<current?'✓':icon}</span><b>${label}</b></div>${i<steps.length-1?'<i aria-hidden="true"></i>':''}`).join('')}</div>`;
}
function jar(label,amount,kind,fill){return `<div class="money-jar ${kind}"><span>${label}</span><div class="jar"><div class="jar-fill" style="--fill:${fill}%"></div><b>${money(amount)}</b></div></div>`;}
function frameRead(a){
 if(a.id!==1)return '';
 if(['brief','learn'].includes(a.step))return 'Week one. Earning and creating value. Use your time, your skills, or your ideas to help someone and earn money.';
 if(a.step==='choice'&&!a.project)return 'Choose one: your time, your skills, or your ideas.';
 if(a.step==='choice'&&a.project==='time')return 'Use your time. Put the leaves in the basket.';
 if(a.step==='choice'&&a.project==='skill')return 'Use your skills. Help a friend match the pictures.';
 if(a.step==='choice'&&a.project==='product')return 'Use your ideas. Match paint, crayons, and markers to make three pictures.';
 if(a.step==='debrief'){const earned=(a.choice?.gross??0)-(a.choice?.cost??0);return `You provided value. Someone provided money. You earned ${money(earned)}.`;}
 return '';
}

function effectValue(key,value){
 const sign=value>0?'+':'';
 return key==='creditScore'?`${sign}${value}`:`${sign}${money(value)}`;
}

function effectChips(record){
 const entries=Object.entries(record?.effects||{}).filter(([,value])=>value);
 const betterWhenLower=new Set(['debt','loans','monthlyExpenses','insuranceCosts']);
 return entries.length?`<div class="effect-chips">${entries.map(([key,value])=>{const positive=betterWhenLower.has(key)?value<0:value>0;return `<span class="${positive?'up':'down'}"><small>${effectLabels[key]||key}</small><b>${effectValue(key,value)}</b></span>`;}).join('')}</div>`:'<p class="muted">Your financial totals stay steady.</p>';
}

function dialoguePanel(lines=[]){
 return `<div class="character-dialogue">${lines.map((line,i)=>{const c=character(line.speaker);return `<article class="dialogue-card ${i%2?'reverse':''}">${portrait(line.speaker)}<div><b>${c.name}</b><small>${c.role}</small><p>${line.text}</p></div></article>`;}).join('')}</div>`;
}

function decisionCards(group){
 return `<div class="decision-grid">${group.options.map(option=>`<button class="decision-card" data-action="choose-${option.id}"><span class="decision-icon" aria-hidden="true">${option.icon}</span><strong>${option.label}</strong><p>${option.detail}</p><small>MAKE THIS MOVE →</small></button>`).join('')}</div>`;
}

function missionWallet(wallet){
 const invested=wallet.investments+wallet.stocks+wallet.etfs;
 return `<div class="mission-wallet"><span>Cash<b>${money(wallet.cash+wallet.checking)}</b></span><span>Ready funds<b>${money(wallet.savings+wallet.emergencyFund)}</b></span><span>Invested<b>${money(invested)}</b></span><span>Debt<b>${money(wallet.debt+wallet.loans)}</b></span><span>Net worth<b>${money(netWorth(wallet))}</b></span></div>`;
}

function finalReport(wallet,p){
 const invested=wallet.investments+wallet.stocks+wallet.etfs,owned=wallet.assets+wallet.otherAssets+wallet.property;
 const rows=[['TOTAL INCOME',wallet.totalIncome],['TOTAL SAVINGS',wallet.savings+wallet.emergencyFund],['INVESTMENT VALUE',invested],['BUSINESS VALUE',wallet.businessValue],['PROPERTY / ASSETS',owned],['TOTAL DEBT',wallet.debt+wallet.loans],['TAXES PAID',wallet.taxes],['GIVING / IMPACT',wallet.giving]];
 const projectedXp=p.xp+(p.active?.practice?0:p.active?.result?.xp||0);
 const achievements=new Set([...(p.badges||[]),'freedom']),medals=Object.values(p.missionMedals||{}),currentMedal=missionMedal(p.active?.decisions);
 medals.push(currentMedal);
 return `<div class="final-report"><div class="final-seal">★</div><p class="eyebrow">FINANCIAL FREEDOM: MONEY OPS</p><h1>MISSION COMPLETE</h1><div class="final-grid">${rows.map(([label,value])=>`<span><small>${label}</small><b>${money(value)}</b></span>`).join('')}<span><small>CREDIT SCORE</small><b>${wallet.creditScore}</b></span><span><small>ACHIEVEMENTS</small><b>${achievements.size}</b></span><span><small>MISSION MEDALS</small><b>${medals.filter(medal=>medal==='gold').length}G · ${medals.filter(medal=>medal==='silver').length}S · ${medals.filter(medal=>medal==='bronze').length}B</b></span><span class="final-worth"><small>FINAL NET WORTH</small><b>${money(netWorth(wallet))}</b></span></div><div class="final-rank"><small>FINANCIAL FREEDOM RANK</small><strong>${rank(projectedXp)}</strong><span>${projectedXp.toLocaleString('en-US')} XP</span></div></div>`;
}

function missionMedal(decisions=[]){
 const scores=decisions.map(decision=>decision.quality).filter(Number.isFinite),average=scores.length?scores.reduce((sum,score)=>sum+score,0)/scores.length:2;
 return average>=2.5?'gold':average>=1.5?'silver':'bronze';
}

function missionMechanic(m,a){
 const wallet=a.wallet;
 if(m.id===12){
  const principal=Math.max(100,wallet.investments+wallet.stocks+wallet.etfs||100),years=[1,5,10,20];
  return `<div class="mission-mechanic growth-machine"><div><small>COMPOUND INTEREST TIME MACHINE</small><strong>${money(principal)} starting amount</strong></div><div class="growth-bars">${years.map(year=>{const value=Math.round(principal*(1.07**year));return `<span style="--growth:${Math.min(100,25+year*3)}%"><i></i><b>${year} yr</b><em>${money(value)}</em></span>`;}).join('')}</div><p>Illustration uses a simulated 7% annual rate. Returns are not guaranteed.</p></div>`;
 }
 if(m.id===15)return `<div class="mission-mechanic market-board"><small>SIMULATED MARKET</small><span><b>BIDS</b><i>$24</i><i>$25</i><i>$26</i></span><strong>BUYERS ↔ SELLERS</strong><span><b>OFFERS</b><i>$27</i><i>$28</i><i>$29</i></span><p>More willing buyers can push a price up. More willing sellers can pull it down.</p></div>`;
 if(m.id===20)return `<div class="mission-mechanic credit-meter"><small>DYNAMIC CREDIT SCORE</small><strong>${wallet.creditScore}</strong><div><i style="width:${Math.max(0,Math.min(100,(wallet.creditScore-300)/5.5))}%"></i></div><p>Payment history, credit usage, account age, and new credit can affect this simulated score.</p></div>`;
 if(m.id===21)return `<div class="mission-mechanic payoff-board"><small>DEBT PAYOFF LAB</small><strong>${money(wallet.debt+wallet.loans)} owed</strong><div><span>MINIMUM PAYMENT<em>More interest over time</em></span><span>EXTRA PAYMENT<em>Less interest over time</em></span></div></div>`;
 if(m.id===23)return `<div class="mission-mechanic pay-stub"><small>PAY STUB</small><div><span>GROSS PAY<b>${money(Math.max(400,wallet.monthlyIncome))}</b></span><i>−</i><span>DEDUCTIONS<b>Taxes + benefits</b></span><i>=</i><span>NET PAY<b>Take-home pay</b></span></div></div>`;
 if(m.id===25)return `<div class="mission-mechanic profit-formula"><small>BUSINESS CONTROL PANEL</small><div><span>REVENUE</span><i>−</i><span>EXPENSES</span><i>=</i><strong>PROFIT</strong></div><p>Price × units sold creates revenue. Fixed and variable expenses reduce profit.</p></div>`;
 if(m.id===27)return `<div class="mission-mechanic property-board"><small>PROPERTY ANALYSIS</small><div><span>Rental income<b>+</b></span><span>Mortgage<b>−</b></span><span>Taxes + repairs<b>−</b></span><strong>CASH FLOW</strong></div><p>A property can gain equity and still have negative monthly cash flow.</p></div>`;
 if(m.id===30||m.id===31)return `<div class="mission-mechanic freedom-plan"><small>${m.id===30?'FUTURE DESIGN BOARD':'YOUR FINANCIAL FREEDOM PLAN'}</small><div>${['INCOME','BUDGET','SAVE','PROTECT','INVEST','GIVE'].map((label,i)=>`<span class="${i<(m.id===30?3:6)?'online':''}">${label}</span>`).join('')}</div><p>Build a future that matches your priorities and can adapt when life changes.</p></div>`;
 const stats=[['NET WORTH',netWorth(wallet)],['MONTHLY INCOME',wallet.monthlyIncome],['READY SAVINGS',wallet.savings+wallet.emergencyFund]];
 return `<div class="mission-mechanic system-board"><small>${m.location} · LIVE FINANCIAL SYSTEM</small><div>${stats.map(([label,value])=>`<span><b>${money(value)}</b><em>${label}</em></span>`).join('')}</div><p>Your earlier choices travel with you. This decision updates the same financial life.</p></div>`;
}

function advancedVisual(p,a,m,button){
 const phase=a.step==='brief'?'BRIEFING':a.step==='choice'?'DECISION':a.step==='event'?'CHALLENGE':'DEBRIEF';
 const phaseRail=`<div class="advanced-phase" aria-label="Mission progress"><span class="done">BRIEF</span><i></i><span class="${['choice','event','debrief'].includes(a.step)?'done':''}">DECIDE</span><i></i><span class="${['event','debrief'].includes(a.step)?'done':''}">ADAPT</span><i></i><span class="${a.step==='debrief'?'done':''}">RESULT</span></div>`;
 let body='';
 if(a.step==='brief')body=`<div class="advanced-brief"><div class="mission-number">MISSION ${String(m.id).padStart(2,'0')} / 32 · ${m.location}</div><span class="advanced-icon" aria-hidden="true">${m.icon}</span><h1>${m.title}</h1><p class="play-prompt">${m.brief}</p>${m.principle?`<blockquote class="mission-principle"><small>MISSION PRINCIPLE · ${m.principle.reference}</small><p>“${m.principle.text}”</p></blockquote>`:''}<div class="concept-chips">${m.concepts.map(term=>`<span>${term}</span>`).join('')}</div>${dialoguePanel(m.dialogue)}${button('START THE MISSION →','next','primary')}</div>`;
 if(a.step==='choice')body=`<div class="advanced-decision"><span class="eyebrow">PLAYER DECISION</span><h1>${m.decision.prompt}</h1><p class="play-prompt">Choose a move. You will see the consequence.</p>${missionMechanic(m,a)}${decisionCards(m.decision)}</div>`;
 if(a.step==='event')body=`<div class="advanced-event"><div class="cast-reaction">${portrait(m.dialogue?.[0]?.speaker||'maya','reaction-portrait')}<div><span class="eyebrow">CONSEQUENCE</span><h1>${a.firstOutcome.label}</h1><p class="outcome-copy">${a.firstOutcome.feedback}</p></div></div>${effectChips(a.firstOutcome)}${missionWallet(a.wallet)}<div class="event-turn"><span>${m.event.title}</span><h2>${m.event.prompt}</h2></div>${missionMechanic(m,a)}${decisionCards(m.event)}</div>`;
 if(a.step==='debrief'){
  const finale=m.finale?finalReport(a.wallet,p):'';
  const medal=missionMedal(a.decisions);
  body=`${finale}<div class="advanced-debrief ${m.finale?'finale-debrief':''}"><span class="eyebrow">${m.finale?'YOUR FINANCIAL STORY':'MISSION DEBRIEF'}</span>${m.finale?'':`<div class="complete-medal ${medal}">${m.icon}<small>${medal.toUpperCase()}</small></div><h1>${m.title} COMPLETE</h1>`}<div class="debrief-team">${castPortraits('debrief-cast')}<b>TEAM MISSION COMPLETE!</b></div><div class="decision-recap">${(a.decisions||[]).map(d=>`<article><small>${d.stage==='choice'?'FIRST DECISION':'SECOND DECISION'}</small><h3>${d.label}</h3><p>${d.feedback}</p>${effectChips(d)}</article>`).join('')}</div><div class="takeaway"><b>WHY IT MATTERS</b><p>${m.takeaway}</p></div>${missionWallet(a.wallet)}<div class="result-rewards"><span>+${a.result.xp} XP</span><span>${medal.toUpperCase()} MEDAL</span><span>${rank(p.xp+a.result.xp)}</span></div>${button(m.finale?'REVIEW MY JOURNEY →':'COMPLETE MISSION →','finish','primary')}</div>`;
 }
 return `<div class="mission-toolbar">${button('← My city','home','text-button')}<span>${phase} · MISSION ${String(m.id).padStart(2,'0')}</span></div>${phaseRail}<section class="mission-body visual-play advanced-play" data-read="${m.brief.replaceAll('"','&quot;')}">${body}</section>`;
}
export function visualMission(p,button,escape){
 const a=p.active,m=missions.find(m=>m.id===a.id);let body='';
 if(a.id>=5)return advancedVisual(p,a,m,button);
 if(['brief','learn'].includes(a.step)&&a.id===3&&a.fromEarning){
  const earned=a.fromEarning.amount??a.wallet.cash;
  body=`<div class="story-bridge"><div class="bridge-map" aria-hidden="true"><div class="bridge-yard">${art(a.fromEarning.job||'time')}<span>EARNED!</span></div><div class="bridge-road"><div class="bridge-coins"><i>$</i><i>$</i><i>$</i></div><div class="bridge-buddy">${buddy('carrying')}</div></div><div class="bridge-home">${art('safe')}<span>SAVE!</span></div></div><div class="bridge-copy"><div class="eyebrow">THE SAME MONEY ADVENTURE</div><h1>YOU EARNED ${money(earned)}!</h1><p class="play-prompt">Bring it with you. Add a pretend payday. Save first!</p><div class="money-arrives" aria-label="Your earned money ${money(earned)} plus a pretend payday of $2,500"><span><small>EARNED MONEY</small><b>${money(earned)}</b></span><i>+</i><span><small>PAYDAY</small><b>$2,500</b></span><i>→</i><strong>PLAN IT!</strong></div>${button('LET’S SAVE →','next','primary')}</div></div>`;
 } else if(['brief','learn'].includes(a.step))body=a.id===1
  ?`<div class="play-intro week-one-intro"><div class="week-one-cast">${castPortraits('poster-cast')}<span>YOUR SKILLS. YOUR IDEAS. A BRIGHTER TOMORROW.</span></div><div><div class="eyebrow">WEEK 1 · COLOSSIANS 3:23</div><h1 class="week-one-title">EARNING &amp;<br>CREATING VALUE</h1><div class="value-rule"><b>YOU PROVIDE VALUE</b><span>→</span><b>SOMEONE PROVIDES MONEY</b></div><div class="value-icons" aria-label="Value can solve a problem, help someone, or make something"><span><i>⚙</i><b>SOLVE</b></span><span><i>♥</i><b>HELP</b></span><span><i>★</i><b>CREATE</b></span></div><p class="play-prompt">You help someone. They pay you.</p>${button('CHOOSE: TIME, SKILLS, OR IDEAS →','next','primary')}</div></div>`
  :`<div class="play-intro">${art('safe')}<div><div class="eyebrow">MONEY ADVENTURE</div><h1 class="${a.id===2?'build-income-title':''}">${a.id===2?'BUILD INCOME!':a.id===3?'SAVE FOR A SURPRISE.':'MAKE A MONEY MAP!'}</h1><p class="play-prompt">${a.id===2?'Use your time, your skills, and your ideas to create value.':a.id===3?'Your job money joins a pretend payday. Save some first!':'Put needs, wants, and savings in the right places.'}</p>${button(a.id===2?'USE ALL 3 →':a.id===3?'LET’S SAVE →':'MAP IT →','next','primary')}</div></div>`;
 if(a.step==='choice'&&a.id===1&&!a.project)body=`<h1>EARN MONEY WITH…</h1><p class="play-prompt">Choose YOUR TIME, YOUR SKILLS, or YOUR IDEAS.</p><div class="job-cards">${m.choices.map(c=>{const labels=c.id==='time'?['YOUR TIME','Help with yard work','HELPING PEOPLE']:c.id==='skill'?['YOUR SKILLS','Teach a friend','PROVIDING KNOWLEDGE']:['YOUR IDEAS','Make art','MAKING SOMETHING'];return `<button class="job-card" data-action="job-${c.id}" aria-label="${labels[0].toLowerCase()}: ${labels[1].toLowerCase()}">${art(c.id)}<h2>${labels[0]}</h2><span class="job-example">${labels[1]}</span><span class="job-pay">Earn ${money(c.gross-c.cost)}</span><span class="job-time">${labels[2]}</span></button>`;}).join('')}</div>`;
 if(a.step==='choice'&&a.id===1&&a.project){const done=a.workDone||[],type=a.project;
 body=`<div class="work-heading"><h1>${type==='time'?'YOUR TIME CREATES VALUE!':type==='skill'?'YOUR SKILLS CREATE VALUE!':'YOUR IDEAS CREATE VALUE!'}</h1><div class="work-stars" aria-label="${done.length} of 3 tasks finished">${[0,1,2].map(i=>`<span class="${i<done.length?'lit':''}">★</span>`).join('')}</div></div><p class="play-prompt">${type==='time'?'Use your time. Help clean the yard.':type==='skill'?'Help a friend learn. Match the pictures.':'Use your ideas. Make 3 pictures!'}</p><div class="work-stage ${type}">${type==='time'?`<div class="work-targets">${[0,1,2].map(i=>`<button class="work-target leaf-token ${done.includes(i)?'finished':''}" data-drag="leaf-${i}" data-action="select-leaf-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick leaf pile ${i+1}">${done.includes(i)?'<span class="task-check">✓</span>':'<span class="leaf-pile">🍂</span>'}</button>`).join('')}</div><button class="drop-basket" data-drop="basket" data-action="drop-basket" aria-label="Put selected leaves in basket"><span class="basket-picture" aria-hidden="true">🧺</span><b>LEAVES HERE</b></button>`:type==='skill'?`<div class="tutor-friend">${art('skill')}<b>HELP ME LEARN!</b></div><div class="picture-tokens">${shapes.map((shape,i)=>`<button class="picture-token shape-${shape} ${done.includes(i)?'finished':''}" data-drag="picture-${i}" data-action="select-picture-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick ${shape}">${done.includes(i)?'✓':symbols[shape]}</button>`).join('')}</div><div class="picture-slots">${[2,0,1].map(i=>`<button class="picture-slot shape-${shapes[i]} ${done.includes(i)?'matched':''}" data-drop="slot-${i}" data-action="drop-slot-${i}" aria-label="Match ${shapes[i]}">${symbols[shapes[i]]}${done.includes(i)?'<span>✓</span>':''}</button>`).join('')}</div>`:`<div class="art-tool-tray">${artTools.map((name,i)=>`<button class="art-tool tool-${i} ${done.includes(i)?'finished':''}" data-drag="art-${i}" data-action="select-art-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick ${name.toLowerCase()}"><span aria-hidden="true">${done.includes(i)?'✓':supplyIcon(i)}</span><b>${name}</b></button>`).join('')}</div><div class="work-targets art-canvases">${artTools.map((name,i)=>`<button class="work-target canvas ${done.includes(i)?'finished':''}" data-drop="canvas-${i}" data-action="drop-canvas-${i}" aria-label="Use ${name.toLowerCase()} on this picture">${done.includes(i)?`${createdArt(i)}<b>${name} ✓</b>`:`<span class="blank-canvas" aria-hidden="true">${supplyIcon(i)}</span><b>${name}</b>`}</button>`).join('')}</div>`}${buddy(done.length?'cheer':'pointing')}</div><p class="task-feedback" role="status">${a.hint|| (done.length?'You created value! Try the next one.':'Drag it. Or tap it, then tap its matching home.')}</p>${button('← Choose again','change-job','text-button')}`;
 }
 if(a.step==='choice'&&a.id===2){const done=a.streamDone||[],names=['YOUR TIME','YOUR SKILLS','YOUR IDEAS'];body=`<h1 class="build-income-title">BUILD INCOME!</h1><p class="income-action-line">FIND 3 WAYS TO EARN</p><p class="play-prompt">Use YOUR TIME, YOUR SKILLS, and YOUR IDEAS to create value.</p><div class="income-stage"><div class="stream-tray">${names.map((name,i)=>`<button class="stream-token ${done.includes(i)?'finished':''}" data-drag="stream-${i}" data-action="select-stream-${i}" ${done.includes(i)?'disabled':''} aria-label="Use ${name.toLowerCase()} to earn"><span>${['◷','🔧','💡'][i]}</span><b>${name}</b></button>`).join('')}</div><button class="income-wallet" data-drop="income-wallet" data-action="drop-income-wallet">${art('safe')}<b>VALUE → MONEY</b></button>${buddy(done.length?'cheer':'pointing')}</div><p class="task-feedback" role="status">${a.hint||`${done.length} of 3 ways to earn found`}</p>`;}
 if(a.step==='choice'&&a.id===3&&!a.jobBanked){
  const earned=a.wallet.cash;
  body=`<h1>FIRST: KEEP IT SAFE!</h1><p class="play-prompt">Move your ${money(earned)} job money to SAVE.</p><div class="earnings-transfer"><button class="earnings-bag" data-drag="earnings-bag" data-action="select-earnings-bag" aria-label="Pick up ${money(earned)} of job money"><span aria-hidden="true">$</span><b>JOB MONEY</b><strong>${money(earned)}</strong></button><div class="transfer-arrow" aria-hidden="true">→</div><button class="jar-drop earnings-jar" data-drop="save" data-action="drop-save" aria-label="Move job money into savings">${jar('SAVE',a.wallet.savings,'save',8)}<span class="drop-label">Drop here ↓</span></button>${buddy('pointing')}</div><p class="task-feedback" role="status">${a.hint||'You earned it. Now keep it!'}</p>`;
 }
 if(a.step==='choice'&&a.id===3&&a.jobBanked){
  const earned=a.wallet.cash,saved=a.planned??0,invested=a.invested??0,wants=2500-1750-saved-invested,total=a.wallet.savings+earned+saved;
  const used=a.savedCoins||Array.from({length:(saved+invested)/250},(_,i)=>i);
  body=`<h1>NOW PLAN PAYDAY!</h1><p class="play-prompt">Put each bundle in SAVE or INVEST.</p><div class="money-arrives"><span><small>JOB MONEY</small><b>${money(earned)} SAVED ✓</b></span><i>+</i><span><small>PAYDAY</small><b>$2,500</b></span></div><div class="coin-tray" aria-label="Three $250 payday bundles">${[0,1,2].map(i=>`<button class="save-coin ${used.includes(i)?'coin-used':''}" data-drag="coin-${i}" data-action="select-coin-${i}" aria-label="Pick a $250 payday bundle" ${used.includes(i)?'disabled':''}><span>$</span><small>$250</small></button>`).join('')}</div><div class="saving-playground money-choice"><div class="needs-chip"><span aria-hidden="true">⌂</span><b>Home + food</b><small>$1,750 ✓</small></div><button class="jar-drop" data-drop="save" data-action="drop-save" aria-label="Move payday money into savings">${jar('SAVE',total,'save',Math.min(100,total/850*100))}<span class="drop-label">SAVE ↓</span></button><button class="jar-drop invest-drop ${invested?'investment-landed':''}" data-drop="invest" data-action="drop-invest" aria-label="Move payday money into investments"><span class="invest-orbit" aria-hidden="true">↗</span>${invested?'<span class="growth-burst" aria-hidden="true">✦ ✦ ✦</span>':''}${jar('INVEST',a.wallet.investments+invested,'invest',Math.min(100,(a.wallet.investments+invested)/750*100))}<span class="drop-label">INVEST ↓</span></button><div class="fun-chip"><span aria-hidden="true">★</span><b>Fun</b><strong>${money(wants)}</strong></div></div><div class="save-tools">${button('↻ Start bundles over','save-0','secondary')}</div><div class="budget-road" aria-hidden="true">${art('car')}<span>READY TO DRIVE</span></div><p class="play-note">Saving keeps money ready. Investing helps money grow over time.</p>${button('DRIVE ON →','pack-budget','primary')}`;
 }
 if(a.step==='choice'&&a.id===4){const done=a.mapDone||[],labels=['HOME','FOOD','SAVE','FUN','FUN'];body=`<h1>GIVE MONEY A HOME!</h1><p class="play-prompt">Move each block to its matching place.</p><div class="income-stage budget-map"><div class="stream-tray">${labels.map((label,i)=>`<button class="stream-token ${done.includes(i)?'finished':''}" data-drag="map-${i}" data-action="select-map-${i}" ${done.includes(i)?'disabled':''}><span>$</span><b>${label}</b></button>`).join('')}</div><div class="map-homes"><button data-drop="need-home" data-action="drop-need-home">HOME</button><button data-drop="need-food" data-action="drop-need-food">FOOD</button><button data-drop="save-home" data-action="drop-save-home">SAVE</button><button data-drop="fun-home" data-action="drop-fun-home">FUN</button></div></div><p class="task-feedback" role="status">${a.hint||`${done.length} of 5 dollars mapped`}</p>`;}
 if(a.step==='event'){
  const fund=a.wallet.savings,done=a.repairDone||[];
  body=`<div class="repair-scene"><button class="car-bay" data-drop="car-bay" data-action="drop-car-bay" aria-label="Move selected tool to the car">${art('car')}<span>${done.length<3?'TOOLS → CAR':'ALL FIXED!'}</span>${done.length?sparkles(5):''}</button><div><div class="eyebrow alert-label">SURPRISE!</div><h1>THE CAR STOPPED!</h1><p class="play-prompt">Fix: <strong>$600</strong></p><p class="play-note">Move all 3 tools to the car.</p></div>${buddy(done.length?'cheer':'pointing')}</div><div class="repair-tools" aria-label="${done.length} of 3 tools used">${repairTools.map(([id,label,path],i)=>`<button class="repair-tool ${done.includes(i)?'tool-used':''}" data-drag="tool-${i}" data-action="select-tool-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick ${label}">${done.includes(i)?'<span class="task-check">✓</span>':toolIcon(path)}<b>${label}</b></button>`).join('')}</div><div class="repair-meter"><div><span>Safe in savings</span><b>${money(fund)}</b></div><div class="repair-track"><i style="width:${Math.min(100,fund/600*100)}%"></i></div><span class="repair-goal">Savings can help!</span></div><p class="task-feedback" role="status">${a.hint||`${done.length} of 3 tools used`}</p>`;
 }
 if(a.step==='debrief'&&a.id===2){body=`<div class="result-celebration">${coins()}${buddy('cheer')}<div class="result-medal">✦</div><h1>YOU BUILT INCOME!</h1><p class="play-prompt">Your time, your skills, and your ideas created value.</p></div><div class="visual-equation income-equation"><div><span>Your time</span><b>◷</b></div><i>+</i><div><span>Your skills</span><b>🔧</b></div><i>+</i><div><span>Your ideas</span><b>💡</b></div><i>→</i><div><span>Value</span><b>♥</b></div><i>→</i><div class="equation-win"><span>Money</span><b>${money(a.choice.amount)}</b></div></div><div class="result-rewards"><span>${a.practice?'Practice':`+${a.result.xp} XP`}</span></div>${button(a.practice?'DONE →':'SAVE THIS MONEY →',a.practice?'finish':'finish-to-save','primary')}`;}
 if(a.step==='debrief'&&a.id===4){body=`<div class="result-celebration">${coins()}${buddy('cheer')}<div class="result-medal">⌁</div><h1>MONEY MAP DONE!</h1><p class="play-prompt">Needs first. Savings next. Fun after!</p></div><div class="visual-equation"><div><span>Needs</span><b>$300</b></div><i>+</i><div><span>Save</span><b>$100</b></div><i>+</i><div><span>Fun</span><b>$100</b></div></div><div class="result-rewards"><span>${a.practice?'Practice':`+${a.result.xp} XP`}</span><span>Saved ${money(a.choice.saved)}</span></div>${button('BACK TO TOWN →','finish','primary')}`;}
 if(a.step==='debrief'&&a.id!==2&&a.id!==4){
  const r=a.result,isEarn=a.id===1,borrowed=r.borrowed||0,earned=isEarn?a.choice.gross-a.choice.cost:0;
  const savedBefore=isEarn?0:a.choice.wallet.savings;
  const valueLabel=a.choice?.id==='time'?'Helping people':a.choice?.id==='skill'?'Providing knowledge':'Making something';
  const outcomeEquation=isEarn
   ?`<div><span>You provide</span><b>VALUE</b><small>${valueLabel}</small></div><i>→</i><div class="equation-win"><span>You earn</span><b>${money(earned)}</b><small>MONEY</small></div>`
   :borrowed
    ?`<div class="equation-win"><span>Savings used</span><b>${money(r.savingsUsed)}</b></div><i>+</i><div class="equation-debt"><span>Borrowed</span><b>${money(borrowed)}</b></div><i>=</i><div><span>Car fixed</span><b>$600</b></div>`
    :`<div class="equation-win"><span>Saved</span><b>${money(savedBefore)}</b></div><i>−</i><div><span>Car fix</span><b>$600</b></div><i>=</i><div class="equation-win"><span>Still saved</span><b>${money(a.wallet.savings)}</b></div>`;
  const resultTitle=isEarn?'YOU CREATED VALUE!':borrowed?'SAVINGS HELPED!':'SAVINGS SAVED THE DAY!';
  const resultPrompt=isEarn?`You helped someone and earned ${money(earned)}!`:borrowed?'We used savings first.':'Car fixed. No borrowing!';
  const finishAction=isEarn&&!a.practice?'finish-to-plan':'finish';
  const finishLabel=isEarn&&!a.practice?'BUILD MORE INCOME →':isEarn?'DONE →':'BACK TO TOWN →';
  const valueKind=a.choice?.id==='time'?'YOUR TIME':a.choice?.id==='skill'?'YOUR SKILLS':'YOUR IDEAS';
  body=`<div class="result-celebration ${borrowed?'learning-result':''}">${coins()}${buddy('cheer')}${!isEarn?`<div class="fixed-car">${art('car')}</div>`:`<div class="value-result-art">${art(a.choice.id)}<b>${valueKind}</b></div>`}<h1>${resultTitle}</h1><p class="play-prompt">${resultPrompt}</p></div><div class="visual-equation">${outcomeEquation}</div><div class="result-rewards"><span>${a.practice?'Practice':`+${r.xp} XP`}</span>${isEarn?'':`<span>Net worth ${money(netWorth(a.wallet))}</span>`}</div><details class="why"><summary>Why?</summary><p>${escape(r.explanation)}</p>${!isEarn?`<p>Your ${money(a.choice.earnedSaved??a.start.cash??0)} job money went into savings first. Fun money was already spent, so savings helped before borrowing.</p>`:''}</details>${button(finishLabel,finishAction,'primary')}`;
 }
 const read=frameRead(a);
 return `<div class="mission-toolbar">${button('← My city','home','text-button')}<span>ONE MONEY ADVENTURE${a.practice?' · PRACTICE':''}</span></div>${storyRail(a)}<section class="mission-body visual-play"${read?` data-read="${escape(read)}"`:''}>${body}</section>`;
}
export function dropAction(p,token,target){
 const a=p.active;if(!a)return null;
 if(a.step==='event'&&[2,3].includes(a.id)){
  const done=a.repairDone||[],index=Number(token.slice(5));
  if(token.startsWith('tool-')&&target==='car-bay'&&[0,1,2].includes(index)&&!done.includes(index)){
   const repairDone=[...done,index],next={...p,active:{...a,repairDone,hint:''}};
   return repairDone.length===3?resolve(next):next;
  }
  return {...p,active:{...a,hint:'Move a tool to the car!'}};
 }
 if(a.step!=='choice')return null;
 if(a.id===2&&token.startsWith('stream-')&&target==='income-wallet')return playAction(p,`stream-${token.slice(7)}`);
 if(a.id===4&&token.startsWith('map-')){const i=Number(token.slice(4)),homes=['need-home','need-food','save-home','fun-home','fun-home'];if(target===homes[i])return playAction(p,`map-${i}`);return {...p,active:{...a,hint:'Try the picture that matches!'}};}
 if([2,3].includes(a.id)&&token==='earnings-bag'&&target==='save'&&!a.jobBanked)return {...p,active:{...a,jobBanked:true,hint:'Your job money is saved!'}};
 if([2,3].includes(a.id)&&(token==='coin'||token.startsWith('coin-'))&&['save','invest'].includes(target)&&a.jobBanked){
  const planned=a.planned||0,invested=a.invested||0,index=token==='coin'?Math.min(2,(planned+invested)/250):Number(token.slice(5));
  const used=a.savedCoins||Array.from({length:(planned+invested)/250},(_,i)=>i);
  if(![0,1,2].includes(index)||used.includes(index)||planned+invested>=750)return {...p,active:{...a,hint:'That bundle already has a home!'}};
  if(a.id===2&&target==='invest')return {...p,active:{...a,hint:'This practice level uses SAVE. Try the SAVE jar!'}};
  if(target==='save'){
   const next=playAction(p,`save-${planned+250}`);
   return {...next,active:{...next.active,invested,savedCoins:[...used,index],hint:'Nice! That money is saved.'}};
  }
  return {...p,active:{...a,invested:invested+250,savedCoins:[...used,index],hint:'Nice! That money can grow over time.'}};
 }
 if(a.id===1&&a.project==='time'&&token.startsWith('leaf-')&&target==='basket')return playAction(p,`work-${token.slice(5)}`);
 if(a.id===1&&a.project==='product'&&token.startsWith('art-')&&target===`canvas-${token.slice(4)}`)return playAction(p,`work-${token.slice(4)}`);
 if(a.id===1&&a.project==='skill'&&token.startsWith('picture-')&&target===`slot-${token.slice(8)}`)return playAction(p,`work-${token.slice(8)}`);
 return {...p,active:{...a,hint:'Try its matching home!'}};
}
export function littleBase(p,button,escape){
 const next=missions.find(m=>!p.completed.includes(m.id));
 const activeMission=p.active&&missions.find(m=>m.id===p.active.id);
 const featured=activeMission||next||missions.at(-1);
 const chapters=[
  ['I','EARN & CONTROL','Create value, build income, save, budget, and make your first investments.'],
  ['II','GROW & INVEST','Build ownership, understand markets, and use time and diversification.'],
  ['III','UNDERSTAND THE SYSTEM','See how prices, banks, credit, debt, insurance, and taxes connect.'],
  ['IV','BUILD YOUR FUTURE','Build a business, property, career, impact, and a Financial Freedom Plan.']
 ];
 const chapterMarkup=chapters.map(([roman,title,description],chapterIndex)=>{
  const group=missions.slice(chapterIndex*8,chapterIndex*8+8);
  const completed=group.filter(m=>p.completed.includes(m.id)).length;
  return `<section class="campaign-chapter ${completed===8?'complete':''}"><div class="chapter-heading"><span>CHAPTER ${roman}</span><div><h2>${title}</h2><p>${description}</p></div><b>${completed}/8</b></div><div class="route-grid">${group.map(m=>{const done=p.completed.includes(m.id),current=m.id===featured.id,locked=!done&&m.id>1&&!p.completed.includes(m.id-1);return `<button class="route-node ${done?'completed':current?'current':'locked'}" data-action="begin-${m.id}" ${locked?'disabled':''} aria-label="Mission ${m.id}: ${m.title}. ${done?'Completed':locked?'Locked':'Available'}"><span class="route-marker">${done?'✓':String(m.id).padStart(2,'0')}</span><span class="route-copy"><small>${m.location||m.sector}</small><strong>${m.title}</strong><em>${m.topic}</em></span><span class="route-status">${done?'REPLAY':current?'PLAY NOW':'LOCKED'}</span></button>`;}).join('')}</div></section>`;
 }).join('');
 const complete=!next;
 return `<main id="main" class="little-base campaign-route" tabindex="-1" data-read="Your financial future is a mission. Continue through thirty-two connected money missions."><div class="little-player"><span class="avatar">${escape(p.avatar)}</span><div class="identity"><h2>${escape(p.name)}</h2><span>${rank(p.xp).toUpperCase()} · ${p.xp.toLocaleString('en-US')} XP · ${p.completed.length}/${missions.length} missions</span></div>${button('🔊 READ THIS SCREEN','read-aloud','secondary')}</div><div class="little-score"><span>Cash <b>${money(p.cash+p.checking)}</b></span><span>Saved <b>${money(p.savings+p.emergencyFund)}</b></span><span>Invested <b>${money(p.investments+p.stocks+p.etfs)}</b></span><span>Net worth <b>${money(netWorth(p))}</b></span></div><section class="next-mission-card ${complete?'campaign-complete':''}"><div><span class="eyebrow">${complete?'CAMPAIGN COMPLETE':activeMission?'MISSION IN PROGRESS':'NEXT MISSION'}</span><small>${featured.location||featured.sector}</small><h1>${complete?'FINANCIAL FREEDOM ACHIEVED':featured.title}</h1><p>${complete?'Review your financial story, replay a mission, or begin a new financial life.':featured.brief}</p><div class="concept-chips">${(featured.concepts||featured.topic.split(' • ')).slice(0,5).map(term=>`<span>${term}</span>`).join('')}</div></div><div class="next-mission-action"><span aria-hidden="true">${complete?'★':featured.icon}</span>${button(complete?'REVIEW MY JOURNEY →':activeMission?'CONTINUE MISSION →':`START MISSION ${String(featured.id).padStart(2,'0')} →`,complete?'tab-ledger':`begin-${featured.id}`,'primary')}${complete?button('VIEW MY PLAN','tab-map','secondary'):''}</div></section><div class="campaign-heading"><div><span class="eyebrow">32-WEEK CAMPAIGN</span><h1>YOUR FINANCIAL FUTURE IS A MISSION.</h1></div><button class="world-buddy" data-action="cheer" aria-label="Make your Money Ops guide cheer"><span class="buddy-face">●‿●</span></button></div>${chapterMarkup}<div class="little-actions">${button('★ Achievements','tab-honors','secondary')}${button('▥ Money report','tab-ledger','secondary')}${button('⚙ Profile & sound','profile','secondary')}</div></main>`;
}
