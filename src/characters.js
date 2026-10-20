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
 return `<img class="character-portrait ${className}" src="assets/cast/${c.image}?v=44.8" alt="${c.name}, ${c.role}">`;
}

export function castPortraits(className='',ids=castIds){
 if(className.includes('debrief-cast')&&ids===castIds)ids=['eli','ruby','maya'];
 return `<div class="curriculum-cast ${className}" aria-label="Money Ops student team">${ids.map(id=>`<div class="cast-member cast-${id}">${portrait(id)}<b>${character(id).name}</b></div>`).join('')}</div>`;
}

export function crewHeroMarkup(){
 return `<section class="my-city-crew home-crew-hero" aria-label="Financial Freedom Money Ops student crew">
  <div class="city-sun" aria-hidden="true"></div>
  <div class="city-buildings" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
  <div class="money-sparkles" aria-hidden="true"><i>$</i><i>★</i><i>¢</i><i>$</i></div>
  <div class="city-crew-copy"><span>YOUR SKILLS. YOUR IDEAS.</span><h1>A BRIGHTER TOMORROW.</h1><p><b>FINANCIAL FREEDOM: MONEY OPS</b>Meet the crew. Choose Career Mode or Arcade Mode and start your money adventure.</p></div>
  ${castPortraits('city-cast')}
  <div class="city-money-props" aria-hidden="true"><span class="hero-money-sign">$</span><span class="hero-gold"><i>GOLD</i><i>GOALS</i><i>GROW</i></span><span class="hero-goals"><b>MY GOALS</b><span>✓ SAVE</span><span>✓ INVEST</span><span>✓ BUILD</span></span></div>
 </section>`;
}
