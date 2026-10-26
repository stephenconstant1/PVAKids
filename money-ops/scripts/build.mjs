import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {cpSync,existsSync,readFileSync,mkdirSync} from 'node:fs';
import {cityStops,cityLandmarks} from '../src/city.js';
import {missions} from '../src/content.js';
const source=JSON.parse(readFileSync(new URL('../career/lessons.json',import.meta.url),'utf8'));
if(source.length!==32||missions.length!==32)throw Error('Career Mode requires exactly 32 original lessons.');
for(let i=0;i<32;i++){
 const a=source[i],b=missions[i];
 if(a.id!==i+1||a.id!==b.id||a.title!==b.title||a.coreIdea!==b.coreIdea||JSON.stringify(a.terms)!==JSON.stringify(b.terms))throw Error(`Level ${i+1}: source lesson needed or source wording changed. Update career/lessons.json from the original lesson files.`);
 if(!a.sourceFiles.every(file=>existsSync(file)))throw Error(`Level ${i+1} is missing source materials.`);
}
const stops=JSON.parse(readFileSync('career/destinations.json','utf8'));
if(stops.length!==32)throw Error('Exactly 32 lesson-to-city mappings are required.');
for(let i=0;i<32;i++){const d=stops[i],original=cityStops.find(stop=>stop.lessonId===i+1);if(d.lessonId!==i+1||d.name!==original?.name||d.title!==missions[i].title||d.sourceLocation!==(missions[i].location||missions[i].sector)||!Number.isFinite(d.x)||!Number.isFinite(d.y))throw Error(`Level ${i+1}: source lesson needed — city location mapping mismatch.`);}
const art=JSON.parse(readFileSync('career/landmark-art.json','utf8'));
if(art.length!==cityLandmarks.length||new Set(art.map(a=>a.tile)).size!==8||cityLandmarks.some(l=>!art.some(a=>a.id===l.id&&Number.isInteger(a.tile)&&a.tile>=0&&a.tile<8))||!existsSync('assets/crew/moneybread-landmarks.png'))throw Error('Every existing city landmark must have its own building artwork.');
const rigs=JSON.parse(readFileSync('career/runner-rigs.json','utf8'));
for(const kind of ['run','jump','duck']){
 const cycles=JSON.parse(readFileSync(`career/${kind}-cycles.json`,'utf8'));
 for(const id of ['jordan','maya','kai','sofia','eli','ruby']){
  const c=cycles[id],png=readFileSync(c.image);
  const count=kind==='duck'?6:16;
  if(c.frameCount!==count||c.frames.length!==count||c.frames.some((f,i)=>f.index!==i||f.groundY<c.groundY)||
   png.readUInt32BE(16)!==c.cellWidth*c.columns||png.readUInt32BE(20)!==c.cellHeight*2||
   createHash('sha256').update(readFileSync(c.source)).digest('hex')!==c.sourceSha256)
   throw Error(`${id}: supplied ${kind} sheet or measured frame metadata changed.`);
 }
}
for(const id of ['jordan','maya','kai','sofia','eli','ruby']){const rig=rigs[id];if(!rig?.source||createHash('sha256').update(readFileSync(rig.source)).digest('hex')!==rig.sourceSha256)throw Error(`Original ${id} running reference changed; review identity and animation metadata before building.`);}
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
// GitHub Pages serves both / and /money-ops/. Keep both entry points identical.
if(existsSync('money-ops'))for(const file of ['README.md','MOVEMENT_METRICS.md','RUNNER_ASSETS.md','assets/crew','assets/environments','assets/cast/kai.png','assets/runner','assets/review','career','scripts','tests','src/moneybread','index.html','src/app.js','src/engine.js','src/content.js','src/curriculum-language.js','src/characters.js','src/runner.js','src/runner-config.js','src/runner-state.js','src/city.js','style.css','package.json','package-lock.json','tsconfig.json']){
 mkdirSync('money-ops/'+file.split('/').slice(0,-1).join('/'),{recursive:true});
 cpSync(file,'money-ops/'+file,{recursive:true});
}
console.log('Built TypeScript city simulation and interface; verified all 32 original lessons; synchronized both static entry points.');
