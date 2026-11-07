import {climbGoal,drawMoneyIllustration} from './needs-wants.js?v=46.28';
// Original waterfront pole/deck route. Practice dollars never enter game wallets.
export class WaterfrontClimb {
 constructor(runner){this.runner=runner;this.nextDistance=0;this.count=0;this.introduced=false;this.attached=false;this.inputs=new Map();this.waiting=new Map();this.allocated=new Set();this.remaining=100;this.reachedTop=false;this.visited=false;this.goalsReached=0;}
 spawn(){const r=this.runner;this.introduced=true;this.count++;this.goal=r.config?.needsWants?climbGoal(this.count-1):null;this.nextDistance=r.distance+850;this.reachedTop=false;this.remaining=100;this.allocated.clear();const height=this.goal?[288,312,296][(this.count-1)%3]:160;this.pole={type:'climb',x:r.width+35,y:r.ground-height,w:52,h:height,done:false};r.entities.push(this.pole);this.wordCard=null;if(r.arcade){r.spawnVocabulary();this.wordCard=r.entities.at(-1);if(this.wordCard?.type==='vocabulary'){this.wordCard.x=this.pole.x+65;this.wordCard.y=this.pole.y-54;}}}
 touching(){const r=this.runner,p=this.pole,b=r.playerBox();return p&&!p.done&&b.x+b.w>p.x-12&&b.x<p.x+p.w+12&&b.y+b.h>=p.y-4&&b.y<r.ground;}
 hold(source,direction){const r=this.runner;if(!r.running||r.paused||r.completed||(!this.attached&&!this.touching()))return false;
  this.inputs.set(source,direction);if(!this.attached){this.attached=true;this.visited=true;r.releaseAllDuck();r.jumpMotion=null;r.duckAnimation=null;r.physics.vy=0;r.player.vy=0;r.physics.grounded=false;r.player.grounded=false;r.state='climbing';}return true;}
 queue(source,direction){if(!this.runner.running||this.runner.paused)return;this.waiting.set(source,direction);this.hold(source,direction);}
 release(source){this.inputs.delete(source);this.waiting.delete(source);}
 stop(){this.inputs.clear();this.waiting.clear();}
 step(dt){if(!this.attached&&this.touching())for(const [source,direction] of this.waiting)this.hold(source,direction);if(!this.attached)return false;const r=this.runner,p=this.pole;
  const direction=[...this.inputs.values()].reduce((a,b)=>a+b,0),feet=r.player.y+r.player.h;
  const next=Math.max(p.y,Math.min(r.ground,feet-Math.sign(direction)*95*dt));
  r.player.y=next-r.player.h;r.player.vy=0;r.player.grounded=false;r.syncPhysicsFromPlayer();r.physics.vx=0;
  r.cameraY=Math.min(0,Math.round(r.player.y-16));r.state='climbing';
  if(next<=p.y+.01){this.reachedTop=true;if(this.wordCard&&!this.wordCard.done)r.collectVocabulary(this.wordCard);if(this.goal&&!this.goal.reached){this.goal.reached=true;this.goalsReached++;r.rememberVocabulary({label:this.goal.term,goalTerm:this.goal.term,definition:this.goal.definition,illustration:this.goal.illustration},'GOAL REACHED');}}if(direction<0&&next>=r.ground){this.leave();r.player.grounded=true;r.physics.grounded=true;}
  return true;
 }
 leave(){if(!this.attached)return false;this.attached=false;this.stop();const r=this.runner;r.player.grounded=true;r.physics.grounded=true;
  // Reserve fresh approach time after the player lands; no spawn at the exit.
  r.routeGapRemaining=Math.max(r.routeGapRemaining,this.goal?Math.max(2400,r.speed*3.4):1800);return true;
 }
 allocate(bucket){if(!this.attached||this.runner.paused||!this.reachedTop||this.runner.player.y+this.runner.player.h>this.pole.y+.01||this.allocated.has(bucket))return false;
  const amount={needs:50,wants:30,savings:20}[bucket];if(!Number.isFinite(amount))return false;
  this.allocated.add(bucket);this.remaining-=amount;return true;
 }
 snapshot(){return {count:this.count,goalsReached:this.goalsReached,goal:this.goal?{...this.goal}:null,available:Boolean(this.pole&&this.pole.x<this.runner.width&&this.pole.x+this.pole.w>this.runner.playerBox().x)||this.attached,ready:this.attached&&this.runner.player.y+this.runner.player.h<=this.pole?.y+.01,attached:this.attached,visited:this.visited,top:this.reachedTop,remaining:this.remaining,allocated:[...this.allocated]};}
 land(previous){const r=this.runner,p=this.pole;if(!p||p.done||this.attached||r.player.vy<0)return;
  const b=r.playerBox();if(previous.y+previous.h<=p.y+.01&&b.y+b.h>=p.y&&b.x+b.w>p.x-70&&b.x<p.x+180){
   r.player.y=p.y-r.player.h;r.player.vy=0;r.player.grounded=true;r.syncPhysicsFromPlayer();
  }
 }
 draw(c){const p=this.pole;if(!p||(!this.attached&&!this.runner.entities.includes(p)))return;
  if(this.goal){
   // Original floating waterfront terrace: the top edge matches the landing surface.
   c.fillStyle='#f2fcff';for(const [x,y,rx,ry] of [[p.x-26,p.y+53,56,15],[p.x+45,p.y+61,70,19],[p.x+123,p.y+50,50,16]]){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
   c.fillStyle='#346b70';c.fillRect(p.x-70,p.y+10,250,23);c.strokeStyle='#dfc88b';c.lineWidth=3;for(let x=p.x-65;x<p.x+175;x+=40){c.beginPath();c.moveTo(x,p.y+12);c.lineTo(x+18,p.y+29);c.lineTo(x+36,p.y+12);c.stroke();}
   c.fillStyle='#8fcf91';c.fillRect(p.x-70,p.y,250,10);c.fillStyle='#f3e5a5';c.fillRect(p.x-70,p.y,250,3);
   // Paired vines remain marked by the same readable ladder rungs.
   c.strokeStyle='#44865d';c.lineWidth=7;for(const x of [p.x+17,p.x+36]){c.beginPath();c.moveTo(x,p.y+8);c.lineTo(x,this.runner.ground);c.stroke();}
   c.fillStyle='#76b878';for(let y=p.y+47;y<this.runner.ground-16;y+=34){c.beginPath();c.ellipse(p.x+7,y,12,5,-.6,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(p.x+47,y+14,12,5,.6,0,Math.PI*2);c.fill();}
  }else{c.fillStyle='#bce5ce';c.fillRect(p.x-70,p.y,250,10);c.fillStyle='#416c67';c.fillRect(p.x+20,p.y,12,p.h);}
  c.strokeStyle='#ffdf87';c.lineWidth=4;for(let y=p.y+12;y<this.runner.ground;y+=18){c.beginPath();c.moveTo(p.x+10,y);c.lineTo(p.x+42,y);c.stroke();}
  if(this.goal){c.fillStyle=this.goal.reached?'#d5efd1':'#fff3ca';c.fillRect(p.x+78,p.y-64,64,60);drawMoneyIllustration(c,this.goal.illustration,p.x+84,p.y-62,52);c.fillStyle='#fff3ca';c.font='bold 12px Arial';c.textAlign='center';c.fillText(this.goal.reached?'✓ GOAL REACHED':'GOAL ↑',p.x+110,p.y-71);}
  c.fillStyle='#12383c';c.fillRect(p.x-82,this.runner.ground+8,230,27);c.fillStyle='#fff2ba';c.font='bold 14px Arial';c.textAlign='center';c.fillText(this.goal?'SKY GOALS · CLIMB ↑':'MONEY LADDER · HOLD ↑',p.x+32,this.runner.ground+27);
  const captionY=p.y+(this.goal?34:12);c.fillStyle='#12383c';c.fillRect(p.x-70,captionY,250,26);c.fillStyle='#fff2ba';c.fillText(this.goal?(this.goal.reached?'GOAL REACHED! · SAFE PLATFORM':'SKY PLATFORM · GOAL ABOVE'):this.runner.arcade?'WORD + $100 PRACTICE DECK':'OPTIONAL $100 PLANNING DECK',p.x+55,captionY+18);
 }
}
