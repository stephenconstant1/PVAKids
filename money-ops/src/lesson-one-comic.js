import {characters,castIds} from './characters.js';
import {lessonVocabulary} from './runner-vocabulary.js';
import {missions} from './content.js';
import {renderJobComic,jobComicPanels} from './moneybread/job-comic.js?v=46.23';
export const lessonOneBeats=()=>jobComicPanels.map(panel=>panel.text);
export function lessonOneComic(active,avatar,button,escape,muted=true){
 const m=missions[0],id=castIds.includes(avatar)?avatar:'jordan';return renderJobComic(active.comicBeat||0,escape,{route:'lesson',introStep:active.comicIntroStep??0,paused:!!active.comicPaused,muted,context:{brief:m.brief,lessonText:m.lesson,title:m.title,coreIdea:m.coreIdea,guide:{id,name:characters[id].name},scripture:m.scripture||m.principle,vocabulary:lessonVocabulary(1)},coreIdea:m.coreIdea,lessonText:`${m.brief} ${m.lesson}`});
}
