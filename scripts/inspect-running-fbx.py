"""Offline only: blender -b --python scripts/inspect-running-fbx.py
Extract motion reference; never import the FBX mesh into the browser game.
"""
import bpy,json,hashlib,math
from pathlib import Path
root=Path(__file__).resolve().parent.parent
source=root/'Running (1).fbx'
bpy.ops.import_scene.fbx(filepath=str(source))
scene=bpy.context.scene
arm=next(o for o in scene.objects if o.type=='ARMATURE')
action=arm.animation_data.action
start,end=map(int,action.frame_range)
fps=scene.render.fps/scene.render.fps_base
names=['Hips','LeftFoot','RightFoot','LeftHand','RightHand']
samples=[]
for frame in range(start,end+1):
 scene.frame_set(frame)
 points={n:list(arm.matrix_world@arm.pose.bones['mixamorig:'+n].head) for n in names}
 hips=points['Hips']
 samples.append({'timeMs':round((frame-start)*1000/fps,5),'root':hips,'limbs':{n:[round(p[i]-hips[i],6) for i in range(3)] for n,p in points.items() if n!='Hips'}})
# Retiming uses BOTH feet and hands relative to the hips, excluding root travel.
# Half uniform phase and half measured joint travel prevents short sprite flashes.
travel=[sum(math.dist(a['limbs'][n],b['limbs'][n]) for n in names[1:]) for a,b in zip(samples,samples[1:])]
total=sum(travel);phase=[0]
for t in travel:phase.append(phase[-1]+.5/(len(samples)-1)+.5*t/total)
phase[-1]=1
out={'source':source.name,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'action':action.name,'fps':fps,'startFrame':start,'endFrame':end,'durationMs':(end-start)*1000/fps,'phase':phase,'samples':samples,'adaptation':'Ordered canonical 2D poses; phase weighted equally by time and hip-relative foot/hand travel. No mesh, face, limb distortion or root translation.'}
(root/'career/run-motion.json').write_text(json.dumps(out,indent=2)+'\n')
