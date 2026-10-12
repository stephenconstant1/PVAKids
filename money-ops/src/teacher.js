import {missions} from './content.js';
import {rank} from './engine.js';
import {finances,netWorth} from './finance.js';

const number=value=>Number.isFinite(value)?value:0;
const text=value=>typeof value==='string'?value:'';
const round=value=>Math.round((value+Number.EPSILON)*100)/100;
const completedIds=profile=>[...new Set(Array.isArray(profile?.completed)?profile.completed:[])]
 .filter(id=>Number.isInteger(id)&&missions.some(mission=>mission.id===id))
 .sort((a,b)=>a-b);

function decisionSummary(decisions=[]){
 return decisions.map(decision=>`${text(decision.stage)||'choice'}: ${text(decision.label)||'Decision'}`).join(' | ');
}

function feedbackSummary(decisions=[]){
 return decisions.map(decision=>text(decision.feedback)).filter(Boolean).join(' | ');
}

function effectSummary(decisions=[]){
 return decisions.flatMap(decision=>Object.entries(decision.effects||{}))
  .filter(([,value])=>Number.isFinite(value)&&value!==0)
  .map(([field,value])=>`${field} ${value>0?'+':''}${value}`)
  .join(' | ');
}

/** Return a compact, serializable snapshot suitable for a teacher dashboard. */
export function studentSummary(profile={}){
 const wallet=finances(profile),completed=completedIds(profile),xp=number(profile.xp);
 const next=missions.find(mission=>!completed.includes(mission.id));
 return {
  studentId:text(profile.studentId??profile.id),
  studentName:text(profile.name)||'Strategist',
  avatar:text(profile.avatar),
  xp,
  rank:rank(xp),
  missionsCompleted:completed.length,
  missionsTotal:missions.length,
  completionPercent:missions.length?round(completed.length/missions.length*100):0,
  nextMissionId:next?.id??null,
  nextMissionTitle:next?.title??'',
  badgeCount:Array.isArray(profile.badges)?new Set(profile.badges).size:0,
  cash:wallet.cash+wallet.checking,
  savings:wallet.savings+wallet.emergencyFund,
  investments:wallet.investments+wallet.stocks+wallet.etfs,
  debt:wallet.debt+wallet.loans,
  netWorth:netWorth(wallet)
 };
}

/** Build one flat record per completed mission for JSON or spreadsheet export. */
export function missionOutcomeRecords(profile={}){
 const student=studentSummary(profile),history=Array.isArray(profile.history)?profile.history:[];
 return completedIds(profile).map(missionId=>{
  const mission=missions.find(item=>item.id===missionId);
  const outcome=history.find(item=>item?.mission===missionId&&!item.practice)
   ??history.find(item=>item?.mission===missionId)??{};
  const decisions=Array.isArray(profile.decisions?.[missionId])?profile.decisions[missionId]:[];
  return {
   studentId:student.studentId,
   studentName:student.studentName,
   missionId,
   missionTitle:mission?.title??text(outcome.title),
   status:'completed',
   medal:text(profile.missionMedals?.[missionId]),
   practice:Boolean(outcome.practice),
   choice:text(outcome.choice),
   borrowed:number(outcome.borrowed),
   netWorthAfter:Number.isFinite(outcome.worth)?outcome.worth:'',
   decisionCount:decisions.length,
   decisionSummary:decisionSummary(decisions),
   feedbackSummary:feedbackSummary(decisions),
   effectSummary:effectSummary(decisions)
  };
 });
}

/** Aggregate several student profiles without mutating or retaining them. */
export function classroomSummary(profiles=[]){
 const students=(Array.isArray(profiles)?profiles:[]).map(studentSummary);
 const average=field=>students.length?round(students.reduce((sum,item)=>sum+item[field],0)/students.length):0;
 return {
  studentCount:students.length,
  missionCompletions:students.reduce((sum,item)=>sum+item.missionsCompleted,0),
  averageCompletionPercent:average('completionPercent'),
  averageXp:average('xp'),
  averageNetWorth:average('netWorth'),
  financiallyFreeStudents:students.filter(item=>item.rank==='Financially Free').length,
  students
 };
}

/** Convert flat records to RFC 4180-compatible CSV text. */
export function recordsToCsv(records=[]){
 if(!Array.isArray(records)||!records.length)return '';
 const headers=[...new Set(records.flatMap(record=>Object.keys(record||{})))];
 const cell=value=>{
  const source=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);
  return /[",\r\n]/.test(source)?`"${source.replaceAll('"','""')}"`:source;
 };
 return [headers.join(','),...records.map(record=>headers.map(header=>cell(record?.[header])).join(','))].join('\r\n');
}
