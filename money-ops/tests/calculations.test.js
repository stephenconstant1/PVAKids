import test from 'node:test';
import assert from 'node:assert/strict';
import {
 budget503020,
 compound,
 compoundInterest,
 debtPayoff,
 inflationValue,
 loanPayment,
 paycheckTaxes,
 realEstateCashFlow,
 simpleInterest,
 taxPaycheck
} from '../src/simulators.js';

const closeTo=(actual,expected,tolerance=1e-8)=>{
 assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} should be within ${tolerance} of ${expected}`);
};

test('simple and compound interest use decimal annual rates',()=>{
 assert.deepEqual(simpleInterest(1000,0.05,3),{principal:1000,interest:150,total:1150});
 assert.equal(compound(1000,0.05,3)[3].value,1157.625);
 const monthly=compoundInterest(1000,0.12,1,12);
 closeTo(monthly.total,1126.8250301319697);
 closeTo(monthly.interest,126.82503013196977);
});

test('the 50/30/20 budget assigns every dollar',()=>{
 const plan=budget503020(2450);
 assert.deepEqual(plan,{income:2450,needs:1225,wants:735,savings:490});
 assert.equal(plan.needs+plan.wants+plan.savings,plan.income);
});

test('fixed-rate loan payment handles interest and zero-interest loans',()=>{
 closeTo(loanPayment(200000,0.06,360),1199.1010503055138);
 assert.equal(loanPayment(1200,0,12),100);
 assert.equal(loanPayment(0,0.08,24),0);
});

test('debt payoff compounds monthly and reduces the final payment',()=>{
 const result=debtPayoff(1000,0.12,100);
 assert.equal(result.paidOff,true);
 assert.equal(result.months,11);
 closeTo(result.totalInterest,58.98488001215102);
 closeTo(result.totalPaid,1058.984880012151);
 assert.equal(result.remainingBalance,0);
 assert.ok(result.schedule.at(-1).payment<100);

 const stalled=debtPayoff(1000,0.12,10,24);
 assert.equal(stalled.paidOff,false);
 assert.equal(stalled.months,1);
 assert.equal(stalled.remainingBalance,1000);
});

test('inflation converts future dollars to present purchasing power',()=>{
 closeTo(inflationValue(1000,0.03,10),744.0939148967249);
 assert.equal(inflationValue(800,0,20),800);
});

test('paycheck taxes itemize deductions and net pay',()=>{
 const result=taxPaycheck(1000,{federal:0.10,state:0.05,socialSecurity:0.062,medicare:0.0145});
 assert.deepEqual(result,{
  gross:1000,
  federalTax:100,
  stateTax:50,
  socialSecurityTax:62,
  medicareTax:14.5,
  totalTaxes:226.5,
  netPay:773.5
 });
 assert.deepEqual(paycheckTaxes(1000,{federal:0.1}),taxPaycheck(1000,{federal:0.1}));
});

test('real-estate cash flow includes vacancy, ownership, and operating costs',()=>{
 assert.deepEqual(realEstateCashFlow({
  rent:1800,
  mortgage:1000,
  taxes:180,
  insurance:70,
  maintenance:100,
  vacancy:90
 }),{
  rent:1800,
  effectiveIncome:1710,
  operatingExpenses:350,
  debtService:1000,
  totalExpenses:1440,
  cashFlow:360
 });
});

test('calculators reject invalid inputs instead of returning NaN',()=>{
 assert.throws(()=>simpleInterest(-1,0.05,1),/Principal/);
 assert.throws(()=>compoundInterest(100,0.05,1,0),/positive integer/);
 assert.throws(()=>budget503020(Number.NaN),/finite/);
 assert.throws(()=>loanPayment(1000,-0.01,12),/supported range/);
 assert.throws(()=>debtPayoff(1000,0.12,0),/greater than zero/);
 assert.throws(()=>inflationValue(100,-1,2),/supported range/);
 assert.throws(()=>taxPaycheck(100,{federal:0.8,state:0.3}),/Combined/);
 assert.throws(()=>realEstateCashFlow({rent:1000,vacancy:-10}),/vacancy/);
});
