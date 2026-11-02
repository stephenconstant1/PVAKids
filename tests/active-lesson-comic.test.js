import {test} from 'node:test';import assert from 'node:assert/strict';
import {missions} from '../src/content.js';import {lessonComicPanels,activeLessonComic,lessonComicRead} from '../src/lesson-comic.js';import {lessonVocabulary} from '../src/runner-vocabulary.js';
const button=(text,action,cls='',extra='')=>`<button data-action="${action}" ${extra}>${text}</button>`;
test('comic content follows all 32 active lessons without mutating curriculum or outcomes',()=>{
 for(const m of missions){const original=structuredClone(m),panels=lessonComicPanels(m);assert(panels.length>0);for(const p of panels)assert(p.text&&typeof p.text==='string');const html=activeLessonComic(m,{step:'choice'},'ruby',button);assert(html.includes(m.title.replaceAll('&','&amp;')));assert.match(html,/ruby.png/);assert.equal(lessonComicRead(m,{lessonPanel:0}).startsWith(m.coreIdea),true);assert.deepEqual(m,original);}
});
test('entrepreneurship gets its six cue panels and glossary definitions from the actual lesson',()=>{
 const m=missions.find(m=>m.terms.includes('find a need')),p=lessonComicPanels(m);assert.deepEqual(p.map(p=>p.term),m.terms);assert.equal(p.length,6);assert.equal(p[0].text,m.dialogue[0].text);assert.equal(p[2].text,m.event.options[0].detail);assert.deepEqual(p[3].examples.map(p=>p.detail),m.decision.options.map(o=>o.detail));assert.equal(p[4].text,m.brief);assert.equal(p[5].detail,m.event.options.at(-1).feedback);assert.deepEqual(p.map(p=>p.definition),lessonVocabulary(m.id).map(v=>v.definition));
 assert(!JSON.stringify(p).includes('materials cost $25'));assert.equal(lessonComicPanels({...m,id:24}).length,6,'semantic curriculum, not a fixed lesson number, selects the sequence');
});
test('navigation clamps corrupt or out-of-range presentation indices',()=>{
 const m=missions[7];assert.match(activeLessonComic(m,{lessonPanel:-9},'maya',button),/Panel 1 of 6/);assert.match(activeLessonComic(m,{lessonPanel:99},'maya',button),/Panel 6 of 6/);
});
