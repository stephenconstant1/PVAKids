import {comicImage} from '../src/moneybread/image-assets.js';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {jobComicNavigate,jobComicPanels,jobComicPracticeMath,jobComicRead,renderJobComic} from '../src/moneybread/job-comic.js';
const e=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
test('storyboard contains eight ordered beats and an honest practice example',()=>{
 assert.equal(jobComicPanels.length,8);assert.deepEqual(jobComicPanels.map(p=>p.cue),['notice','discover','plan','supplies','work','shared','budget','celebrate']);
 assert.deepEqual(jobComicPracticeMath(),{payment:100,materials:25,labor:40,overhead:15,total:80,remaining:20});assert.match(jobComicRead(6),/not guaranteed profit/);assert.match(jobComicRead(6),/minus \$25 materials minus \$40 labor minus \$15 overhead/);
});
test('both routes use the same artwork and preserve their existing next actions',()=>{
 for(let i=0;i<8;i++){const html=renderJobComic(i,e),career=renderJobComic(i,e,{route:'lesson'});assert(html.includes(comicImage(i)));assert(career.includes(comicImage(i)));assert.match(html,/data-action="job-comic-next"/);assert.match(career,/data-action="next"/);assert.match(career,/data-action="comic-skip"/);assert.match(html,/data-action="motion-pause"/);assert(!html.includes('autoplay'));assert(!html.includes('video'));}
});
test('lesson context uses supplied approved data and escapes it without generating definitions',()=>{
 const context={title:'Approved title',coreIdea:'Existing lesson idea',guide:{id:'maya',name:'Maya'},scripture:{text:'Approved scripture',reference:'Existing reference'},vocabulary:[{term:'existing term',definition:'Existing definition <unchanged>'}]};const html=renderJobComic(0,e,{context,paused:true,muted:true});assert.match(html,/data-paused="true"/);for(const text of ['Approved title','Existing lesson idea','Approved scripture','Existing reference','existing term','Existing definition &lt;unchanged>'])assert(html.includes(text));assert.match(html,/Sound off/);assert.match(html,/assets\/cast\/CMI_maya-character-purple-yellow-headband.png/);assert.match(html,/data-read=/);
});

test('Lesson 1 interleaves the scripture after scene one and reverses without skipping',()=>{
 const sequence=[{step:0,intro:0},{step:0,intro:3},{step:0,intro:1},...Array.from({length:7},(_,i)=>({step:i+1,intro:3}))];
 for(let i=0;i<sequence.length;i++){
  const {step,intro}=sequence[i];
  assert.deepEqual(jobComicNavigate(step,intro,'next'),i===9?{step:7,intro:3,done:true}:{...sequence[i+1],done:false});
  assert.deepEqual(jobComicNavigate(step,intro,'back'),{...sequence[Math.max(0,i-1)],done:false});
 }
 assert.deepEqual(jobComicNavigate(0,2,'next'),{step:2,intro:3,done:false});
 const verse=renderJobComic(0,e,{introStep:1,context:{title:'Work',coreIdea:'Value',guide:{id:'zion',name:'Zion'},scripture:{text:'Approved verse',reference:'Approved reference'},vocabulary:[]}});
 assert.match(verse,/comic-book-image/);assert.match(verse,/Approved verse/);assert(!verse.includes('A verse for our work'));
 const practice=renderJobComic(6,e);for(const label of ['Payment received','Minus materials','Minus labor','Minus overhead','Total costs','Money left after costs'])assert(practice.includes(label));
 assert(!renderJobComic(7,e).includes('comic-practice-card'));assert(!renderJobComic(7,e).includes('class="comic-job-words"'));
});

test('the job vocabulary is confined to panel two and has a dedicated accessible sidebar',()=>{for(let i=0;i<8;i++){const html=renderJobComic(i,e);assert.equal(html.includes('class="comic-job-words"'),i===1);}assert.match(renderJobComic(1,e),/<aside class="comic-job-words" aria-labelledby="comic-job-words-title">/);for(const introStep of [0,1])assert(!renderJobComic(0,e,{introStep}).includes('class="comic-job-words"'));});
