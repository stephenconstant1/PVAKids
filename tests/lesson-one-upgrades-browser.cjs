const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync,writeFileSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.MONEY_OPS_URL);
 await page.locator('.money-ops-reference').evaluate(img=>img.decode());
 assert.equal(await page.locator('.everest-approved-patch').count(),1);
 const edited=await page.evaluate(async()=>{const img=new Image();img.src='assets/crew/moneybread-city-everest-approved.png';await img.decode();return img.naturalWidth>0;});assert(edited);
 mkdirSync('/tmp/moneyops-everest-review',{recursive:true});
 await page.locator('.reference-crew-hero').screenshot({path:'/tmp/moneyops-everest-review/home-crew.png'});
 await page.locator('#name').fill('Everest Review');await page.locator('#profile-form button[type=submit]').click();
 const career=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await page.locator('[data-action="arcade-open"]').first().click();
 await page.locator('[data-action="arcade-character-kai"]').click();await page.locator('[data-action="arcade-level-1"]').click();
 assert.match(await page.locator('.runner-intro').textContent(),/200 COINS/);
 await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.reviewRunner=this;return start.apply(this,args);};});
 await page.locator('[data-action="runner-start"]').click();await page.waitForFunction(()=>window.reviewRunner?.running&&window.reviewRunner?.imageReady);
 // Record a short actual gameplay clip, rather than only inspecting a source PNG.
 const clip=await page.evaluate(async()=>{
  const runner=window.reviewRunner;runner.lives=5;runner.spawnIn=99;runner.rewardIn=99;runner.boxIn=99;runner.lifeIn=99;
  const chunks=[],stream=document.querySelector('#runner-canvas').captureStream(30),recorder=new MediaRecorder(stream,{mimeType:'video/webm'});
  const done=new Promise(resolve=>{recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=async()=>resolve(Array.from(new Uint8Array(await new Blob(chunks,{type:'video/webm'}).arrayBuffer())));});
  recorder.start();await new Promise(resolve=>setTimeout(resolve,1600));recorder.stop();const bytes=await done;stream.getTracks().forEach(t=>t.stop());runner.setPaused(true);return bytes;
 });writeFileSync('/tmp/moneyops-everest-review/everest-run.webm',Buffer.from(clip));
 const result=await page.evaluate(()=>{
  const r=window.reviewRunner;r.lives=1;r.collectLife({x:200,y:100,done:false});r.collectLife({x:200,y:100,done:false});
  r.activePower={effect:'income',until:Date.now()+10000};
  for(let i=0;i<205;i++)r.collect({...r.config.collectibleSet[i%2],x:200,y:100,done:false});
  r.onUpdate(r.snapshot());return {running:r.running,goalReached:r.goalReached,paychecks:r.paychecks,pay:r.paycheckCoins,lives:r.lives};
 });assert(result.running&&result.goalReached);assert.equal(result.lives,3);assert.equal(result.paychecks,103);assert.equal(result.pay,206);
 assert.match(await page.locator('[data-runner-hud="goal"]').textContent(),/205 \/ 200/);
 assert.match(await page.locator('[data-action="runner-finish-now"]').textContent(),/BANK REWARDS/);
 await page.locator('[data-action="runner-finish-now"]').click();
 assert.match(await page.locator('.runner-results h1').textContent(),/200-COIN GOAL COMPLETE/);
 assert.match(await page.locator('.runner-town-deposit').textContent(),/103 paychecks collected/);
 assert.match(await page.locator('.runner-town-deposit').textContent(),/308 city coins deposited/);
 assert.equal(await page.locator('.city-bank b').textContent(),'308');
 const approvedPortrait=await page.locator('.runner-result-hero').evaluate(async img=>{await img.decode();return img.currentSrc;});assert(approvedPortrait.includes('kai.png?v=45.6'));
 await page.screenshot({path:'/tmp/moneyops-everest-review/results.png',fullPage:true});
 await page.locator('[data-action="city-build-town-center"]').click();await page.locator('[data-action="dismiss-city-build"]').last().click();assert.equal(await page.locator('.city-bank b').textContent(),'208');
 await page.evaluate(()=>window.reviewRunner.finish('manual'));assert.equal(await page.locator('.city-bank b').textContent(),'208');
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}px results overflow`);}
 await page.locator('[data-action="arcade-exit"]').first().click();assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),career);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-action="begin-1"]').first().click();await page.locator('[data-action="runner-start"]').click();await page.waitForFunction(()=>window.reviewRunner?.imageReady&&window.reviewRunner?.running);
 assert.equal(await page.evaluate(()=>window.reviewRunner.reduced&&window.reviewRunner.strideTimeMs===0),true);
 assert.equal(await page.evaluate(()=>window.reviewRunner.config.targetCoins),200);
 await page.locator('[data-action="runner-finish-now"]').click();
 assert.deepEqual(errors,[]);console.log('PASS approved Everest in crew/Arcade/results; actual run clip; 200-coin goal with continuation; heart pickups; 103 paychecks → 206 city coins plus 102 other tokens = 308 once; town purchase; four layouts; Career isolation and reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
