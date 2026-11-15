"""Register reviewed supplied rear-view sheets without altering original source pixels."""
from pathlib import Path
from PIL import Image
import json,hashlib
names={'jordan':'kanyon','maya':'maya','kai':'everest','sofia':'sofia','eli':'zion','ruby':'ruby'}
metadata={}
for char,name in names.items():
 p=Path(f'assets/runner/rear/CMI_{name}-rear-run-sheet.png');im=Image.open(p)
 if im.mode!='RGBA' or im.getchannel('A').getextrema()[0]!=0:raise ValueError('Transparent source required: '+str(p))
 frames=[]
 for i in range(8):
  col,row=i%4,i//4;x,y=round(col*im.width/4),round(row*im.height/2);right,bottom=round((col+1)*im.width/4),round((row+1)*im.height/2)
  bounds=im.getchannel('A').crop((x,y,right,bottom)).point(lambda a:255 if a>24 else 0).getbbox()
  if not bounds:raise ValueError('Empty rear-run frame: '+str(p))
  frames.append({'rect':[x,y,right-x,bottom-y],'visibleBounds':list(bounds)})
 baseline=max(f['visibleBounds'][3] for f in frames);top=min(f['visibleBounds'][1] for f in frames)
 metadata[char]={'image':str(p),'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'frameMs':80,'baseline':baseline,'bodyHeight':baseline-top,'reviewed':True,'frames':frames}
Path('career/rear-run-cycles.json').write_text(json.dumps(metadata,indent=2)+'\n')
