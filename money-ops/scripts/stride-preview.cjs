const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1000,height:1600}});await page.goto(process.env.MONEY_OPS_URL);
 await page.evaluate(async()=>{
  const {drawStride}=await import('./src/moneybread/runner-stride.js');
  document.body.innerHTML='<canvas id="sheet" width="1000" height="1560"></canvas>';
  const c=document.querySelector('canvas').getContext('2d');c.fillStyle='#b7d8cd';c.fillRect(0,0,1000,1560);
  const ids=['jordan','maya','kai','sofia','eli','ruby'];
  for(let row=0;row<6;row++){
   const image=new Image();image.src=`assets/runner/${ids[row]}-right.png`;await image.decode();
   for(let col=0;col<4;col++){
    c.fillStyle='#173e3b';c.font='16px Arial';c.fillText(`${ids[row]} / ${col===0?'source':col===1?'neutral':col===2?'stride +':'stride −'}`,col*250+12,row*260+22);
    c.save();c.translate(col*250+125,row*260+145);
    const width=200*image.naturalWidth/image.naturalHeight;
    if(col===0)c.drawImage(image,-width/2,-100,width,200);
    else drawStride(c,image,ids[row],width,200,col===1?0:col===2?Math.PI/2*120:Math.PI*1.5*120);
    c.restore();
   }
  }
 });
 await page.locator('canvas').screenshot({path:'/tmp/moneyops-stride-sheet.png'});await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
