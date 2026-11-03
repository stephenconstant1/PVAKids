import {test} from 'node:test';import assert from 'node:assert/strict';
import {jobComicPanels,jobComicPracticeMath,jobComicRead,renderJobComic} from '../src/moneybread/job-comic.js';
const e=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
test('storyboard contains eight ordered beats and an honest practice example',()=>{
 assert.equal(jobComicPanels.length,8);assert.deepEqual(jobComicPanels.map(p=>p.cue),['notice','discover','plan','supplies','work','shared','budget','celebrate']);
 assert.deepEqual(jobComicPracticeMath(),{payment:100,materials:25,labor:40,overhead:15,total:80,remaining:20});assert.match(jobComicRead(6),/not guaranteed profit/);assert.match(jobComicRead(6),/minus \$25 materials minus \$40 labor minus \$15 overhead/);
});
test('both routes use the same artwork and preserve their existing next actions',()=>{
 for(let i=0;i<8;i++){const html=renderJobComic(i,e),career=renderJobComic(i,e,{route:'lesson'});assert.match(html,new RegExp(`panel-${i+1}\\.png`));assert.match(career,new RegExp(`panel-${i+1}\\.png`));assert.match(html,/data-action="job-comic-next"/);assert.match(career,/data-action="next"/);assert.match(career,/data-action="comic-skip"/);assert.match(html,/data-action="motion-pause"/);assert(!html.includes('autoplay'));assert(!html.includes('video'));}
});
test('lesson context uses supplied approved data and escapes it without generating definitions',()=>{
 const context={title:'Approved title',coreIdea:'Existing lesson idea',guide:{id:'maya',name:'Maya'},scripture:{text:'Approved scripture',reference:'Existing reference'},vocabulary:[{term:'existing term',definition:'Existing definition <unchanged>'}]};const html=renderJobComic(0,e,{context,paused:true,muted:true});assert.match(html,/data-paused="true"/);for(const text of ['Approved title','Existing lesson idea','Approved scripture','Existing reference','existing term','Existing definition &lt;unchanged>'])assert(html.includes(text));assert.match(html,/Sound off/);assert.match(html,/assets\/cast\/maya.png/);assert.match(html,/data-read=/);
});
