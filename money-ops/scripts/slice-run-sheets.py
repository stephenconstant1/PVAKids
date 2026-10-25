"""Import supplied run sheets without repainting/resizing character pixels.

Usage: python3 scripts/slice-run-sheets.py /path/to/attached/sheets
Requires Pillow, numpy and scipy for this offline import only, not the game.
"""
from pathlib import Path
import hashlib
import json
import shutil
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects, binary_fill_holes, binary_dilation

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
kind = sys.argv[2] if len(sys.argv)>2 else 'run'
assert kind in ('run', 'jump')
output = root / 'assets/runner/cycles'
output.mkdir(parents=True, exist_ok=True)
characters = ([('maya', 'Maya', 1), ('kai', 'Everest', 2), ('ruby', 'Ruby', 3),
              ('jordan', 'Kanyon', 4), ('sofia', 'Sofia', 5), ('eli', 'Zion', 6)] if kind=='run' else
              [('ruby', 'Ruby', 1), ('sofia', 'Sofia', 2), ('maya', 'Maya', 3),
               ('jordan', 'Kanyon', 4), ('eli', 'Zion', 5), ('kai', 'Everest', 6)])
metadata = {}
for ident, name, number in characters:
    original = source / f'{number}-Photo-{number}.jpg'
    shutil.copyfile(original, output / f'{ident}-{kind}-source.jpg')
    rgb = np.array(Image.open(original).convert('RGB'))
    height, width, _ = rgb.shape
    frames = []
    # Inspected sheets have two separated rows. Component boundaries, rather
    # than assumed 160px grid cells, retain hair and extended shoes across cells.
    whole = rgb.astype(int)
    ink_rows = ((np.ptp(whole, axis=2)>35)|(whole.max(axis=2)<165)).sum(axis=1)
    gaps = np.where(ink_rows[int(height*.40):int(height*.60)]==0)[0]+int(height*.40)
    groups = np.split(gaps, np.where(np.diff(gaps)>1)[0]+1)
    gap = max(groups, key=len)
    assert len(gap)>2, f'{name}: inspect row separation'
    split = int(gap[len(gap)//2])
    for top, bottom in [(0, split), (split, height)]:
        row = rgb[top:bottom].astype(int)
        ink = (np.ptp(row, axis=2) > 35) | (row.max(axis=2) < 165)
        labels, _ = label(ink)
        counts = np.bincount(labels.ravel())
        objects = find_objects(labels)
        poses = sorted([(s[1].start, i + 1, s) for i, s in enumerate(objects)
                        if counts[i + 1] > 1800])
        assert len(poses) == 8, f'{name}: expected 8 separate poses in row {top}'
        for _, component, slices in poses:
            # Fill enclosed white shoes/eyes, remove only exterior background
            # and baked-in ground shadows. Keep the supplied RGB pixels intact.
            mask = binary_fill_holes(labels == component)
            edge = binary_dilation(mask, iterations=1)
            ys, xs = np.where(edge)
            x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
            pixels = rgb[top+y0:top+y1, x0:x1]
            alpha = (edge[y0:y1, x0:x1] * 255).astype('uint8')
            rgba = np.dstack([pixels, alpha])
            # Anchor at the face, not the changing reach of hair/feet. This
            # stabilizes the body horizontally while limbs move around it.
            head = pixels[:max(1, int(len(pixels)*.32))].astype(int)
            skin = ((head[:,:,0] > 140) & (head[:,:,1] > 75) &
                    (head[:,:,1] < 205) & (head[:,:,2] < 165) &
                    (head[:,:,0] > head[:,:,1]*1.15) &
                    (head[:,:,1] > head[:,:,2]*1.15))
            face_x = np.where(skin)[1]
            anchor = int(np.median(face_x)) if len(face_x) else (x1-x0)//2
            frames.append({'pixels': rgba, 'anchor': anchor,
                           'sourceRect': [int(x0), int(top+y0), int(x1-x0), int(y1-y0)]})
    left = max(f['anchor'] for f in frames) + 3
    right = max(f['pixels'].shape[1]-f['anchor'] for f in frames) + 3
    cell_width = left + right
    design_height = max(f['pixels'].shape[0] for f in frames)
    cell_height = design_height + 6
    if kind=='jump':
        # Uniform character scale follows the supplied final standing pose.
        # Raised arms may exceed that height; leave room instead of shrinking.
        standing_height = frames[-1]['pixels'].shape[0]
    else:
        standing_height = design_height
    atlas = Image.new('RGBA', (cell_width*8, cell_height*2))
    records = []
    for index, f in enumerate(frames):
        pixels = f['pixels']; h, w, _ = pixels.shape
        x, y = left-f['anchor'], design_height-h
        atlas.paste(Image.fromarray(pixels), ((index%8)*cell_width+x, (index//8)*cell_height+y))
        records.append({'index': index, 'sourceRect': f['sourceRect'],
                        'anchorX': left, 'groundY': design_height,
                        'contentRect': [int(x), int(y), int(w), int(h)]})
    atlas.save(output / f'{ident}-{kind}.png')
    metadata[ident] = {'name': name, 'source': f'assets/runner/cycles/{ident}-{kind}-source.jpg',
                       'sourceSha256': hashlib.sha256(original.read_bytes()).hexdigest(),
                       'sourceSize': [width, height], 'image': f'assets/runner/cycles/{ident}-{kind}.png',
                       'cellWidth': cell_width, 'cellHeight': cell_height,
                       'columns': 8, 'frameCount': 16, 'fps': 12,
                       'anchorX': left, 'groundY': design_height,
                       'designHeight': standing_height, 'rowSplit': split, 'frames': records}
if kind=='run':
    for cycle in metadata.values():
        for row in range(2):
            fs=cycle['frames'][row*8:(row+1)*8]
            baseline=max(f['sourceRect'][1]+f['sourceRect'][3] for f in fs)
            for f in fs:f['groundY']=cycle['groundY']+baseline-f['sourceRect'][1]-f['sourceRect'][3]
(root/f'career/{kind}-cycles.json').write_text(json.dumps(metadata, indent=2)+'\n')
print(f'Imported 96 {kind} poses; source RGB pixels unchanged; measured frame/ground anchors saved.')
