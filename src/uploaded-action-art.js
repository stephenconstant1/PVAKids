import {uploadedActionCycles} from './uploaded-action-cycles.js?v=46.38';
export class UploadedActionArt {
 constructor(id,kind){this.meta=uploadedActionCycles[id]?.[kind];this.ready=false;if(!this.meta)return;this.image=new Image();this.image.onload=()=>{this.ready=true};this.image.src=new URL('../'+this.meta.image,import.meta.url).href;this.ready=Boolean(this.image.complete&&this.image.naturalWidth);}
 draw(c,height,progress,direction=1,reduced=false){if(!this.ready)return false;const m=this.meta,index=reduced?7:Math.min(7,Math.floor(Math.max(0,progress)*8)),[x,y,w,h]=m.frames[index].rect,scale=height/m.scaleHeight;
  c.save();c.scale(direction,1);c.drawImage(this.image,x,y,w,h,-w*scale/2,height/2-m.baseline*scale,w*scale,h*scale);c.restore();return true;
 }
}
