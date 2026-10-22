const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.MONEY_OPS_URL);
 const ids=await page.evaluate(async()=>{
  const {newGame,finances}=await import('./src/engine.js');
  const {depositCityCoins,cityLandmarks}=await import('./src/city.js');
  const {recordRunnerResult,openRunner}=await import('./src/runner-state.js');
  let p=newGame('Building Art Review','maya');p.completed=Array.from({length:32},(_,i)=>i+1);p.snapshots=Object.fromEntries(p.completed.map(id=>[id,finances(p)]));
  p=recordRunnerResult(openRunner(depositCityCoins(p,3200),1,'pre'),1,'pre',{skipped:true});
  localStorage.setItem('money-ops-v02',JSON.stringify(p));return cityLandmarks.map(l=>l.id);
 });
 await page.reload();await page.locator('[data-action="continue-career"]').first().click();
 assert.equal(await page.locator('.city-skyline .city-lot').count(),8);
 assert.equal(await page.locator('.city-skyline .city-landmark-art').count(),8);
 assert(!((await page.locator('.city-skyline').textContent()).includes('EMPTY LOT')));
 const asset=await page.evaluate(async()=>{const img=new Image();img.src='assets/crew/moneybread-landmarks.png';await img.decode();return {w:img.naturalWidth,h:img.naturalHeight};});assert.equal(asset.w/asset.h,2);
 const tiles=await page.locator('.city-skyline .city-landmark-art .landmark-built>svg').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('viewBox')));assert.equal(new Set(tiles).size,8);
 mkdirSync('/tmp/moneyops-landmark-review',{recursive:true});
 await page.locator('.city-skyline').screenshot({path:'/tmp/moneyops-landmark-review/planned.png'});
 for(const id of ids){
  const art=page.locator(`.city-skyline [data-landmark="${id}"]`);
  assert.equal(await art.getAttribute('data-construction-stage'),'0');
  for(let stage=1;stage<=4;stage++){
   const oldBank=await page.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')).city.bank);
   const build=page.locator(`[data-action="city-build-${id}"]`);
   await build.scrollIntoViewIfNeeded();assert.match(await build.textContent(),new RegExp(`BUILD STAGE ${stage}.*100 COINS`));
   if(id==='freedom-skyline'){await build.focus();await page.keyboard.press('Enter');}else await build.click();
   const modal=page.locator('.city-build-modal');await modal.waitFor();
   assert.equal(await modal.locator('.city-landmark-art').getAttribute('data-landmark'),id);
   assert.equal(await modal.locator('.city-landmark-art').getAttribute('data-construction-stage'),String(stage));
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')).city.bank),oldBank-100);
   await page.locator('[data-action="dismiss-city-build"]').last().click();
   assert.equal(await art.getAttribute('data-construction-stage'),String(stage));
  }
 }
 assert.equal(await page.locator('.city-lot.finished').count(),8);
 await page.locator('.city-skyline').screenshot({path:'/tmp/moneyops-landmark-review/complete.png'});
 const save=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await page.reload();await page.locator('[data-action="continue-career"]').first().click();assert.equal(await page.locator('.city-lot.finished').count(),8);assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),save);
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.locator('.city-skyline .city-landmark-art').count(),8);
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.landmark-built').first().evaluate(n=>getComputedStyle(n).animationName),'none');
 await page.route('**/assets/crew/moneybread-landmarks.png*',route=>route.abort());await page.reload();await page.locator('[data-action="continue-career"]').first().click();await page.waitForFunction(()=>document.querySelectorAll('.city-landmark-art.art-missing').length===8);
 await page.unroute('**/assets/crew/moneybread-landmarks.png*');
 await page.goto(process.env.MONEY_OPS_URL+'/money-ops/');await page.locator('[data-action="continue-career"]').first().click();assert.equal(await page.locator('.city-skyline .city-landmark-art').count(),8);
 assert.deepEqual(errors,[]);console.log('PASS all eight landmark cards and all 32 purchases: distinct artwork, stages 0–4, 100-coin costs, matching celebration, last-card keyboard build, save/reload, four responsive sizes, reduced motion, missing-art fallback, both static paths.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
