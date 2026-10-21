const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const sources=require('../career/destinations.json');
const url=process.env.MONEY_OPS_URL;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1280,height:1000}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 for(let id=1;id<=32;id++){
  await page.evaluate(async id=>{
   const {newGame,finances}=await import('./src/engine.js');const {freshCity}=await import('./src/moneybread/simulation.js');
   const p=newGame('Destination Tester','jordan'),prior=Array.from({length:id-1},(_,i)=>i+1);
   p.completed=prior;p.snapshots=Object.fromEntries(prior.map(i=>[i,finances(p)]));p.moneybread=freshCity(prior);
   localStorage.setItem('money-ops-v02',JSON.stringify(p));
  },id);await page.reload();await page.locator('[data-action="continue-career"]').first().click();
  const marker=page.locator('.mb-destination-marker');assert.equal(await marker.getAttribute('data-action'),`begin-${id}`);
  assert.match(await page.locator('#mb-next-stop-cue').textContent(),new RegExp(sources[id-1].name));
  assert.equal(await page.locator('.mb-level.completed').count(),id-1);assert.equal(await page.locator('.mb-level.locked').count(),32-id);
  if([1,16,32].includes(id)){
   await marker.focus();await page.keyboard.press('Enter');assert.match(await page.locator('.runner-titlebar').textContent(),new RegExp(`WEEK ${String(id).padStart(2,'0')}`));
   await page.locator('[data-action="runner-skip"]').click();await page.locator('[data-action="runner-start-lesson"]').click();
   assert.match(await page.locator('.sequence-brief').textContent(),new RegExp(sources[id-1].title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
   await page.locator('[data-action="home"]').first().click();
  }
 }
 console.log('PASS all 32 sourced next-stop mappings and keyboard entry to original lessons');
 // Animate the real renderer for all six image sources and inspect the shared
 // kinematics the renderer uses, not just an unrelated sine-wave calculation.
 const rendering=await page.evaluate(async()=>{
  const {FinancialRunner}=await import('./src/runner.js'),{runnerConfig}=await import('./src/runner-config.js');
  const {strideJoints}=await import('./src/moneybread/runner-stride.js');
  const result=[];
  for(const id of ['jordan','maya','kai','sofia','eli','ruby']){
   const canvas=document.createElement('canvas'),runner=new FinancialRunner(canvas,runnerConfig(1,'pre'),{characterId:id,animateStride:true});
   await runner.image.decode();runner.imageReady=true;runner.running=true;runner.last=0;runner.startedAt=Date.now();
   const box=JSON.stringify(runner.playerBox());runner.frame(16);cancelAnimationFrame(runner.raf);
   const clock=runner.strideTimeMs;runner.setPaused(true);runner.frame(32);cancelAnimationFrame(runner.raf);
   const froze=clock===runner.strideTimeMs;runner.setPaused(false);
   const begin=performance.now();
   for(let frame=0;frame<24;frame++){runner.strideTimeMs=frame*32;runner.state='running';runner.drawPlayer(0);}
   const average=(performance.now()-begin)/24;
   const a=strideJoints(id,150,124,Math.PI/2*120),b=strideJoints(id,150,124,Math.PI*1.5*120);
   const stillBox=JSON.stringify(runner.playerBox())===box;
   runner.jump();const jumped=runner.player.vy<0;runner.duck();const ducked=runner.player.duck;
   runner.destroy();result.push({id,froze,clock,average,stillBox,jumped,ducked,leftChangesSide:a.leftLeg.end[0]<a.rightLeg.end[0]&&b.leftLeg.end[0]>b.rightLeg.end[0]});
  }return result;
 });
 for(const row of rendering){assert(row.clock>0&&row.froze&&row.stillBox&&row.jumped&&row.ducked&&row.leftChangesSide,JSON.stringify(row));assert(row.average<25,`${row.id} cached sprite drawing should stay below 25ms/frame: ${row.average}`);}
 console.log('PASS all six source-preserving articulated runners, pause, unchanged hitboxes, jump/duck controls and cached frame cost',rendering.map(r=>({id:r.id,ms:Number(r.average.toFixed(2))})));
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('[data-action="continue-career"]').first().click();
 assert.equal(await page.locator('.mb-destination-marker').evaluate(n=>getComputedStyle(n).animationName),'none');
 const reduced=await page.evaluate(async()=>{
  const {FinancialRunner}=await import('./src/runner.js'),{runnerConfig}=await import('./src/runner-config.js');
  const runner=new FinancialRunner(document.createElement('canvas'),runnerConfig(1,'pre'),{animateStride:true});await runner.image.decode();runner.imageReady=true;
  runner.running=true;runner.last=0;runner.frame(16);cancelAnimationFrame(runner.raf);const answer=runner.reduced&&runner.strideTimeMs===0;runner.destroy();return answer;
 });assert(reduced);
 // A missing canonical location must be reported, never replaced with a guess.
 const missing=await browser.newContext(),m=await missing.newPage();
 await m.route('**/src/moneybread/destinations.json',route=>{const bad=structuredClone(sources);bad[0].sourceLocation='source lesson needed';return route.fulfill({contentType:'application/json',body:JSON.stringify(bad)});});
 await m.goto(url);await m.locator('#name').fill('Missing Source Test');await m.locator('#profile-form button[type=submit]').click();
 assert.equal(await m.locator('.mb-destination-marker').count(),0);assert.match(await m.locator('.mb-map-panel [role=alert]').textContent(),/Level 1: source lesson needed/);
 await missing.close();assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS static reduced-motion destination and runner feedback; explicit missing-location state; no browser runtime errors');
})().catch(error=>{console.error(error);process.exit(1);});
