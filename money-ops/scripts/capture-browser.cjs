const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
 await page.goto(process.env.MONEY_OPS_URL);await page.locator('.money-ops-reference').evaluate(i=>i.decode());
 await page.locator('.home-crew-hero').screenshot({path:'/tmp/moneyops-landing-reference.png'});
 await page.locator('#name').fill('City Explorer');await page.locator('#profile-form button[type=submit]').click();
 await page.locator('.mb-city-scene').evaluate(i=>i.decode());
 await page.locator('.mb-map-panel').screenshot({path:'/tmp/moneybread-map.png'});
 await page.locator('.mb-hero').screenshot({path:'/tmp/moneybread-guide.png'});
 console.log('Map loaded:',await page.locator('.mb-map').getAttribute('class'));
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
