const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
const url=process.env.MONEY_OPS_URL||'http://127.0.0.1:8082';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[],context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 const click=async action=>page.locator(`[data-action="${action}"]`).first().click();
 const snapshot=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')));
 await page.goto(url);
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  const art=await page.locator('.money-ops-reference').evaluate(async img=>{await img.decode();const r=img.getBoundingClientRect();return {width:r.width,height:r.height,natural:img.naturalWidth};});
  assert.equal(art.natural,1280);assert(Math.abs(art.width/art.height-1280/748)<.01,'the full source image must preserve its aspect ratio');assert(art.width<=width);
 }
 await page.setViewportSize({width:1440,height:1000});await page.locator('#name').fill('City Builder');await page.locator('#profile-form button[type=submit]').click();
 assert.equal(await page.locator('.mb-building').count(),8);assert.equal(await page.locator('.mb-level').count(),32);
 assert.equal(await page.locator('[data-action="begin-2"]').isDisabled(),true);
 await page.locator('[data-action="mb-view-school"]').first().focus();await page.keyboard.press('Enter');
 assert.match(await page.locator('.mb-school h2').textContent(),/Earning & Creating Value/);
 await click('begin-1');await click('runner-skip');await click('runner-start-lesson');await click('next');await click('job-time');
 for(const [token,target] of [['yard-gloves','jordan-gear'],['yard-bag','bag-spot'],['yard-rake','jordan-gear'],['leaf-0','leaf-bag'],['leaf-1','leaf-bag'],['leaf-2','leaf-bag']]){
  await click(`select-${token}`);await click(`drop-${target}`);
 }
 await click('finish-to-plan');await click('runner-skip');await click('mb-view-work');
 await page.locator('[data-action="mb-work-service"]').focus();await page.keyboard.press('Enter');
 assert.equal((await snapshot()).moneybread.wallet.income,100);
 await page.reload();assert.equal((await snapshot()).moneybread.wallet.income,100);
 await click('mb-view-work');assert.equal(await page.locator('[data-action="mb-work-service"]').count(),0,'work cannot be paid twice after reload');
 assert.equal(await page.locator('[data-action="mb-allocate-mix"]').isDisabled(),true);await click('mb-allocate-save');await click('mb-build-park');
 assert.equal((await snapshot()).moneybread.buildings.park,1);
 assert.equal(await page.locator('[data-action="begin-2"]').isDisabled(),true,'activity alone cannot unlock next level');
 await page.locator('#mb-reflection').fill('I used my time to create value and kept bread for services.');
 await page.locator('#mb-reflect-form button[type=submit]').click();
 const career=await snapshot();assert.ok(career.moneybread.weeks[1].reflection);assert.equal(career.moneybread.wallet.investmentResult,0);
 assert.equal(await page.locator('[data-action="begin-2"]').isDisabled(),false);
 await page.reload();assert.deepEqual((await snapshot()).moneybread,career.moneybread);
 // Arcade remains temporary, playable, and isolated from the whole city save.
 const before=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await click('arcade-open');await click('arcade-intensity-rookie');await click('arcade-level-1');await click('runner-start');
 assert.equal(await page.locator('#runner-canvas').count(),1);await page.keyboard.press('Space');await click('runner-finish-now');
 await click('arcade-exit');assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),before);
 mkdirSync('/tmp/moneybread-validation',{recursive:true});
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.screenshot({path:`/tmp/moneybread-validation/city-${width}.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`city should fit ${width}px`);
  for(const view of ['school','work','wallet','progress','city']){
   await click(`mb-view-${view}`);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${view} should fit ${width}px`);
  }
  assert.ok((await page.locator('.mb-shell *').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none'))),'reduced motion disables decorative animations');
 }
 await click('mb-reset-request');const saved=await snapshot();await click('mb-reset-confirm');const rebuilt=await snapshot();
 assert.deepEqual(rebuilt.moneybread.wallet,saved.moneybread.wallet);assert.deepEqual(rebuilt.completed,saved.completed);assert.deepEqual(rebuilt.moneybread.weeks,saved.moneybread.weeks);
 // Missing crew art has a text alternative rather than a broken portrait.
 await page.route('**/assets/crew/**',route=>route.abort());await page.reload();
 await page.waitForTimeout(200);assert.equal(await page.locator('.mb-portrait-fallback:not([hidden])').count(),1);
 // Both GitHub Pages paths serve the same new city modules and lesson data.
 await page.unroute('**/assets/crew/**');await page.goto(url+'/money-ops/');assert.equal(await page.locator('.mb-building').count(),8);
 assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS Moneybread City: actual lesson → keyboard work → allocation → city action → reflection → save/reload; Arcade isolation; five responsive sizes; reduced motion; safe rebuild; missing asset fallback; both entry points.');
})().catch(e=>{console.error(e);process.exit(1);});
