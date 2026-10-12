export const characters={
 maya:{name:'Maya',role:'careful planner',sprite:1},
 jordan:{name:'Jordan',role:'entrepreneur',sprite:0},
 sofia:{name:'Sofia',role:'creative problem-solver',sprite:3},
 kai:{name:'Kai',role:'analytical investor',sprite:2}
};

export const character=id=>characters[id]||characters.maya;

export function portrait(id,className=''){
 const c=character(id);
 return `<span class="character-portrait ${className}" style="--cast-index:${c.sprite}" role="img" aria-label="${c.name}, ${c.role}"></span>`;
}

export function castPortraits(className=''){
 return `<div class="curriculum-cast ${className}" aria-label="Money Ops student team">${['jordan','maya','kai','sofia'].map(id=>portrait(id)).join('')}</div>`;
}
