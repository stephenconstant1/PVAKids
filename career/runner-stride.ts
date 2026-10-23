import data from './runner-rigs.json' with {type:'json'};
type Point=readonly [number,number];
type Limb='leftLeg'|'rightLeg'|'leftArm'|'rightArm';
interface Rig {source:string;head:readonly Point[];torso:readonly Point[];bones:Record<Limb,readonly [Point,Point,Point]>;faceGuard:readonly number[];clothSample:Point;pantsSample:Point;sourceSha256:string}
export const runnerRigs=data as unknown as Record<string,Rig>;
export interface StridePose {leftLeg:number;rightLeg:number;leftArm:number;rightArm:number;leftKnee:number;rightKnee:number;leftElbow:number;rightElbow:number;lean:number}
export function stridePose(ms:number):StridePose {
 const phase=ms/120,s=Math.sin(phase);
 return {leftLeg:s*.65,rightLeg:-s*.65,leftArm:-s*.45,rightArm:s*.45,leftKnee:.10+Math.max(0,s)*.75,rightKnee:.10+Math.max(0,-s)*.75,leftElbow:s*.08,rightElbow:-s*.08,lean:.035+Math.cos(phase*2)*.012};
}
type Surface=OffscreenCanvas|HTMLCanvasElement;
type Paint=OffscreenCanvasRenderingContext2D|CanvasRenderingContext2D;
function surface(w:number,h:number):Surface|undefined {
 if(typeof OffscreenCanvas!=='undefined')return new OffscreenCanvas(w,h);
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 return undefined;
}
interface Layer {image:Surface;x:number;y:number;w:number;h:number;label:number}
interface Prepared {layers:Layer[];w:number;h:number}
const cache=new WeakMap<object,Map<string,Prepared>>();
const names:Limb[]=['leftLeg','rightLeg','leftArm','rightArm'];
function inside(x:number,y:number,poly:readonly Point[]):boolean {
 let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
 }return hit;
}
function distance(x:number,y:number,a:Point,b:Point,aspect:number):number {
 const ax=a[0]*aspect,ay=a[1],dx=(b[0]-a[0])*aspect,dy=b[1]-a[1],px=x*aspect-ax,py=y-ay;
 const t=Math.max(0,Math.min(1,(px*dx+py*dy)/(dx*dx+dy*dy)));return (px-dx*t)**2+(py-dy*t)**2;
}
/** Assign each nontransparent source pixel to exactly one bone layer. This
 * avoids polygon clipping leaving strips of the original static limbs behind.
 * Masks and lighting are prepared once, never recomputed in the frame loop. */
function prepare(source:HTMLImageElement,id:string):Prepared|undefined {
 const prior=cache.get(source)?.get(id);if(prior)return prior;
 const rig=runnerRigs[id];if(!rig)return;
 const ratio=Math.min(1,560/Math.max(source.naturalWidth,source.naturalHeight)),w=Math.round(source.naturalWidth*ratio),h=Math.round(source.naturalHeight*ratio);
 const canvas=surface(w,h);if(!canvas)return;const ctx=canvas.getContext('2d',{willReadFrequently:true}) as Paint|null;if(!ctx)return;
 ctx.drawImage(source,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h),labels=new Uint8Array(w*h);
 const bounds=Array.from({length:10},()=>({x:w,y:h,right:0,bottom:0}));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x,offset=i*4;if(!pixels.data[offset+3])continue;
  const nx=x/w,ny=y/h,r=pixels.data[offset],g=pixels.data[offset+1],b=pixels.data[offset+2];
  // Hair behind the shoulders is retained independently of moving clothing.
  const warmHair=r>g*1.08&&r>b*1.08;
  const nearHand=([rig.bones.leftArm[2],rig.bones.rightArm[2]] as const).some(([hx,hy])=>((nx-hx)/.04)**2+((ny-hy)/.05)**2<1);
  const head=inside(nx,ny,rig.head)&&(ny<.27||nx>.55||warmHair)&&!nearHand;
  const sourceArm=([rig.bones.leftArm,rig.bones.rightArm] as const).some(([a,b])=>{
   const dx=(b[0]-a[0])*w/h,dy=b[1]-a[1],t=(((nx-a[0])*w/h)*dx+(ny-a[1])*dy)/(dx*dx+dy*dy);
   return t>.15&&t<1.1&&distance(nx,ny,a,b,w/h)<.065**2;
  });
  let label=head?1:inside(nx,ny,rig.torso)&&!sourceArm?2:0;
  if(!label){
   let best=Infinity;
   names.forEach((name,index)=>{const [a,joint,end]=rig.bones[name];const upper=distance(nx,ny,a,joint,w/h),lower=distance(nx,ny,joint,end,w/h);if(upper<best){best=upper;label=3+index*2;}if(lower<best){best=lower;label=4+index*2;}});
  }
  labels[i]=label;const box=bounds[label-1];box.x=Math.min(box.x,x);box.y=Math.min(box.y,y);box.right=Math.max(box.right,x+1);box.bottom=Math.max(box.bottom,y+1);
 }
 // A source texture can have detached antialiased scraps near an occluding
 // limb. Keep each garment/bone's connected silhouette, avoiding floating scraps.
 const visited=new Uint8Array(w*h);
 for(let label=2;label<=10;label++){
  const groups:number[][]=[];
  for(let seed=0;seed<labels.length;seed++)if(labels[seed]===label&&!visited[seed]){
   const group=[seed];visited[seed]=1;
   for(let q=0;q<group.length;q++){const v=group[q],x=v%w;for(const n of [x? v-1:-1,x<w-1?v+1:-1,v-w,v+w])if(n>=0&&n<labels.length&&!visited[n]&&labels[n]===label){visited[n]=1;group.push(n);}}
   groups.push(group);
  }
  const largest=Math.max(0,...groups.map(g=>g.length));
  for(const group of groups)if(group.length<largest*.025)for(const i of group)labels[i]=0;
 }
 const images=bounds.map(box=>box.right>box.x?ctx.createImageData(box.right-box.x,box.bottom-box.y):null);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const label=labels[y*w+x];if(!label)continue;
  const box=bounds[label-1],image=images[label-1]!,offset=(y*w+x)*4,target=((y-box.y)*image.width+x-box.x)*4;
  // Source faces and all warm skin/hair tones are not recolored. Gentle neutral
  // garment lighting only reinforces the reference art's existing folds.
  const r=pixels.data[offset],g=pixels.data[offset+1],b=pixels.data[offset+2],warm=r>g*1.12&&r>b*1.15;
  const light=label===1||warm?1:1.035-(x/w)*.075;
  image.data[target]=Math.min(255,r*light);image.data[target+1]=Math.min(255,g*light);image.data[target+2]=Math.min(255,b*light);image.data[target+3]=pixels.data[offset+3];
 }
 const layers:Layer[]=[];
 images.forEach((image,index)=>{if(!image)return;const box=bounds[index],part=surface(image.width,image.height)!;(part.getContext('2d') as Paint).putImageData(image,0,0);layers.push({image:part,x:box.x/w,y:box.y/h,w:image.width/w,h:image.height/h,label:index+1});});
 const result={layers,w,h};let entries=cache.get(source);if(!entries){entries=new Map();cache.set(source,entries);}entries.set(id,result);return result;
}
function drawLayer(ctx:CanvasRenderingContext2D,layer:Layer,w:number,h:number):void {ctx.drawImage(layer.image,(layer.x-.5)*w,(layer.y-.5)*h,layer.w*w,layer.h*h);}
function move(ctx:CanvasRenderingContext2D,p:Point,w:number,h:number,angle:number):void {const x=(p[0]-.5)*w,y=(p[1]-.5)*h;ctx.translate(x,y);ctx.rotate(angle);ctx.translate(-x,-y);}
function angle(a:Point,b:Point,w:number,h:number):number {return Math.atan2((b[1]-a[1])*h,(b[0]-a[0])*w);}
function length(a:Point,b:Point,w:number,h:number):number {return Math.hypot((b[0]-a[0])*w,(b[1]-a[1])*h);}
function cap(ctx:CanvasRenderingContext2D,image:HTMLImageElement,p:Point,sample:Point,w:number,h:number,rx:number,ry=rx):void {
 ctx.save();ctx.beginPath();ctx.ellipse((p[0]-.5)*w,(p[1]-.5)*h,w*rx,h*ry,0,0,Math.PI*2);ctx.clip();
 const sw=image.naturalWidth*.045,sh=image.naturalHeight*.045;
 ctx.drawImage(image,sample[0]*image.naturalWidth-sw/2,sample[1]*image.naturalHeight-sh/2,sw,sh,(p[0]-.5-rx)*w,(p[1]-.5-ry)*h,rx*w*2,ry*h*2);ctx.restore();
}
export function strideJoints(id:string,w:number,h:number,ms:number){
 const rig=runnerRigs[id];if(!rig)return undefined;
 const pose=stridePose(ms),phase=ms/120;
 const legs=[rig.bones.leftLeg,rig.bones.rightLeg];
 // A shared ground and leg length prevent the unequal source poses from making
 // one side limp. Each foot has a planted backward stroke and an arcing return.
 const upperLength=legs.reduce((sum,[a,b])=>sum+length(a,b,w,h),0)/2;
 const lowerLength=legs.reduce((sum,[,b,c])=>sum+length(b,c,w,h),0)/2;
 const reach=upperLength+lowerLength;
 const ground=((legs[0][0][1]+legs[1][0][1])/2-.5)*h+reach*.86;
 return Object.fromEntries(names.map(name=>{
  const [root,joint,end]=rig.bones[name];
  const r:Point=[(root[0]-.5)*w,(root[1]-.5)*h];
  if(name.endsWith('Leg')){
   const legPhase=phase+(name==='rightLeg'?Math.PI:0);
   const foot:Point=[r[0]-Math.sin(legPhase)*reach*.24,ground-Math.max(0,-Math.cos(legPhase))*reach*.30];
   const dx=foot[0]-r[0],dy=foot[1]-r[1],d=Math.max(.001,Math.hypot(dx,dy));
   const along=(upperLength**2-lowerLength**2+d*d)/(2*d);
   const bend=Math.sqrt(Math.max(0,upperLength**2-along**2));
   const j:Point=[r[0]+dx/d*along+dy/d*bend,r[1]+dy/d*along-dx/d*bend];
   return [name,{root:r,joint:j,end:foot,upper:Math.atan2(j[1]-r[1],j[0]-r[0]),lower:Math.atan2(foot[1]-j[1],foot[0]-j[0])}];
  }
  const upper=Math.PI/2+pose[name]*1.6,lower=upper-1.4+(name==='leftArm'?pose.leftElbow:pose.rightElbow);
  const a=length(root,joint,w,h),b=length(joint,end,w,h);
  const j:Point=[r[0]+a*Math.cos(upper),r[1]+a*Math.sin(upper)];
  const e:Point=[j[0]+b*Math.cos(lower),j[1]+b*Math.sin(lower)];
  return [name,{root:r,joint:j,end:e,upper,lower}];
 })) as Record<Limb,{root:Point;joint:Point;end:Point;upper:number;lower:number}>;
}
export function drawStride(ctx:CanvasRenderingContext2D,image:HTMLImageElement,id:string,width:number,height:number,ms:number):void {
 const prepared=prepare(image,id),rig=runnerRigs[id];if(!prepared||!rig){ctx.drawImage(image,-width/2,-height/2,width,height);return;}
 const pose=stridePose(ms);
 // Fit the articulated standing reach uniformly, retaining source aspect ratio.
 const reach=Math.max(...(['leftLeg','rightLeg'] as const).map(name=>{const [a,b,c]=rig.bones[name];return a[1]+(length(a,b,width,height)+length(b,c,width,height))/height+.10;}));
 const fit=1/Math.max(1,reach),w=width*fit,h=height*fit;
 const joints=strideJoints(id,w,h,ms)!;
 const feet=(['leftLeg','rightLeg'] as const).map(name=>joints[name].end[1]+h*.055);
 ctx.save();ctx.translate(0,height/2-Math.max(...feet));
 const draw=(label:number)=>{const layer=prepared.layers.find(l=>l.label===label);if(layer)drawLayer(ctx,layer,w,h);};
 const limb=(name:Limb,index:number)=>{
  const [root,joint,end]=rig.bones[name],a=joints[name];
  if(name.endsWith('Leg')){
   const segment=(label:number,from:Point,to:Point,start:Point,finish:Point)=>{
    const scale=Math.hypot(finish[0]-start[0],finish[1]-start[1])/length(from,to,w,h);
    ctx.save();ctx.translate(start[0],start[1]);ctx.rotate(Math.atan2(finish[1]-start[1],finish[0]-start[0])-angle(from,to,w,h));ctx.scale(scale,scale);ctx.translate(-((from[0]-.5)*w),-((from[1]-.5)*h));draw(label);ctx.restore();
   };
   segment(3+index*2,root,joint,a.root,a.joint);segment(4+index*2,joint,end,a.joint,a.end);
   cap(ctx,image,[a.joint[0]/w+.5,a.joint[1]/h+.5],rig.pantsSample,w,h,.035);return;
  }
  const upperRotation=a.upper-angle(root,joint,w,h);
  ctx.save();move(ctx,root,w,h,upperRotation);draw(3+index*2);
  ctx.save();move(ctx,joint,w,h,a.lower-angle(joint,end,w,h)-upperRotation);draw(4+index*2);ctx.restore();
  cap(ctx,image,joint,rig.clothSample,w,h,.025);
  ctx.restore();
 };
 limb('leftLeg',0);limb('rightLeg',1);
 const left=rig.bones.leftLeg[0],right=rig.bones.rightLeg[0];
 cap(ctx,image,[(left[0]+right[0])/2,(left[1]+right[1])/2],rig.pantsSample,w,h,.09,.06);
 cap(ctx,image,rig.bones.leftArm[0],rig.clothSample,w,h,.045,.035);cap(ctx,image,rig.bones.rightArm[0],rig.clothSample,w,h,.04,.035);draw(2);limb('leftArm',2);limb('rightArm',3);
 // Face and hair use the unchanged source-colored head layer, not a new drawing.
 draw(1);ctx.restore();
}
