import {rearRunCycles} from './rear-run-manifest.js';
export class RearRunCycle {
 constructor(id){this.meta=rearRunCycles[id];this.ready=false;this.id=id;if(!this.meta)return;this.image=new Image();this.image.onload=()=>{this.ready=true};this.image.onerror=()=>{this.failed=true};this.image.src=new URL('../'+this.meta.image,import.meta.url).href;}
 draw(c,x,feet,height,time,reduced=false){if(!this.ready)return false;const m=this.meta,index=reduced?0:Math.floor(time/80)%8,[sx,sy,sw,sh]=m.frames[index].rect,scale=height/m.bodyHeight;c.drawImage(this.image,sx,sy,sw,sh,x-sw*scale/2,feet-m.baseline*scale,sw*scale,sh*scale);return true;}
}
