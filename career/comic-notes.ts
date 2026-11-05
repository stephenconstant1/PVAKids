import {castImage} from './image-assets.js';
import type {JobComicContext} from './job-comic.js';
export type NotesTab='scene'|'lesson'|'words'|'scripture';
export interface ComicNote {title:string;body:string;kind?:'math'|'word'|'scripture'|'guide';wordIndex?:number;related?:number[]}
export interface NotesInput {index:number;title:string;description:string;context?:JobComicContext;lessonText?:string;math:{payment:number;materials:number;labor:number;overhead:number;remaining:number}}
const tabs:NotesTab[]=['scene','lesson','words','scripture'];
const relatedTerms=[['services','time'],['ideas','services'],['skills','ideas'],['products'],['time','skills'],['business owner','self-employed'],['business owner'],['creator','services']];
export function comicNoteGroups(input:NotesInput):Record<NotesTab,ComicNote[]> {
 const c=input.context,scene:ComicNote[]=[{title:input.title,body:input.description,related:relatedTerms[input.index].map(term=>c?.vocabulary.findIndex(word=>word.term===term)??-1).filter(index=>index>=0)}];
 if(input.index===6)scene.push({title:'Practice Example',body:'Money remaining is after the listed costs, not guaranteed profit.',kind:'math'});
 const lesson:ComicNote[]=[];
 for(const [title,body] of [[c?.title||'Lesson idea',c?.coreIdea,'guide'],['Lesson introduction',c?.brief,undefined],['Lesson notes',c?.lessonText||input.lessonText,undefined]] as const){if(body&&!lesson.some(note=>note.body===body))lesson.push({title,body,kind:'guide'});}
 return {scene,lesson:lesson.length?lesson:[{title:'Lesson idea',body:input.description}],words:c?.vocabulary.length?c.vocabulary.map((word,wordIndex)=>({title:word.term,body:word.definition,kind:'word',wordIndex})):[{title:'Lesson words',body:'Explore the lesson vocabulary with your guide.'}],scripture:c?.scripture?[{title:c.scripture.reference,body:c.scripture.text,kind:'scripture'}]:[{title:'Lesson reference',body:c?.coreIdea||input.description}]};
}
export function renderComicNotes(input:NotesInput,e:(v:unknown)=>string):string {
 const groups=comicNoteGroups(input),m=input.math,c=input.context;
 const pages=tabs.map(tab=>groups[tab].map((note,index)=>{
  const read=note.kind==='math'?`${note.title}. $${m.payment} payment minus $${m.materials} materials minus $${m.labor} labor minus $${m.overhead} overhead equals $${m.remaining} left. ${note.body}`:`${note.title}. ${note.body}`;
  let body=`<h2 class="motion-note-title" tabindex="-1">${e(note.title)}</h2><p>${e(note.body)}</p>`;
  if(note.kind==='guide'&&c)body=`<div class="motion-note-guide"><img class="motion-guide-image" src="${castImage(c.guide.id)}?v=45.6" alt="${e(c.guide.name)}, your lesson guide"/><div><small>${e(c.guide.name)} · YOUR GUIDE</small><h2 class="motion-note-title" tabindex="-1">${e(note.title)}</h2><blockquote>“${e(note.body)}”</blockquote></div></div>`;
  if(note.kind==='scripture')body=`<aside class="scripture-card motion-scripture">${c?`<img class="motion-guide-image" src="${castImage(c.guide.id)}?v=45.6" alt="${e(c.guide.name)} shares the scripture"/>`:''}<div><h2 class="motion-note-title" tabindex="-1">${e(note.title)}</h2><blockquote>“${e(note.body)}”</blockquote><cite>${e(note.title)}</cite></div></aside>`;
  if(note.kind==='word')body=`<div class="motion-vocabulary">${body}</div>`;
  if(note.kind==='math')body=`<section class="motion-practice"><h2 class="motion-note-title" tabindex="-1">Practice Example</h2><dl>${[['Payment',m.payment],['Materials',m.materials],['Labor',m.labor],['Overhead',m.overhead]].map(([label,amount])=>`<div><dt>${label}</dt><dd>$${amount}</dd></div>`).join('')}</dl><p>$${m.payment} − $${m.materials} − $${m.labor} − $${m.overhead} = <b>$${m.remaining} left</b></p><small>${e(note.body)}</small></section>`;
  if(note.related?.length)body+=`<nav class="motion-note-related" aria-label="Words in this scene">${note.related.map(wordIndex=>`<button class="mb-button" data-action="motion-notes-word-${wordIndex}">${e(c!.vocabulary[wordIndex].term)} →</button>`).join('')}</nav>`;
  return `<article class="motion-note-page" data-note-tab="${tab}" data-note-index="${index}" data-note-read="${e(read)}" hidden>${body}</article>`;
 }).join('')).join('');
 return `<aside id="motion-lesson-info" class="motion-notes-panel" aria-label="Notes for panel ${input.index+1}" data-panel-number="${input.index+1}" hidden><header class="motion-notes-heading"><b class="motion-notes-label">Notes · Panel ${input.index+1}</b><button class="mb-button" data-action="motion-notes-close" aria-label="Close notes and return to the comic">Close ✕</button></header><nav class="motion-notes-tabs" aria-label="Note categories">${tabs.map((tab,index)=>`<button class="mb-button" data-action="motion-notes-tab-${tab}" aria-pressed="false">${['Scene','Lesson','Words','Scripture'][index]}</button>`).join('')}</nav><div class="motion-notes-pages">${pages}</div><nav class="motion-notes-pager" aria-label="Note pages"><button class="mb-button" data-action="motion-notes-prev">← Back</button><span role="status" class="motion-notes-progress"></span><button class="mb-button" data-action="motion-notes-next">Next →</button></nav></aside>`;
}
export function selectComicNotes(root:HTMLElement,tab:NotesTab,index=0,focus=true):void {
 const panel=root.querySelector<HTMLElement>('.motion-notes-panel');if(!panel||!tabs.includes(tab))return;
 const pages=Array.from(panel.querySelectorAll<HTMLElement>(`[data-note-tab="${tab}"]`));if(!pages.length)return;
 const page=Math.max(0,Math.min(pages.length-1,index));panel.dataset.notesTab=tab;panel.dataset.notesPage=String(page);panel.querySelector('.motion-notes-label')!.textContent=`${({scene:'Scene quote',lesson:'Lesson quote',words:'Lesson words',scripture:'Scripture quote'})[tab]} · ${panel.dataset.panelNumber}`;
 for(const card of Array.from(panel.querySelectorAll<HTMLElement>('[data-note-tab]')))card.hidden=card!==pages[page];
 for(const button of Array.from(panel.querySelectorAll<HTMLElement>('[data-action^="motion-notes-tab-"]')))button.setAttribute('aria-pressed',String(button.dataset.action===`motion-notes-tab-${tab}`));
 panel.querySelector('.motion-notes-progress')!.textContent=`${page+1} of ${pages.length}`;
 (panel.querySelector('[data-action="motion-notes-prev"]') as HTMLButtonElement).disabled=page===0;
 (panel.querySelector('[data-action="motion-notes-next"]') as HTMLButtonElement).disabled=page===pages.length-1;
 for(const button of Array.from(root.querySelectorAll<HTMLElement>('[data-action="motion-info"],[data-action="motion-scripture"],[data-action="motion-scene-quote"]')))button.setAttribute('aria-expanded',String(root.dataset.notesOpen==='true'&&button.dataset.action===({scene:'motion-scene-quote',lesson:'motion-info',scripture:'motion-scripture',words:''})[tab]));
 if(focus)pages[page].querySelector<HTMLElement>('.motion-note-title')?.focus({preventScroll:true});
}
export function openComicNotes(root:HTMLElement|null,tab:NotesTab='scene',focus=true):void {
 if(!root)return;const panel=root.querySelector<HTMLElement>('.motion-notes-panel');if(!panel)return;
 panel.hidden=false;root.dataset.notesOpen='true';root.dataset.noteOpener=tab==='scripture'?'motion-scripture':tab==='scene'?'motion-scene-quote':'motion-info';const picture=root.querySelector<HTMLElement>('[data-job-comic-panel]');if(picture)picture.inert=matchMedia('(max-width:999px),(max-height:619px)').matches;selectComicNotes(root,tab,0,focus);
 
}
export function closeComicNotes(root:HTMLElement|null):void {
 if(!root)return;const panel=root.querySelector<HTMLElement>('.motion-notes-panel');if(panel)panel.hidden=true;root.dataset.notesOpen='false';const picture=root.querySelector<HTMLElement>('[data-job-comic-panel]');if(picture)picture.inert=false;
 for(const button of Array.from(root.querySelectorAll('[data-action="motion-info"],[data-action="motion-scripture"],[data-action="motion-scene-quote"]')))button.setAttribute('aria-expanded','false');
 root.querySelector<HTMLElement>(`[data-action="${root.dataset.noteOpener||'motion-info'}"]`)?.focus({preventScroll:true});
}
export function changeComicNotes(root:HTMLElement|null,direction:number):void {
 const panel=root?.querySelector<HTMLElement>('.motion-notes-panel');if(root&&panel)selectComicNotes(root,panel.dataset.notesTab as NotesTab,(Number(panel.dataset.notesPage)||0)+direction);
}
export function comicNotesRead(root:HTMLElement|null):string {return root?.dataset.notesOpen==='true'?root.querySelector<HTMLElement>('.motion-note-page:not([hidden])')?.dataset.noteRead||'':'';}
