const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 for(const width of [320,390,1440])for(const mode of ['arcade','bonus'])for(const intensity of [0,1,1.5]){
  const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<500}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));const prefix=width===1440?'/money-ops/':'/';await page.goto(process.env.MONEY_OPS_URL+prefix);
  if(mode==='arcade'){
   await page.locator('[data-action="start-arcade"]').first().click();
   await page.locator(`[data-action="arcade-intensity-${({0:'rookie',1:'intermediate',1.5:'expert'})[intensity]}"]`).click();
   await page.locator('#arcade-level-select').selectOption('1');
  }else{
   await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(markLessonCompleted(newGame('Ladder planner','maya'),1),1,'post')));});
   await page.goto(process.env.MONEY_OPS_URL+prefix);await page.locator('[data-action="continue-career"]').first().click();
  }
  await page.evaluate(async level=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;this.intensityLevel=level;this.speedMultiplier=level===0?.68:level;this.accelerates=level!==0;return start.apply(this,args);};},intensity);
  await page.locator('[data-action="runner-start"]').click();await page.waitForFunction(()=>window.runner?.running);
  await page.evaluate(()=>{const r=window.runner;cancelAnimationFrame(r.raf);let n=0;while(!r.climb.touching()&&n++<3000)r.update(.01,n*.01);if(!r.climb.touching())throw Error('Natural route never reaches the pole');r.onUpdate(r.snapshot());r.draw();});
  await page.keyboard.down('ArrowUp');
  assert(await page.evaluate(()=>window.runner.climb.attached));
  await page.evaluate(()=>window.runner.update(.2,0));await page.keyboard.up('ArrowUp');
  const y=await page.evaluate(()=>window.runner.player.y);await page.evaluate(()=>window.runner.update(.2,0));assert.equal(await page.evaluate(()=>window.runner.player.y),y);
  await page.keyboard.down('ArrowDown');await page.evaluate(()=>window.runner.update(.1,0));await page.keyboard.up('ArrowDown');assert(await page.evaluate(y=>window.runner.player.y>y&&!window.runner.player.duck,y));
  const up=page.locator('[data-climb-up]');await up.scrollIntoViewIfNeeded();
  if(width<500){const rect=await up.boundingBox();assert(rect.height>=44);const touch=await page.context().newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2}]});await page.evaluate(()=>{for(let i=0;i<10;i++)window.runner.update(.25,0);});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();}
  else {await up.focus();await page.keyboard.down('Enter');await page.evaluate(()=>{for(let i=0;i<10;i++)window.runner.update(.25,0);});await page.keyboard.up('Enter');}
  await page.evaluate(()=>{window.runner.onUpdate(window.runner.snapshot());window.runner.draw();});
  assert(await page.evaluate(()=>window.runner.climb.reachedTop));
  const before=await page.evaluate(()=>{const r=window.runner;return {score:r.score,coins:r.coins,bonus:r.bonusMoney,lives:r.lives};});
  for(const bucket of ['needs','wants','savings'])await page.locator(`[data-action="ladder-${bucket}"]`).click();
  assert.match(await page.locator('[data-ladder-status]').textContent(),/Great planning.*\$50 Needs.*\$30 Wants.*\$20 Savings/);
  assert.equal(await page.evaluate(()=>window.runner.climb.remaining),0);
  assert.deepEqual(await page.evaluate(()=>{const r=window.runner;return {score:r.score,coins:r.coins,bonus:r.bonusMoney,lives:r.lives};}),before);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(mode==='arcade'&&intensity===1){mkdirSync('/tmp/money-ladder-review',{recursive:true});await page.screenshot({path:`/tmp/money-ladder-review/${width}.png`,fullPage:true});}
  await page.locator('[data-action="runner-jump"]').click();assert(await page.evaluate(()=>!window.runner.climb.attached&&window.runner.player.vy<0));
  await page.evaluate(()=>{const r=window.runner;for(let i=0;i<200;i++)r.update(.01,i*.01);r.onUpdate(r.snapshot());});
  assert(await page.evaluate(()=>window.runner.player.grounded));assert.equal(await page.evaluate(()=>window.runner.lives),before.lives);
  await page.keyboard.down('ArrowDown');assert(await page.evaluate(()=>window.runner.player.duck));await page.keyboard.up('ArrowDown');await page.keyboard.press('ArrowUp');assert(await page.evaluate(()=>window.runner.player.vy<0));
  assert.deepEqual(errors,[]);console.log('PASS Money Ladder',JSON.stringify({mode,intensity,width}));await page.close();
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
