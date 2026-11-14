import {missions} from './content.js';
import {lessonVocabulary,vocabularyDefinition} from './runner-vocabulary.js';
export const downtownLesson=missions.find(lesson=>lesson.id===2);
export const downtownOpportunities=[
 {id:'bakery',name:'Bakery job',type:'earned income',icon:'bread',customer:'Neighbors looking for fresh bread.',value:'Prepare fresh bread and help neighbors.',tradeoff:'A job takes scheduled time and effort.'},
 {id:'tutor',name:'Tutoring',type:'freelance income',icon:'book',customer:'A student who needs schoolwork explained.',value:'Explain schoolwork so a student understands.',tradeoff:'Helping another student takes preparation and teaching time.'},
 {id:'repair',name:'Repair service',type:'freelance income',icon:'tools',customer:'A neighbor whose bicycle needs fixing.',value:'Fix a neighbor’s bicycle so they can use it again.',tradeoff:'Another repair takes tools, time and careful work.'},
 {id:'market',name:'Neighborhood market',type:'business income',icon:'shop',customer:'Neighbors looking for useful products.',value:'Offer useful products that meet neighbors’ needs.',tradeoff:'Serving more customers takes planning, supplies and effort.'}
];
const practiceWords=[
 {term:'skills',definition:vocabularyDefinition('skills'),icon:'tools',example:'A tutor uses explaining skills to help a student.'},
 {term:'customer',definition:vocabularyDefinition('customer'),icon:'person',example:'A neighbor buying bread is a bakery customer.'},
 {term:'services',definition:vocabularyDefinition('services'),icon:'tools',example:'Repairing a bicycle is a service.'},
 {term:'business income',definition:vocabularyDefinition('business income'),icon:'shop',example:'A market receives money by selling products to customers.'},
 {term:'income stream',definition:downtownLesson.lesson.split('. ')[0]+'.',icon:'streams',example:'A bakery job and tutoring are two ways to earn.'}
];
export const downtownVocabulary=[...practiceWords,...lessonVocabulary(2).filter(word=>!practiceWords.some(p=>p.term===word.term)).map(word=>({...word,icon:'streams',example:''}))];
export function downtownConfig(config){return {...config,forwardView:true,vocabulary:downtownVocabulary};}
export function opportunity(id){return downtownOpportunities.find(item=>item.id===id);}
export function projectStreet(lane,depth,width,height){const p=Math.max(0,Math.min(1,depth))**2;return {x:width/2+lane*width*.32*p,y:height*.34+height*.57*p,scale:.12+.88*p};}
export function downtownWordIcon(kind){const paths={book:'M6 8Q15 3 24 9Q33 3 42 8V35Q33 30 24 36Q15 30 6 35ZM24 9V36',tools:'M12 8L8 15L29 36L36 29L15 8M30 8L40 18M35 13L15 33',person:'M24 7A8 8 0 1 0 24 23A8 8 0 1 0 24 7M8 41Q9 25 24 25Q39 25 40 41',shop:'M6 20V40H42V20M4 20L9 7H39L44 20ZM19 40V27H29V40M5 20H43',bread:'M10 35V18Q10 4 24 7Q39 4 39 18V35ZM17 13L21 20M25 12L29 20',streams:'M5 12H16L24 25L32 12H43M24 25V41M5 22H12M36 22H43'};return `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="12" fill="#fff0b5"/><path d="${paths[kind]||paths.streams}" fill="none" stroke="#176c70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
export function downtownRecap(result,escape){const streams=(result.incomeStreams||[]).map(opportunity).filter(Boolean);return `<section class="downtown-recap" aria-label="Income streams explored"><h2>Your downtown paths</h2>${streams.length?streams.map(item=>`<p><b>${escape(item.name)}</b> · ${escape(item.type)}<br>${escape(item.value)}</p>`).join(''):'<p>No business stops explored yet. Replay to choose a path.</p>'}<p>${streams.length>1?'You explored more than one income stream. Each takes time, skills or planning.':'One income stream is one way money comes in. You can explore another on your next run.'}</p></section>`;}
