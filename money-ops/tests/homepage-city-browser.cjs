const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const url=process.env.MONEY_OPS_URL;
 await page.goto(url);
 await page.locator('#name').fill('Scene Review');await page.locator('#profile-form button[type=submit]').click();
 const saved=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await page.reload();assert.equal(await page.locator('.title-screen').count(),1,'saved players land on homepage');
 assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),saved);
 assert.equal(await page.locator('#profile-form').count(),0,'homepage cannot accidentally replace saved profile');
 await page.locator('[data-action="continue-career"]').first().focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('.mb-guide').count(),0,'no isolated guide cutout');
 assert.equal(await page.locator('.mb-level').count(),32);
 assert.match(await page.locator('#mb-next-stop-cue').textContent(),/Value Village/);
 const image=page.locator('.mb-source-city img');
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  const art=await image.evaluate(async img=>{await img.decode();const b=img.getBoundingClientRect();return {src:img.getAttribute('src'),width:b.width,height:b.height,natural:img.naturalWidth,bottom:b.bottom};});
  assert(art.src.includes('money-ops-moneybread-city.jpg'));assert.equal(art.natural,1280);assert(Math.abs(art.width/art.height-1280/748)<.01);
  const controls=await page.locator('.source-city-controls').boundingBox();assert(controls.y>=art.bottom,'controls stay below original lettering and all six crew');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.mb-destination-marker').evaluate(n=>getComputedStyle(n).animationName),'none');
 await page.locator('.mb-destination-marker').focus();await page.keyboard.press('Enter');
 await page.locator('[data-action="runner-skip"]').click();await page.locator('[data-action="runner-start-lesson"]').click();
 assert.match(await page.locator('.sequence-brief').textContent(),/Earning & Creating Value/);
 await page.locator('[data-action="site-home"]').click();assert.equal(await page.locator('.title-screen').count(),1);
 await page.locator('[data-action="start-arcade"]').first().click();assert.equal(await page.locator('.arcade-level-card').count(),32);
 await page.locator('[data-action="site-home"]').click();assert.equal(await page.locator('.title-screen').count(),1);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/tmp/moneyops-home-review.png',fullPage:true});
 await page.locator('[data-action="continue-career"]').first().click();await page.locator('[data-action="home"]').first().click();
 await page.screenshot({path:'/tmp/moneyops-city-review.png',fullPage:true});await page.locator('.mb-source-city').screenshot({path:'/tmp/moneyops-original-city-review.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS homepage on reload without losing saves; exact uncropped city with all six crew; controls outside artwork; 320/390/768/1440px; reduced motion; keyboard Lesson 1 entry; Arcade available; no page errors.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
