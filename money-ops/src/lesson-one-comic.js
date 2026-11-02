import {missions} from './content.js';
import {portrait,character} from './characters.js';
// All narration comes verbatim from the existing lesson, not new dialogue.
export const lessonOneBeats=()=>[missions[0].brief,...missions[0].lesson.match(/[^.!?]+[.!?]+/g).map(s=>s.trim())];
export function lessonOneComic(active,avatar,button,escape){
 const beats=lessonOneBeats(),index=Math.max(0,Math.min(beats.length-1,active.comicBeat||0));
 return `<section class="lesson-comic" aria-label="Lesson 1 comic"><div class="eyebrow">WEEK 1 · EARNING &amp; CREATING VALUE</div><h1>Earning and Creating Value</h1><p class="comic-progress">Panel ${index+1} of ${beats.length}</p><article class="comic-panel" data-beat="${index}" tabindex="-1" aria-labelledby="comic-caption"><div class="comic-hero">${portrait(avatar,'comic-character')}<b>${character(avatar).name}</b></div><div class="comic-caption" id="comic-caption"><small>LESSON CAPTION</small><p>${escape(beats[index])}</p></div></article><nav class="comic-controls" aria-label="Comic panels">${button('← Back','comic-back','secondary',index===0?'disabled':'')}${button(index===beats.length-1?'Continue · choose how to create value →':'Next panel →','next','primary')}</nav></section>`;
}
