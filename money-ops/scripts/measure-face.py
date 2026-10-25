"""Numerical source-art measurements only; no pixel edits."""
import numpy as np
from scipy.ndimage import label,find_objects

def face_width(rgb):
 p=rgb[:int(len(rgb)*.65),:,:3].astype(int)
 mask=(p[:,:,0]>140)&(p[:,:,1]>75)&(p[:,:,1]<205)&(p[:,:,2]>35)&(p[:,:,2]<175)&(p[:,:,0]>p[:,:,1]*1.15)&(p[:,:,1]>p[:,:,2]*1.15)
 ls,_=label(mask);counts=np.bincount(ls.ravel());objects=find_objects(ls)
 candidates=[(counts[i+1],s) for i,s in enumerate(objects) if counts[i+1]>40]
 if not candidates:raise ValueError('Face landmark needs review')
 _,s=max(candidates,key=lambda c:c[0])
 return int(s[1].stop-s[1].start)

def glasses_width(rgb):
 p=rgb[:int(len(rgb)*.65),:,:3].astype(int)
 mask=(p[:,:,0]>140)&(p[:,:,1]>75)&(p[:,:,1]<205)&(p[:,:,2]>35)&(p[:,:,2]<175)&(p[:,:,0]>p[:,:,1]*1.15)&(p[:,:,1]>p[:,:,2]*1.15)
 ls,_=label(mask);counts=np.bincount(ls.ravel());objects=find_objects(ls)
 _,s=max([(counts[i+1],s) for i,s in enumerate(objects) if counts[i+1]>40],key=lambda c:c[0])
 width=s[1].stop-s[1].start;cx=(s[1].stop+s[1].start)/2;y=s[0].start
 strip=p[max(0,y-int(width*.25)):y+int(width*.12),max(0,int(cx-width*.8)):int(cx+width*.8)]
 xs=np.where(strip.max(2)<90)[1]
 return int(xs.max()-xs.min()+1)
