import {missions} from './content.js';
import {lessonVocabulary} from './runner-vocabulary.js';

export const runnerEnvironments={
 school:{name:'Financial Freedom School',sky:'#79c9e8',far:'#cfe9d6',near:'#4d8c69',ground:'#294f45',accent:'#ffe071'},
 business:{name:'Downtown Business District',sky:'#83b5d5',far:'#8da5ad',near:'#486878',ground:'#243d49',accent:'#f7ca62'},
 shopping:{name:'Smart Shopping Center',sky:'#efb7aa',far:'#f8dfb6',near:'#b87875',ground:'#5d4a4c',accent:'#ffe879'},
 bank:{name:'Bank District',sky:'#8bcdd0',far:'#d7e8d7',near:'#50867d',ground:'#294b4a',accent:'#ffdf71'},
 market:{name:'Stock Market City',sky:'#7eaed9',far:'#bfcfe1',near:'#3e6785',ground:'#243a55',accent:'#9df09d'},
 energy:{name:'Energy Industry',sky:'#f3b56f',far:'#ead6a4',near:'#8d7650',ground:'#4f463a',accent:'#fff18b'},
 startup:{name:'Entrepreneur Street',sky:'#a79ad8',far:'#e2d7ed',near:'#705f8d',ground:'#413852',accent:'#ffdf71'},
 housing:{name:'Housing Neighborhood',sky:'#8fc9df',far:'#d8e8d2',near:'#67936e',ground:'#3e5745',accent:'#ffe17c'},
 freedom:{name:'Financial Freedom Skyline',sky:'#655eaa',far:'#aca8d5',near:'#3b4777',ground:'#222942',accent:'#ffe272'}
};

const rows=[
 [1,'school',['Missed Opportunity','Wasted Time'],['Paycheck','Skill','Value Token'],['Value Boost','income']],
 [2,'business',['Lost Job','Single-Income Risk'],['Side Hustle','Income Stream','Customer'],['Income Boost','income']],
 [3,'bank',['Impulse Purchase','Surprise Bill'],['Savings Jar','Emergency Fund','Pay Yourself First'],['Emergency Fund Shield','shield']],
 [4,'shopping',['Overspending','Unnecessary Purchase'],['Budget Envelope','Smart Purchase','Needs Token'],['Budget Magnet','magnet']],
 [5,'market',['Market Dip','Risky Speculation'],['Stock','Bond','Investment Token'],['Growth Multiplier','multiplier']],
 [6,'energy',['Fuel Spike','Supply Disruption'],['Energy Saving','Smart Decision','Efficiency Token'],['Energy Saver','slow']],
 [7,'bank',['High APR','Late Fee'],['On-Time Payment','Responsible Credit','Low-Rate Token'],['Credit Guard','shield']],
 [8,'startup',['Startup Cost','Failed Pitch'],['Customer','Business Idea','Solution Token'],['Founder Sprint','dash']],
 [9,'market',['Panic Selling','Concentrated Risk'],['Long-Term Asset','Growth Token','Ownership'],['Wealth Builder','multiplier']],
 [10,'school',['Unplanned Spending','Goal Distraction'],['SMART Goal','Budget Milestone','Focus Token'],['Goal Focus','magnet']],
 [11,'market',['Market Volatility','Misinformation'],['Share','Dividend','Ownership Token'],['Owner Vision','multiplier']],
 [12,'market',['Early Withdrawal','Missed Contribution'],['Compounding Coin','Time Bonus','Contribution'],['Compound Growth Multiplier','multiplier']],
 [13,'market',['Concentration Risk','Market Shock'],['Diversified Asset','Risk Shield','Balanced Mix'],['Diversification Shield','shield']],
 [14,'market',['Excessive Fee','Poor Allocation'],['ETF Basket','Index Fund','Low-Fee Token'],['Index Glide','slow']],
 [15,'market',['Price Swing','False Signal'],['Market Knowledge','Trade Signal','Bid Token'],['Market Signal','warning']],
 [16,'business',['High Debt','Weak Profit'],['Revenue','Earnings','Strong Business'],['Company Scanner','warning']],
 [17,'business',['Shortage','Price Spike'],['Balanced Supply','Profitable Sale','Demand Token'],['Supply Balance','clear']],
 [18,'shopping',['Rising Cost','Shrinking Buying Power'],['Wage Growth','Buying-Power Boost','Value Token'],['Inflation Guard','shield']],
 [19,'bank',['Banking Fee','Overdraft'],['Interest Earning','Deposit','Savings Token'],['Interest Builder','multiplier']],
 [20,'bank',['Missed Payment','High Utilization'],['Payment History','Credit Improvement','Low Balance'],['Score Shield','shield']],
 [21,'bank',['Minimum-Payment Trap','Compounding Debt'],['Principal Reduction','Debt Payoff','Extra Payment'],['Debt-Free Dash','dash']],
 [22,'housing',['Accident','Uninsured Loss'],['Coverage Shield','Emergency Protection','Policy Token'],['Insurance Protection','shield']],
 [23,'business',['Unexpected Withholding','Filing Error'],['Pay Stub','Tax Knowledge','Net Pay'],['Paycheck Lens','warning']],
 [24,'startup',['Startup Setback','Unsolved Problem'],['Solution','Customer','Opportunity Token'],['Opportunity Finder','magnet']],
 [25,'startup',['Excessive Cost','Underpricing'],['Revenue','Profit Margin','Price Token'],['Profit Power','multiplier']],
 [26,'startup',['Bad Advertisement','Lost Customer'],['Brand Loyalty','Customer Growth','Message Token'],['Brand Beacon','magnet']],
 [27,'housing',['Repair Cost','Vacancy'],['Equity','Rental Income','Property Token'],['Equity Builder','multiplier']],
 [28,'school',['Skill Gap','Lost Opportunity'],['Training','Raise','Certification'],['Career Boost','income']],
 [29,'school',['Waste','Missed Community Need'],['Community Impact','Generosity','Giving Token'],['Impact Wave','clear']],
 [30,'freedom',['Lifestyle Inflation','Unsustainable Expense'],['Freedom Milestone','Passive Income','Choice Token'],['Freedom Glide','slow']],
 [31,'freedom',['Poor Planning','Conflicting Priority'],['Financial Goal','Balanced Plan','Plan Token'],['Plan Compass','warning']],
 [32,'freedom',['Mixed Money Hazard','Freedom Setback'],['Ultimate Wealth','Knowledge Reward','Freedom Star'],['Financial Freedom Mode','freedom']]
];

const icons=['⚠','▰','◆','●','▲','■','✦','⬟'];
const rewardIcons=['$','●','★'];
const behaviors=['ground','overhead','moving','wide'];
const reflections={
 shield:'Protection gave you room to recover.',multiplier:'Knowledge helped each smart choice grow.',magnet:'A clear plan made useful rewards easier to spot.',dash:'A strong financial move cleared the path.',slow:'Understanding the system gave you more time to choose.',warning:'Knowledge helped you read the warning signs.',clear:'Solving the cause cleared several obstacles.',income:'Creating value opened more earning opportunities.',freedom:'Connected money skills created more choices.'
};

export const runnerLessons=rows.map(([id,environment,hazards,rewards,power])=>{
 const mission=missions[id-1],effect=power[1],vocabulary=lessonVocabulary(id),definitionFor=label=>vocabulary.find(item=>item.term.toLowerCase()===label.toLowerCase())?.definition||`Connect this runner word to ${mission.title}.`;
 return {
  lessonId:id,title:mission.title,environment,vocabulary,
  obstacleSet:hazards.map((label,index)=>({id:`w${id}-hazard-${index+1}`,label,definition:definitionFor(label),icon:icons[(id+index)%icons.length],behavior:behaviors[(id+index)%behaviors.length],art:{hue:(id*47+index*131)%360,pattern:(id+index)%6,variant:(id*3+index)%9}})),
  collectibleSet:rewards.map((label,index)=>({id:`w${id}-reward-${index+1}`,label,definition:definitionFor(label),icon:rewardIcons[index],kind:index===0?'dollar':index===1?'gold':'lesson',value:index===0?1:index===1?5:10})),
  powerUp:{id:`w${id}-power`,name:power[0],label:power[0],definition:definitionFor(power[0]),effect,icon:effect==='shield'?'◇':effect==='magnet'?'◎':effect==='multiplier'?'×2':effect==='dash'?'↠':effect==='slow'?'◷':effect==='warning'?'!':effect==='clear'?'✦':effect==='income'?'$+':'★'},
  reflection:reflections[effect],
  pre:{targetCoins:100,maxLives:3,difficulty:1},
  post:{targetCoins:100,maxLives:3,difficulty:1.08}
 };
});

export function runnerConfig(lessonId,phase='pre'){
 const lesson=runnerLessons.find(item=>item.lessonId===Number(lessonId));
 if(!lesson)throw Error('Unknown runner lesson');
 const stage=phase==='post'?lesson.post:lesson.pre;
 return {...lesson,phase,targetCoins:Number(lessonId)===1?200:stage.targetCoins,maxLives:stage.maxLives,lifeCap:Number(lessonId)===1?5:stage.maxLives,extraLifeInterval:Number(lessonId)===1?18:0,continueAfterGoal:Number(lessonId)===1,difficulty:stage.difficulty,environmentData:runnerEnvironments[lesson.environment]};
}
