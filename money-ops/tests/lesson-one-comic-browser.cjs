const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,768,1440])for(const reduced of [false,true]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<500,reducedMotion:reduced?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.MONEY_OPS_URL+(width===768?'/money-ops/':'/'));
 await page.evaluate(async()=>{const {newGame,begin}=await import('./src/engine.js');localStorage.setItem('money-ops-v02',JSON.stringify(begin(newGame('Comic reader','maya'),1)));});
 await page.reload();await page.locator('[data-action="continue-career"]').first().click();
 const click=action=>page.locator(`[data-action="${action}"]`).first().click();
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')));
 const original=await saved(),beats=await page.evaluate(async()=>{const {lessonOneBeats}=await import('./src/lesson-one-comic.js');return lessonOneBeats();});
 assert.equal(beats.length,8);assert(await page.locator('[data-action="comic-back"]').isDisabled());
 for(let i=0;i<8;i++){
  assert.equal((await page.locator('.motion-line').textContent()).trim(),beats[i]);assert.equal(await page.locator('.motion-line').evaluate(n=>getComputedStyle(n).color),'rgb(20, 59, 57)');
  if(reduced)assert.equal(await page.locator('.comic-panel').evaluate(n=>getComputedStyle(n).animationName),'none');
  if(i===0&&!reduced){await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));mkdirSync('/tmp/comic-building-review',{recursive:true});await page.screenshot({path:`/tmp/comic-building-review/comic-${width}.png`,fullPage:true});}
  if(i===1){await click('comic-back');assert.match(await page.locator('.comic-progress').textContent(),/Panel 1/);await click('next');}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('[data-action="next"]').focus();await page.keyboard.press('Enter');
 }
 assert.equal((await saved()).active.step,'choice');assert.equal((await saved()).cash,original.cash);assert.equal((await saved()).xp,original.xp);
 await click('job-time');for(const [token,target] of [['yard-gloves','jordan-gear'],['yard-bag','bag-spot'],['yard-rake','jordan-gear'],['leaf-0','leaf-bag'],['leaf-1','leaf-bag'],['leaf-2','leaf-bag']]){await click(`select-${token}`);await click(`drop-${target}`);}
 assert.equal((await saved()).active.step,'debrief');await click('finish-to-plan');await click('runner-skip');await click('mb-view-work');await click('mb-work-service');await click('mb-allocate-save');
 await page.locator('.job-city-actions summary').click();assert.equal(await page.locator('.mb-projects [data-building-card]').count(),8);
 const park=page.locator('.mb-projects [data-building-card]').filter({has:page.locator('[data-action="mb-build-park"]')});
 const explore=park.locator('[data-building-preview]');
 if(width<500)await explore.tap();else await explore.hover();
 await explore.focus();assert.equal(await explore.getAttribute('aria-expanded'),'true');assert(await park.locator('[data-building-detail]').isVisible());assert.match(await park.locator('[data-building-detail]').textContent(),/40 bread/);assert((await park.locator('[data-building-detail]').boundingBox()).width>180,'details need a readable column');
 const before=(await saved()).moneybread.wallet;assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 mkdirSync('/tmp/comic-building-review',{recursive:true});if(!reduced)await page.screenshot({path:`/tmp/comic-building-review/buildings-${width}.png`,fullPage:true});
 await click('mb-build-park');const after=await saved();assert.equal(after.moneybread.buildings.park,1);assert.equal(after.moneybread.wallet.available,before.available-40);assert(await page.locator('#mb-status .building-reaction').isVisible());
 await page.locator('#mb-reflection').fill('My time creates value for the city.');await page.locator('#mb-reflect-form button[type="submit"]').click();assert((await saved()).moneybread.weeks[1].reflection);
 // Exercise the separate City Bank choices and existing purchase confirmation.
 await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {depositCityCoins}=await import('./src/city.js');const p=depositCityCoins(newGame('Builder','maya'),100);p.completed=[1];p.screen='runner';p.runnerSession={lessonId:1,phase:'post',status:'results',result:{collected:0,coins:0,score:0,bonusMoney:0,vocabularySeen:[]}};localStorage.setItem('money-ops-v02',JSON.stringify(p));});
 await page.reload();await click('continue-career');const town=page.locator('.city-lot').first();await town.locator('[data-building-preview]').focus();await page.waitForFunction(()=>{const card=document.querySelector('.city-lot');return card&&!card.querySelector('[data-building-detail]').hidden;});assert(await town.locator('[data-building-detail]').isVisible());assert.match(await town.locator('[data-building-detail]').textContent(),/100 City Bank coins/);
 await click('city-build-town-center');assert(await page.locator('.city-build-modal').isVisible());assert(await page.locator('.city-build-modal .building-reaction-character').isVisible());assert.equal((await saved()).city.bank,0);assert.equal((await saved()).city.upgrades['town-center'],1);
 await click('dismiss-city-build');assert(await page.locator('.city-lot.building-selected').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('PASS Lesson 1 comic and building flow',JSON.stringify({width,reduced}));await page.close();
 }
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
