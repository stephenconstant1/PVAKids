import {missions} from './content.js';
import {lessonVocabulary,vocabularyDefinition} from './runner-vocabulary.js';
export const downtownLesson=missions.find(lesson=>lesson.id===2);
export const downtownOpportunities=[
 {id:'interest',name:'Savings interest',type:'interest income',icon:'interest',customer:'An interest-bearing savings account.',value:'Some savings accounts pay interest.',tradeoff:'Account terms and interest rates can change.'},
 {id:'bonds',name:'Bond interest',type:'investment income',icon:'bond',customer:'A loan to a government or organization.',value:'Some bonds pay interest to lenders.',tradeoff:'Borrowers may not pay; bond values can change.'},
 {id:'dividends',name:'Stock dividends',type:'investment income',icon:'dividend',customer:'Shares are small ownership pieces of a company.',value:'Some companies pay dividends to shareholders.',tradeoff:'Dividends can stop and share values can fall.'},
 {id:'funds',name:'Fund income',type:'investment income',icon:'fund',customer:'A fund holds a collection of investments.',value:'Some funds distribute interest or dividends.',tradeoff:'Payments and investment values can change.'}
];
const practiceWords=[
 {term:'investment income',definition:vocabularyDefinition('investment income'),icon:'streams',example:'Interest and dividends are examples of investment income.'},
 {term:'interest',definition:vocabularyDefinition('interest'),icon:'interest',example:'An interest-bearing savings account may pay interest.'},
 {term:'bonds',definition:vocabularyDefinition('bonds'),icon:'bond',example:'A bond is a loan; some bonds pay interest.'},
 {term:'dividend',definition:vocabularyDefinition('dividend'),icon:'dividend',example:'Some companies pay dividends; payments can change.'},
 {term:'stocks',definition:vocabularyDefinition('stocks'),icon:'dividend',example:'A shareholder owns a small piece of a company.'},
 {term:'etfs',definition:vocabularyDefinition('etfs'),icon:'fund',example:'Some funds distribute income from the investments they hold.'},
 {term:'risk',definition:vocabularyDefinition('risk'),icon:'fund',example:'Investment values can fall; income is not guaranteed.'},
 {term:'needs',definition:vocabularyDefinition('needs'),icon:'home',illustration:'home',example:'Housing, groceries and water are examples of needs.'},
 {term:'wants',definition:vocabularyDefinition('wants'),icon:'toy',illustration:'toy',example:'A toy or game is an optional want.'},
 {term:'loan',definition:vocabularyDefinition('loan'),icon:'bond',example:'Borrowing comes with an agreement to repay.'},
 {term:'income stream',definition:downtownLesson.lesson.split('. ')[0]+'.',icon:'streams',example:'Interest and dividends are different ways money may come in.'}
];
export const downtownVocabulary=[...practiceWords,...lessonVocabulary(2).filter(word=>!practiceWords.some(p=>p.term===word.term)).map(word=>({...word,icon:'streams',example:''}))];
export function downtownConfig(config){return {...config,forwardView:true,vocabulary:downtownVocabulary};}
export function opportunity(id){return downtownOpportunities.find(item=>item.id===id);}
export function projectStreet(lane,depth,width,height){const p=Math.max(0,Math.min(1,depth))**2;return {x:width/2+lane*width*.32*p,y:height*.34+height*.57*p,scale:.12+.88*p};}
export function downtownWordIcon(kind){const paths={interest:'M7 38V19H41V38ZM4 19L24 5L44 19M14 24V34M24 24V34M34 24V34',bond:'M10 5H38V43H10ZM17 15H31M17 22H31M18 31L24 36L30 29',dividend:'M6 37V17H42V37ZM4 17L24 5L44 17M24 25V43M17 36L24 43L31 36',fund:'M6 20H42L37 40H11ZM14 20V8H24V20M25 20V5H35V20',book:'M6 8Q15 3 24 9Q33 3 42 8V35Q33 30 24 36Q15 30 6 35ZM24 9V36',tools:'M12 8L8 15L29 36L36 29L15 8M30 8L40 18M35 13L15 33',person:'M24 7A8 8 0 1 0 24 23A8 8 0 1 0 24 7M8 41Q9 25 24 25Q39 25 40 41',shop:'M6 20V40H42V20M4 20L9 7H39L44 20ZM19 40V27H29V40M5 20H43',bread:'M10 35V18Q10 4 24 7Q39 4 39 18V35ZM17 13L21 20M25 12L29 20',streams:'M5 12H16L24 25L32 12H43M24 25V41M5 22H12M36 22H43'};return `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="12" fill="#fff0b5"/><path d="${paths[kind]||paths.streams}" fill="none" stroke="#176c70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
export function downtownRecap(result,escape){const streams=(result.incomeStreams||[]).map(opportunity).filter(Boolean);return `<section class="downtown-recap" aria-label="Income streams explored"><h2>Your downtown paths</h2>${streams.length?streams.map(item=>`<p><b>${escape(item.name)}</b> · ${escape(item.type)}<br>${escape(item.value)}</p>`).join(''):'<p>No income examples explored yet. Replay to choose a path.</p>'}<p>${streams.length>1?'You explored different income sources. Payments and investment values can change.':'One income stream is one way money comes in. Income is not guaranteed.'}</p></section>`;}
