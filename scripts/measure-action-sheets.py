"""Measure supplied 4x2 sheets; preserve original pixels and stable cell scale."""
from pathlib import Path
from PIL import Image
import json,hashlib
names={'kanyon':'jordan','maya':'maya','everest':'kai','sofia':'sofia','zion':'eli','ruby':'ruby'}
meta={}
for name,char in names.items():
 for action in ('climb','flip','kick'):
  path=Path(f'assets/runner/actions/CMI_{name}-{action}-sheet.png')
  if not path.exists():continue
  im=Image.open(path);alpha=im.getchannel('A');frames=[]
  for i in range(8):
   col,row=i%4,i//4;x,y=round(col*im.width/4),round(row*im.height/2);right,bottom=round((col+1)*im.width/4),round((row+1)*im.height/2)
   box=alpha.crop((x,y,right,bottom)).point(lambda v:255 if v>24 else 0).getbbox()
   if box is None:raise ValueError(f'Empty frame {path}:{i}')
   frames.append({'rect':[x,y,right-x,bottom-y],'visibleBounds':list(box)})
  # Climb contains scenery: retain as reference until character-only layers are supplied.
  if action=='climb':continue
  baseline=max(f['visibleBounds'][3] for f in frames)
  scaleHeight=baseline-frames[7]['visibleBounds'][1] if action=='flip' else baseline-min(f['visibleBounds'][1] for f in frames)
  meta.setdefault(char,{})[action]={'image':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'baseline':baseline,'scaleHeight':scaleHeight,'frames':frames}
Path('career/uploaded-action-cycles.json').write_text(json.dumps(meta,indent=2)+'\n')
Path('src/uploaded-action-cycles.js').write_text('// Measured by scripts/measure-action-sheets.py; original source pixels retained.\nexport const uploadedActionCycles='+json.dumps(meta,indent=2)+';\n')
