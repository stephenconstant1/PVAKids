import {missions05to10} from './missions-05-10.js';
import {missions11to16} from './missions-11-16.js';
import {missions17to22} from './missions-17-22.js';
import {missions23to28} from './missions-23-28.js';
import {missions29to32} from './missions-29-32.js';
import {curriculumMeta} from './curriculum-meta.js';
import {curriculumLanguage} from './curriculum-language.js';

export const curriculum = ['Earning & Creating Value','Building Income Streams','Saving & Paying Yourself First','Budgeting & Smart Spending','Investing & Growing Your Money','Oil, Gas & World Events','Credit, Loans & Smart Borrowing','Entrepreneurship & Starting a Business','Investing & Building Wealth','Budgeting & Goal Setting','Stocks & Owning a Piece of a Company','Compound Interest & the Power of Time','Risk, Reward & Diversification','ETFs, Index Funds & Building a Portfolio','The Stock Market & How Markets Work','Reading a Company — Revenue, Profit & Value','Supply, Demand & Why Prices Change','Inflation & the Changing Value of Money','Banks, Interest & How Money Moves','Credit Scores & Building Strong Credit','Debt & Interest — What Borrowing Really Costs','Insurance & Protecting What You Build','Taxes & Your Paycheck','Starting a Business — Problem to Opportunity','Pricing, Revenue, Expenses & Profit','Marketing, Customers & Building a Brand','Real Estate & Building Wealth Through Property','Careers, Skills & Increasing Your Income','Giving, Generosity & Using Money to Help Others','Financial Independence & Designing Your Future','Building Your Personal Financial Freedom Plan','The Financial Freedom Challenge — Put It All Together'];
const openingMissions = [
 {id:1, title:'Earning & Creating Value', topic:'Your Time • Your Skills • Your Ideas', sector:'THE NEIGHBORHOOD', icon:'♥', brief:'Use your time, your skills, or your ideas to build value and get paid.', lesson:'Build value. Get paid. Value can solve a problem, save time, share knowledge, entertain, make something, or help others.', choices:[
 {id:'time',title:'Your time — Work outside',type:'YOUR TIME → SERVICE',gross:60,cost:0,xp:140,hours:3,explanation:'You used your time to complete useful yard work. The finished service built value and earned money.'},
 {id:'skill',title:'Your skills — Explain schoolwork',type:'YOUR SKILLS → SERVICE',gross:100,cost:0,xp:180,hours:4,explanation:'You used your skills to complete a tutoring service. The finished service built value and earned money.'},
 {id:'product',title:'Your ideas — Create art',type:'YOUR IDEAS → PRODUCT',gross:150,cost:40,xp:220,hours:5,explanation:'You used your ideas to make art people wanted. Art supplies cost $40, so you kept $110 after creating value.'} ]},
 {id:2,title:'Building Income Streams',topic:'Earned • Business • Freelance • Creative Income',sector:'MARKET STREET',location:'MARKET STREET',icon:'✦',brief:'Use your time, skills, and ideas to build more than one way to earn.',lesson:'An income stream is a way money comes in. Your time, your skills, and your ideas can each create value and earn money.',income:120,savings:[0,250,500,750]},
 {id:3,title:'Saving & Paying Yourself First',topic:'SAVE FIRST → SPEND SECOND',sector:'FINANCIAL DISTRICT',location:'FINANCIAL DISTRICT',icon:'◈',brief:'Bring the money you earned into a future payday. Save first, then see how it helps with a surprise.',lesson:'Pay Yourself First means SAVE FIRST → SPEND SECOND. An emergency fund helps keep surprises from becoming loans.',savings:[0,250,500,750]},
 {id:4,title:'Budgeting & Smart Spending',topic:'Needs • Wants • Savings • 50/30/20',sector:'PLANNING PLAZA',location:'PLANNING PLAZA',icon:'⌁',brief:'Give every dollar a job, balance needs and wants, and save toward a goal.',lesson:'A budget is a plan for your money. The 50/30/20 rule is a simple guide: 50% needs, 30% wants, and 20% savings and goals.',budgetSave:100}
];

openingMissions[0].location=openingMissions[0].sector;
export const missions=[...openingMissions,...missions05to10,...missions11to16,...missions17to22,...missions23to28,...missions29to32]
 .map(mission=>{const language=curriculumLanguage[mission.id];return {...mission,...curriculumMeta[mission.id],...language,topic:language.coreIdea,terms:language.terms,concepts:language.terms,principle:curriculumMeta[mission.id].scripture};});
export const events = [
 {id:'repair',title:'Car repair',amount:-600,description:'In this future-adult scenario, your car stops working. You need a $600 repair to get to work.'},
 {id:'phone',title:'Broken phone',amount:-180,description:'Your phone needs a replacement screen. The repair costs $180.'},
 {id:'medical',title:'Medical bill',amount:-220,description:'An unexpected healthcare bill arrives: $220.'},
 {id:'birthday',title:'Birthday money',amount:80,description:'Your family gives you $80. A gift adds money, but it is not earned income.'},
 {id:'bonus',title:'Work bonus',amount:120,description:'Your reliable work earns a one-time $120 bonus.'},
 {id:'hours',title:'Lost work hours',amount:-100,description:'Your work schedule shrinks. Cover a $100 shortfall in your plan.'},
 {id:'prices',title:'Price increase',amount:-65,description:'Your planned groceries and transport cost $65 more.'},
 {id:'fee',title:'Unexpected fee',amount:-35,description:'A missed deadline brings a $35 fee. Check due dates next time.'}
];
export const badges=[
 {id:'earner',icon:'↗',name:'Value Creator',detail:'Complete your first paid project.'},
 {id:'streams',icon:'✦',name:'Income Explorer',detail:'Build three useful ways to earn.'},
 {id:'buffer',icon:'◈',name:'Shock Absorber',detail:'Cover the car repair without borrowing.'},
 {id:'planner',icon:'⌁',name:'Money Mapper',detail:'Give every dollar a job.'},
 {id:'investor',icon:'↗',name:'First Investor',detail:'Build your first investment portfolio.'},
 {id:'founder',icon:'◆',name:'Business Founder',detail:'Turn a need into a business idea.'},
 {id:'analyst',icon:'▥',name:'Company Analyst',detail:'Compare revenue, expenses, profit, and value.'},
 {id:'paycheck',icon:'$',name:'Paycheck Pro',detail:'Explain gross pay and net pay.'},
 {id:'giver',icon:'♥',name:'Community Builder',detail:'Use money to create community impact.'},
 {id:'freedom',icon:'★',name:'Financially Free',detail:'Complete the full 32-mission campaign.'},
 {id:'practice',icon:'↻',name:'Second Perspective',detail:'Finish a practice replay.'}
];
