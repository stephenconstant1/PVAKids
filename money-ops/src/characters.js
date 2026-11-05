import {everestPatchOverlay} from './moneybread/crew-art.js';
export const characters={
 maya:{name:'Maya',role:'careful planner',image:'CMI_maya-character-purple-yellow-headband.png'},
 jordan:{name:'Kanyon',role:'entrepreneur',image:'CMI_kanyon-character-green.png'},
 sofia:{name:'Sofia',role:'creative problem-solver',image:'CMI_sofia-character-pink.png'},
 kai:{name:'Everest',role:'analytical investor',image:'CMI_everest-character-blue-yellow.png'},
 eli:{name:'Zion',role:'technology builder',image:'CMI_zion-character-red-glasses.png'},
 ruby:{name:'Ruby',role:'goal coach',image:'CMI_ruby-character-purple-auburn-hair.png'}
};

export const castIds=['jordan','maya','kai','sofia','eli','ruby'];

export const character=id=>characters[id]||characters.maya;

export function portrait(id,className=''){
 const c=character(id);
 return `<img class="character-portrait ${className}" src="assets/cast/${c.image}?v=45.6" alt="${c.name}, ${c.role}">`;
}

export function castPortraits(className='',ids=castIds){
 if(className.includes('debrief-cast')&&ids===castIds)ids=['eli','ruby','maya'];
 return `<div class="curriculum-cast ${className}" aria-label="Money Ops student team">${ids.map(id=>`<div class="cast-member cast-${id}">${portrait(id)}<b>${character(id).name}</b></div>`).join('')}</div>`;
}

export function crewHeroMarkup(){
 return `<section class="home-crew-hero reference-crew-hero" aria-label="Money Ops crew in Moneybread City"><figure><img class="money-ops-reference" src="assets/crew/CMI_moneybread-city-crew-home-reference.jpg?v=45.6" width="1280" height="748" fetchpriority="high" alt="Money Ops: Kanyon in green, Maya in purple, Everest in blue and yellow, Sofia in pink, Zion in red, and Ruby in purple in Moneybread City. Your skills. Your ideas. A brighter tomorrow. Choose Career Mode or Arcade Mode.">${everestPatchOverlay('home')}<figcaption class="sr">Money Ops crew reference with the approved Everest update. School, businesses, homes, transit, and Opportunity Park surround the crew in Moneybread City.</figcaption></figure><p class="crew-image-fallback" hidden>The Money Ops crew image could not load. You can still choose Career Mode or Arcade Mode below.</p></section>`;
}
