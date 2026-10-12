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
 async function begin(p,id){
  await click(p,`begin-${id}`);
  await click(p,'next');
 }

 const p=await student();
 assert.equal(await p.locator('.my-city-crew .city-cast .cast-member').count(),6);
 assert.deepEqual(await p.locator('.my-city-crew .city-cast .cast-member>b').allTextContents(),['Jordan','Maya','Kai','Sofia','Eli','Ruby']);
 assert.equal(await p.locator('.hero-money-sign').count(),1);
 assert.equal(await p.locator('.hero-gold').count(),1);
 assert.equal(await p.locator('.hero-goals').count(),1);
 assert.equal(await p.locator('[data-action="begin-2"]').isDisabled(),true);
 const beforeHome=moneyState(await state(p));
 await click(p,'cheer');
 assert.equal(await p.locator('.world-buddy').evaluate(e=>e.classList.contains('cheer')),true);
 assert.deepEqual(moneyState(await state(p)),beforeHome);
 await p.screenshot({path:'/tmp/money-ops-new-world.png',fullPage:true});

 await begin(p,1);
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
 await click(p,'finish-to-plan');
 const chainedMission=await state(p);
 assert.equal(chainedMission.active.id,2);
 assert.equal(chainedMission.active.step,'brief');
 await click(p,'next');
 for(let i=0;i<3;i++)await drag(p,`stream-${i}`,'income-wallet');
 await click(p,'finish-to-save');
 assert.equal((await state(p)).active.id,3);
 await click(p,'next');
 assert.equal(await p.locator('[data-drag="earnings-bag"]').count(),1);
 assert.equal(await p.locator('.save-coin').count(),0);
 await drag(p,'earnings-bag','save');
 assert.equal((await state(p)).active.jobBanked,true);
 assert.equal(await p.locator('.save-coin').count(),3);
 for(let i=0;i<3;i++)await moveNextCoin(p);
 assert.equal((await state(p)).active.planned,750);
 await p.screenshot({path:'/tmp/money-ops-saving-play.png',fullPage:true});
 await p.reload();
 assert.equal((await state(p)).active.planned,750);
 await click(p,'pack-budget');
 const repairBudget=moneyState((await state(p)).active.wallet);
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
 await click(p,'finish');
 assert.equal((await state(p)).savings,330);
 assert.equal((await state(p)).debt,0);

 await begin(p,1);
 await click(p,'job-skill');
 await drag(p,'picture-0','slot-1');
 assert.equal((await state(p)).active.workDone.length,0);
 assert.match(await p.locator('.task-feedback').textContent(),/matching/);
 for(let i=0;i<3;i++)await drag(p,`picture-${i}`,`slot-${i}`);
 await click(p,'finish');
 assert.equal((await state(p)).cash,0);
 assert.equal((await state(p)).xp,620);
 await begin(p,1);
 await click(p,'job-product');
 assert.equal(await p.locator('.art-tool').count(),3);
 await p.getByRole('button',{name:'Pick paint'}).waitFor();
 await p.getByRole('button',{name:'Pick crayons'}).waitFor();
 await p.getByRole('button',{name:'Pick markers'}).waitFor();
 for(let i=0;i<3;i++){await drag(p,`art-${i}`,`canvas-${i}`);await traceLine(p);}
 await click(p,'finish');
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
 for(const [i,target] of ['need-home','need-food','save-home','fun-home','fun-home'].entries())await tap(p,`map-${i}`,target);
 assert.equal((await state(p)).active.step,'debrief');
 await click(p,'finish');
 const bubbleCharacters=new Set();
 for(let id=5;id<=32;id++){
  await click(p,`begin-${id}`);
  assert.equal(await p.locator('.direction-bubble').count(),1);
  bubbleCharacters.add(await p.locator('.lesson-character-header').getAttribute('data-character'));
  assert.equal(await p.locator('.character-dialogue .dialogue-card').count(),2);
  await click(p,'next');
  assert.ok(await p.locator('.advanced-decision .decision-card').count()>=2);
  await makeDecision(p,'.advanced-decision');
  assert.equal((await state(p)).active.step,'event');
  assert.ok(await p.locator('.advanced-event .decision-card').count()>=2);
  await makeDecision(p,'.advanced-event');
  assert.equal((await state(p)).active.step,'debrief',`mission ${id} event interaction must reach debrief`);
  if(id===32){
   assert.equal(await p.locator('.final-report').count(),1);
   assert.match(await p.locator('.final-rank').textContent(),/FINANCIALLY FREE/i);
   await p.screenshot({path:'/tmp/money-ops-finale.png',fullPage:true});
  }
  await click(p,'finish');
 }
 assert.deepEqual([...bubbleCharacters].sort(),['eli','jordan','kai','maya','ruby','sofia']);
 const complete=await state(p);
 assert.equal(complete.completed.length,32);
 assert.equal(complete.badges.includes('freedom'),true);
 assert.equal(await p.locator('.campaign-complete').count(),1);
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
 await click(q,'finish-to-plan');
 assert.equal((await state(q)).active.id,2);
 assert.equal((await state(q)).active.step,'brief');
 await click(q,'next');
 for(let i=0;i<3;i++)await touchDrag(q,`stream-${i}`,'income-wallet');
 await click(q,'finish-to-save');
 assert.equal((await state(q)).active.id,3);
 await click(q,'next');
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
 await click(q,'finish');
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
 console.log('PASS: all 32 rendered missions complete through the finale; opening activities work with mouse, tap, keyboard, and touch; reload, accounting, replay, audio controls, reset, reduced motion, and responsive layouts pass without console errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
