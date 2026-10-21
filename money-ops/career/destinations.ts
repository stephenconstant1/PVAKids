import data from './destinations.json' with {type:'json'};
import type {DistrictId} from './types.js';
export interface LessonDestination {
 lessonId:number;title:string;name:string;sourceLocation:string;
 sourceFiles:string[];district:DistrictId;x:number;y:number;
}
// Stop names and lesson numbers come from src/city.js. Coordinates only place
// those existing stops on the illustrated map; they are not new curriculum.
export const destinations=data as LessonDestination[];
export const missingDestinations=Array.from({length:32},(_,i)=>i+1).filter(id=>{
 const d=destinations.find(d=>d.lessonId===id);
 return !d?.name||!d.sourceLocation||d.name==='source lesson needed'||d.sourceLocation==='source lesson needed'||!Number.isFinite(d.x)||!Number.isFinite(d.y)||d.x<0||d.x>100||d.y<0||d.y>100;
});
export function destination(id:number):LessonDestination|undefined {
 return missingDestinations.includes(id)?undefined:destinations.find(d=>d.lessonId===id);
}
