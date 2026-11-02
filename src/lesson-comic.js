import {portrait,character,castIds} from './characters.js';
import {lessonVocabulary} from './runner-vocabulary.js';
export const comicEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={'find a need':'⌕','generate ideas':'✦',research:'⌕',plan:'▤',act:'→',persist:'↻'};
/** Build only from the active curriculum. No decisions or financial effects run here. */
export function lessonComicPanels(m){
 const vocabulary=lessonVocabulary(m.id),terms=m.terms||[];
 const entrepreneurship=Object.keys(icons).every(term=>terms.includes(term));
 if(entrepreneurship){
  const sources={
   'find a need':{text:m.dialogue?.[0]?.text||m.coreIdea,contributor:m.dialogue?.[0]},
   'generate ideas':{text:m.brief,examples:m.decision?.options?.map(o=>({label:o.label,icon:o.icon}))},
   research:{text:m.event?.options?.[0]?.detail||m.dialogue?.[1]?.text||m.coreIdea,contributor:m.dialogue?.[1]},
   plan:{text:m.dialogue?.[1]?.text||m.coreIdea,examples:m.decision?.options?.map(o=>({label:o.label,icon:o.icon,detail:o.detail}))},
   act:{text:m.brief},
   persist:{text:m.event?.prompt||m.takeaway,detail:m.event?.options?.at(-1)?.feedback||m.takeaway}
  };
  return terms.map((term,index)=>({term,icon:icons[term]||m.icon,...sources[term],definition:vocabulary[index]?.definition||m.coreIdea}));
 }
 const beats=[{text:m.coreIdea,term:terms[0],icon:m.icon},...(m.dialogue||[]).map(line=>({text:line.text,contributor:line,icon:'✦'})),{text:m.brief,term:terms[1],icon:'▤'},...(m.takeaway?[{text:m.takeaway,term:terms.at(-1),icon:'→'}]:[])];
 return beats.filter((b,i,all)=>b.text&&!all.slice(0,i).some(other=>other.text===b.text));
}
export function lessonComicOpen(a){return a?.step==='choice'&&!a.lessonComicDone;}
export function lessonComicRead(m,a){const panels=lessonComicPanels(m),panel=panels[Math.max(0,Math.min(panels.length-1,Number(a.lessonPanel)||0))];return `${m.coreIdea} ${panel.text}${panel.detail?' '+panel.detail:''}`;}
export function activeLessonComic(m,a,avatar,button){
 const e=comicEscape,panels=lessonComicPanels(m),index=Math.max(0,Math.min(panels.length-1,Number(a.lessonPanel)||0)),panel=panels[index];
 const guide=castIds.includes(avatar)?avatar:castIds[(m.id-1)%castIds.length];
 return `<section class="active-lesson-comic" aria-labelledby="active-comic-title"><div class="active-comic-top"><div><small>CAREER MODE · LESSON ${String(m.id).padStart(2,'0')}</small><h2 id="active-comic-title">${e(m.title)}</h2></div><span class="active-comic-progress" role="status">Panel ${index+1} of ${panels.length}</span></div><article class="active-comic-panel" data-comic-panel tabindex="-1" aria-labelledby="active-comic-caption"><div class="active-comic-cast">${portrait(guide,'active-comic-guide')}<b>${e(character(guide).name)}</b>${panel.contributor&&panel.contributor.speaker!==guide?`<div class="active-comic-contributor">${portrait(panel.contributor.speaker,'active-comic-friend')}<small>${e(character(panel.contributor.speaker).name)}</small></div>`:''}</div><div class="active-comic-story"><span class="active-comic-cue" aria-hidden="true">${e(panel.icon)}</span>${panel.term?`<button class="comic-cue-word" data-action="lesson-word-${m.terms.indexOf(panel.term)}" aria-controls="active-comic-word-definition" aria-pressed="false" aria-expanded="false">${e(panel.term)} · explore word</button>`:''}<div id="active-comic-word-definition" class="comic-inline-definition" hidden><b></b><p></p></div><div class="active-comic-bubble"><small>${e(panel.contributor?character(panel.contributor.speaker).name:character(guide).name)} · LESSON VOICE</small><p id="active-comic-caption">${e(panel.text)}</p>${panel.detail?`<p>${e(panel.detail)}</p>`:''}</div>${panel.examples?`<div class="active-comic-ideas" aria-label="Ideas from this lesson">${panel.examples.map(example=>`<span><i aria-hidden="true">${e(example.icon)}</i>${e(example.label)}${example.detail?`<small>${e(example.detail)}</small>`:''}</span>`).join('')}</div>`:''}</div></article><nav class="active-comic-controls" aria-label="Comic panel navigation">${button('← Back','active-comic-back','secondary',index===0?'disabled':'')}${button(index===panels.length-1?'Continue to activity →':'Next panel →','active-comic-next','primary')}${button('Replay ↻','active-comic-replay','text-button')}${button('Skip comic · go to activity','active-comic-skip','text-button')}</nav><p class="active-comic-note">Explore any vocabulary word above. The comic does not select an answer or change your score.</p></section>`;
}
export function withLessonComic(m,a,avatar,body,button){return a.step==='choice'?(lessonComicOpen(a)?activeLessonComic(m,a,avatar,button):`<div class="comic-replay-bar">${button('Replay lesson comic ↻','active-comic-replay','secondary')}</div>${body}`):body;}
