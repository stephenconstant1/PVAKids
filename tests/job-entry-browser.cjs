const {chromium}=require('playwright');const assert=require('node:assert/strict');const {mkdirSync}=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,768,1440])for(const savedCareer of [false,true]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<500,reducedMotion:width===320?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));const url=process.env.MONEY_OPS_URL+(width===768?'/money-ops/':'/');await page.goto(url);
 if(savedCareer){await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {attachCity}=await import('./src/moneybread/simulation.js');const p=newGame('Returning learner','maya');p.completed=[1];localStorage.setItem('money-ops-v02',JSON.stringify(attachCity(p)));});await page.reload();}
 const original=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));await page.locator('[data-action="job-practice-open"]').click();
 assert(await page.locator('.job-opening-comic').isVisible());assert.equal(await page.locator('.job-play-board').count(),0);assert.match(await page.locator('.job-comic-heading').textContent(),/Panel 1 of 4/);
 await page.locator('[data-action="job-intro-next"]').click();assert.match(await page.locator('.job-comic-heading').textContent(),/Panel 2 of 4/);await page.locator('[data-action="job-intro-back"]').click();assert.match(await page.locator('.job-comic-heading').textContent(),/Panel 1 of 4/);
 for(let i=0;i<4;i++){await page.locator('[data-action="job-intro-next"]').focus();await page.keyboard.press('Enter');}
 assert(await page.locator('.job-play-board').isVisible());assert((await page.locator('.job-play-board').boundingBox()).y<600);assert.equal(await page.locator('.job-cost-grid').count(),1);assert.equal(await page.locator('[data-job-cost]').count(),3);
 await page.locator('[data-action="job-plan-tutor"]').click();assert.match(await page.locator('.job-customer h2').textContent(),/School Tutor/);assert.equal(await page.locator('.job-opening-comic').count(),0);
 assert.equal(await page.locator('.job-totals [data-job-total]').textContent(),'$80');assert(await page.locator('.job-check-primary').isDisabled());
 for(const category of ['materials','labor','overhead'])await page.locator(`[data-action="job-plan-pack-${category}"]`).click();await page.locator('.job-check-primary').click();assert.match(await page.locator('.job-plan-feedback').textContent(),/Job plan ready/);assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),original);
 mkdirSync('/tmp/job-board-review',{recursive:true});if(!savedCareer)await page.locator('.job-game').screenshot({path:`/tmp/job-board-review/board-${width}.png`});
 await page.locator('[data-action="job-intro-replay"]').click();assert(await page.locator('.job-opening-comic').isVisible());if(!savedCareer)await page.locator('.job-opening-comic').screenshot({path:`/tmp/job-board-review/comic-${width}.png`});await page.locator('[data-action="job-intro-skip"]').click();assert(await page.locator('.job-play-board').isVisible());
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('[data-action="job-practice-close"]').click();
 if(savedCareer){assert(await page.locator('.mb-shell').isVisible());await page.locator('[data-action="mb-view-job"]').click();assert(await page.locator('.job-opening-comic').isVisible());assert.deepEqual((await page.evaluate(()=>JSON.parse(localStorage.getItem('money-ops-v02')))).moneybread,JSON.parse(original).moneybread);}
 else{assert(await page.locator('.title-screen').isVisible());assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),null);}
 assert.deepEqual(errors,[]);console.log('PASS comic-first job entry',JSON.stringify({width,savedCareer}));await page.close();
 }
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
