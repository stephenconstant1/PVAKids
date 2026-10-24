"""Slice generated transparent duck art; never repaint or warp character pixels.
Usage: python3 scripts/import-duck-sheets.py /path/to/id-to-generated-path.json
"""
import hashlib,json,sys,shutil,math
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects,binary_dilation

root=Path(__file__).resolve().parents[1]
inputs=json.loads(Path(sys.argv[1]).read_text())
names={'jordan':'Kanyon','maya':'Maya','kai':'Everest','sofia':'Sofia','eli':'Zion','ruby':'Ruby'}
target=root/'assets/runner/cycles';target.mkdir(exist_ok=True)
metadata={}
for ident,path in inputs.items():
 source=Path(path);image=np.array(Image.open(source).convert('RGBA'))
 labels,_=label(image[:,:,3]>80);counts=np.bincount(labels.ravel());objects=find_objects(labels)
 parts=[(i+1,s) for i,s in enumerate(objects) if counts[i+1]>2500]
 assert len(parts)==18,(ident,len(parts),'Inspect sheet for touching or missing poses')
 parts.sort(key=lambda p:(p[1][0].start+p[1][0].stop)/2)
 ordered=[]
 for row in range(3):ordered+=sorted(parts[row*6:(row+1)*6],key=lambda p:p[1][1].start)
 frames=[]
 for index,(component,_) in enumerate(ordered):
  mask=binary_dilation(labels==component,iterations=2)
  ys,xs=np.where(mask);x0,x1,y0,y1=int(xs.min()),int(xs.max()+1),int(ys.min()),int(ys.max()+1)
  pixels=image[y0:y1,x0:x1].copy();pixels[:,:,3]*=mask[y0:y1,x0:x1].astype('uint8')
  h,w,_=pixels.shape;head=pixels[:max(1,int(h*.38)),:,:3].astype(int)
  skin=(head[:,:,0]>140)&(head[:,:,1]>65)&(head[:,:,1]<205)&(head[:,:,0]>head[:,:,1]*1.15)&(head[:,:,1]>head[:,:,2]*1.15)
  face=np.where(skin)[1];anchor=int(np.median(face)) if len(face) else w//2
  frames.append({'pixels':pixels,'anchor':anchor,'sourceRect':[x0,y0,w,h]})
 left=max(f['anchor'] for f in frames)+3;right=max(f['pixels'].shape[1]-f['anchor'] for f in frames)+3
 cw=left+right;ground=max(f['pixels'].shape[0] for f in frames);ch=ground+6
 atlas=Image.new('RGBA',(cw*6,ch*3));records=[]
 for index,f in enumerate(frames):
  h,w,_=f['pixels'].shape;x=left-f['anchor'];y=ground-h
  atlas.paste(Image.fromarray(f['pixels']),((index%6)*cw+x,(index//6)*ch+y))
  records.append({'index':index,'variant':index%6,'phase':index//6,'sourceRect':f['sourceRect'],'contentRect':[int(x),int(y),int(w),int(h)],'anchorX':left,'groundY':ground})
 dest=target/f'{ident}-duck-source.png';shutil.copyfile(source,dest);atlas.save(target/f'{ident}-duck.png')
 metadata[ident]={'name':names[ident],'source':str(dest.relative_to(root)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceSize':[image.shape[1],image.shape[0]],'image':f'assets/runner/cycles/{ident}-duck.png','cellWidth':cw,'cellHeight':ch,'columns':6,'frameCount':18,'fps':0,'anchorX':left,'groundY':ground,'designHeight':math.ceil(ground*124/58),'maxDrawHeight':58,'frames':records}
assert set(metadata)==set(names)
(root/'career/duck-cycles.json').write_text(json.dumps(metadata,indent=2)+'\n')
print('Imported 6 character sheets, 6 duck variations each, 3 phases each; normal-proportion poses fit overhead clearance.')
