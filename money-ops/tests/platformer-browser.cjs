const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 for(const width of [1440,390])for(const mode of ['arcade','bonus']){
  const page=await browser.newPage({viewport:{width,height:950},hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));const base=process.env.MONEY_OPS_URL;
  await page.goto(base);
  if(mode==='arcade'){await page.locator('[data-action="start-arcade"]').first().click();await page.locator('[data-action="arcade-level-1"]').click();}
  else{
   await page.evaluate(async()=>{const {newGame}=await import('./src/engine.js');const {openRunner,markLessonCompleted}=await import('./src/runner-state.js');localStorage.setItem('money-ops-v02',JSON.stringify(openRunner(markLessonCompleted(newGame('Tile test','maya'),1),1,'post')));});
   await page.reload();await page.locator('[data-action="continue-career"]').first().click();
  }
  await page.evaluate(async()=>{const {FinancialRunner}=await import('./src/runner.js');const start=FinancialRunner.prototype.start;FinancialRunner.prototype.start=function(...args){window.runner=this;return start.apply(this,args);};});
  await page.locator('[data-action="runner-start"]').click();await page.waitForFunction(()=>window.runner?.running&&window.runner.runCycle.ready);
  const checks=await page.evaluate(async()=>{
   const {runnerBody,runnerMap,runnerTiles,RUNNER_ZOOM}=await import('./src/moneybread/runner-physics.js');
   const {ArrayTileMap,TILE,overlapsSolid}=await import('./src/moneybread/platform-physics.js');
   const r=window.runner;cancelAnimationFrame(r.raf);r.paused=false;r.entities=[];r.routeGapRemaining=1e9;
   const reset=()=>{r.physics=runnerBody(r.player.x+r.player.w/2);r.tileMap=runnerMap();r.collected=0;r.distance=0;r.player.duck=false;r.duckAnimation=null;r.jumpMotion=null;r.duckSources?.clear();r.duckRemaining=0;r.projectPlayer();};
   const samples=[];
   for(const fps of [30,60,120,144]){
    reset();for(let i=0;i<fps;i++)r.update(1/fps,i/fps);
    const y=r.physics.y;r.jump();let min=y,ticks=0,visible=true,draws=[];
    while(!r.player.grounded&&ticks++<fps*2){r.update(1/fps,ticks/fps);min=Math.min(min,r.physics.y);r.draw();visible&&=r.player.y-r.cameraY>=15;}
    const translate=r.ctx.translate.bind(r.ctx);r.ctx.translate=(x,y)=>{draws.push([x,y]);translate(x,y);};r.drawPlayer(0);r.ctx.translate=translate;
    samples.push({fps,width:r.physics.w,height:r.physics.h,landed:r.player.grounded,clipped:overlapsSolid(r.physics,r.tileMap),jump:y-min,visible,rounded:draws.every(([x,y])=>Number.isInteger(x)&&Number.isInteger(y)),screenX:r.player.x});
   }
   reset();const level=runnerTiles.level.map(row=>[...row]),wall=9;for(let y=0;y<runnerTiles.floorRow;y++)level[y][wall]=1;r.tileMap=new ArrayTileMap(level,false);
   for(let i=0;i<120;i++)r.update(1/60,i/60);const stop={x:r.physics.x,vx:r.physics.vx,right:r.physics.right,expected:wall*TILE-r.physics.w,inside:overlapsSolid(r.physics,r.tileMap)};
   reset();r.last=performance.now();r.raf=requestAnimationFrame(r.boundFrame);r.setPaused(true);return {samples,stop,tile:TILE,zoom:RUNNER_ZOOM};
  });
  assert.equal(checks.tile,16);assert.equal(checks.zoom,4);
  for(const row of checks.samples){assert.equal(row.width,12);assert.equal(row.height,26);assert(row.landed&&!row.clipped&&row.visible&&row.rounded,JSON.stringify(row));assert(row.jump>=63&&row.jump<=67);assert.equal(row.screenX,112);}
  assert.equal(checks.stop.x,checks.stop.expected);assert.equal(checks.stop.vx,0);assert(checks.stop.right&&!checks.stop.inside);
  await page.locator('[data-action="runner-pause"]').click();await page.keyboard.press('ArrowUp');assert(await page.evaluate(()=>!window.runner.player.grounded));
  await page.waitForFunction(()=>window.runner.player.grounded);
  const duck=page.locator('[data-action="runner-duck"]'),rect=await duck.boundingBox();assert(rect.width>=44&&rect.height>=44);
  const touch=await page.context().newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2}]});
  assert.equal(await page.evaluate(()=>window.runner.physics.h),14);await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.evaluate(()=>window.runner.physics.h),26);await touch.detach();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const canvas=await page.locator('#runner-canvas').boundingBox();assert(Math.abs(canvas.width/canvas.height-960/360)<.04,'phone must show the complete game bitmap');
  mkdirSync('/tmp/platformer-review',{recursive:true});await page.screenshot({path:`/tmp/platformer-review/${mode}-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS integrated platform physics',JSON.stringify({mode,width,checks}));await page.close();
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
