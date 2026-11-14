import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const names={jordan:'kanyon',maya:'maya',kai:'everest',sofia:'sofia',eli:'zion',ruby:'ruby'},frames={};
// Source images are registered only after alpha/cell measurements are reviewed.
const metadataPath='career/rear-run-cycles.json';
if(existsSync(metadataPath)){const metadata=JSON.parse(readFileSync(metadataPath,'utf8'));for(const [id,name] of Object.entries(names)){const m=metadata[id];if(!m)continue;if(!existsSync(m.image)||m.frames?.length!==8||!m.reviewed)throw Error('Rear run needs source/cell review: '+name);frames[id]=m;}}
writeFileSync('src/rear-run-manifest.js','// Only reviewed original rear-view sheets may be used here.\nexport const rearRunCycles='+JSON.stringify(frames,null,2)+';\n');
console.log('Reviewed rear-view sheets: '+Object.keys(frames).length+'/6');
