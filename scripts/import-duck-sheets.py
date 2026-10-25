"""Slice generated transparent duck art; never repaint or warp character pixels.
Usage: python3 scripts/import-duck-sheets.py /path/to/id-to-generated-path.json
"""
from pathlib import Path
import hashlib,json,sys,shutil,math,importlib.util
spec=importlib.util.spec_from_file_location("face",Path(__file__).with_name("measure-face.py"));face_measure=importlib.util.module_from_spec(spec);spec.loader.exec_module(face_measure)
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
 assert len(parts)==6,(ident,len(parts),'Inspect sheet for touching or missing poses')
 parts.sort(key=lambda p:(p[1][0].start+p[1][0].stop)/2)
 ordered=[]
 for row in range(2):ordered+=sorted(parts[row*3:(row+1)*3],key=lambda p:p[1][1].start)
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
 atlas=Image.new('RGBA',(cw*3,ch*2));records=[]
 for index,f in enumerate(frames):
  h,w,_=f['pixels'].shape;x=left-f['anchor'];y=ground-h
  atlas.paste(Image.fromarray(f['pixels']),((index%3)*cw+x,(index//3)*ch+y))
  records.append({'index':index,'variant':index,'sourceRect':f['sourceRect'],'contentRect':[int(x),int(y),int(w),int(h)],'anchorX':left,'groundY':ground})
 dest=target/f'{ident}-duck-source.png';shutil.copyfile(source,dest);atlas.save(target/f'{ident}-duck.png')
 run=json.loads((root/'career/run-cycles.json').read_text())[ident]
 run_source=np.array(Image.open(root/run['source']).convert('RGBA'))
 measure=face_measure.glasses_width if ident=='eli' else face_measure.face_width
 run_sizes=[]
 for f in run['frames']:
  x,y,w,h=f['sourceRect'];run_sizes.append(measure(run_source[y:y+h,x:x+w]))
 head_target=float(np.median(run_sizes))*124/run['designHeight']
 duck_size=float(np.median([measure(f['pixels']) for f in frames]))
 scale=head_target/duck_size;design_height=124/scale
 head_reference={'metric':'glasses-width' if ident=='eli' else 'face-width','runPixels':head_target,'duckSourcePixels':duck_size,'duckPixels':duck_size*scale,'scale':scale}
 assert ground*scale<90,(ident,ground*scale,'Compact art still too tall at full head size')
 print(ident,'matched head',round(head_target,2),'duck height',round(ground*scale,2))
 metadata[ident]={'name':names[ident],'source':str(dest.relative_to(root)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceSize':[image.shape[1],image.shape[0]],'image':f'assets/runner/cycles/{ident}-duck.png','cellWidth':cw,'cellHeight':ch,'columns':3,'frameCount':6,'fps':0,'anchorX':left,'groundY':ground,'designHeight':design_height,'maxDrawHeight':ground*scale,'headReference':head_reference,'frames':records}
assert set(metadata)==set(names)
(root/'career/duck-cycles.json').write_text(json.dumps(metadata,indent=2)+'\n')
print('Imported 6 character sheets, 6 full-size duck poses each; calibrated heads match running sprites.')
