import {installDrag} from './drag.js';
import {visualMission,playAction,dropAction,littleBase} from './play.js';
import {missions,badges} from './content.js';
import {newGame,begin,choose,resolve,finish,rank,nextRank,netWorth,ranks} from './engine.js';
import {load,save,clear,storageWarning} from './persistence.js';
import {setMusic,sound} from './audio.js';
import {characters,castIds,portrait} from './characters.js';
const app=document.querySelector('#app');let p=load();let tab='operations';let resetting=false;let selectedToken=null;let suppressClickUntil=0;let activeTrace=null;
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(text,action,cls='',extra='')=>`<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
function progress(){const next=nextRank(p.xp);const current=ranks.filter(r=>p.xp>=r[1]).at(-1);const pct=next?Math.min(100,(p.xp-current[1])/(next[1]-current[1])*100):100;return `<div class="xp-row"><span>${p.xp} XP</span><span>${next?`${next[1]-p.xp} TO ${next[0].toUpperCase()}`:'TOP RANK'}</span></div><div class="bar" role="progressbar" aria-label="Rank progress" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>`;}
function header(){return `<header><a class="brand" href="./" aria-label="Money Ops home"><span class="brand-mark">M<span>↗</span></span><span><small>FINANCIAL FREEDOM</small><b>MONEY OPS<span class="version"> / 34.0</span></b></span></a><div class="header-right"><span class="system"><i></i> CAREER SAVED</span>${button(p.muted?'SOUND OFF':'SOUND ON','mute','utility',`aria-pressed="${!p.muted}" aria-label="${p.muted?'Enable':'Mute'} sound"`)}</div></header>`;}
function playerPortrait(className=''){return characters[p.avatar]?portrait(p.avatar,className):`<span class="avatar">${escape(p.avatar)}</span>`;}
function profile(){return `<aside class="profile panel" style="--player-accent:${p.playerStyle?.accent||'#d9f577'}"><div class="eyebrow">YOUR CAREER HERO <span>${escape(p.playerStyle?.emblem||'◈')}</span></div><div class="identity">${playerPortrait('profile-character')}<div><h2>${escape(p.name)}</h2><span class="rank">${rank(p.xp)}</span></div></div>${progress()}<div class="profile-metrics"><span>LESSONS DONE<b>${p.completed.length} <em>/ ${missions.length}</em></b></span><span>CAREER JOURNEY<b>32 <em>levels</em></b></span></div><div class="aside-note"><span class="tiny-icon">${escape(p.playerStyle?.emblem||'◈')}</span><p>Your career starts at $0.<br><strong>Build value, savings, and investments.</strong></p></div><details class="rank-details"><summary>See all ranks</summary><div class="rank-ladder">${ranks.map(([r,x])=>`<div class="${p.xp>=x?'reached':''}"><span>${p.xp>=x?'◆':'◇'}</span>${r}<small>${x} XP</small></div>`).join('')}</div></details>${button('Career profile & save','profile','text-button')}</aside>`;}
function title(){const colors=['#d9f577','#54c7de','#ffcf65','#ef7594','#a98cff','#70c483'];return `<div class="title-screen"><div class="title-nav"><span class="eyebrow">POLARIS VILLAGE ACADEMY</span><span class="edition">COMPLETE 32-LESSON CAREER MODE</span></div><main id="main" tabindex="-1"><div class="title-content"><div class="eyebrow"><span class="live-dot"></span> CAREER MODE · BUILD YOUR HERO</div><p class="title-kicker">FINANCIAL FREEDOM</p><h1>MONEY<br><span>OPS.</span></h1><p class="title-description"><strong>Start with $0.</strong> Take one character through all 32 lessons. Earn money, grow savings, build an investment portfolio, and return anytime with progress saved.</p><div class="career-promise" aria-label="Career mode journey"><span><b>$0</b>START</span><i>→</i><span><b>32</b>LESSONS</span><i>→</i><span><b>$$$</b>BUILD</span></div><form id="profile-form"><label for="name">PLAYER NAME</label><input id="name" name="name" maxlength="24" placeholder="Enter your name" autocomplete="off" required><fieldset class="character-picker"><legend>1 · CHOOSE YOUR CAREER HERO</legend>${castIds.map((id,i)=>`<label class="character-option"><input type="radio" name="avatar" value="${id}" ${i===0?'checked':''}><span>${portrait(id,'creator-character')}<b>${characters[id].name}</b><small>${characters[id].role}</small></span></label>`).join('')}</fieldset><fieldset class="color-picker"><legend>2 · CHOOSE YOUR TEAM COLOR</legend>${colors.map((color,i)=>`<label><input type="radio" name="accent" value="${color}" ${i===0?'checked':''}><span style="--swatch:${color}"></span></label>`).join('')}</fieldset><fieldset><legend>3 · CHOOSE YOUR MISSION BADGE</legend>${['◈','↗','⌁','◎'].map((a,i)=>`<label class="emblem"><input type="radio" name="emblem" value="${a}" ${i===0?'checked':''}><span>${a}</span></label>`).join('')}</fieldset><button class="primary" type="submit">START CAREER MODE <span>↗</span></button></form><p class="fine">1 persistent hero · $0 starting balance · 32 connected lessons · automatic local saving</p>${storageWarning?`<p class="warning" role="alert">${storageWarning}</p>`:''}</div><div class="title-coordinate">BUILD YOUR CHARACTER <span>CAREER READY</span></div></main><footer>${castIds.map(id=>portrait(id,'title-footer-character')).join('')}<span>EARN → SAVE → INVEST → FREEDOM</span></footer></div>`;}
function missionCards(){return `<div class="section-title"><h2>YOUR MISSIONS</h2><span>${String(missions.length).padStart(2,'0')} CONNECTED MISSIONS</span></div><div class="mission-grid">${missions.map(m=>{const done=p.completed.includes(m.id);const locked=!done&&m.id>1&&!p.completed.includes(m.id-1);const terms=(m.concepts||m.topic.split(' • ')).slice(0,3).join(' · ');return `<article class="mission-card mission-${m.id} ${locked?'locked':''}"><div class="card-top"><span class="eyebrow">MISSION ${String(m.id).padStart(2,'0')}</span><span class="tag ${done?'complete':''}">${done?'✓ COMPLETED':locked?'◇ LOCKED':'● AVAILABLE'}</span></div><div class="mission-art"><span>${m.icon}</span><i></i><i></i><i></i></div><div class="mission-copy"><small>${m.location||m.sector}</small><h3>${m.title}</h3><p>${m.topic}</p><div class="mission-bottom"><span>${terms}</span>${button(done?'Replay ↻':locked?`Complete Mission ${String(m.id-1).padStart(2,'0')}`:'Play ↗',`begin-${m.id}`,'card-button',locked?'disabled':'')}</div></div></article>`;}).join('')}</div>`;}
function badgePanel(){return `<section class="panel badges"><div class="section-title"><h2>YOUR BADGES</h2><span>${p.badges.length} / ${badges.length}</span></div><div class="badge-grid">${badges.map(b=>`<div class="badge ${p.badges.includes(b.id)?'earned':''}"><span class="badge-icon">${b.icon}</span><strong>${b.name}</strong><small>${b.detail}</small><em>${p.badges.includes(b.id)?'UNLOCKED':'LOCKED'}</em></div>`).join('')}</div></section>`;}
function map(){return `<h1>COMPLETE CAREER MAP</h1><p class="play-prompt">Your chosen hero carries one financial life through all 32 lessons. Every completed lesson saves career progress, savings, investments, and decisions.</p>${missionCards()}`;}
function history(){const totals=[['Cash + checking',p.cash+p.checking],['Savings + emergency fund',p.savings+p.emergencyFund],['Investments + stocks + ETFs',p.investments+p.stocks+p.etfs],['Property + business + other assets',p.property+p.businessValue+p.assets+p.otherAssets],['Debt + loans',p.debt+p.loans],['Monthly income',p.monthlyIncome],['Monthly expenses',p.monthlyExpenses],['Giving / impact',p.giving],['Net worth',netWorth(p)]];return `<section class="panel"><div class="section-title"><h2>MY FINANCIAL STORY</h2><span>SIMULATED DOLLARS</span></div><div class="ledger">${totals.map(([k,v])=>`<div><span>${k}</span><b>${money(v)}</b></div>`).join('')}<div><span>Credit score</span><b>${p.creditScore}</b></div></div><p class="muted">Net worth equals everything you own minus everything you owe. Market returns and life events in Money Ops are simulations, not promises.</p><h3>DECISION HISTORY</h3>${p.history.length?p.history.map(h=>`<div class="history-row"><span>MISSION ${String(h.mission).padStart(2,'0')}${h.practice?' / PRACTICE':''}<b>${escape(h.title||h.choice)}</b><small>${escape(h.choice)}</small></span><span>${money(h.worth)} net worth<small>${money(h.borrowed)} new debt</small></span></div>`).join(''):'<p class="muted">Your first decision starts the story.</p>'}</section>`;}
function settings(){return `<section class="panel settings"><div class="eyebrow">SAVED CAREER PROFILE</div><h1>YOUR CAREER.</h1><p>Your hero, current lesson, scores, savings, investments, and decisions save after every action in this browser. Use CONTINUE CAREER to resume an unfinished lesson.</p><form id="rename-form"><label for="rename">PLAYER NAME</label><input id="rename" name="name" maxlength="24" required value="${escape(p.name)}"><button class="primary">UPDATE NAME</button></form><div class="audio-settings"><label for="music-volume">MUSIC VOLUME <output>${Math.round(p.musicVolume*100)}%</output></label><input id="music-volume" data-setting="musicVolume" type="range" min="0" max="1" step="0.05" value="${p.musicVolume}"><label for="sfx-volume">SFX VOLUME <output>${Math.round(p.sfxVolume*100)}%</output></label><input id="sfx-volume" data-setting="sfxVolume" type="range" min="0" max="1" step="0.05" value="${p.sfxVolume}"></div>${button(p.muted?'ENABLE AUDIO':'MUTE AUDIO','mute','secondary')}${button('Export career save ↓','export','secondary')}<p class="muted">Export creates a local backup of the complete Career Mode profile.</p><hr><h2>NEW CAREER / RESET PROFILE</h2><p>Reset removes this device's current hero, choices, lessons, and financial portfolio.</p>${resetting?`<div class="warning">This clears your complete career.${button('Keep my career','cancel-reset','secondary')}${button('Start a new financial life','confirm-reset','danger')}</div>`:button('Reset career','reset','secondary')}</section>`;}
function base(){
 if(tab==='operations')return `${header()}${littleBase(p,button,escape)}${storageWarning?`<p role="alert" class="warning">${storageWarning}</p>`:''}`;
 const content=tab==='map'?map():tab==='honors'?badgePanel():tab==='ledger'?history():settings();
 return `${header()}<div class="layout">${profile()}<main id="main" tabindex="-1"><nav class="tabs" aria-label="Career sections">${[['operations','CAREER HOME'],['map','CAREER MAP'],['honors','ACHIEVEMENTS'],['ledger','MY PORTFOLIO']].map(([id,label])=>button(label,`tab-${id}`,tab===id?'active':'',`aria-current="${tab===id?'page':'false'}"`)).join('')}</nav>${p.lastReward?`<div class="reward" role="status">${p.lastReward.rankUp?`◆ RANK UP: ${p.lastReward.rankUp.toUpperCase()} · `:'✓ LESSON SAVED · '}${p.lastReward.xp?`+${p.lastReward.xp} XP`:'Practice complete — career finances preserved'}${button('Dismiss','dismiss','text-button')}</div>`:''}${p.active?`<div class="reward">CAREER LESSON ${String(p.active.id).padStart(2,'0')} IN PROGRESS${button('CONTINUE CAREER →',`begin-${p.active.id}`,'text-button')}</div>`:''}${content}${storageWarning?`<p role="alert" class="warning">${storageWarning}</p>`:''}<footer><span>MONEY OPS / CAREER MODE</span><span>${storageWarning?'SAVE UNAVAILABLE':'CAREER PROGRESS SAVED ON THIS DEVICE'} <i class="live-dot"></i></span></footer></main></div>`;
}
function mission(){return `${header()}<div class="reader-control">${button('🔊 READ THIS SCREEN','read-aloud','secondary')}</div><main id="main" class="mission-main" tabindex="-1">${visualMission(p,button,escape)}</main>`;}
const counterValues=new Map();
function animateMoney(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 app.querySelectorAll('[data-money]').forEach(el=>{const target=Number(el.dataset.money),key=el.dataset.counter,start=counterValues.get(key)??target;counterValues.set(key,target);if(reduced||start===target)return;const t=performance.now();function frame(now){if(!el.isConnected)return;const fraction=Math.min(1,(now-t)/450);el.textContent=money(Math.round(start+(target-start)*(1-(1-fraction)**3)));if(fraction<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);});
}
function initializeTraceBoards(){app.querySelectorAll('.trace-board').forEach(board=>{const path=board.querySelector('.trace-guide'),start=path?.getPointAtLength(0),length=path?.getTotalLength()||0;if(!start)return;for(const selector of ['.trace-start','.trace-cursor']){const dot=board.querySelector(selector);dot?.setAttribute('cx',start.x);dot?.setAttribute('cy',start.y);}const ink=board.querySelector('.trace-ink');if(ink){ink.style.strokeDasharray=length;ink.style.strokeDashoffset=length;}});}
function completeArtTrace(tool){if(p?.active?.id!==1||p.active.project!=='product'||p.active.traceTool!==tool)return;const next=playAction(p,`work-${tool}`);if(next)commit(next,next.active.step==='debrief'?'earn':'success');}
function traceLocation(board,event){const point=board.createSVGPoint();point.x=event.clientX;point.y=event.clientY;return point.matrixTransform(board.getScreenCTM().inverse());}
function advanceTrace(event){const session=activeTrace;if(!session||session.pointerId!==event.pointerId||!session.board.isConnected)return;const point=traceLocation(session.board,event),path=session.path;let best=-1;for(let i=session.index;i<Math.min(session.total,session.index+9);i++){const target=path.getPointAtLength(session.length*i/(session.total-1));if(Math.hypot(point.x-target.x,point.y-target.y)<48)best=i;}if(best<0)return;session.index=best+1;const progress=Math.min(1,session.index/session.total),ink=session.board.querySelector('.trace-ink'),cursor=session.board.querySelector('.trace-cursor'),target=path.getPointAtLength(session.length*Math.min(session.index,session.total-1)/(session.total-1));ink.style.strokeDashoffset=session.length*(1-progress);cursor.setAttribute('cx',target.x);cursor.setAttribute('cy',target.y);session.board.closest('.trace-activity')?.querySelector('.trace-meter i')?.style.setProperty('width',`${Math.round(progress*100)}%`);const label=session.board.closest('.trace-activity')?.querySelector('.trace-meter b');if(label)label.textContent=`${Math.round(progress*100)}% TRACED`;if(progress>=.94&&!session.complete){session.complete=true;completeArtTrace(Number(session.board.dataset.traceTool));}}
function fixArrowIcons(){
 const targets=app.querySelectorAll('button,.mission-art,.badge-icon,.honor-icons,.brand-mark');
 targets.forEach(el=>{const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())if(walk.currentNode.textContent.includes('↗'))nodes.push(walk.currentNode);nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split('↗').forEach((text,i)=>{if(i){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');icon.setAttribute('class','arrow-icon');icon.innerHTML='<path d="M4 20L20 4M5 4h15v15" fill="none" stroke="currentColor" stroke-width="2"/>';fragment.append(icon);}fragment.append(document.createTextNode(text));});node.replaceWith(fragment);});});
}
function render(focus=false){selectedToken=null;activeTrace=null;window.speechSynthesis?.cancel();app.innerHTML=p?(p.screen==='mission'&&p.active?mission():base()):title();if(p)app.style.setProperty('--player-accent',p.playerStyle?.accent||'#d9f577');fixArrowIcons();animateMoney();initializeTraceBoards();if(focus){document.querySelector('#main')?.focus({preventScroll:true});window.scrollTo(0,0);}}
function commit(next,kind='click',focus=true){p=next;save(p);sound(kind,p.muted,p.sfxVolume);setMusic(p.muted,p.musicVolume);render(focus);}
app.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);const name=String(data.get('name')||'').trim();if(!name)return;if(e.target.id==='profile-form')commit(newGame(name,String(data.get('avatar')), {accent:String(data.get('accent')),emblem:String(data.get('emblem'))}),'start');if(e.target.id==='rename-form')commit({...p,name});});
app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled||!p)return;const action=b.dataset.action;
 if(performance.now()<suppressClickUntil)return;
 if(action==='read-aloud'){const text=document.querySelector('[data-read]')?.dataset.read||document.querySelector('.play-prompt')?.textContent||'Choose mission one to create value and earn money. Then build income, save, and plan.';if('speechSynthesis' in window){const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.85;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);}else document.querySelector('#announcer').textContent='Read aloud is not supported in this browser.';return;}
 if(action==='cheer'){b.classList.remove('cheer');void b.offsetWidth;b.classList.add('cheer');sound('success',p.muted,p.sfxVolume);document.querySelector('#announcer').textContent='Your Money Ops guide is cheering!';return;}
 if(action.startsWith('pop-spark-')){b.classList.add('collected');b.disabled=true;sound('xp',p.muted,p.sfxVolume);document.querySelector('#announcer').textContent='Achievement marker collected!';return;}
 if(action.startsWith('complete-trace-')){completeArtTrace(Number(action.slice(15)));return;}
 if(action.startsWith('select-')){selectedToken=action.slice(7);app.querySelectorAll('[data-drag]').forEach(el=>{const active=el.dataset.drag===selectedToken;el.classList.toggle('picked',active);el.setAttribute('aria-pressed',String(active));});document.querySelector('#announcer').textContent='Picked up. Now tap its home.';return;}
 if(action.startsWith('drop-')){if(selectedToken)handleDrop(selectedToken,action.slice(5));return;}
 if(action.startsWith('mark-decision-')){const id=action.slice(14);selectedToken=`decision-${id}`;const workbench=b.closest('.decision-workbench'),crossout=workbench?.classList.contains('method-crossout');workbench?.querySelectorAll('.decision-card').forEach(card=>{const selected=card===b;card.classList.toggle('circled',selected);card.classList.toggle('crossed',crossout&&!selected);card.setAttribute('aria-pressed',String(selected));});const confirm=workbench?.querySelector('[data-action="confirm-decision"]');if(confirm)confirm.disabled=false;document.querySelector('#announcer').textContent=crossout?'Other choices crossed out. Your choice is circled. Confirm it.':'Choice circled. Confirm it.';return;}
 if(action==='confirm-decision'&&selectedToken?.startsWith('decision-')){commit(choose(p,selectedToken.slice(9)),'warning');return;}
 const playNext=playAction(p,action);if(playNext){commit(playNext,playNext.active.step==='debrief'?'earn':action.startsWith('save-')?'click':'xp');return;}
 if(action==='mute'){commit({...p,muted:!p.muted},'click',false);document.querySelector('[data-action="mute"]')?.focus();return;}
 if(action.startsWith('tab-')){tab=action.slice(4);commit({...p,screen:'base'});return;}
 if(action==='profile'){tab='profile';render(true);return;}
 if(action.startsWith('begin-')){const id=Number(action.slice(6));if(p.active&&p.active.id===id){commit({...p,screen:'mission'},'start');return;}if(p.active){document.querySelector('#announcer').textContent='Finish your current mission before starting another.';return;}commit(begin(p,id),'start');return;}
 if(action==='home'){commit({...p,screen:'base'});return;}
 if(action==='next'){const a=p.active;if(a&&['brief','learn'].includes(a.step))commit({...p,active:{...a,step:'choice'}});return;}
 if(action.startsWith('choose-')){commit(choose(p,action.slice(7)),p.active.id===1?'earn':'warning');return;}
 if(action==='resolve'){commit(resolve(p),'loss');return;}
 if(action==='finish-to-plan'&&p.active?.id===1&&p.active.step==='debrief'&&!p.active.practice){const completed=finish(p);const next=begin(completed,2);tab='operations';commit(next,completed.lastReward?.rankUp?'rank':'achievement');document.querySelector('#announcer').textContent='You created value and earned money. Now build more income.';return;}
 if(action==='finish-to-save'&&p.active?.id===2&&p.active.step==='debrief'&&!p.active.practice){const earned=p.active.wallet.cash;const completed=finish(p);const next=begin(completed,3);next.active={...next.active,fromEarning:{amount:earned,job:'safe'},jobBanked:false};tab='operations';commit(next,completed.lastReward?.rankUp?'rank':'achievement');document.querySelector('#announcer').textContent=`You built ${money(earned)} in income. Now save some.`;return;}
 if(action==='finish'){const next=finish(p);tab='operations';commit(next,next.lastReward?.rankUp?'rank':'achievement');return;}
 if(action==='retry-mission'){const id=p.active?.id;if(!id)return;commit(begin({...p,active:null,screen:'base'},id),'start');return;}
 if(action==='dismiss'){commit({...p,lastReward:null});return;}
 if(action==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='money-ops-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(action==='reset'||action==='cancel-reset'){resetting=action==='reset';render(true);return;}
 if(action==='confirm-reset'){p=null;clear();resetting=false;tab='operations';render(true);}
});
render();

app.addEventListener('pointerdown',event=>{const board=event.target.closest('.trace-board');if(!board||event.button!==0)return;event.preventDefault();board.setPointerCapture(event.pointerId);activeTrace={board,path:board.querySelector('.trace-guide'),length:board.querySelector('.trace-guide').getTotalLength(),index:0,total:64,pointerId:event.pointerId,complete:false};advanceTrace(event);});
app.addEventListener('pointermove',event=>{if(activeTrace){event.preventDefault();advanceTrace(event);}});
app.addEventListener('pointerup',event=>{if(activeTrace?.pointerId===event.pointerId)activeTrace=null;});
app.addEventListener('pointercancel',()=>{activeTrace=null;});

app.addEventListener('input',event=>{
 const input=event.target.closest('[data-setting]');
 if(!input||!p)return;
 const key=input.dataset.setting,value=Math.max(0,Math.min(1,Number(input.value)));
 if(!['musicVolume','sfxVolume'].includes(key)||!Number.isFinite(value))return;
 p={...p,[key]:value};save(p);
 input.previousElementSibling?.querySelector('output')?.replaceChildren(`${Math.round(value*100)}%`);
 if(key==='musicVolume')setMusic(p.muted,value);
 else sound('click',p.muted,value);
});

function progressCount(a){
 if(!a)return 0;
 if(a.id===1)return (a.yardPrep||[]).length+(a.workDone||[]).length;
 if(a.step==='event'||a.step==='debrief')return (a.repairDone||[]).length+5;
 return (a.jobBanked?1:0)+(a.planned||0)/250;
}
function handleDrop(token,target){
 const before=p.active,next=dropAction(p,token,target);
 if(!next)return;
 const after=next.active,finished=after.step==='debrief',progressed=progressCount(after)>progressCount(before)||after.step!==before.step||after.traceTool!==before.traceTool;
 let kind='retry';
 if(progressed){
  if(finished)kind=after.id===1?'earn':'achievement';
  else if(token==='earnings-bag'||token.startsWith('coin'))kind='coin';
  else if(token.startsWith('tool-'))kind='repair';
  else kind='success';
 }
 commit(next,kind,finished);
 const stage=app.querySelector('.visual-play');
 stage?.classList.add(progressed?'action-success':'action-retry');
 stage?.querySelector('.journey-buddy')?.classList.add(progressed?'cheer':'oops');
 if(progressed&&!finished){
  let fresh=null;
  if(token==='earnings-bag'||token.startsWith('coin'))fresh=stage?.querySelector('.jar');
  else if(token.startsWith('tool-'))fresh=stage?.querySelector('.car-bay .play-art');
  else if(target==='basket')fresh=stage?.querySelector('.drop-basket');
  else fresh=stage?.querySelector(`[data-drop="${target}"]`);
  fresh?.classList.add('fresh-success');
 }
 const message=finished
  ?after.id===1?'You created value and earned money!':'The car is fixed. See how savings helped.'
  :progressed?(after.hint||'Great move!'):after.hint||'Try its matching home!';
 document.querySelector('#announcer').textContent=message;
}
installDrag(app,(token,target)=>{suppressClickUntil=performance.now()+150;handleDrop(token,target);});
