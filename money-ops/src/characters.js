export const characters={
 maya:{name:'Maya',role:'careful planner',skin:'#7b452f',hair:'#24130f',hoodie:'#f4c62f',accent:'#fff0a8'},
 jordan:{name:'Jordan',role:'entrepreneur',skin:'#70402f',hair:'#1d1412',hoodie:'#1b5274',accent:'#79c8e6'},
 sofia:{name:'Sofia',role:'creative problem-solver',skin:'#c77d5a',hair:'#352019',hoodie:'#e95f91',accent:'#ffd0df'},
 kai:{name:'Kai',role:'analytical investor',skin:'#a96043',hair:'#191514',hoodie:'#c94343',accent:'#ffd36a'}
};

export const character=id=>characters[id]||characters.maya;

export function portrait(id){
 const c=character(id),braids=id==='maya',glasses=id==='kai',longHair=id==='sofia';
 return `<svg class="character-portrait" viewBox="0 0 120 130" role="img" aria-label="${c.name}">
  <path d="M16 130q6-42 44-42t44 42" fill="${c.hoodie}"/><path d="M37 100l23 22 23-22" fill="none" stroke="${c.accent}" stroke-width="6"/>
  ${longHair?'<path d="M22 42q1-35 38-35t39 38v63H20z" fill="'+c.hair+'"/>':''}
  ${braids?'<g stroke="'+c.hair+'" stroke-width="8" stroke-linecap="round"><path d="M31 44 17 111m23-67-5 76m54-76 14 67M80 44l5 76"/></g>':''}
  <ellipse cx="60" cy="54" rx="31" ry="38" fill="${c.skin}"/>
  ${id==='jordan'?'<path d="M28 40Q30 4 60 7q32-6 35 34-11-13-18-23-8 12-49 22" fill="'+c.hair+'"/><g fill="'+c.hair+'"><circle cx="34" cy="14" r="9"/><circle cx="49" cy="8" r="10"/><circle cx="66" cy="9" r="10"/><circle cx="82" cy="15" r="9"/></g>':''}
  ${id==='kai'?'<path d="M28 39Q28 7 61 7q35 2 34 36-15-9-25-25-9 17-42 21" fill="'+c.hair+'"/><g fill="'+c.hair+'"><circle cx="37" cy="13" r="8"/><circle cx="53" cy="8" r="9"/><circle cx="70" cy="9" r="9"/><circle cx="85" cy="16" r="8"/></g>':''}
  ${longHair?'<path d="M29 41Q30 8 61 8q32 0 33 36-17-8-25-25-8 15-40 22" fill="'+c.hair+'"/>':''}
  ${braids?'<path d="M29 39Q30 8 60 8q31 1 33 35-12-9-23-26-10 17-41 22" fill="'+c.hair+'"/><path d="M23 34q10-24 37-24t39 25" fill="none" stroke="#e7b42d" stroke-width="6"/>':''}
  <g fill="#241d1a"><circle cx="48" cy="54" r="3"/><circle cx="73" cy="54" r="3"/></g>
  ${glasses?'<g fill="none" stroke="#192b32" stroke-width="3"><rect x="37" y="46" width="22" height="17" rx="6"/><rect x="63" y="46" width="22" height="17" rx="6"/><path d="M59 52h4"/></g>':''}
  <path d="M49 70q11 10 23 0" fill="none" stroke="#54251f" stroke-width="3" stroke-linecap="round"/>
 </svg>`;
}
