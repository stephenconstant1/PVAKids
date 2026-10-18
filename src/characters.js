export const characters={
 maya:{name:'Maya',role:'careful planner',image:'maya.png'},
 jordan:{name:'Kanyon',role:'entrepreneur',image:'jordan.png'},
 sofia:{name:'Sofia',role:'creative problem-solver',image:'sofia.png'},
 kai:{name:'Everest',role:'analytical investor',image:'kai.png'},
 eli:{name:'Zion',role:'technology builder',image:'eli.png'},
 ruby:{name:'Ruby',role:'goal coach',image:'ruby.png'}
};

export const castIds=['jordan','maya','kai','sofia','eli','ruby'];

export const character=id=>characters[id]||characters.maya;

export function portrait(id,className=''){
 const c=character(id);
 return `<img class="character-portrait ${className}" src="assets/cast/${c.image}?v=43.8" alt="${c.name}, ${c.role}">`;
}

export function castPortraits(className='',ids=castIds){
 if(className.includes('debrief-cast')&&ids===castIds)ids=['eli','ruby','maya'];
 return `<div class="curriculum-cast ${className}" aria-label="Money Ops student team">${ids.map(id=>`<div class="cast-member cast-${id}">${portrait(id)}<b>${character(id).name}</b></div>`).join('')}</div>`;
}
