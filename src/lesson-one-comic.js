import {missions} from './content.js';
import {renderJobComic,jobComicPanels} from './moneybread/job-comic.js?v=46.17';
export const lessonOneBeats=()=>jobComicPanels.map(panel=>panel.text);
export function lessonOneComic(active,avatar,button,escape,muted=true){
 const m=missions[0];return renderJobComic(active.comicBeat||0,escape,{route:'lesson',paused:!!active.comicPaused,muted,coreIdea:m.coreIdea,lessonText:`${m.brief} ${m.lesson}`});
}
