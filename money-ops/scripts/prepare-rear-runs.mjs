import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const names={jordan:'kanyon',maya:'maya',kai:'everest',sofia:'sofia',eli:'zion',ruby:'ruby'},frames={};
const metadataPath='career/rear-run-cycles.json';
if(existsSync(metadataPath)){const metadata=JSON.parse(readFileSync(metadataPath,'utf8'));for(const [id,name] of Object.entries(names)){const m=metadata[id];if(!m)throw Error('Missing reviewed rear run: '+name);const expected=`assets/runner/rear/CMI_${name}-rear-run-sheet.png`;if(m.image!==expected||!existsSync(m.image)||m.frames?.length!==8||!m.reviewed)throw Error('Rear run needs source/cell review: '+name);const png=readFileSync(m.image);if(createHash('sha256').update(png).digest('hex')!==m.sourceSha256||png.readUInt32BE(16)!==m.width||png.readUInt32BE(20)!==m.height||m.bodyHeight<=0||m.baseline<=0||m.frames.some(f=>{const[x,y,w,h]=f.rect;return ![x,y,w,h].every(Number.isInteger)||x<0||y<0||w<=0||h<=0||x+w>m.width||y+h>m.height}))throw Error('Rear run source or measured bounds changed: '+name);frames[id]=m;}}
writeFileSync('src/rear-run-manifest.js','// Reviewed original rear-view sheets, measured without changing source pixels.\nexport const rearRunCycles='+JSON.stringify(frames,null,2)+';\n');
console.log('Reviewed rear-view sheets: '+Object.keys(frames).length+'/6');
