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
  const a=await p.locator(`[data-drag="${token}"]:not(:disabled)`).filter({visible:true}).first().boundingBox();
  const b=await p.locator(`[data-drop="${target}"]`).boundingBox();
  await p.mouse.move(a.x+a.width/2,a.y+a.height/2);
  await p.mouse.down();
  await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});
  await p.mouse.up();
  await p.waitForTimeout(170);
 }
 async function touchDrag(p,token,target){
  const client=await p.context().newCDPSession(p);
  const a=await p.locator(`[data-drag="${token}"]:not(:disabled)`).first().boundingBox();
  const b=await p.locator(`[data-drop="${target}"]`).boundingBox();
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
 async function begin(p,id){
  await click(p,`begin-${id}`);
  await click(p,'next');
 }

 const p=await student();
 assert.equal(await p.locator('[data-action="begin-2"]').isDisabled(),true);
 const beforeHome=moneyState(await state(p));
 await click(p,'cheer');
 assert.equal(await p.locator('.world-buddy').evaluate(e=>e.classList.contains('cheer')),true);
 for(let i=0;i<3;i++){
  await click(p,`pop-spark-${i}`);
  const spark=p.locator(`[data-action="pop-spark-${i}"]`);
  assert.equal(await spark.evaluate(e=>e.classList.contains('collected')),true);
  assert.equal(await spark.isDisabled(),true);
 }
 assert.deepEqual(moneyState(await state(p)),beforeHome);
 await p.screenshot({path:'/tmp/money-ops-new-world.png',fullPage:true});

 await begin(p,1);
 await click(p,'job-time');
 await drag(p,'leaf-0','basket');
 assert.equal((await state(p)).active.workDone.length,1);
 await p.reload();
 assert.equal((await state(p)).active.workDone.length,1);
 await tap(p,'leaf-1','basket');
 await tap(p,'leaf-2','basket');
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
 for(let i=0;i<3;i++)await drag(p,'brush',`canvas-${i}`);
 await click(p,'finish');
 assert.equal((await state(p)).savings,330);
 await click(p,'tab-honors');
 assert.equal(await p.locator('.badge.earned').count(),4);
 await click(p,'tab-operations');
 await click(p,'read-aloud');
 await click(p,'mute');
 assert.equal((await state(p)).muted,false);
 await click(p,'mute');
 await click(p,'random');
 assert.equal((await state(p)).eventUsed,true);
 for(const width of [1024,768,390]){
  await p.setViewportSize({width,height:950});
  await p.reload();
  await p.waitForTimeout(300);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:`/tmp/money-ops-play-${width}.png`,fullPage:true});
 }
 await p.emulateMedia({reducedMotion:'reduce'});
 const reducedAnimations=await p.locator('.world-cloud,.world-buddy,.world-spark').evaluateAll(elements=>elements.map(e=>getComputedStyle(e).animationName));
 assert.ok(reducedAnimations.length>=3);
 assert.deepEqual([...new Set(reducedAnimations)],['none']);

 const q=await student(390,true);
 await begin(q,1);
 await click(q,'job-time');
 for(let i=0;i<3;i++)await tap(q,`leaf-${i}`,'basket');
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
 await q.locator('.grownup-menu summary').click();
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
 for(let i=0;i<3;i++)await keyboardTap(k,`leaf-${i}`,'basket');
 assert.equal((await state(k)).active.step,'debrief');

 assert.deepEqual(errors,[]);
 console.log('PASS: animated home actions preserve progress; car repair requires three tools with mouse, tap, keyboard, and touch play; reload preserves work and repair progress; savings/debt outcomes, practice, badges, audio, reset, reduced motion, and responsive layouts pass without console errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
