import {execFileSync} from 'node:child_process';
import {cpSync,existsSync,readFileSync,mkdirSync} from 'node:fs';
import {missions} from '../src/content.js';
const source=JSON.parse(readFileSync(new URL('../career/lessons.json',import.meta.url),'utf8'));
if(source.length!==32||missions.length!==32)throw Error('Career Mode requires exactly 32 original lessons.');
for(let i=0;i<32;i++){
 const a=source[i],b=missions[i];
 if(a.id!==i+1||a.id!==b.id||a.title!==b.title||a.coreIdea!==b.coreIdea||JSON.stringify(a.terms)!==JSON.stringify(b.terms))throw Error(`Level ${i+1}: source lesson needed or source wording changed. Update career/lessons.json from the original lesson files.`);
 if(!a.sourceFiles.every(file=>existsSync(file)))throw Error(`Level ${i+1} is missing source materials.`);
}
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
// GitHub Pages serves both / and /money-ops/. Keep both entry points identical.
if(existsSync('money-ops'))for(const file of ['README.md','assets/crew','career','scripts','tests','src/moneybread','index.html','src/app.js','src/engine.js','src/characters.js','src/runner.js','style.css','package.json','package-lock.json','tsconfig.json']){
 mkdirSync('money-ops/'+file.split('/').slice(0,-1).join('/'),{recursive:true});
 cpSync(file,'money-ops/'+file,{recursive:true});
}
console.log('Built TypeScript city simulation and interface; verified all 32 original lessons; synchronized both static entry points.');
