export const cityStops=[
 ['Value Village','Value Maker'],['Income Avenue','Income Builder'],['Savings Harbor','Savings Planner'],['Budget Boulevard','Budget Builder'],
 ['Investment Heights','Investor'],['Energy Junction','Energy Planner'],['Credit Corner','Smart Borrower'],['Founder Square','Founder'],
 ['Wealth Way','Wealth Builder'],['Goal Gardens','Goal Setter'],['Ownership Exchange','Company Owner'],['Compound Clockworks','Growth Thinker'],
 ['Diversification Park','Risk Balancer'],['Index Plaza','Fund Explorer'],['Market Station','Market Reader'],['Company Row','Business Analyst'],
 ['Supply Market','Supply Planner'],['Purchasing Power Point','Inflation Tracker'],['Bank Bay','Banking Guide'],['Credit Commons','Credit Builder'],
 ['Debt-Free Drive','Debt Reducer'],['Protection Port','Risk Protector'],['Paycheck Place','Paycheck Reader'],['Opportunity Works','Problem Solver'],
 ['Profit Promenade','Profit Planner'],['Brand Boulevard','Brand Builder'],['Equity Estates','Property Planner'],['Career Campus','Skill Builder'],
 ['Generosity Grove','Community Giver'],['Independence Heights','Freedom Builder'],['Freedom Plan Center','Financial Planner'],['Grand Financial City','Financial Freedom Leader']
].map(([name,talent],index)=>({lessonId:index+1,name,talent}));

export const cityLandmarks=[
 {id:'town-center',name:'Opportunity Town Center',icon:'★',color:'#ffcf65'},
 {id:'savings-bank',name:'Savings Bank',icon:'$',color:'#70c483'},
 {id:'skills-academy',name:'Skills Academy',icon:'✦',color:'#54c7de'},
 {id:'business-market',name:'Business Market',icon:'▦',color:'#ef7594'},
 {id:'investment-tower',name:'Investment Tower',icon:'↗',color:'#a98cff'},
 {id:'housing-gardens',name:'Housing Gardens',icon:'⌂',color:'#74b9ff'},
 {id:'community-center',name:'Community Center',icon:'♥',color:'#ff8f70'},
 {id:'freedom-skyline',name:'Freedom Skyline',icon:'◆',color:'#d9f577'}
];

export const cityUpgradeCost=100;
export const cityStagesPerLandmark=4;

export function normalizeCity(value={}){
 const upgrades=Object.fromEntries(cityLandmarks.map(landmark=>[landmark.id,Math.max(0,Math.min(cityStagesPerLandmark,Math.floor(Number(value?.upgrades?.[landmark.id])||0)))]));
 return {bank:Math.max(0,Math.floor(Number(value?.bank)||0)),lifetimeCoins:Math.max(0,Math.floor(Number(value?.lifetimeCoins)||0)),upgrades,lastBuild:value?.lastBuild||null,notice:value?.notice||''};
}

export function cityTotals(profile){
 const city=normalizeCity(profile?.city),built=Object.values(city.upgrades).reduce((sum,value)=>sum+value,0),permits=profile?.mode==='arcade'?32:Math.min(32,profile?.completed?.length||0);
 return {city,built,permits,remaining:32-built,complete:built===32,talents:Math.min(32,profile?.completed?.length||0)};
}

export function depositCityCoins(profile,amount){
 const city=normalizeCity(profile?.city),coins=Math.max(0,Math.floor(Number(amount)||0));
 return {...profile,city:{...city,bank:city.bank+coins,lifetimeCoins:city.lifetimeCoins+coins,notice:coins?`${coins} coins deposited in your City Bank.`:city.notice}};
}

export function buildCity(profile,landmarkId){
 const totals=cityTotals(profile),landmark=cityLandmarks.find(item=>item.id===landmarkId),stage=totals.city.upgrades[landmarkId];
 let notice='Choose a city landmark.';
 if(!landmark)return {...profile,city:{...totals.city,notice}};
 if(stage>=cityStagesPerLandmark)notice=`${landmark.name} is fully built.`;
 else if(totals.built>=totals.permits)notice=profile.mode==='arcade'?'Earn 100 more coins to build again.':'Complete another lesson to earn a construction permit.';
 else if(totals.city.bank<cityUpgradeCost)notice=`You need ${cityUpgradeCost-totals.city.bank} more coins for the next build.`;
 else{
  const upgrades={...totals.city.upgrades,[landmarkId]:stage+1};
  notice=`${landmark.name}: stage ${stage+1} of ${cityStagesPerLandmark} built!`;
  return {...profile,city:{...totals.city,bank:totals.city.bank-cityUpgradeCost,upgrades,lastBuild:landmarkId,notice}};
 }
 return {...profile,city:{...totals.city,notice}};
}

function stopState(profile,stop){
 if(profile?.completed?.includes(stop.lessonId))return 'complete';
 const current=(profile?.completed?.length||0)+1;
 return stop.lessonId===current?'current':'locked';
}

export function cityJourneyMarkup(profile,escape){
 const totals=cityTotals(profile),next=cityStops.find(stop=>!profile.completed.includes(stop.lessonId))||cityStops.at(-1);
 return `<section class="grand-city-journey" aria-labelledby="grand-city-title"><div class="grand-city-copy"><span>YOUR 32-STOP FINANCIAL JOURNEY</span><h1 id="grand-city-title">GRAND FINANCIAL CITY</h1><p>Finish each lesson to reach a new destination and collect its talent. Runner coins go into your City Bank so you can build the city as you learn.</p><div class="city-journey-stats"><b>${totals.talents}<small>/ 32 TALENTS</small></b><b>${profile.completed.length}<small>/ 32 DESTINATIONS</small></b><b>${totals.city.bank}<small>CITY BANK COINS</small></b></div><strong>NEXT STOP · ${escape(next.name)}</strong></div><div class="city-route" aria-label="32 city destinations">${cityStops.map(stop=>{const state=stopState(profile,stop);return `<div class="city-destination ${state}" title="Lesson ${stop.lessonId}: ${escape(stop.name)}"><i>${state==='complete'?'✓':String(stop.lessonId).padStart(2,'0')}</i><span><b>${escape(stop.name)}</b><small>${state==='complete'?`TALENT COLLECTED · ${escape(stop.talent)}`:state==='current'?'NEXT DESTINATION':'LOCKED'}</small></span></div>`;}).join('')}</div></section>`;
}

export function cityBuilderMarkup(profile,button,escape,{compact=false}={}){
 const {city,built,permits,complete}=cityTotals(profile),arcade=profile.mode==='arcade';
 const permitReady=built<permits;
 return `<section class="grand-city-builder ${compact?'compact':''}" aria-labelledby="city-builder-title"><div class="city-builder-heading"><div><span>${arcade?'YOUR TEMPORARY ARCADE TOWN':'SAVED CAREER CITY'}</span><h2 id="city-builder-title">${complete?'GRAND FINANCIAL CITY COMPLETE!':arcade?'BUILD YOUR OWN TOWN':'BUILD YOUR GRAND CITY'}</h2><p>${arcade?'Collect 100 coins in a run, then spend them on one town-building stage. Each landmark has four stages.':'Every runner coin enters the City Bank. Spend 100 coins on one construction stage. Each landmark has four stages.'}</p></div><div class="city-bank"><small>CITY BANK</small><b>${city.bank}</b><span>COINS</span></div></div>${arcade?'<div class="city-reset-warning"><b>TOWN IS TEMPORARY</b> Town construction resets when you leave Arcade Mode. Initials and top scores remain on this device.</div>':''}<div class="city-construction-status"><span><b>${built}</b> / 32 CITY STAGES BUILT</span><span>${arcade?`<b>${Math.floor(city.bank/cityUpgradeCost)}</b> 100-COIN TOWN BUILDS READY`:`<b>${permits-built}</b> BUILD PERMITS READY`}</span><span>TOWN CENTER: <b>${city.upgrades['town-center']} / 4</b></span></div><div class="city-skyline" aria-label="Grand Financial City construction map">${cityLandmarks.map((landmark,index)=>{const stage=city.upgrades[landmark.id],canBuild=stage<4&&city.bank>=cityUpgradeCost&&permitReady;return `<article class="city-lot ${stage===4?'finished':''}" style="--landmark:${landmark.color}"><div class="city-building" data-stage="${stage}" aria-label="${escape(landmark.name)}, stage ${stage} of 4"><span class="city-building-icon">${landmark.icon}</span>${[4,3,2,1].map(level=>`<i class="${stage>=level?'built':''}"></i>`).join('')}<em>${stage?`${stage}/4`:'EMPTY LOT'}</em></div><h3>${escape(landmark.name)}</h3>${stage===4?'<b class="city-built-label">COMPLETE</b>':button(`BUILD STAGE ${stage+1} · 100 COINS`,`city-build-${landmark.id}`,'city-build-button',canBuild?'':'disabled')}</article>`;}).join('')}</div><p class="city-build-notice" role="status">${escape(city.notice||(arcade?'Collect 100 coins in an Arcade run to build the next part of your own town.':permitReady?'A construction permit is ready. Collect 100 coins to use it.':'Complete your next lesson to earn a construction permit.'))}</p></section>`;
}
