import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync,existsSync} from 'node:fs';import {createHash} from 'node:crypto';import {basename,extname} from 'node:path';
import {castImage,runnerImage,comicImage,jobSceneImage} from '../src/moneybread/image-assets.js';
const audit=JSON.parse(readFileSync('docs/image-audit.json','utf8'));const extensions=new Set(['.png','.jpg','.jpeg','.svg','.webp','.gif','.avif','.ico','.bmp']);
test('all current images match their audited bytes and have mirrored descriptive CMI filenames',()=>{
 assert.equal(audit.entries.length,152);const redirects=readFileSync('_redirects','utf8');
 for(const entry of audit.entries){assert.match(basename(entry.renamed),/^CMI_[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z]+$/);assert(!existsSync(entry.original));const bytes=readFileSync(entry.renamed);assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.renamed);assert.equal(bytes.length,entry.bytes);assert(redirects.includes(`/${entry.original} /${entry.renamed} 301`));if(!entry.renamed.startsWith('money-ops/'))assert.deepEqual(bytes,readFileSync('money-ops/'+entry.renamed));}
 const images=[];function walk(dir){for(const d of readdirSync(dir,{withFileTypes:true})){if(d.name.startsWith('.')||d.name==='node_modules')continue;const path=dir==='.'?d.name:dir+'/'+d.name;if(d.isDirectory())walk(path);else if(extensions.has(extname(path).toLowerCase()))images.push(path);}}walk('.');assert.deepEqual(images.sort(),audit.entries.map(e=>e.renamed).sort());
});
test('dynamic character, comic and job selectors resolve real assets while retaining stable internal IDs',()=>{
 for(const id of ['jordan','maya','kai','sofia','eli','ruby'])for(const path of [castImage(id),runnerImage(id)])assert(existsSync(path),path);
 assert.match(castImage('jordan'),/CMI_kanyon/);assert.match(castImage('kai'),/CMI_everest/);assert.match(castImage('eli'),/CMI_zion/);
 for(let i=0;i<8;i++)assert(existsSync(comicImage(i)));for(const id of ['service','tutor','creator'])assert(existsSync(jobSceneImage(id)));
});
