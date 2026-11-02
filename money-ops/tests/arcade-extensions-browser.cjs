const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const [width,lesson,reduced] of [[1440,1,false],[390,8,false],[320,32,true]]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<500,reducedMotion:reduced?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.MONEY_OPS_URL+(width===390?'/money-ops/':'/'));
 await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');localStorage.setItem('money-ops-v02',JSON.stringify(newGame('Preserved learner','maya')));});const saved=await page.evaluate(()=>localStorage.getItem('money-ops-v02'));
 await page.locator('[data-action="start-arcade"]').first().click();await page.locator(`[data-action="arcade-level-${lesson}"]`).click();
 await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return start.apply(this,args);};});
 await page.locator('[data-action="runner-start"]').click();await page.waitForFunction(()=>window.runner?.running);
 await page.evaluate(()=>{const r=window.runner;cancelAnimationFrame(r.raf);r.onUpdate(r.snapshot());});
 // Actual scheduler produces three separated ladders with open approaches.
 const ladders=await page.evaluate(()=>{const r=window.runner,counts=[];let time=0;for(let i=0;i<18000&&counts.length<3;i++){if(r.climb.attached)r.jump();r.update(.01,time+=.01);if(r.climb.count>counts.length){counts.push({count:r.climb.count,distance:r.distance,hazards:r.entities.filter(e=>e.type==='obstacle'&&!e.done&&e.x+e.w>r.player.x-100).length});} // Avoid hazards with the same legal actions used by a player.
 const next=r.entities.find(e=>e.type==='obstacle'&&!e.done&&e.x+e.w>=r.player.x&&e.x<r.player.x+350);if(next){if(next.behavior==='overhead'&&r.player.grounded)r.holdDuck('autoplay');else {r.releaseDuck('autoplay');if(r.player.grounded)r.jump();}}else r.releaseDuck('autoplay');
 if(r.completed)throw Error('Autoplay lost lives before recurrence');}
 return counts;});
 assert.equal(ladders.length,3,JSON.stringify(ladders));assert(ladders.every(x=>x.hazards===0));assert(ladders[1].distance-ladders[0].distance>=849);
 // Deterministic contact isolates collectible accounting from automatic run score.
 const vocab=await page.evaluate(()=>{const r=window.runner;r.entities=[];r.routeGapRemaining=1e9;r.releaseAllDuck();r.player.y=r.ground-r.player.h;r.player.vy=0;r.player.grounded=true;r.syncPhysicsFromPlayer();const before=[r.coins,r.collected,r.score,r.xp,r.bonusMoney];for(let i=0;i<r.config.vocabulary.length;i++){r.spawnVocabulary();r.collectVocabulary(r.entities.at(-1));}r.collectVocabulary(r.entities.at(-1));r.onUpdate(r.snapshot());r.draw();return {before,after:[r.coins,r.collected,r.score,r.xp,r.bonusMoney],words:r.vocabularyCollected,total:r.config.vocabulary.length};});
 assert.deepEqual(vocab.after,vocab.before);assert.equal(vocab.words.length,vocab.total);assert.match(await page.locator('[data-word-progress]').textContent(),new RegExp(`${vocab.total} / ${vocab.total}`));
 await page.locator('#runner-canvas').focus();await page.keyboard.press('f');assert.equal(await page.evaluate(()=>window.runner.flourish.kind),'flip');await page.keyboard.press('k');assert(await page.evaluate(()=>window.runner.flourish.queuedKick));
 const combo=await page.evaluate(()=>{const r=window.runner,before=r.playerBox();const direction=r.flourish.direction;r.stepFlourish(.51);r.draw();const result={kind:r.flourish.kind,direction:r.flourish.direction,before,after:r.playerBox()};r.setPaused(true);result.cleared=r.flourish===null;return result;});assert.equal(combo.kind,'kick');assert.equal(combo.direction,-1);assert.deepEqual(combo.after,combo.before);assert(combo.cleared);
 await page.locator('[data-action="runner-pause"]').click();await page.locator('[data-action="runner-kick"]')[width<500?'tap':'click']();assert.equal(await page.evaluate(()=>window.runner.flourish.kind),'kick');
 await page.evaluate(()=>{const r=window.runner;r.stepFlourish(1);r.jumpMotion=null;r.player.y=r.ground-r.player.h;r.player.vy=0;r.player.grounded=true;r.syncPhysicsFromPlayer();});
 await page.locator('#runner-canvas').focus();await page.keyboard.down('ArrowDown');assert(await page.evaluate(()=>window.runner.player.duck));await page.keyboard.up('ArrowDown');assert(await page.evaluate(()=>!window.runner.player.duck));await page.keyboard.press('Space');assert(await page.evaluate(()=>!window.runner.player.grounded));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.evaluate(()=>localStorage.getItem('money-ops-v02')),saved);assert.deepEqual(errors,[]);await page.screenshot({path:`/tmp/arcade-extensions-${width}.png`,fullPage:true});console.log('PASS Arcade extensions',JSON.stringify({width,lesson,reduced,ladders,words:vocab.total}));await page.close();
 }
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
