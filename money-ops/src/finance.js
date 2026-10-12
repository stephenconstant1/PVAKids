export const financialFields=['cash','checking','savings','emergencyFund','investments','stocks','etfs','assets','otherAssets','property','businessValue','debt','loans','monthlyIncome','monthlyExpenses','creditScore','taxes','insuranceCosts','giving','totalIncome','goalTarget','goalProgress'];

export const defaultFinances=()=>({cash:0,checking:0,savings:0,emergencyFund:0,investments:0,stocks:0,etfs:0,assets:0,otherAssets:0,property:0,businessValue:0,debt:0,loans:0,monthlyIncome:0,monthlyExpenses:0,creditScore:650,taxes:0,insuranceCosts:0,giving:0,totalIncome:0,goalTarget:0,goalProgress:0});

export function normalizeFinances(source={}){
 const defaults=defaultFinances();
 return Object.fromEntries(financialFields.map(key=>[key,Number.isFinite(source[key])?source[key]:defaults[key]]));
}

export const finances=profile=>normalizeFinances(profile);

export function netWorth(profile){
 const p=normalizeFinances(profile);
 const assets=p.cash+p.checking+p.savings+p.emergencyFund+p.investments+p.stocks+p.etfs+p.assets+p.otherAssets+p.property+p.businessValue;
 return assets-p.debt-p.loans;
}

const floorFields=new Set(financialFields.filter(key=>key!=='creditScore'));

export function applyEffects(wallet,effects={}){
 const next=normalizeFinances(wallet),beforeAll=normalizeFinances(wallet);
 for(const [key,raw] of Object.entries(effects)){
  if(!financialFields.includes(key)||!Number.isFinite(raw))continue;
  const before=next[key],target=before+raw;
  if(key==='creditScore')next[key]=Math.max(300,Math.min(850,target));
  else if(floorFields.has(key)&&target<0){
   next[key]=0;
   if(['cash','checking','savings','emergencyFund'].includes(key))next.debt+=-target;
  }else next[key]=target;
 }
 const applied=Object.fromEntries(financialFields.map(key=>[key,next[key]-beforeAll[key]]).filter(([,value])=>value!==0));
 return {wallet:next,applied};
}

export const effectLabels={cash:'Cash',checking:'Checking',savings:'Savings',emergencyFund:'Emergency fund',investments:'Investments',stocks:'Stocks',etfs:'ETFs',assets:'Assets',otherAssets:'Skills/assets',property:'Property',businessValue:'Business value',debt:'Debt',loans:'Loans',monthlyIncome:'Monthly income',monthlyExpenses:'Monthly expenses',creditScore:'Credit score',taxes:'Taxes paid',insuranceCosts:'Insurance cost',giving:'Giving/impact',totalIncome:'Total income',goalTarget:'Goal target',goalProgress:'Goal progress'};

export function validFinances(profile){
 const normalized=normalizeFinances(profile);
 return financialFields.every(key=>Number.isFinite(profile?.[key]??normalized[key])&&(key==='creditScore'?normalized[key]>=300&&normalized[key]<=850:normalized[key]>=0));
}
