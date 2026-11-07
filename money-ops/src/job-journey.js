import {allocationReady} from './moneybread/job-practice.js?v=46.25';
import {finances} from './finance.js';
import {markLessonCompleted,openRunner} from './runner-state.js';
// The job board is a practice activity: completion never deposits its example dollars.
export function completeJobJourney(profile,plan){
 if(!allocationReady(plan))return profile;
 const completed=[...new Set([...profile.completed,1])];
 const city=profile.moneybread;
 const moneybread=city?{...city,legacy:[...new Set([...city.legacy,1])]}:city;
 return markLessonCompleted({...profile,completed,moneybread,
  snapshots:{...profile.snapshots,1:profile.snapshots[1]||finances(profile)},
  active:profile.active?.id===1?null:profile.active,
  jobJourney:{lessonId:1,stage:'complete',job:plan.job,costs:{materials:plan.materials,labor:plan.labor,overhead:plan.overhead},allocation:{...plan.allocation}}},1);
}
export function startJobRun(profile){return {...openRunner(profile,1,'post'),jobJourney:{...profile.jobJourney,stage:'run'}};}
export const jobRunActive=profile=>profile?.jobJourney?.stage==='run'&&profile.runnerSession?.lessonId===1&&profile.runnerSession?.phase==='post';
