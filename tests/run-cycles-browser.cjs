const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:950}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.MONEY_OPS_URL;
 const ids=['jordan','maya','kai','sofia','eli','ruby'];
 for(const prefix of ['/','/money-ops/']){
 await page.goto(base+prefix);
 await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const original=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return original.apply(this,args);};});
 // Actual Arcade selection and actual saved Career Bonus flow, every character.
 for(const mode of ['arcade','bonus'])for(const id of ids){
  if(mode==='arcade'){
   await page.goto(base+prefix);await page.locator('[data-action="start-arcade"]').first().click();
   await page.locator(`[data-action="arcade-character-${id}"]`).click();
   await page.locator('[data-action="arcade-level-2"]').click();
  }else{
   await page.evaluate(async()=>{
    const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');
    const profile=markLessonCompleted(newGame('Cycle Review','jordan'),2);
    localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(profile,2,'post')));
   });await page.goto(base+prefix);await page.locator('[data-action="continue-career"]').first().click();
   await page.locator(`input[name="runner-character"][value="${id}"]`).check();
   assert.match(await page.locator('.runner-titlebar').textContent(),new RegExp(({jordan:'Kanyon',maya:'Maya',kai:'Everest',sofia:'Sofia',eli:'Zion',ruby:'Ruby'})[id]));
  }
  await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');if(!FinancialRunner.prototype._review){const original=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return original.apply(this,args);};FinancialRunner.prototype._review=true;}});
  await page.locator('[data-action="runner-start"]').click();
  await page.waitForFunction(()=>window.runner?.runCycle.ready&&window.runner?.strideTimeMs>0);
  const frames=await page.evaluate(()=>{
   const r=window.runner;r.spawnIn=r.rewardIn=r.boxIn=r.powerIn=r.lifeIn=999;r.entities=[];r.setPaused(true);
   const c=r.runCycle.cycle, hashes=[],bottoms=[],order=[];
   for(let i=0;i<16;i++){
    r.ctx.clearRect(0,0,r.width,r.height);r.strideTimeMs=(i+.05)*1000/c.fps;r.state='running';r.drawPlayer(0);
    order.push(r.runCycle.frame);
    const pixels=r.ctx.getImageData(0,0,r.canvas.width,r.canvas.height);let bottom=-1,hash=0;
    for(let y=0;y<pixels.height;y++)for(let x=0;x<pixels.width;x++){const k=(y*pixels.width+x)*4;if(pixels.data[k+3]){bottom=y;hash=(Math.imul(hash,31)+pixels.data[k]+pixels.data[k+1]*3+pixels.data[k+2]*7)|0;}}
    bottoms.push(bottom);hashes.push(hash);
   }
   r.strideTimeMs=16*1000/c.fps;r.drawPlayer(0);
   return {order,bottoms,unique:new Set(hashes).size,loop:r.runCycle.frame,id:r.characterId,x:r.player.x};
  });
  assert.equal(frames.id,id);assert.equal(frames.x,112);assert.deepEqual(frames.order,Array.from({length:16},(_,i)=>i));
  assert.equal(frames.unique,16,`${mode}/${id} must show 16 distinct supplied poses`);assert.equal(frames.loop,0);
  await page.waitForFunction(()=>window.runner.jumpCycle.ready);
  const jump=await page.evaluate(()=>{
   const r=window.runner;r.setPaused(false);r.jump();r.setPaused(true);const c=r.jumpCycle.cycle,order=[],hashes=[];
   for(let i=0;i<16;i++){
    r.jumpMotion={elapsedMs:(Math.min(i,9)+.05)*r.jumpMotion.flightMs/10,flightMs:r.jumpMotion.flightMs,landed:i>=10,landingMs:Math.max(0,i-10+.05)*40};
    r.player.grounded=i>=10;r.player.y=i>=10?r.ground-r.player.h:70;r.state=i>=10?'landing':'jumping';
    r.ctx.clearRect(0,0,r.width,r.height);r.drawPlayer(0);order.push(r.jumpCycle.frame);
    const d=r.ctx.getImageData(0,0,r.canvas.width,r.canvas.height).data;let hash=0;for(let k=0;k<d.length;k+=4)if(d[k+3])hash=(Math.imul(hash,31)+d[k]+d[k+1]*3+d[k+2]*7)|0;hashes.push(hash);
   }
   r.jumpMotion.landingMs=900;r.drawPlayer(0);const last=r.jumpCycle.frame;
   r.update(.25,1);const recovered=r.jumpMotion===null;
   r.player.grounded=true;r.player.y=r.ground-r.player.h;r.state='running';r.drawPlayer(0);
   return {order,unique:new Set(hashes).size,last,recovered,source:c.name};
  });assert.deepEqual(jump.order,Array.from({length:16},(_,i)=>i));assert.equal(jump.unique,16);assert.equal(jump.last,15);assert(jump.recovered);

  assert(Math.max(...frames.bottoms)-Math.min(...frames.bottoms)<=2,`${id} feet moved off ground`);

  await page.evaluate(()=>{const r=window.runner;r.player.grounded=true;r.player.y=r.ground-r.player.h;r.jumpMotion=null;r.state='running';r.stateTime=0;r.setPaused(false);});

  const ducks=await page.evaluate(()=>{
   const r=window.runner,random=Math.random,seen=[],hashes=[],tops=[],bottoms=[];Math.random=()=>0;
   try{for(let i=0;i<6;i++){
    r.holdDuck('test');r.ctx.clearRect(0,0,r.width,r.height);r.drawPlayer(0);seen.push(r.duckAnimation.variant);
    const d=r.ctx.getImageData(0,0,r.canvas.width,r.canvas.height);let hash=0,top=99999,bottom=-1;
    for(let y=0;y<d.height;y++)for(let x=0;x<d.width;x++){const k=(y*d.width+x)*4;if(d.data[k+3]){top=Math.min(top,y);bottom=y;hash=(Math.imul(hash,31)+d.data[k]+d.data[k+1]*3+d.data[k+2]*7)|0;}}
    hashes.push(hash);tops.push(top);bottoms.push(bottom);
    const lives=r.lives;r.entities=[{type:'obstacle',behavior:'overhead',x:r.player.x,y:r.ground-132,w:110,h:70,done:false,passed:false}];r.update(.01,0);if(r.lives!==lives)throw Error('duck collided with overhead');r.entities=[];
    r.releaseDuck('test');r.update(.3,0);if(r.duckAnimation!==null)throw Error('duck recovery stuck');
   }}finally{Math.random=random;}
   return {unique:new Set(seen).size,poses:new Set(hashes).size,tops,bottoms};
  });assert.equal(ducks.unique,6);assert.equal(ducks.poses,6);assert(ducks.tops.every(y=>y>=232));assert(ducks.bottoms.every(y=>y<=292&&y>=289));
  await page.keyboard.down('ArrowDown');assert(await page.evaluate(()=>window.runner.player.duck));
  await page.keyboard.up('ArrowDown');assert.equal(await page.evaluate(()=>window.runner.player.duck),false);
  const duckButton=page.locator('[data-action="runner-duck"]'),rect=await duckButton.boundingBox();assert(rect.width>=44&&rect.height>=44);
  const touch=await page.context().newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2}]});
  await page.waitForTimeout(750);assert(await page.evaluate(()=>window.runner.player.duck),'touch hold must outlast the old tap timer');
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.evaluate(()=>window.runner.player.duck),false,'touch release stands immediately');
  await touch.detach();await page.evaluate(()=>window.runner.setPaused(true));
  const actual=await page.evaluate(async()=>{
   const r=window.runner,seen=[],draw=r.jumpCycle.drawFrame.bind(r.jumpCycle);
   r.jumpCycle.drawFrame=(...args)=>{seen.push(args[2]);return draw(...args);};
   r.setPaused(false);r.jump();await new Promise(resolve=>setTimeout(resolve,1350));r.setPaused(true);
   r.jumpCycle.drawFrame=draw;
   return {seen:[...new Set(seen)],grounded:r.player.grounded,recovered:r.jumpMotion===null,state:r.state};
  });assert.deepEqual(actual.seen,Array.from({length:16},(_,i)=>i),`${mode}/${id}: real input must show the complete one-shot`);assert(actual.grounded&&actual.recovered);

  await page.locator('[data-action="runner-pause"]').click();
  await page.keyboard.press('Space');assert(await page.evaluate(()=>!window.runner.player.grounded));
  await page.keyboard.press('KeyP');assert(await page.evaluate(()=>window.runner.paused));
  await page.evaluate(()=>{const r=window.runner;r.jumpMotion=null;r.player.grounded=true;r.player.y=r.ground-r.player.h;r.state='running';});
  await page.locator('[data-action="runner-pause"]').click();await page.locator('[data-action="runner-jump"]').click();assert(await page.evaluate(()=>!window.runner.player.grounded));await page.locator('[data-action="runner-pause"]').click();
  const rewards=await page.evaluate(()=>{const r=window.runner;const before=r.score;r.collect({...r.config.collectibleSet[0],x:150,y:160,done:false});r.invulnerable=0;r.hitObstacle({...r.config.obstacleSet[0],x:150,y:240,w:40,h:40,done:false});return {score:r.score>before,lives:r.lives,collected:r.collected};});
  assert(rewards.score);assert.equal(rewards.collected,1);assert.equal(rewards.lives,2);
  if(id==='maya'&&prefix==='/'){
   mkdirSync('/tmp/run-cycle-review',{recursive:true});
   await page.screenshot({path:`/tmp/run-cycle-review/${mode}.png`,fullPage:true});
   for(const width of [390,768,1280]){await page.setViewportSize({width,height:950});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
   await page.setViewportSize({width:1280,height:950});
  }
 }
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base);
 const alternative=await reduced.evaluate(async()=>{
  const {FinancialRunner}=await import('./src/runner.js');const {runnerConfig}=await import('./src/runner-config.js');
  const r=new FinancialRunner(document.createElement('canvas'),runnerConfig(1,'post'),{characterId:'ruby'});
  await Promise.all([r.image.decode(),r.runCycle.image.decode(),r.jumpCycle.image.decode()]);r.runCycle.ready=true;r.jumpCycle.ready=true;r.imageReady=true;r.start();r.drawPlayer(0);r.jump();r.drawPlayer(0);const out={reduced:r.reduced,frame:r.runCycle.frame,jump:!r.player.grounded,jumpFrame:r.jumpCycle.frame};r.destroy();return out;
 });assert.deepEqual(alternative,{reduced:true,frame:0,jump:true,jumpFrame:5});
 assert.deepEqual(errors,[]);console.log('PASS all 6 characters × Arcade/Bonus × both static paths: 16 distinct ordered run/jump frames, one-shot landing recovery, loop, stable feet, selection, six randomized duck variants, held keyboard/touch, overhead clearance, release recovery, scoring, hits, responsive layout; reduced motion retains jumping.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
