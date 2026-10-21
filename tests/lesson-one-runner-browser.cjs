const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:950}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.MONEY_OPS_URL);
 for(const phase of ['pre','post']){
  await page.evaluate(async phase=>{
   const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');
   let p=newGame('Lesson One Review','maya');if(phase==='post')p=markLessonCompleted(p,1);
   localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(p,1,phase)));
  },phase);
  await page.reload();await page.locator('[data-action="continue-career"]').first().click();
  await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const original=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.reviewRunner=this;return original.apply(this,args);};});
  await page.locator('[data-action="runner-start"]').click();
  await page.waitForFunction(()=>window.reviewRunner?.imageReady&&window.reviewRunner?.strideTimeMs>0);
  const result=await page.evaluate(()=>{const r=window.reviewRunner;r.setPaused(true);return {enabled:r.animateStride,id:r.characterId,clock:r.strideTimeMs};});
  assert(result.enabled&&result.clock>0,`${phase} must use the articulated stride in the actual app`);
  assert.equal(result.id,phase==='pre'?'jordan':'maya');
  await page.evaluate(()=>{const r=window.reviewRunner;r.setPaused(false);r.jump();});
  assert(await page.evaluate(()=>window.reviewRunner.player.vy<0));
  await page.locator('[data-action="runner-pause"]').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS actual Lesson 1 Career pre-run and bonus-run instantiate articulated runners, advance the stride, preserve the expected crew, and retain jump/pause controls.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
