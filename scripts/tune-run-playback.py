"""Find a continuous loop through supplied poses; never modify character pixels."""
import json,random
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parent.parent
p=root/'career/run-cycles.json';data=json.loads(p.read_text());rng=random.Random(465)
for c in data.values():
 atlas=Image.open(root/c['image']);cw,ch=c['cellWidth'],c['cellHeight'];features=[]
 for i in range(16):
  tile=atlas.crop(((i%8)*cw,(i//8)*ch,(i%8+1)*cw,(i//8+1)*ch)).resize((48,64))
  a=np.array(tile).astype(float)/255;alpha=a[:,:,3:4];features.append(np.concatenate([a[:,:,:3]*alpha,alpha],axis=2))
 cost=np.array([[np.mean(np.abs(a-b)) for b in features] for a in features])
 def score(order):return sum(cost[order[i],order[(i+1)%16]] for i in range(16))
 candidates=[list(range(16))]
 for _ in range(100):
  order=[0]+rng.sample(list(range(1,16)),15)
  changed=True
  while changed:
   changed=False
   for i in range(1,15):
    for j in range(i+1,16):
     a,b=order[i-1],order[i];cc,d=order[j],order[(j+1)%16]
     if cost[a,cc]+cost[b,d]<cost[a,b]+cost[cc,d]-1e-8:
      order[i:j+1]=reversed(order[i:j+1]);changed=True
  candidates.append(order)
 best=min(candidates,key=score);before=score(list(range(16)));after=score(best)
 c['playbackOrder']=best;c['playbackDurationMs']=800;c['fps']=20;c['transitionAudit']={'rowMajorCost':float(before),'loopCost':float(after),'method':'whole-pose alpha/color transition cost, deterministic 2-opt including wrap seam'}
 print(c['name'],best,'transition change',round((1-after/before)*100),'percent')
p.write_text(json.dumps(data,indent=2)+'\n')
