const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const base=process.env.MONEY_OPS_URL;
 for(const scenario of [
  {width:1440,mode:'arcade',intensity:'intermediate',prefix:'/'},
  {width:390,mode:'arcade',intensity:'expert',prefix:'/'},
  {width:390,mode:'bonus',prefix:'/'},
  {width:390,mode:'arcade',intensity:'rookie',prefix:'/money-ops/'}
 ]){
  const page=await browser.newPage({viewport:{width:scenario.width,height:950},hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(base+scenario.prefix);
  if(scenario.mode==='arcade'){
   await page.locator('[data-action="start-arcade"]').first().click();
   await page.locator(`[data-action="arcade-intensity-${scenario.intensity}"]`).click();
   await page.locator('[data-action="arcade-level-1"]').click();
  }else{
   await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(markLessonCompleted(newGame('Waterfront route','maya'),1),1,'post')));});
   await page.goto(base+scenario.prefix);await page.locator('[data-action="continue-career"]').first().click();
  }
  await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return start.apply(this,args);};});
  await page.locator('[data-action="runner-start"]').click();
  await page.waitForFunction(()=>window.runner?.running&&window.runner.waterfront?.nearReady&&window.runner.waterfront?.tile);
  const layers=await page.evaluate(()=>{
   const r=window.runner;r.setPaused(true);r.draw();const s=r.waterfront;
   s.draw(r.ctx,960,360,30,3,false);const offsets={...s.layerOffsets};s.draw(r.ctx,960,360,999,90,true);
   const still=Object.values(s.layerOffsets).every(v=>v===0);r.draw();return {offsets,still};
  });assert(layers.offsets.path>layers.offsets.railing&&layers.offsets.railing>layers.offsets.near&&layers.offsets.near>layers.offsets.far);assert(layers.still);
  const result=await page.evaluate(()=>{
   const r=window.runner;cancelAnimationFrame(r.raf);r.paused=false;
   let seed=4523;const random=Math.random;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
   const encounters=[],seen=new Set();let ducking=false,ticks=0,jumps=0,ducks=0;
   const key=(type,code)=>window.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));
   try{
    while(r.running&&r.collected<200&&ticks<40000){
     const next=r.entities.filter(e=>!e.done&&['obstacle','moneybox','collectible'].includes(e.type)&&e.x+e.w>r.player.x).sort((a,b)=>a.x-b.x)[0];
     const overhead=next?.behavior==='overhead'&&next.x<r.player.x+310;
     if(overhead&&!ducking){key('keydown','ArrowDown');ducking=true;ducks++;}
     if(!overhead&&ducking){key('keyup','ArrowDown');ducking=false;}
     if(next&&!overhead&&next.x<r.playerBox().x+r.playerBox().w+(next.type==='collectible'?-20:r.speed*(next.type==='moneybox'?.035:.11))&&r.player.grounded){key('keydown','ArrowUp');key('keyup','ArrowUp');jumps++;}
     r.update(.02,ticks*.02);ticks++;
     for(const e of r.entities)if(e.encounter&&!seen.has(e.encounter)){
      seen.add(e.encounter);const items=r.entities.filter(v=>v.encounter===e.encounter),world=r.distance*18;
      encounters.push({start:Math.min(...items.map(v=>v.x))+world,end:Math.max(...items.map(v=>v.x+v.w))+world,type:e.type,speed:r.speed,count:items.length});
     }
     if(ticks%200===0)r.draw();
    }
   }finally{Math.random=random;if(ducking)key('keyup','ArrowDown');}
   r.draw();r.setPaused(true);
   return {coins:r.collected,goal:r.goalReached,reason:r.completed?'ended early':'survival continues',lives:r.lives,x:r.player.x,jumps,ducks,seconds:ticks*.02,encounters,
    target:r.config.targetCoins,phase:r.config.phase};
  });
  assert.equal(result.target,200);assert(result.coins>=200&&result.goal&&result.lives>0,JSON.stringify(result));assert.equal(result.x,112);assert(result.jumps>0&&result.ducks>0);
  const gaps=result.encounters.slice(1).map((e,i)=>e.start-result.encounters[i].end);
  assert(gaps.every(g=>g>=269),'all different encounters need room after the last item');
  assert(new Set(gaps.map(g=>Math.round(g/10))).size>5,'route must vary its gaps');
  assert(result.encounters.some(e=>e.type==='moneybox'));assert(result.encounters.some(e=>e.type==='life'));if(scenario.mode==='bonus')assert(result.encounters.some(e=>e.type==='power'));
  assert(result.encounters.filter(e=>e.type==='collectible').every(e=>e.count===1));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  mkdirSync('/tmp/waterfront-route-review',{recursive:true});
  await page.evaluate(()=>{const r=window.runner;r.paused=false;r.draw();r.paused=true;});
  await page.screenshot({path:`/tmp/waterfront-route-review/${scenario.mode}-${scenario.intensity||'standard'}-${scenario.width}.png`,fullPage:true});
  await page.locator('[data-action="runner-finish-now"]').click();assert.equal(await page.locator('.runner-results').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS full 200-coin route',JSON.stringify({...scenario,coins:result.coins,lives:result.lives,seconds:result.seconds,minGap:Math.round(Math.min(...gaps)),jumps:result.jumps,ducks:result.ducks}));await page.close();
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
