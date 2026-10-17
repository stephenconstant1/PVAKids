const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[];
 const url=process.env.MONEY_OPS_URL||'http://127.0.0.1:8080';
 async function student(width=1280,touch=false){
  const c=await browser.newContext({viewport:{width,height:950},hasTouch:touch});
  const page=await c.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(url);
  await page.locator('#name').fill('Maya');
  await page.locator('button[type="submit"]').click();
  return page;
 }
 const click=(p,a)=>p.locator(`[data-action="${a}"]`).first().click();
 const state=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')));
 const moneyState=p=>({cash:p.cash,savings:p.savings,debt:p.debt,xp:p.xp,completed:p.completed});
 async function drag(p,token,target){
  const source=p.locator(`[data-drag="${token}"]:not(:disabled)`).filter({visible:true}).first(),destination=p.locator(`[data-drop="${target}"]`);
  await destination.scrollIntoViewIfNeeded();
  const a=await source.boundingBox();
  const b=await destination.boundingBox();
  await p.mouse.move(a.x+a.width/2,a.y+a.height/2);
  await p.mouse.down();
  await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});
  await p.mouse.up();
  await p.waitForTimeout(170);
 }
 async function touchDrag(p,token,target){
  const client=await p.context().newCDPSession(p);
  const source=p.locator(`[data-drag="${token}"]:not(:disabled)`).first(),destination=p.locator(`[data-drop="${target}"]`);
  await destination.scrollIntoViewIfNeeded();
  const a=await source.boundingBox();
  const b=await destination.boundingBox();
  const from={x:a.x+a.width/2,y:a.y+a.height/2},to={x:b.x+b.width/2,y:b.y+b.height/2};
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});
  for(let i=1;i<=12;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/12,y:from.y+(to.y-from.y)*i/12}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await p.waitForTimeout(170);
  await client.detach();
 }
 async function tap(p,token,target){
  await click(p,`select-${token}`);
  await click(p,`drop-${target}`);
 }
 async function keyboardTap(p,token,target){
  await p.locator(`[data-action="select-${token}"]`).focus();
  await p.keyboard.press('Enter');
  await p.locator(`[data-action="drop-${target}"]`).focus();
  await p.keyboard.press('Enter');
 }
 async function moveNextCoin(p,move=drag){
  const token=await p.locator('.save-coin:not(:disabled)').first().getAttribute('data-drag');
  await move(p,token,'save');
 }
 async function makeDecision(p,scope){
  const workbench=p.locator(`${scope} .decision-workbench`);
  if(await workbench.evaluate(element=>element.classList.contains('method-grab'))){
   const token=await workbench.locator('[data-drag]').first().getAttribute('data-drag');
   await drag(p,token,'decision-zone');
  }else{
   await workbench.locator('.decision-card').first().click();
   await workbench.locator('[data-action="confirm-decision"]').click();
  }
 }
 async function traceLine(p){
  const board=p.locator('.trace-board');
  await board.scrollIntoViewIfNeeded();
  const points=await board.evaluate(svg=>{const path=svg.querySelector('.trace-guide'),length=path.getTotalLength(),matrix=path.getScreenCTM();return Array.from({length:100},(_,i)=>{const point=path.getPointAtLength(length*i/99);return {x:matrix.a*point.x+matrix.c*point.y+matrix.e,y:matrix.b*point.x+matrix.d*point.y+matrix.f};});});
  await p.mouse.move(points[0].x,points[0].y);await p.mouse.down();
  for(const point of points.slice(1))await p.mouse.move(point.x,point.y,{steps:2});
  await p.mouse.up();await p.waitForTimeout(180);
 }
 async function enterLesson(p,id,exerciseRunner=false){
  await click(p,`begin-${id}`);
  if(await p.locator('.runner-intro').count()){
   assert.match(await p.locator('.runner-titlebar').textContent(),new RegExp(`WEEK ${String(id).padStart(2,'0')}`));
   assert.ok(await p.locator('.runner-chip.hazard').count()>=2);
   assert.ok(await p.locator('.runner-chip.reward').count()>=3);
   const before=await state(p),beforeWorth=before.cash+before.checking+before.savings+before.emergencyFund+before.investments+before.stocks+before.etfs+before.assets+before.otherAssets+before.property+before.businessValue-before.debt-before.loans;
   if(exerciseRunner){
    await click(p,'runner-start');
    assert.equal(await p.locator('#runner-canvas').count(),1);
    assert.equal(await p.locator('[data-runner-hud="lives"]').count(),1);
    assert.equal(await p.locator('[data-action="runner-restart"]').count(),1);
    await click(p,'runner-restart');
    assert.match(await p.locator('[data-runner-hud="goal"]').textContent(),/^0 \/ 100$/);
    assert.equal(await p.locator('.runner-vocab-feed').count(),1);
    await p.keyboard.press('Space');await p.keyboard.press('ArrowDown');
    await click(p,'runner-pause');assert.match(await p.locator('[data-runner-hud="power"]').textContent(),/PAUSED/);
    await p.waitForTimeout(250);await click(p,'runner-pause');
    await click(p,'runner-jump');await p.waitForTimeout(450);await click(p,'runner-finish-now');
   }else await click(p,'runner-skip');
   assert.equal(await p.locator('.runner-results').count(),1);
   const afterRun=await state(p),afterWorth=afterRun.cash+afterRun.checking+afterRun.savings+afterRun.emergencyFund+afterRun.investments+afterRun.stocks+afterRun.etfs+afterRun.assets+afterRun.otherAssets+afterRun.property+afterRun.businessValue-afterRun.debt-afterRun.loans;
   assert.equal(afterWorth,beforeWorth,'arcade rewards must not change financial net worth');
   assert.equal(afterRun.runnerProgress[id].pre.completed,true);
   await click(p,'runner-start-lesson');
  }
 }
 async function begin(p,id,exerciseRunner=false){
  await enterLesson(p,id,exerciseRunner);
  const scriptureBox=await p.locator('.scripture-card').boundingBox(),characterBox=await p.locator('.lesson-character-header').boundingBox();
  assert.ok(scriptureBox.y<scriptureBox.y+scriptureBox.height&&scriptureBox.y+scriptureBox.height<=characterBox.y,`mission ${id} scripture must be the header above the character lesson`);
  await assertCharacterLessonPattern(p,id);
  const bigIdea=(await p.locator('.sequence-brief .big-idea-description').textContent()).trim();
  assert.match(bigIdea,new RegExp(`^LESSON ${String(id).padStart(2,'0')} · BIG IDEA:\\s+\\S`));
  assert.ok(bigIdea.length>25,`mission ${id} opening bubble must explain its big idea`);
  if(id===1){
   const crewHeights=await p.locator('.week-one-hero .poster-cast .character-portrait').evaluateAll(images=>images.map(image=>Math.round(image.getBoundingClientRect().height)));
   assert.equal(crewHeights.length,6,'week one must show all six students');
   assert.ok(Math.max(...crewHeights)-Math.min(...crewHeights)<=2,`week one students must have one visual height: ${crewHeights.join(', ')}`);
  }
  await click(p,'next');
  await assertCharacterLessonPattern(p,id);
 }
 async function finishLesson(p,action='finish',exerciseBonus=false){
  await click(p,action);
  if(!await p.locator('.runner-bonus-intro').count())return;
  assert.match(await p.locator('.runner-bonus-intro').textContent(),/KNOWLEDGE UNLOCKED/);
  if(exerciseBonus){
   await click(p,'runner-start');
   assert.equal(await p.locator('#runner-canvas').count(),1);
   await click(p,'runner-jump');await p.waitForTimeout(350);await click(p,'runner-finish-now');
   assert.equal(await p.locator('.runner-comparison').count(),1);
   assert.match(await p.locator('.runner-reflection').textContent(),/not a financial literacy grade/i);
   await click(p,'runner-continue');
  }else await click(p,'runner-skip');
 }
 async function assertCharacterLessonPattern(p,id){
  assert.equal(await p.locator('.scripture-character-card .scripture-character').count(),1,`mission ${id} needs a character speaking scripture`);
  assert.equal(await p.locator('.scripture-character-card .scripture-bubble').count(),1,`mission ${id} needs a scripture speech bubble`);
  assert.equal(await p.locator('.lesson-character-header .direction-bubble').count(),1,`mission ${id} needs a character explaining the lesson`);
  const verseSpeaker=await p.locator('.scripture-character-card').getAttribute('data-scripture-speaker');
  const lessonSpeaker=await p.locator('.lesson-character-header').getAttribute('data-lesson-speaker');
  assert.notEqual(verseSpeaker,lessonSpeaker,`mission ${id} must use two different character voices`);
  assert.match((await p.locator('.scripture-bubble blockquote').textContent()).trim(),/^“\S[\s\S]+”$/);
  assert.match((await p.locator('.scripture-bubble cite').textContent()).trim(),/\(NIV\)$/);
  assert.match((await p.locator('.lesson-character-header .big-idea-description').textContent()).trim(),new RegExp(`^LESSON ${String(id).padStart(2,'0')} · BIG IDEA:`));
  const languageColumns=await p.locator('.lesson-language-card').evaluate(element=>getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
  assert.equal(languageColumns,1,`mission ${id} vocabulary must use the full-width lesson flow`);
  const layout=await p.locator('.lesson-character-header').evaluate(header=>{const character=header.querySelector('.lead-character').getBoundingClientRect(),bubble=header.querySelector('.direction-bubble').getBoundingClientRect(),frame=header.getBoundingClientRect();return {characterBottom:character.bottom,bubbleLeft:bubble.left,characterRight:character.right,frameBottom:frame.bottom};});
  assert.ok(layout.characterBottom<=layout.frameBottom+1,`mission ${id} character must stay inside its guide frame`);
  assert.ok(layout.characterRight<=layout.bubbleLeft+1,`mission ${id} character must not step on lesson words`);
  const dialogue=p.locator('.character-dialogue');
  if(await dialogue.count()){
   const dialogueColumns=await dialogue.evaluate(element=>getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
   assert.equal(dialogueColumns,1,`mission ${id} character dialogue must stack in the full-width lesson flow`);
  }
 }

 const arcadeContext=await browser.newContext({viewport:{width:1280,height:950}});
 const arcadePage=await arcadeContext.newPage();
 arcadePage.on('pageerror',e=>errors.push(e.message));
 arcadePage.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await arcadePage.goto(url);
 assert.match(await arcadePage.locator('.mode-entry-grid').textContent(),/NO SAVE FILE[\s\S]+ARCADE MODE/i);
 assert.equal(await arcadePage.evaluate(()=>localStorage.getItem('money-ops-v02')),null);
 await click(arcadePage,'start-arcade');
 assert.match(await arcadePage.locator('.arcade-warning').textContent(),/PROGRESS IS NOT SAVED/);
 assert.equal(await arcadePage.locator('.arcade-character').count(),6);
 assert.equal(await arcadePage.locator('.arcade-level-card').count(),32);
 assert.equal(await arcadePage.locator('.grand-city-builder .city-lot').count(),8);
 assert.match(await arcadePage.locator('.city-reset-warning').textContent(),/resets when you leave Arcade Mode[\s\S]+no password or recovery code/i);
 assert.match(await arcadePage.locator('.coin-goal-panel').textContent(),/100 COINS[\s\S]+20 COINS[\s\S]+VOCABULARY/i);
 await click(arcadePage,'arcade-character-ruby');
 assert.equal(await arcadePage.locator('[data-action="arcade-character-ruby"]').getAttribute('aria-pressed'),'true');
 await click(arcadePage,'arcade-level-32');
 assert.match(await arcadePage.locator('.runner-titlebar').textContent(),/ARCADE MODE · NOT SAVED[\s\S]+Financial Freedom Challenge/i);
 assert.match(await arcadePage.locator('.runner-note').textContent(),/temporary and are not saved/i);
 await click(arcadePage,'runner-start');
 assert.match(await arcadePage.locator('[data-runner-hud="goal"]').textContent(),/^0 \/ 100$/);
 await click(arcadePage,'runner-finish-now');
 assert.match(await arcadePage.locator('.arcade-results').textContent(),/ARCADE RESULT · NOT SAVED/);
 assert.equal(await arcadePage.locator('.arcade-results .grand-city-builder').count(),1);
 assert.ok(await arcadePage.locator('.runner-vocabulary-results article').count()>=4);
 await click(arcadePage,'arcade-back');
 assert.equal(await arcadePage.locator('.arcade-level-card').count(),32);
 await click(arcadePage,'arcade-exit');
 assert.equal(await arcadePage.locator('[data-action="start-arcade"]').count(),1);
 assert.equal(await arcadePage.evaluate(()=>localStorage.getItem('money-ops-v02')),null,'fresh Arcade play must never create a Career save');
 await arcadeContext.close();

 const p=await student();
 assert.equal((await state(p)).mode,'career');
 assert.equal((await state(p)).cash,0);
 assert.equal((await state(p)).savings,0);
 assert.equal((await state(p)).investments,0);
 assert.match(await p.locator('.career-mode-ribbon').textContent(),/CAREER MODE/);
 assert.match(await p.locator('.career-portfolio').textContent(),/STARTED AT \$0/);
 assert.match(await p.locator('.grand-city-journey').textContent(),/GRAND FINANCIAL CITY[\s\S]+NEXT STOP · Value Village/i);
 assert.equal(await p.locator('.grand-city-journey .city-destination').count(),32);
 assert.equal(await p.locator('.grand-city-builder .city-lot').count(),8);
 assert.equal(await p.locator('.grand-city-builder .city-build-button:disabled').count(),8);
 assert.match(await p.locator('.grand-city-builder').textContent(),/0 \/ 32 CITY STAGES BUILT[\s\S]+TOWN CENTER:[\s\S]+0 \/ 4/i);
 assert.equal(await p.locator('[data-action="begin-2"]').isDisabled(),true);
 const savedCareer=await p.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await click(p,'arcade-open');
 assert.match(await p.locator('.arcade-warning').textContent(),/Career Mode file is not changed/);
 await click(p,'arcade-character-ruby');
 assert.equal(await p.evaluate(()=>localStorage.getItem('money-ops-v02')),savedCareer,'Arcade choices must not overwrite the Career save');
 await click(p,'arcade-exit');
 assert.equal((await state(p)).mode,'career');
 assert.equal((await state(p)).avatar,'jordan');
 assert.equal(await p.evaluate(()=>localStorage.getItem('money-ops-v02')),savedCareer,'leaving Arcade must restore the untouched Career save');
 const beforeHome=moneyState(await state(p));
 await click(p,'cheer');
 assert.equal(await p.locator('.world-buddy').evaluate(e=>e.classList.contains('cheer')),true);
 assert.deepEqual(moneyState(await state(p)),beforeHome);
 await p.screenshot({path:'/tmp/money-ops-new-world.png',fullPage:true});

 await begin(p,1,true);
 await click(p,'job-time');
 await drag(p,'yard-gloves','jordan-gear');
 assert.deepEqual((await state(p)).active.yardPrep,['gloves']);
 await tap(p,'yard-bag','bag-spot');
 await keyboardTap(p,'yard-rake','jordan-gear');
 assert.deepEqual((await state(p)).active.yardPrep,['gloves','bag','rake']);
 await drag(p,'leaf-0','leaf-bag');
 assert.equal((await state(p)).active.workDone.length,1);
 await p.reload();
 assert.equal((await state(p)).active.workDone.length,1);
 await tap(p,'leaf-1','leaf-bag');
 await tap(p,'leaf-2','leaf-bag');
 assert.equal((await state(p)).active.wallet.cash,60);
 assert.equal(await p.locator('.why').getAttribute('open'),null);
 await finishLesson(p,'finish-to-plan',true);
 assert.equal((await state(p)).completed.includes(1),true);
 await begin(p,2);
 for(let i=0;i<3;i++)await drag(p,`stream-${i}`,'income-wallet');
 await finishLesson(p,'finish-to-save');
 assert.equal((await state(p)).completed.includes(2),true);
 await begin(p,3);
 assert.equal(await p.locator('[data-drag="earnings-bag"]').count(),1);
 assert.equal(await p.locator('.save-coin').count(),0);
 await drag(p,'earnings-bag','save');
 assert.equal((await state(p)).active.jobBanked,true);
 assert.equal(await p.locator('.invest-action .seated-eli img[alt^="Zion"]').count(),1);
 assert.equal(await p.locator('.invest-action .eli-chair').count(),1);
 assert.match(await p.locator('.invest-action>p').textContent(),/Zion types a buy order/i);
 assert.equal(await p.locator('.save-coin').count(),3);
 for(let i=0;i<3;i++)await moveNextCoin(p);
 assert.equal((await state(p)).active.planned,750);
 await p.screenshot({path:'/tmp/money-ops-saving-play.png',fullPage:true});
 await p.reload();
 assert.equal((await state(p)).active.planned,750);
 await click(p,'pack-budget');
 const repairBudget=moneyState((await state(p)).active.wallet);
 assert.equal(await p.locator('.garage-wrench').count(),1);
 assert.equal(await p.locator('.repairing-arm').count(),0);
 await p.screenshot({path:'/tmp/money-ops-jordan-wrench.png',fullPage:true});
 await drag(p,'tool-0','car-bay');
 assert.deepEqual((await state(p)).active.repairDone,[0]);
 assert.deepEqual(moneyState((await state(p)).active.wallet),repairBudget);
 await p.reload();
 assert.deepEqual((await state(p)).active.repairDone,[0]);
 await tap(p,'tool-1','car-bay');
 assert.deepEqual((await state(p)).active.repairDone,[0,1]);
 assert.deepEqual(moneyState((await state(p)).active.wallet),repairBudget);
 await keyboardTap(p,'tool-2','car-bay');
 assert.equal((await state(p)).active.step,'debrief');
 await finishLesson(p);
 assert.equal((await state(p)).savings,330);
 assert.equal((await state(p)).debt,0);

 await begin(p,1);
 await click(p,'job-skill');
 await drag(p,'picture-0','slot-1');
 assert.equal((await state(p)).active.workDone.length,0);
 assert.match(await p.locator('.task-feedback').textContent(),/matching/);
 for(let i=0;i<3;i++)await drag(p,`picture-${i}`,`slot-${i}`);
 await finishLesson(p);
 assert.equal((await state(p)).cash,0);
 assert.equal((await state(p)).xp,620);
 await begin(p,1);
 await click(p,'job-product');
 assert.equal(await p.locator('.art-tool').count(),3);
 await p.getByRole('button',{name:'Pick paint'}).waitFor();
 await p.getByRole('button',{name:'Pick crayons'}).waitFor();
 await p.getByRole('button',{name:'Pick markers'}).waitFor();
 for(let i=0;i<3;i++){await drag(p,`art-${i}`,`canvas-${i}`);await traceLine(p);}
 await finishLesson(p);
 assert.equal((await state(p)).savings,330);
 await click(p,'tab-honors');
 assert.equal(await p.locator('.badge.earned').count(),4);
 await click(p,'tab-operations');
 await click(p,'read-aloud');
 await click(p,'mute');
 assert.equal((await state(p)).muted,false);
 await click(p,'mute');
 for(const width of [1024,768,390]){
  await p.setViewportSize({width,height:950});
  await p.reload();
  await p.waitForTimeout(300);
  const overflow=await p.evaluate(()=>({wide:document.documentElement.scrollWidth>innerWidth,elements:[...document.querySelectorAll('*')].map(element=>{const box=element.getBoundingClientRect();return {name:`${element.tagName}.${element.className}`,left:box.left,right:box.right,width:box.width};}).filter(box=>box.right>innerWidth+1||box.left<-1).slice(0,8)}));
  assert.equal(overflow.wide,false,`horizontal overflow at ${width}px: ${JSON.stringify(overflow.elements)}`);
  await p.screenshot({path:`/tmp/money-ops-play-${width}.png`,fullPage:true});
 }
 await p.emulateMedia({reducedMotion:'reduce'});
 const reducedAnimations=await p.locator('.world-buddy,.route-node.current,.next-mission-action>span').evaluateAll(elements=>elements.map(e=>getComputedStyle(e).animationName));
 assert.ok(reducedAnimations.length>=3);
 assert.deepEqual([...new Set(reducedAnimations)],['none']);

 // Complete the budget map, then exercise every reusable mission frame through the finale.
 await p.emulateMedia({reducedMotion:'no-preference'});
 await p.setViewportSize({width:1280,height:950});
 await begin(p,4);
 assert.deepEqual(await p.locator('.budget-map .stream-token b').allTextContents(),['500','200','100','50','50']);
 const kaiBubble=await p.locator('.budget-map .actor-planning>span').boundingBox();
 const moneyOptions=await p.locator('.budget-map button').evaluateAll(buttons=>buttons.map(button=>{const box=button.getBoundingClientRect();return {x:box.x,y:box.y,width:box.width,height:box.height};}));
 assert.ok(moneyOptions.every(box=>kaiBubble.x+kaiBubble.width<=box.x||box.x+box.width<=kaiBubble.x||kaiBubble.y+kaiBubble.height<=box.y||box.y+box.height<=kaiBubble.y),'Everest bubble must not cover a money option');
 for(const [i,target] of ['need-home','need-food','save-home','fun-home','fun-home'].entries())await tap(p,`map-${i}`,target);
 assert.equal((await state(p)).active.step,'debrief');
 await finishLesson(p);
 const bubbleCharacters=new Set();
 for(let id=5;id<=32;id++){
  await enterLesson(p,id);
  await assertCharacterLessonPattern(p,id);
  assert.equal(await p.locator('.direction-bubble').count(),1);
  bubbleCharacters.add(await p.locator('.lesson-character-header').getAttribute('data-character'));
  assert.equal(await p.locator('.character-dialogue .dialogue-card').count(),2);
  await click(p,'next');
  await assertCharacterLessonPattern(p,id);
  assert.ok(await p.locator('.advanced-decision .decision-card').count()>=2);
  assert.equal(await p.locator('.advanced-decision .lesson-action-demo,.advanced-decision .typing-computer,.advanced-decision .animated-arm').count(),0,`mission ${id} must not contain an automated character demonstration`);
  assert.match(await p.locator('.advanced-decision>.play-prompt').textContent(),/complete the activity yourself/i);
  await makeDecision(p,'.advanced-decision');
  await assertCharacterLessonPattern(p,id);
  assert.equal((await state(p)).active.step,'event');
  assert.ok(await p.locator('.advanced-event .decision-card').count()>=2);
  assert.equal(await p.locator('.advanced-event .lesson-action-demo,.advanced-event .typing-computer,.advanced-event .animated-arm').count(),0,`mission ${id} event must not contain an automated character demonstration`);
  await makeDecision(p,'.advanced-event');
  await assertCharacterLessonPattern(p,id);
  assert.equal((await state(p)).active.step,'debrief',`mission ${id} event interaction must reach debrief`);
  if(id===32){
   assert.equal(await p.locator('.final-report').count(),1);
   assert.match(await p.locator('.final-rank').textContent(),/FINANCIALLY FREE/i);
   await p.screenshot({path:'/tmp/money-ops-finale.png',fullPage:true});
  }
  await finishLesson(p);
 }
 assert.deepEqual([...bubbleCharacters],['jordan']);
 const complete=await state(p);
 assert.equal(complete.completed.length,32);
 assert.equal(complete.badges.includes('freedom'),true);
 assert.equal(Object.keys(complete.runnerProgress).length,32);
 assert.ok(Object.values(complete.runnerProgress).every(week=>week.pre.completed&&week.lessonStarted&&week.lessonCompleted&&week.post.completed));
 assert.equal(await p.locator('.campaign-complete').count(),1);
 await click(p,'tab-teacher');
 assert.equal(await p.locator('.teacher-week-table>div').count(),33);
 assert.match(await p.locator('.teacher-view>p').first().textContent(),/not financial literacy grades/i);
 await click(p,'profile');
 await p.locator('#music-volume').fill('0.2');
 await p.locator('#sfx-volume').fill('0.5');
 assert.equal((await state(p)).musicVolume,0.2);
 assert.equal((await state(p)).sfxVolume,0.5);

 const artPage=await student();
 await begin(artPage,1);
 await click(artPage,'job-product');
 for(let i=0;i<3;i++){
  await drag(artPage,`art-${i}`,`canvas-${i}`);
  assert.equal((await state(artPage)).active.traceTool,i);
  await traceLine(artPage);
 }
 assert.equal((await state(artPage)).active.step,'debrief');

 const q=await student(390,true);
 await begin(q,1);
 await click(q,'job-time');
 await tap(q,'yard-gloves','jordan-gear');await tap(q,'yard-bag','bag-spot');await tap(q,'yard-rake','jordan-gear');
 for(let i=0;i<3;i++)await tap(q,`leaf-${i}`,'leaf-bag');
 await finishLesson(q,'finish-to-plan');
 await begin(q,2);
 for(let i=0;i<3;i++)await touchDrag(q,`stream-${i}`,'income-wallet');
 await finishLesson(q,'finish-to-save');
 await begin(q,3);
 await touchDrag(q,'earnings-bag','save');
 assert.equal((await state(q)).active.jobBanked,true);
 await moveNextCoin(q,touchDrag);
 assert.equal((await state(q)).active.planned,250);
 await click(q,'pack-budget');
 for(let i=0;i<2;i++){
  const before=moneyState((await state(q)).active.wallet);
  await touchDrag(q,`tool-${i}`,'car-bay');
  assert.deepEqual(moneyState((await state(q)).active.wallet),before);
 }
 await touchDrag(q,'tool-2','car-bay');
 assert.equal((await state(q)).active.step,'debrief');
 await finishLesson(q);
 assert.equal((await state(q)).debt,170);
 await click(q,'profile');
 assert.equal(await q.locator('#rename').count(),1);
 await click(q,'reset');
 await click(q,'cancel-reset');
 await click(q,'reset');
 await click(q,'confirm-reset');
 assert.equal(await q.locator('#name').count(),1);

 const k=await student(768);
 await begin(k,1);
 await click(k,'job-time');
 await keyboardTap(k,'yard-gloves','jordan-gear');await keyboardTap(k,'yard-bag','bag-spot');await keyboardTap(k,'yard-rake','jordan-gear');
 for(let i=0;i<3;i++)await keyboardTap(k,`leaf-${i}`,'leaf-bag');
 assert.equal((await state(k)).active.step,'debrief');

 assert.deepEqual(errors,[]);
 console.log('PASS: Career and unsaved Arcade modes, the runner, all 32 pre/lesson/bonus flows, the finale, activities, persistence, accounting, controls, teacher view, reduced motion, and responsive layouts pass without console errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
