import data from './run-cycles.json' with {type:'json'};
import jumps from './jump-cycles.json' with {type:'json'};
import ducks from './duck-cycles.json' with {type:'json'};
import motion from './run-motion.json' with {type:'json'};
export const runMotion=motion;

export interface RunCycle {
 name:string; image:string; columns:number; frameCount:number; fps:number;
 playbackOrder?:readonly number[]; playbackDurationMs?:number; motionReference?:string; cellWidth:number; cellHeight:number; anchorX:number; groundY:number; designHeight:number;
 frames:readonly {index:number;sourceRect:readonly number[];anchorX:number;groundY:number;contentRect:readonly number[]}[];
}
export const runCycles:Record<string,RunCycle>=data;
export const jumpCycles:Record<string,RunCycle>=jumps;
export const duckCycles:Record<string,RunCycle>=ducks;
export interface JumpMotion {elapsedMs:number;flightMs:number;landed:boolean;landingMs:number}
/** Flight is driven by the existing physics; landing/recovery consumes .24s.
 * Frames clamp instead of wrapping. No input delay or physics changes. */
export function jumpFrame(motion:JumpMotion,reduced=false):number {
 if(reduced)return motion.landed?15:5;
 return motion.landed?Math.min(15,10+Math.floor(motion.landingMs/40)):
  Math.min(9,Math.floor(Math.max(0,motion.elapsedMs)/motion.flightMs*10));
}
/** Row-major order follows the supplied sheets: 0..7, then 8..15. */
export function runFrame(cycle:RunCycle,elapsedMs:number,reduced=false):number {
 if(reduced)return 0;
 if(!cycle.motionReference)return Math.floor(Math.max(0,elapsedMs)*cycle.fps/1000)%cycle.frameCount;
 const duration=cycle.playbackDurationMs||motion.durationMs;
 const slot=Math.min(cycle.frameCount-1,Math.floor(((Math.round(Math.max(0,elapsedMs)*1e6)/1e6)%duration)/duration*cycle.frameCount));
 return cycle.playbackOrder?.[slot]??slot;
}
export class CharacterRunCycle {
 readonly cycle:RunCycle|undefined;
 readonly image:HTMLImageElement;
 ready=false;
 failed=false;
 frame=0;
 constructor(id:string,kind:'run'|'jump'|'duck'='run',onSettled:()=>void=()=>{}){
  this.cycle=(kind==='duck'?duckCycles:kind==='jump'?jumpCycles:runCycles)[id];this.image=new Image();
  this.image.onload=()=>{this.ready=true;onSettled();};this.image.onerror=()=>{this.failed=true;onSettled();};
  if(this.cycle)this.image.src=new URL('../../'+this.cycle.image+'?v=46.6',import.meta.url).href;
  else this.failed=true;
  this.ready=Boolean(this.image.complete&&this.image.naturalWidth);
 }
 /** Uniform scale and measured anchors only. Never rotate/warp individual art. */
 draw(ctx:CanvasRenderingContext2D,height:number,elapsedMs:number,reduced=false):boolean {
  const c=this.cycle;if(!c||!this.ready||!this.image.naturalWidth)return false;
  return this.drawFrame(ctx,height,runFrame(c,elapsedMs,reduced));
 }
 drawFrame(ctx:CanvasRenderingContext2D,height:number,frame:number):boolean {
  const c=this.cycle;if(!c||!this.ready||!this.image.naturalWidth)return false;
  this.frame=Math.max(0,Math.min(c.frameCount-1,frame));
  const scale=height/c.designHeight;
  ctx.drawImage(this.image,(this.frame%c.columns)*c.cellWidth,
   Math.floor(this.frame/c.columns)*c.cellHeight,c.cellWidth,c.cellHeight,
   Math.round(-c.anchorX*scale),Math.round(height/2-c.frames[this.frame].groundY*scale),c.cellWidth*scale,c.cellHeight*scale);
  return true;
 }
}
