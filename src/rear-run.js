import {rearRunCycles} from './rear-run-manifest.js?v=46.36';
export class RearRunCycle {
 constructor(id,onReady=()=>{}){this.meta=rearRunCycles[id];this.ready=false;this.id=id;if(!this.meta){this.failed=true;return;}this.image=new Image();this.image.onload=()=>{this.ready=true;onReady()};this.image.onerror=()=>{this.failed=true;onReady()};this.image.src=new URL('../'+this.meta.image,import.meta.url).href;this.ready=Boolean(this.image.complete&&this.image.naturalWidth);}
 draw(c,x,feet,height,time,reduced=false){if(!this.ready)return false;const m=this.meta,index=reduced?0:Math.floor(time/m.frameMs)%8,[sx,sy,sw,sh]=m.frames[index].rect,scale=height/m.bodyHeight;c.drawImage(this.image,sx,sy,sw,sh,x-sw*scale/2,feet-m.baseline*scale,sw*scale,sh*scale);return true;}
}
