"""Import the approved 4x4 sheets using measured connected components.
Usage: python3 scripts/import-updated-run-sheets.py /path/to/six/sheets
Only crops, exterior background removal and uniform whole-pose scaling occur.
"""
from pathlib import Path
import sys,json,hashlib,shutil
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects,binary_fill_holes,binary_dilation
root=Path(__file__).resolve().parent.parent
folder=Path(sys.argv[1]);out=root/'assets/runner/cycles'
motion=json.loads((root/'career/run-motion.json').read_text());result={}
for ident,name,index in [('maya','Maya',1),('kai','Everest',2),('eli','Zion',3),('ruby','Ruby',4),('sofia','Sofia',5),('jordan','Kanyon',6)]:
 original=folder/f'{index}-Photo-{index}.jpg';rgb=np.array(Image.open(original).convert('RGB'));a=rgb.astype(int)
 labels,n=label((np.ptp(a,axis=2)>35)|(a.max(axis=2)<165));counts=np.bincount(labels.ravel());objects=find_objects(labels)
 parts=sorted([(s[0].start,s[1].start,i+1,s) for i,s in enumerate(objects) if counts[i+1]>1800]);assert len(parts)==16
 ordered=[]
 for row in range(4):ordered+=sorted(parts[row*4:row*4+4],key=lambda p:p[1])
 frames=[]
 for _,_,component,s in ordered:
  mask=binary_dilation(binary_fill_holes(labels==component),iterations=1);ys,xs=np.where(mask);x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
  crop=rgb[y0:y1,x0:x1];rgba=np.dstack([crop,(mask[y0:y1,x0:x1]*255).astype('uint8')]);scale=512/crop.shape[0]
  im=Image.fromarray(rgba).resize((round(rgba.shape[1]*scale),round(rgba.shape[0]*scale)),Image.Resampling.LANCZOS)
  # Face-center anchor in the upper face region, never the sprite's changing width.
  p=crop[:int(len(crop)*.38)].astype(int);skin=(p[:,:,0]>140)&(p[:,:,1]>75)&(p[:,:,1]<205)&(p[:,:,2]<175)&(p[:,:,0]>p[:,:,1]*1.15)&(p[:,:,1]>p[:,:,2]*1.15)
  anchor=round(float(np.median(np.where(skin)[1]))*scale)
  frames.append((im,anchor,[int(x0),int(y0),int(x1-x0),int(y1-y0)]))
 left=max(f[1] for f in frames)+4;right=max(f[0].width-f[1] for f in frames)+4;cw=left+right;baseline=max(f[0].height for f in frames);ch=baseline+8
 atlas=Image.new('RGBA',(cw*8,ch*2));records=[]
 for i,(im,anchor,rect) in enumerate(frames):
  x=left-anchor;y=baseline-im.height;atlas.paste(im,((i%8)*cw+x,(i//8)*ch+y))
  records.append({'index':i,'sourceRect':rect,'anchorX':left,'groundY':baseline,'contentRect':[x,y,im.width,im.height]})
 shutil.copyfile(original,out/f'{ident}-run-source.jpg');atlas.save(out/f'{ident}-run.png')
 result[ident]={'name':name,'source':f'assets/runner/cycles/{ident}-run-source.jpg','sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'sourceSize':[rgb.shape[1],rgb.shape[0]],'image':f'assets/runner/cycles/{ident}-run.png','cellWidth':cw,'cellHeight':ch,'columns':8,'frameCount':16,'fps':16*1000/motion['durationMs'],'anchorX':left,'groundY':baseline,'designHeight':512,'sourceLayout':[4,4],'motionReference':'run-motion.json','frames':records}
 print(name,'16 measured poses; 124px display height; source RGB design preserved')
(root/'career/run-cycles.json').write_text(json.dumps(result,indent=2)+'\n')
