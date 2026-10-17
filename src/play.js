import {missions} from './content.js';
import {choose,netWorth,rank,resolve,missionScore,passingScore} from './engine.js';
import {effectLabels} from './finance.js';
import {character,portrait,castPortraits,castIds} from './characters.js';
const money=n=>'$'+n.toLocaleString('en-US');
export const shapes=['star','circle','heart'];
const symbols={star:'★',circle:'●',heart:'♥'};
const artTools=['PAINT','CRAYONS','MARKERS'];
const tracePaths=[
 'M45 205 C95 45 185 45 235 205 C285 45 375 45 475 205',
 'M260 35 L310 133 L420 150 L340 226 L360 280 L260 236 L160 280 L180 226 L100 150 L210 133 Z',
 'M75 210 L165 120 L245 195 L325 95 L455 220'
];
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
 if(action.startsWith('job-')){const project=action.slice(4);if(!missions[0].choices.some(c=>c.id===project)||a.id!==1)return null;return {...p,active:{...a,project,workDone:[],yardPrep:[],hint:''}};}
 if(action==='change-job'&&a.id===1)return {...p,active:{...a,project:null,workDone:[],hint:''}};
 if(action.startsWith('work-')&&a.id===1&&a.project){const value=Number(action.slice(5)),done=a.workDone||[];if(done.length>=3)return null;
  if(a.project==='skill'){if(![0,1,2].includes(value)||done.includes(value))return {...p,active:{...a,hint:'Try another picture!'}};}
  else if(![0,1,2].includes(value)||done.includes(value))return null;
  const workDone=[...done,value];
  const hint=a.project==='time'?`You helped! ${workDone.length} of 3.`:a.project==='skill'?`You shared what you know! ${workDone.length} of 3.`:`${artTools[value]} picture done! ${workDone.length} of 3.`;
  const next={...p,active:{...a,workDone,hint,traceTool:a.project==='product'?null:a.traceTool}};return workDone.length===3?choose(next,a.project):next;
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
 if(['brief','learn'].includes(a.step))return 'Week one. Earning and creating value. Use your time, your skills, or your ideas to build value and get paid.';
 if(a.step==='choice'&&!a.project)return 'Choose one: your time, your skills, or your ideas.';
 if(a.step==='choice'&&a.project==='time')return 'Use your time. Put on the gloves, open the leaf bag, pick up the rake, and rake the leaves into the bag.';
 if(a.step==='choice'&&a.project==='skill')return 'Use your skills. Help a friend match the pictures.';
 if(a.step==='choice'&&a.project==='product')return 'Use your ideas. Match paint, crayons, and markers to make three pictures.';
 if(a.step==='debrief'){const earned=(a.choice?.gross??0)-(a.choice?.cost??0);return `You built value and got paid. You earned ${money(earned)}.`;}
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

function decisionCards(group,mode='route'){
 const method=['portfolio','route'].includes(mode)?'grab':['build','goal'].includes(mode)?'circle':'crossout';
 const instruction=method==='grab'?'GRAB A CHOICE. DROP IT INTO MY PLAN.':method==='circle'?'CIRCLE YOUR CHOICE. THEN CONFIRM.':'CROSS OUT THE OTHER CHOICES. KEEP ONE. THEN CONFIRM.';
 const cards=group.options.map((option,index)=>`<button class="decision-card method-${method}" style="--choice:${index}" ${method==='grab'?`data-drag="decision-${option.id}" data-action="select-decision-${option.id}"`:`data-action="mark-decision-${option.id}"`}><span class="decision-mark" aria-hidden="true">${method==='circle'?'○':method==='crossout'?'×':'✋'}</span><span class="decision-number">${index+1}</span><span class="decision-icon" aria-hidden="true">${option.icon}</span><strong>${option.label}</strong><p>${option.detail}</p><small>${mode==='portfolio'?'ADD TO PLAN':mode==='path'?'TAKE THIS PATH':mode==='build'?'BUILD THIS':mode==='protect'?'RAISE SHIELD':'MAKE THIS MOVE'} →</small></button>`).join('');
 const finish=method==='grab'?`<button class="decision-drop-zone" data-drop="decision-zone" data-action="drop-decision-zone"><span>▣</span><b>MY PLAN</b><small>DROP CHOICE HERE</small></button>`:`<button class="decision-confirm" data-action="confirm-decision" disabled>CONFIRM MY CIRCLED CHOICE →</button>`;
 return `<div class="decision-workbench method-${method}"><p class="interaction-instruction"><b>${method==='grab'?'GRAB + DROP':method==='circle'?'CIRCLE':'CROSS OUT + CIRCLE'}</b>${instruction}</p><div class="decision-grid decision-${mode}">${cards}</div>${finish}</div>`;
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

const missionGuide=id=>castIds[(id-1)%castIds.length];
const lessonMode=id=>id<=4?'starter':[5,9,11,12,13,14,15,16].includes(id)?'portfolio':[7,20,21].includes(id)?'path':[8,24,25,26,28].includes(id)?'build':[6,18,22].includes(id)?'protect':[10,30,31,32].includes(id)?'goal':'route';
const actionWords={
 portfolio:['TYPES A BUY ORDER','⌨','Kai compares investments, types the amount, and watches the chart move.'],
 path:['BUILDS A PAYMENT PATH','▤','Maya points to each payment and moves the plan forward.'],
 build:['BUILDS THE IDEA','⚙','Jordan puts the pieces together and tests the new idea.'],
 protect:['RAISES THE SAFETY SHIELD','◇','Ruby checks the risk and protects what the team built.'],
 goal:['MAPS THE NEXT STEP','◎','Ruby writes the goal, checks the plan, and points to the finish.'],
 route:['MOVES MONEY THROUGH THE SYSTEM','$','Eli follows the money and shows where it goes next.']
};
const missionMaterials={
 5:['ETFs','▥'],6:['energy prices','⛽'],7:['borrowing costs','▤'],8:['products or services','⚙'],9:['asset classes','◫'],10:['SMART financial goals','◎'],11:['shares','▥'],12:['rate of return','⌁'],13:['diversification','◫'],14:['asset allocation','▦'],15:['bids / offers','↕'],16:['revenue / expenses / profit','▤'],17:['supply / demand','⚖'],18:['purchasing power','🧺'],19:['deposits','▣'],20:['payment history','▤'],21:['APR','%'],22:['risk protection','◇'],23:['GROSS PAY ≠ TAKE-HOME PAY','$'],24:['PROBLEM → SOLUTION → CUSTOMER → REVENUE → PROFIT','→'],25:['PROFIT = REVENUE - EXPENSES','='],26:['marketing strategy','◉'],27:['cash flow','⌂'],28:['skills','◆'],29:['giving','♥'],30:['WHAT DOES FINANCIAL FREEDOM MEAN TO YOU?','◎'],31:['FINANCIAL FREEDOM PLAN','▣'],32:['long-term goals','★']
};
function scriptureSpeaker(m,p){const lead=castIds.includes(p?.avatar)?p.avatar:missionGuide(m.id);let speaker=castIds[(m.id+1)%castIds.length];if(speaker===lead)speaker=castIds[(m.id+2)%castIds.length];return speaker;}
function scriptureCard(m,speakerId){const s=m.scripture||m.principle,c=character(speakerId);return `<aside class="scripture-card scripture-character-card" data-scripture-speaker="${speakerId}">${portrait(speakerId,'scripture-character')}<div class="scripture-bubble"><span>${c.name.toUpperCase()} SHARES TODAY’S SCRIPTURE</span><blockquote>“${s.text}”</blockquote><cite>${s.reference}</cite></div></aside>`;}
function lessonLanguageCard(m){return `<aside class="lesson-language-card vocabulary-only"><div><small>LESSON ${m.id} · WORDS TO KNOW</small><p>${m.title}</p></div><div class="lesson-term-strip" aria-label="Lesson ${m.id} terminology">${m.terms.map(term=>`<span>${term}</span>`).join('')}</div></aside>`;}
function characterHeader(m,step,p){
 const lead=castIds.includes(p?.avatar)?p.avatar:missionGuide(m.id),c=character(lead);
 const cues={brief:'I’ll show you the big idea.',choice:'Watch us act it out. Then choose!',event:'A surprise! Let’s adjust the plan.',debrief:'We did it! Tell what you learned.'};
 const bigIdea=`<p class="big-idea-description"><strong>LESSON ${String(m.id).padStart(2,'0')} · BIG IDEA:</strong> ${m.coreIdea}</p>`;
 return `<header class="lesson-character-header sequence-${step}" data-character="${lead}" data-lesson-speaker="${lead}" data-career-player="true">${portrait(lead,'header-character lead-character')}<div class="direction-bubble"><small>${c.name.toUpperCase()} · YOUR CAREER HERO EXPLAINS THE LESSON</small><b>${cues[step]||cues.brief}</b>${bigIdea}<span>${m.title}</span></div><div class="lesson-number-badge" aria-label="Lesson ${m.id}"><small>LESSON</small><b>${String(m.id).padStart(2,'0')}</b><i aria-hidden="true">${m.icon}</i></div></header>`;
}
function characterFooter(m,step){
 const lead=missionGuide(m.id),c=character(lead),cue=step==='debrief'?'Celebrate, then carry this skill to the next lesson!':'Follow the characters. Try the action. Make your choice.';
 return `<footer class="lesson-character-footer"><div class="footer-runner">${portrait(lead,'footer-character')}<span aria-hidden="true">→</span></div><b>${c.name} says: ${cue}</b>${castPortraits('footer-cast')}</footer>`;
}
function characterActionDemo(m,a){
 const mode=lessonMode(m.id),lead=missionGuide(m.id),[label,icon,description]=actionWords[mode],[material,materialIcon]=missionMaterials[m.id],isBank=m.id===19,isInvest=['portfolio'].includes(mode);
 return `<div class="lesson-action-demo action-${mode} ${isBank?'action-bank':''}">
  <div class="action-demo-character">${portrait(lead,'action-demo-portrait')}<span class="animated-arm" aria-hidden="true"></span><span class="action-prop" aria-hidden="true">${icon}</span></div>
  ${isBank?'<div class="walk-in-bank" aria-hidden="true"><b>BANK</b><i></i><i></i><span>TELLER</span></div>':''}
  ${isInvest?'<div class="typing-computer" aria-hidden="true"><div><i></i><i></i><i></i><i></i></div><span>⌨</span><em></em><em></em></div>':''}
  <div class="material-kit"><span aria-hidden="true">${materialIcon}</span><b>${material}</b></div>
  <p><b>${character(lead).name} ${label}.</b><span>${description}</span></p>
 </div>`;
}
function valueFireworks(){return `<div class="value-fireworks" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="--spark:${i}">✦</i>`).join('')}</div><div class="value-word-reveal"><span>YOU</span><span>CREATED</span><span>VALUE!</span></div>`;}
function scoreCard(a,button){
 const score=missionScore(a),passed=a.practice||score>=passingScore;
 return `<section class="level-score ${passed?'score-pass':'score-retry'}" role="status"><div class="score-ring" style="--score:${score}"><strong>${score}</strong><span>/ 100</span></div><div><small>${a.practice?'PRACTICE SCORE':'LEVEL SCORE'}</small><h2>${a.practice?'PRACTICE COMPLETE!':passed?'LEVEL PASSED!':'ALMOST THERE!'}</h2><p>${a.practice?'Practice helps you test a new choice.':passed?'Great choices! You are ready for the next lesson.':'Your character has a new plan. Try again and reach 70 points.'}</p></div>${passed?'':button('TRY THIS LEVEL AGAIN ↻','retry-mission','primary')}</section>`;
}
function advancedVisual(p,a,m,button){
 const phase=a.step==='brief'?'BRIEFING':a.step==='choice'?'DECISION':a.step==='event'?'CHALLENGE':'DEBRIEF';
 const phaseRail=`<div class="advanced-phase" aria-label="Mission progress"><span class="done">BRIEF</span><i></i><span class="${['choice','event','debrief'].includes(a.step)?'done':''}">DECIDE</span><i></i><span class="${['event','debrief'].includes(a.step)?'done':''}">ADAPT</span><i></i><span class="${a.step==='debrief'?'done':''}">RESULT</span></div>`;
 let body='';
 const mode=lessonMode(m.id);
 if(a.step==='brief')body=`<div class="advanced-brief"><div class="mission-number">MISSION ${String(m.id).padStart(2,'0')} / 32 · ${m.location}</div><span class="advanced-icon" aria-hidden="true">${m.icon}</span><h1>${m.title}</h1><p class="play-prompt">${m.coreIdea}</p>${dialoguePanel(m.dialogue)}${button('START THE MISSION →','next','primary')}</div>`;
 if(a.step==='choice')body=`<div class="advanced-decision interaction-${mode}"><span class="eyebrow">PLAYER DECISION</span><h1>${m.decision.prompt}</h1><p class="play-prompt">Watch the character demonstrate the skill. Then choose your move.</p>${characterActionDemo(m,a)}${missionMechanic(m,a)}${decisionCards(m.decision,mode)}</div>`;
 if(a.step==='event')body=`<div class="advanced-event interaction-${mode}"><div class="cast-reaction">${portrait(missionGuide(m.id),'reaction-portrait')}<div><span class="eyebrow">CONSEQUENCE</span><h1>${a.firstOutcome.label}</h1><p class="outcome-copy">${a.firstOutcome.feedback}</p></div></div>${effectChips(a.firstOutcome)}${missionWallet(a.wallet)}<div class="event-turn"><span>${m.event.title}</span><h2>${m.event.prompt}</h2></div>${characterActionDemo(m,a)}${missionMechanic(m,a)}${decisionCards(m.event,mode)}</div>`;
 if(a.step==='debrief'){
  const finale=m.finale?finalReport(a.wallet,p):'';
  const medal=missionMedal(a.decisions);
  const passed=a.practice||missionScore(a)>=passingScore;
  body=`${finale}<div class="advanced-debrief ${m.finale?'finale-debrief':''}"><span class="eyebrow">${m.finale?'YOUR FINANCIAL STORY':'MISSION DEBRIEF'}</span>${m.finale?'':`<div class="complete-medal ${medal}">${m.icon}<small>${medal.toUpperCase()}</small></div><h1>${m.title} ${passed?'COMPLETE':'REVIEW'}</h1>`}<div class="debrief-team">${castPortraits('debrief-cast')}<b>TEAM MISSION COMPLETE!</b></div><div class="decision-recap">${(a.decisions||[]).map(d=>`<article><small>${d.stage==='choice'?'FIRST DECISION':'SECOND DECISION'}</small><h3>${d.label}</h3><p>${d.feedback}</p>${effectChips(d)}</article>`).join('')}</div><div class="takeaway"><b>WHY IT MATTERS</b><p>${m.takeaway}</p></div>${missionWallet(a.wallet)}${scoreCard(a,button)}${passed?`<div class="result-rewards"><span>+${a.result.xp} XP</span><span>${medal.toUpperCase()} MEDAL</span><span>${rank(p.xp+a.result.xp)}</span></div>${button(m.finale?'REVIEW MY JOURNEY →':'COMPLETE MISSION →','finish','primary')}`:''}</div>`;
 }
 const guideId=missionGuide(m.id),guide=character(guideId);
 if(a.step==='brief')body=body.replace('<div class="mission-number">',`<div class="mission-guide">${portrait(guideId,'mission-guide-character')}<span><b>${guide.name}</b>Your mission guide</span></div><div class="mission-number">`);
 if(a.step==='choice')body=body.replace('<span class="eyebrow">',`<div class="mission-guide compact">${portrait(guideId,'mission-guide-character')}<span><b>${guide.name}</b>Choose with me!</span></div><span class="eyebrow">`);
 const verseSpeaker=scriptureSpeaker(m,p);
 return `<div class="mission-toolbar">${button('← My city','home','text-button')}<span>CAREER MODE · ${phase} · MISSION ${String(m.id).padStart(2,'0')}</span></div>${scriptureCard(m,verseSpeaker)}${characterHeader(m,a.step,p)}${lessonLanguageCard(m)}${phaseRail}<section class="mission-body visual-play advanced-play interaction-${mode}" data-read="${m.coreIdea.replaceAll('"','&quot;')}">${body}</section>${characterFooter(m,a.step)}`;
}
function taskActor(type,progress){
 const id=type==='time'||type==='repair'?'jordan':type==='skill'||type==='saving'?'maya':type==='income'||type==='planning'?'kai':'sofia';
 const actions={time:'I’ll carry the leaves!',skill:'Let’s solve it together!',product:'Let’s create each picture!',income:'I’ll build each income path!',saving:'I’ll move the money!',repair:'I’ll bring the tools!',planning:'I’ll map every dollar!'};
 const action=actions[type]||'Let’s do it together!';
 return `<div class="task-actor actor-${type} actor-step-${progress}" aria-live="polite">${portrait(id,'task-character')}<span><b>${character(id).name}</b>${action}</span>${type==='time'&&progress?'<i aria-hidden="true">🍂</i>':''}</div>`;
}
function moneyActionScene(a){
 const move=a.lastMove||'ready';
 return `<div class="money-action-scene move-${move}" aria-label="Maya walks inside the bank to save. Eli sits at a computer and types a buy order."><div class="bank-action"><div class="scene-character bank-walker">${portrait('maya','action-character')}<span class="money-bundle" aria-hidden="true">$</span></div><div class="bank-building bank-interior" aria-hidden="true"><b>BANK</b><i class="bank-door left-door"></i><i class="bank-door right-door"></i><div class="bank-teller"><span>●‿●</span><strong>TELLER</strong></div><em>WELCOME INSIDE</em></div><p><b>Maya walks into the bank.</b><span>She hands the teller money to keep in savings.</span></p></div><div class="invest-action"><div class="computer-desk" aria-hidden="true"><div class="invest-app"><small>MY INVESTING APP</small><div class="app-chart"><i></i><i></i><i></i><i></i></div><b>BUY $250</b></div><span class="keyboard">▦</span><i class="typing-hand hand-left"></i><i class="typing-hand hand-right"></i></div><div class="scene-character typing-character seated-eli"><span class="eli-chair" aria-hidden="true"><i></i><i></i></span>${portrait('eli','action-character')}</div><p><b>Eli types a buy order.</b><span>He sits at the computer and uses both hands on the keyboard.</span></p></div></div>`;
}
function workActionScene(type,progress,prep=[]){
 if(type==='time'){const ready=prep.length===3;return `<div class="character-action-scene yard-action action-step-${progress} prep-step-${prep.length}"><div class="yard-leaves" aria-hidden="true">🍂 🍂 🍂</div><div class="working-character">${portrait('jordan','full-task-character')}${prep.includes('gloves')?'<span class="jordan-gloves" aria-hidden="true"><i></i><i></i></span>':''}${prep.includes('rake')?'<svg class="yard-rake" viewBox="0 0 160 250" aria-hidden="true"><path d="M38 226 124 18"/><path d="m18 212 57 24"/><path d="m25 211-12 23m25-17-10 24m25-18-8 23m24-17-6 21"/></svg>':''}<span class="carried-leaves" aria-hidden="true">${ready?'🍂':''}</span></div><div class="scene-leaf-bag ${prep.includes('bag')?'bag-open':''}" aria-hidden="true"><b>LEAF BAG</b><span>${progress}/3 PILES</span></div><p><b>Jordan’s yard-work sequence</b><span>${!prep.includes('gloves')?'First: put on the gloves.':!prep.includes('bag')?'Next: open the leaf bag.':!prep.includes('rake')?'Next: pick up the rake.':'Now: rake each leaf pile into the leaf bag.'}</span></p></div>`;}
 if(type==='skill')return `<div class="character-action-scene tutor-action action-step-${progress}"><div class="student-desk"><span>📖</span><span>★</span><span>●</span><span>♥</span></div><div class="working-character">${portrait('maya','full-task-character')}<i class="teacher-pointer" aria-hidden="true"></i></div><div class="lesson-board"><b>PROVIDING KNOWLEDGE</b><span>★ → ★</span><span>● → ●</span><span>♥ → ♥</span></div><p><b>Maya uses a book and pointer.</b><span>She uses her skills to explain how each shape matches.</span></p></div>`;
 const canvas=progress?createdArt(Math.min(2,progress-1)):`${svg('<rect x="45" y="24" width="210" height="142" rx="10" fill="#fffdf5" stroke="#78583d" stroke-width="7"/><path d="M80 135q55-90 140 0" fill="none" stroke="#d7d2c4" stroke-width="5" stroke-dasharray="10 8"/>','blank-idea-picture')}`;
 return `<div class="character-action-scene artist-action action-step-${progress}"><div class="working-character">${portrait('sofia','full-task-character')}</div><div class="scene-easel">${canvas}<b>${progress?'ART CREATED!':'READY TO TRACE'}</b></div><div class="paint-dots" aria-hidden="true"><i></i><i></i><i></i></div><p><b>Sofia creates art with you.</b><span>Choose a tool, then use your mouse or finger to trace the dotted line.</span></p></div>`;
}
function traceActivity(tool){const name=artTools[tool];return `<div class="trace-activity"><div class="trace-instruction"><b>${name} IS READY!</b><span>Start at the green dot. Hold and trace the dotted line.</span></div><svg class="trace-board" data-trace-tool="${tool}" viewBox="0 0 520 310" role="application" tabindex="0" aria-label="Trace the dotted line with ${name.toLowerCase()}"><rect x="8" y="8" width="504" height="294" rx="24"/><path class="trace-guide" d="${tracePaths[tool]}"/><path class="trace-ink trace-ink-${tool}" d="${tracePaths[tool]}"/><circle class="trace-start" cx="0" cy="0" r="18"/><circle class="trace-cursor" cx="0" cy="0" r="13"/></svg><div class="trace-meter"><i></i><b>0% TRACED</b></div><button class="trace-keyboard" data-action="complete-trace-${tool}">PRESS SPACE OR TAP HERE TO TRACE</button></div>`;}
function garageRepairScene(progress){
 const fixes=[['WHEEL','○'],['ENGINE','⚙'],['POWER','ϟ']];
 return `<div class="garage-repair-scene repair-step-${progress}" aria-label="Jordan takes his car into the garage, checks the problem, and fixes it with tools.">
  <div class="garage-sign"><b>JORDAN’S GARAGE</b><span>${progress<3?'DIAGNOSE → REPAIR':'REPAIR COMPLETE!'}</span></div>
  <div class="garage-jordan">${portrait('jordan','garage-character')}<svg class="garage-wrench" viewBox="0 0 110 110" role="img" aria-label="Wrench"><path d="M89 8A25 25 0 0 0 59 40L17 82a11 11 0 1 0 16 16l42-42A25 25 0 0 0 103 24L86 41l-15-3-3-15Z"/><circle cx="25" cy="90" r="5"/></svg><b class="garage-wrench-label">WRENCH</b></div>
  <div class="garage-car"><div class="open-hood"></div>${art('car')}<span class="repair-sparks" aria-hidden="true">✦</span></div>
  <div class="diagnostic-board"><b>CAR CHECK</b>${fixes.map(([label,icon],i)=>`<span class="${i<progress?'fixed':''}"><i>${i<progress?'✓':icon}</i>${label}</span>`).join('')}<strong>${progress}/3 FIXED</strong></div>
 </div>`;
}
export function visualMission(p,button,escape){
 const a=p.active,m=missions.find(m=>m.id===a.id);let body='';
 if(a.id>=5)return advancedVisual(p,a,m,button);
 if(['brief','learn'].includes(a.step)&&a.id===3&&a.fromEarning){
  const earned=a.fromEarning.amount??a.wallet.cash;
  body=`<div class="story-bridge"><div class="bridge-map" aria-hidden="true"><div class="bridge-yard">${art(a.fromEarning.job||'time')}<span>EARNED!</span></div><div class="bridge-road"><div class="bridge-coins"><i>$</i><i>$</i><i>$</i></div><div class="bridge-buddy">${buddy('carrying')}</div></div><div class="bridge-home">${art('safe')}<span>SAVE!</span></div></div><div class="bridge-copy"><div class="eyebrow">THE SAME MONEY ADVENTURE</div><h1>YOU EARNED ${money(earned)}!</h1><p class="play-prompt">Bring it with you. Add a pretend payday. Save first!</p><div class="money-arrives" aria-label="Your earned money ${money(earned)} plus a pretend payday of $2,500"><span><small>EARNED MONEY</small><b>${money(earned)}</b></span><i>+</i><span><small>PAYDAY</small><b>$2,500</b></span><i>→</i><strong>PLAN IT!</strong></div>${button('LET’S SAVE →','next','primary')}</div></div>`;
 } else if(['brief','learn'].includes(a.step))body=a.id===1
  ?`<div class="play-intro week-one-intro"><div class="week-one-hero"><div class="week-one-slogan"><small>YOUR SKILLS. YOUR IDEAS.</small><strong>A BRIGHTER TOMORROW.</strong></div>${castPortraits('poster-cast')}</div><div class="week-one-copy"><div class="eyebrow">WEEK 1 · EARNING &amp; CREATING VALUE</div><h1 class="week-one-title">EARNING &amp;<br>CREATING VALUE</h1><div class="value-rule"><b>BUILD VALUE</b><span>→</span><b>GET PAID</b></div><div class="value-icons" aria-label="Value can solve a problem, save time, share knowledge, entertain, make something, or help others"><span><i>⚙</i><b>SOLVE</b></span><span><i>♥</i><b>HELP</b></span><span><i>★</i><b>CREATE</b></span></div><p class="play-prompt">Build value. Get paid.</p>${button('CHOOSE: TIME, SKILLS, OR IDEAS →','next','primary')}</div></div>`
  :`<div class="play-intro">${art('safe')}<div><div class="eyebrow">MONEY ADVENTURE</div><h1 class="${a.id===2?'build-income-title':''}">${a.id===2?'BUILD INCOME!':a.id===3?'SAVE FOR A SURPRISE.':'MAKE A MONEY MAP!'}</h1><p class="play-prompt">${a.id===2?'Use your time, your skills, and your ideas to create value.':a.id===3?'Your job money joins a pretend payday. Save some first!':'Put needs, wants, and savings in the right places.'}</p>${button(a.id===2?'USE ALL 3 →':a.id===3?'LET’S SAVE →':'MAP IT →','next','primary')}</div></div>`;
 if(a.step==='choice'&&a.id===1&&!a.project)body=`<h1>EARN MONEY WITH…</h1><p class="play-prompt">Choose YOUR TIME, YOUR SKILLS, or YOUR IDEAS.</p><div class="job-cards">${m.choices.map(c=>{const labels=c.id==='time'?['YOUR TIME','Help with yard work','HELPING PEOPLE']:c.id==='skill'?['YOUR SKILLS','Teach a friend','PROVIDING KNOWLEDGE']:['YOUR IDEAS','Make art','MAKING SOMETHING'];return `<button class="job-card" data-action="job-${c.id}" aria-label="${labels[0].toLowerCase()}: ${labels[1].toLowerCase()}">${art(c.id)}<h2>${labels[0]}</h2><span class="job-example">${labels[1]}</span><span class="job-pay">Earn ${money(c.gross-c.cost)}</span><span class="job-time">${labels[2]}</span></button>`;}).join('')}</div>`;
 if(a.step==='choice'&&a.id===1&&a.project){const done=a.workDone||[],type=a.project,prep=a.yardPrep||[],yardReady=prep.length===3,traceTool=a.traceTool;
  body=`<div class="work-heading"><h1>${type==='time'?'YOUR TIME CREATES VALUE!':type==='skill'?'YOUR SKILLS CREATE VALUE!':'YOUR IDEAS CREATE VALUE!'}</h1><div class="work-stars" aria-label="${done.length} of 3 tasks finished">${[0,1,2].map(i=>`<span class="${i<done.length?'lit':''}">★</span>`).join('')}</div></div><p class="play-prompt">${type==='time'?'Put on gloves. Open the leaf bag. Pick up the rake. Rake the leaves into the bag.':type==='skill'?'Help a friend learn. Match the pictures.':'Use your ideas. Make 3 pictures!'}</p><div class="work-stage ${type}">${type==='time'?`${!yardReady?`<div class="yard-prep-board"><div class="sequence-list">${[['gloves','1','PUT ON GLOVES'],['bag','2','OPEN LEAF BAG'],['rake','3','PICK UP RAKE']].map(([id,n,label],i)=>`<span class="${prep.includes(id)?'done':i===prep.length?'current':''}"><i>${prep.includes(id)?'✓':n}</i>${label}</span>`).join('')}</div><div class="yard-gear">${prep.length===0?'<button data-drag="yard-gloves" data-action="select-yard-gloves"><span>🧤</span><b>GLOVES</b></button>':prep.length===1?'<button data-drag="yard-bag" data-action="select-yard-bag"><span class="bag-icon">▱</span><b>LEAF BAG</b></button>':'<button data-drag="yard-rake" data-action="select-yard-rake"><span>♜</span><b>RAKE</b></button>'}</div><div class="gear-targets">${prep.length===1?'<button data-drop="bag-spot" data-action="drop-bag-spot"><span>▱</span><b>OPEN BAG HERE</b></button>':'<button data-drop="jordan-gear" data-action="drop-jordan-gear">'+portrait('jordan','gear-jordan')+'<b>GIVE TO JORDAN</b></button>'}</div></div>`:`<div class="work-targets">${[0,1,2].map(i=>`<button class="work-target leaf-token ${done.includes(i)?'finished':''}" data-drag="leaf-${i}" data-action="select-leaf-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick leaf pile ${i+1}">${done.includes(i)?'<span class="task-check">✓</span>':'<span class="leaf-pile">🍂</span>'}</button>`).join('')}</div><button class="drop-basket leaf-bag-drop" data-drop="leaf-bag" data-action="drop-leaf-bag" aria-label="Rake selected leaves into the leaf bag"><span class="leaf-bag-picture" aria-hidden="true">▱</span><b>RAKE INTO LEAF BAG</b></button>`}`:type==='skill'?`<div class="tutor-friend">${art('skill')}<b>HELP ME LEARN!</b></div><div class="picture-tokens">${shapes.map((shape,i)=>`<button class="picture-token shape-${shape} ${done.includes(i)?'finished':''}" data-drag="picture-${i}" data-action="select-picture-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick ${shape}">${done.includes(i)?'✓':symbols[shape]}</button>`).join('')}</div><div class="picture-slots">${[2,0,1].map(i=>`<button class="picture-slot shape-${shapes[i]} ${done.includes(i)?'matched':''}" data-drop="slot-${i}" data-action="drop-slot-${i}" aria-label="Match ${shapes[i]}">${symbols[shapes[i]]}${done.includes(i)?'<span>✓</span>':''}</button>`).join('')}</div>`:Number.isInteger(traceTool)?traceActivity(traceTool):`<div class="art-tool-tray">${artTools.map((name,i)=>`<button class="art-tool tool-${i} ${done.includes(i)?'finished':''}" data-drag="art-${i}" data-action="select-art-${i}" ${done.includes(i)?'disabled':''} aria-label="Pick ${name.toLowerCase()}"><span aria-hidden="true">${done.includes(i)?'✓':supplyIcon(i)}</span><b>${name}</b></button>`).join('')}</div><div class="work-targets art-canvases">${artTools.map((name,i)=>`<button class="work-target canvas ${done.includes(i)?'finished':''}" data-drop="canvas-${i}" data-action="drop-canvas-${i}" aria-label="Use ${name.toLowerCase()} on this picture">${done.includes(i)?`${createdArt(i)}<b>${name} ✓</b>`:`<span class="blank-canvas" aria-hidden="true">${supplyIcon(i)}</span><b>${name}</b>`}</button>`).join('')}</div>`}${buddy(done.length?'cheer':'pointing')}</div><p class="task-feedback" role="status">${a.hint|| (type==='time'&&!yardReady?`Step ${prep.length+1} of 3: drag or tap the next material.`:done.length?'You created value! Try the next one.':'Drag it. Or tap it, then tap its matching home.')}</p>${button('← Choose again','change-job','text-button')}`;
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
 if(a.step==='choice'&&a.id===4){const done=a.mapDone||[],amounts=[500,200,100,50,50],funTotal=(done.includes(3)?50:0)+(done.includes(4)?50:0);body=`<h1>GIVE MONEY A HOME!</h1><p class="play-prompt">Move each dollar amount to the right home.</p><div class="income-stage budget-map"><div class="stream-tray">${amounts.map((amount,i)=>`<button class="stream-token ${done.includes(i)?'finished':''}" data-drag="map-${i}" data-action="select-map-${i}" ${done.includes(i)?'disabled':''} aria-label="Move ${money(amount)}"><span>$</span><b>${amount}</b></button>`).join('')}</div><div class="map-homes"><button data-drop="need-home" data-action="drop-need-home"><b>HOME</b><span>${done.includes(0)?'$500':'$0'}</span></button><button data-drop="need-food" data-action="drop-need-food"><b>FOOD</b><span>${done.includes(1)?'$200':'$0'}</span></button><button data-drop="save-home" data-action="drop-save-home"><b>SAVE</b><span>${done.includes(2)?'$100':'$0'}</span></button><button data-drop="fun-home" data-action="drop-fun-home"><b>FUN</b><span>$${funTotal}</span></button></div></div><p class="task-feedback" role="status">${a.hint||`${done.length} of 5 dollar amounts mapped`}</p>`;}
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
  const resultPrompt=isEarn?`You built value and got paid ${money(earned)}!`:borrowed?'We used savings first.':'Car fixed. No borrowing!';
  const finishAction=isEarn&&!a.practice?'finish-to-plan':'finish';
  const finishLabel=isEarn&&!a.practice?'BUILD MORE INCOME →':isEarn?'DONE →':'BACK TO TOWN →';
  const valueKind=a.choice?.id==='time'?'YOUR TIME':a.choice?.id==='skill'?'YOUR SKILLS':'YOUR IDEAS';
  body=`<div class="result-celebration ${borrowed?'learning-result':''}">${coins()}${buddy('cheer')}${isEarn?valueFireworks():''}${!isEarn?`<div class="fixed-car">${art('car')}</div>`:`<div class="value-result-art">${art(a.choice.id)}<b>${valueKind}</b></div>`}<h1>${resultTitle}</h1><p class="play-prompt">${resultPrompt}</p></div><div class="visual-equation">${outcomeEquation}</div><div class="result-rewards"><span>${a.practice?'Practice':`+${r.xp} XP`}</span>${isEarn?'':`<span>Net worth ${money(netWorth(a.wallet))}</span>`}</div><details class="why"><summary>Why?</summary><p>${escape(r.explanation)}</p>${!isEarn?`<p>Your ${money(a.choice.earnedSaved??a.start.cash??0)} job money went into savings first. Fun money was already spent, so savings helped before borrowing.</p>`:''}</details>${button(finishLabel,finishAction,'primary')}`;
 }
 if(a.step==='debrief'&&a.id<5)body+=scoreCard(a,button);
 if(a.id===1&&a.step==='choice'&&a.project){
  const progress=(a.workDone||[]).length;
  body=body.replace(`<div class="work-stage ${a.project}">`,`<div class="action-work-layout">${workActionScene(a.project,progress,a.yardPrep||[])}<div class="work-stage ${a.project}">`);
  body=body.replace('</div><p class="task-feedback"','</div></div><p class="task-feedback"');
 }
 if(a.id===2&&a.step==='choice')body=body.replace('<div class="income-stage">',`<div class="income-stage actor-stage">${taskActor('income',(a.streamDone||[]).length)}`);
 if(a.id===3&&a.step==='choice'&&!a.jobBanked)body=body.replace('<div class="earnings-transfer">',`<div class="bank-run-scene">${portrait('maya','bank-run-character')}<div class="bank-run-money">$</div><div class="bank-building"><b>BANK</b><i></i><i></i><i></i><strong>SAVINGS</strong></div></div><div class="earnings-transfer">`);
 if(a.id===3&&a.step==='choice'&&a.jobBanked){
  body=body.replace('<div class="saving-playground money-choice">',`<div class="money-action-layout">${moneyActionScene(a)}<div class="saving-playground money-choice">`);
  body=body.replace('</div><div class="save-tools">','</div></div><div class="save-tools">');
 }
 if(a.id===3&&a.step==='event')body=`${garageRepairScene((a.repairDone||[]).length)}${body.replace('<div class="repair-scene">',`<div class="repair-scene actor-stage">${taskActor('repair',(a.repairDone||[]).length)}`)}`;
 if(a.id===4&&a.step==='choice')body=body.replace('<div class="income-stage budget-map">',`<div class="income-stage budget-map actor-stage">${taskActor('planning',(a.mapDone||[]).length)}`);
 const read=frameRead(a);
 const verseSpeaker=scriptureSpeaker(m,p);
 return `<div class="mission-toolbar">${button('← My city','home','text-button')}<span>CAREER MODE · ONE MONEY ADVENTURE${a.practice?' · PRACTICE':''}</span></div>${scriptureCard(m,verseSpeaker)}${characterHeader(m,a.step,p)}${lessonLanguageCard(m)}${storyRail(a)}<section class="mission-body visual-play" data-read="${escape(m.coreIdea)}">${body}</section>${characterFooter(m,a.step)}`;
}
export function dropAction(p,token,target){
 const a=p.active;if(!a)return null;
 if(a.id>=5&&['choice','event'].includes(a.step)&&token.startsWith('decision-')&&target==='decision-zone')return choose(p,token.slice(9));
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
   return {...next,active:{...next.active,invested,savedCoins:[...used,index],lastMove:'save',hint:'Maya took that money to the bank!'}};
  }
  return {...p,active:{...a,invested:invested+250,savedCoins:[...used,index],lastMove:'invest',hint:'Kai invested that money on the app!'}};
 }
 if(a.id===1&&a.project==='time'){
  const prep=a.yardPrep||[];
  if(token==='yard-gloves'&&target==='jordan-gear'&&prep.length===0)return {...p,active:{...a,yardPrep:['gloves'],hint:'Gloves are on! Now open the leaf bag.'}};
  if(token==='yard-bag'&&target==='bag-spot'&&prep.length===1)return {...p,active:{...a,yardPrep:[...prep,'bag'],hint:'Leaf bag is open! Now give Jordan the rake.'}};
  if(token==='yard-rake'&&target==='jordan-gear'&&prep.length===2)return {...p,active:{...a,yardPrep:[...prep,'rake'],hint:'Jordan has the rake. Rake each pile into the leaf bag!'}};
  if(token.startsWith('leaf-')&&target==='leaf-bag'&&prep.length===3)return playAction(p,`work-${token.slice(5)}`);
  return {...p,active:{...a,hint:`Finish step ${prep.length+1} before raking the leaves.`}};
 }
 if(a.id===1&&a.project==='product'&&token.startsWith('art-')&&target===`canvas-${token.slice(4)}`){const tool=Number(token.slice(4)),done=a.workDone||[];if(done.includes(tool))return p;return {...p,active:{...a,traceTool:tool,hint:`Trace the dotted line with ${artTools[tool].toLowerCase()}.`}};}
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
 const saved=p.savings+p.emergencyFund,invested=p.investments+p.stocks+p.etfs,careerPercent=Math.round(p.completed.length/missions.length*100);
 const playerAvatar=castIds.includes(p.avatar)?portrait(p.avatar,'city-player-character'):`<span class="avatar">${escape(p.avatar)}</span>`;
 const crewHero=`<section class="my-city-crew" aria-labelledby="city-welcome"><div class="city-sun" aria-hidden="true"></div><div class="city-buildings" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="money-sparkles" aria-hidden="true"><i>$</i><i>★</i><i>$</i><i>★</i></div><div class="city-crew-copy"><span>FINANCIAL FREEDOM</span><h1 id="city-welcome">MONEY OPS</h1><p><b>YOUR SKILLS. YOUR IDEAS.</b> A BRIGHTER TOMORROW.</p></div>${castPortraits('city-cast')}<div class="city-money-props" aria-hidden="true"><span class="hero-money-sign">$</span><div class="hero-gold"><i>GOLD</i><i>GOLD</i><i>GOLD</i></div><div class="hero-goals"><b>MY GOALS</b><span>✓ SAVE</span><span>✓ INVEST</span><span>✓ BUILD</span></div></div></section>`;
 const careerPortfolio=`<section class="career-portfolio" aria-labelledby="career-portfolio-title"><div class="career-portfolio-head"><div><span class="eyebrow">SAVED CAREER MODE</span><h2 id="career-portfolio-title">MY MONEY PORTFOLIO</h2></div><b>${p.completed.length}<small>/ 32 LESSONS</small></b></div><div class="little-score"><span>Cash <b>${money(p.cash+p.checking)}</b></span><span>Savings <b>${money(saved)}</b></span><span>Investments <b>${money(invested)}</b></span><span>Net worth <b>${money(netWorth(p))}</b></span></div><div class="career-progress" role="progressbar" aria-label="Career journey progress" aria-valuenow="${careerPercent}" aria-valuemin="0" aria-valuemax="100"><i style="width:${careerPercent}%"></i><span>STARTED AT $0</span><b>${careerPercent}% COMPLETE</b></div><p>Your hero’s lesson progress and money totals save automatically on this device.</p></section>`;
 return `<main id="main" class="little-base campaign-route career-mode" tabindex="-1" data-read="Career Mode. Start with zero dollars. Take your chosen hero through 32 lessons to build savings, investments, and financial freedom.">${crewHero}<div class="career-mode-ribbon"><span>CAREER MODE</span><b>ONE HERO · 32 LESSONS · ONE SAVED FINANCIAL JOURNEY</b></div><div class="little-player">${playerAvatar}<div class="identity"><small>YOUR CAREER HERO</small><h2>${escape(p.name)}</h2><span>${rank(p.xp).toUpperCase()} · ${p.xp.toLocaleString('en-US')} XP · ${p.completed.length}/${missions.length} lessons</span></div>${button('🔊 READ THIS SCREEN','read-aloud','secondary')}</div>${careerPortfolio}<section class="next-mission-card ${complete?'campaign-complete':''}"><div><span class="eyebrow">${complete?'CAREER COMPLETE':activeMission?'CAREER LESSON IN PROGRESS':'NEXT CAREER LESSON'}</span><small>${featured.location||featured.sector}</small><h1>${complete?'FINANCIAL FREEDOM ACHIEVED':featured.title}</h1><p>${complete?'Review your financial story, replay a lesson, or begin a new financial life.':featured.brief}</p><div class="concept-chips">${(featured.concepts||featured.topic.split(' • ')).slice(0,5).map(term=>`<span>${term}</span>`).join('')}</div></div><div class="next-mission-action"><span aria-hidden="true">${complete?'★':featured.icon}</span>${button(complete?'REVIEW MY CAREER →':activeMission?'CONTINUE CAREER →':`START LESSON ${String(featured.id).padStart(2,'0')} →`,complete?'tab-ledger':`begin-${featured.id}`,'primary')}${complete?button('VIEW CAREER MAP','tab-map','secondary'):''}</div></section><div class="campaign-heading"><div><span class="eyebrow">32-LESSON CAREER JOURNEY</span><h1>BUILD YOUR FINANCIAL FUTURE.</h1></div><button class="world-buddy" data-action="cheer" aria-label="Make your Money Ops guide cheer"><span class="buddy-face">●‿●</span></button></div>${chapterMarkup}<div class="little-actions">${button('★ Achievements','tab-honors','secondary')}${button('▥ Career portfolio','tab-ledger','secondary')}${button('⚙ Career profile & sound','profile','secondary')}</div></main>`;
}
