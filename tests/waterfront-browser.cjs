const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:950}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.MONEY_OPS_URL;
 for(const prefix of ['/','/money-ops/'])for(const phase of ['pre','post']){
  await page.goto(base+prefix);
  if(phase==='pre'){
   await page.locator('[data-action="start-arcade"]').first().click();
   await page.locator('[data-action="arcade-level-1"]').click();
  }else{
   await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(markLessonCompleted(newGame('Waterfront','maya'),1),1,'post')));});
   await page.goto(base+prefix);await page.locator('[data-action="continue-career"]').first().click();
  }
  assert.match(await page.locator('.runner-titlebar').textContent(),/City Waterfront · Earning and Creating Value/);
  await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return start.apply(this,args);};});
  await page.locator('[data-action="runner-start"]').click();
  await page.waitForFunction(()=>window.runner?.waterfront?.tile&&window.runner.running);
  const scene=await page.evaluate(()=>{const r=window.runner;r.setPaused(true);r.spawnIn=r.rewardIn=r.boxIn=r.powerIn=r.lifeIn=999;r.routeGapRemaining=1e9;r.entities=[];
   const old=r.waterfront.offset;r.update(.02,1);r.draw();return {title:r.config.title,name:r.config.levelName,changed:r.waterfront.offset!==old,path:r.ground,source:r.waterfront.image.currentSrc};});
  assert.equal(scene.title,'Earning and Creating Value');assert.equal(scene.name,'City Waterfront');assert(scene.changed);assert.equal(scene.path,292);assert(scene.source.includes('city-waterfront.png'));
  const paused=await page.evaluate(()=>({offset:window.runner.waterfront.offset,time:window.runner.sceneryTime}));await page.waitForTimeout(120);
  assert.deepEqual(await page.evaluate(()=>({offset:window.runner.waterfront.offset,time:window.runner.sceneryTime})),paused);
  await page.evaluate(()=>{window.runner.setPaused(false);window.runner.draw();});
  mkdirSync('/tmp/waterfront-review',{recursive:true});await page.locator('#runner-canvas').screenshot({path:`/tmp/waterfront-review/${phase}.png`});
  for(const width of [390,768,1280]){await page.setViewportSize({width,height:950});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base);
 const a=await reduced.evaluate(async()=>{const {WaterfrontScene}=await import('./src/moneybread/waterfront.js');const scene=new WaterfrontScene();await scene.image.decode();scene.ready=true;const c=document.createElement('canvas');c.width=960;c.height=360;scene.draw(c.getContext('2d'),960,360,40,1,true);const first=c.toDataURL();scene.draw(c.getContext('2d'),960,360,90,2,true);return {same:first===c.toDataURL(),offset:scene.offset};});assert.deepEqual(a,{same:true,offset:0});
 assert.deepEqual(errors,[]);console.log('PASS City Waterfront Level 1 in Arcade/Bonus and both entry points: supplied panorama, new title, smooth scroll, paused/reduced-motion stillness, three responsive sizes.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
