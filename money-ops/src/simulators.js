// Future mission adapters: fictional data, explicit simulated time, no financial APIs.
export const companies=[
 {id:'solar',name:'Sunline Energy',price:40,risk:'high',dividend:0.01},
 {id:'grocer',name:'Neighborhood Foods',price:25,risk:'medium',dividend:0.02},
 {id:'index',name:'Community Index',price:50,risk:'mixed',dividend:0.015}
];

const finite=(value,name)=>{
 if(!Number.isFinite(value))throw Error(`${name} must be a finite number`);
 return value;
};

const nonNegative=(value,name)=>{
 finite(value,name);
 if(value<0)throw Error(`${name} cannot be negative`);
 return value;
};

const decimalRate=(value,name,{allowNegative=false}={})=>{
 finite(value,name);
 if((allowNegative&&value<=-1)||(!allowNegative&&value<0))throw Error(`${name} is outside the supported range`);
 return value;
};

export function buyStock(wallet,portfolio,id,shares){
 const company=companies.find(candidate=>candidate.id===id);
 if(!company||!Number.isInteger(shares)||shares<=0||wallet.cash<company.price*shares)throw Error('Invalid purchase');
 const cost=company.price*shares;
 return {
  wallet:{...wallet,cash:wallet.cash-cost,investments:wallet.investments+cost},
  portfolio:{...portfolio,[id]:(portfolio[id]||0)+shares}
 };
}

export function marketStep(portfolio,returns={}){
 return companies.reduce((result,company)=>{
  const value=(portfolio[company.id]||0)*company.price;
  return {
   value:result.value+value*(1+(returns[company.id]||0)),
   dividends:result.dividends+value*company.dividend
  };
 },{value:0,dividends:0});
}

/** Annual compound-growth schedule. Rates use decimals, so 5% is 0.05. */
export function compound(principal,rate,years){
 nonNegative(principal,'Principal');
 decimalRate(rate,'Rate',{allowNegative:true});
 if(!Number.isInteger(years)||years<0)throw Error('Invalid projection');
 return Array.from({length:years+1},(_,year)=>({year,value:Number((principal*(1+rate)**year).toPrecision(15))}));
}

/** Compound interest with a selectable number of compounding periods per year. */
export function compoundInterest(principal,annualRate,years,compoundsPerYear=1){
 nonNegative(principal,'Principal');
 decimalRate(annualRate,'Annual rate',{allowNegative:true});
 nonNegative(years,'Years');
 if(!Number.isInteger(compoundsPerYear)||compoundsPerYear<=0)throw Error('Compounds per year must be a positive integer');
 const total=principal*(1+annualRate/compoundsPerYear)**(compoundsPerYear*years);
 return {principal,interest:total-principal,total};
}

/** Simple interest: interest never earns additional interest. */
export function simpleInterest(principal,annualRate,years){
 nonNegative(principal,'Principal');
 decimalRate(annualRate,'Annual rate',{allowNegative:true});
 nonNegative(years,'Years');
 const interest=principal*annualRate*years;
 return {principal,interest,total:principal+interest};
}

/** Split income using the 50% needs, 30% wants, and 20% saving guideline. */
export function budget503020(income){
 nonNegative(income,'Income');
 return {income,needs:income*0.5,wants:income*0.3,savings:income*0.2};
}

/** Fixed monthly payment for a fully amortizing loan. */
export function loanPayment(principal,annualRate,months){
 nonNegative(principal,'Principal');
 decimalRate(annualRate,'Annual rate');
 if(!Number.isInteger(months)||months<=0)throw Error('Months must be a positive integer');
 if(principal===0)return 0;
 if(annualRate===0)return principal/months;
 const monthlyRate=annualRate/12;
 return principal*monthlyRate/(1-(1+monthlyRate)**-months);
}

/**
 * Simulate fixed monthly debt payments. The final payment is reduced to the
 * exact amount owed, and `paidOff` is false if the requested month cap is hit.
 */
export function debtPayoff(balance,annualRate,payment,maxMonths=1200){
 nonNegative(balance,'Balance');
 decimalRate(annualRate,'Annual rate');
 nonNegative(payment,'Payment');
 if(!Number.isInteger(maxMonths)||maxMonths<=0)throw Error('Maximum months must be a positive integer');
 if(balance>0&&payment===0)throw Error('Payment must be greater than zero');

 const monthlyRate=annualRate/12;
 const schedule=[];
 let remainingBalance=balance;
 let totalInterest=0;
 let totalPaid=0;

 for(let month=1;month<=maxMonths&&remainingBalance>0;month+=1){
  const startingBalance=remainingBalance;
  const interest=startingBalance*monthlyRate;
  const amountPaid=Math.min(payment,startingBalance+interest);
  const principalPaid=Math.max(0,amountPaid-interest);
  remainingBalance=Math.max(0,startingBalance+interest-amountPaid);
  totalInterest+=interest;
  totalPaid+=amountPaid;
  schedule.push({month,startingBalance,interest,principalPaid,payment:amountPaid,remainingBalance});

  // A payment that does not cover interest cannot reduce a positive balance.
  if(principalPaid===0)break;
 }

 return {
  months:schedule.length,
  totalPaid,
  totalInterest,
  remainingBalance,
  paidOff:remainingBalance===0,
  schedule
 };
}

/** Present purchasing power after inflation (or deflation with a negative rate). */
export function inflationValue(amount,annualInflationRate,years){
 nonNegative(amount,'Amount');
 decimalRate(annualInflationRate,'Inflation rate',{allowNegative:true});
 nonNegative(years,'Years');
 return amount/(1+annualInflationRate)**years;
}

/** Estimate a paycheck from flat tax rates supplied as decimals. */
export function taxPaycheck(gross,{federal=0,state=0,socialSecurity=0,medicare=0}={}){
 nonNegative(gross,'Gross pay');
 const rates={federal,state,socialSecurity,medicare};
 Object.entries(rates).forEach(([name,rate])=>{
  finite(rate,`${name} rate`);
  if(rate<0||rate>1)throw Error(`${name} rate must be between zero and one`);
 });
 const combinedRate=federal+state+socialSecurity+medicare;
 if(combinedRate>1)throw Error('Combined tax rate cannot exceed 100%');
 const federalTax=gross*federal;
 const stateTax=gross*state;
 const socialSecurityTax=gross*socialSecurity;
 const medicareTax=gross*medicare;
 const totalTaxes=federalTax+stateTax+socialSecurityTax+medicareTax;
 return {gross,federalTax,stateTax,socialSecurityTax,medicareTax,totalTaxes,netPay:gross-totalTaxes};
}

// Readable alias for callers that name the operation rather than its result.
export const paycheckTaxes=taxPaycheck;

/** Monthly rental cash flow. `vacancy` is a dollar reserve, not a percentage. */
export function realEstateCashFlow({rent,mortgage=0,taxes=0,insurance=0,maintenance=0,vacancy=0}){
 const inputs={rent,mortgage,taxes,insurance,maintenance,vacancy};
 Object.entries(inputs).forEach(([name,value])=>nonNegative(value,name));
 const effectiveIncome=rent-vacancy;
 const operatingExpenses=taxes+insurance+maintenance;
 const totalExpenses=mortgage+operatingExpenses+vacancy;
 return {
  rent,
  effectiveIncome,
  operatingExpenses,
  debtService:mortgage,
  totalExpenses,
  cashFlow:rent-totalExpenses
 };
}

export function businessRound({price,customers,unitCost,fixedCosts}){
 if([price,customers,unitCost,fixedCosts].some(value=>!Number.isFinite(value)||value<0))throw Error('Invalid business inputs');
 const revenue=price*customers;
 const expenses=unitCost*customers+fixedCosts;
 return {revenue,expenses,profit:revenue-expenses};
}
