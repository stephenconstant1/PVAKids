import {BODY_WIDTH,BODY_HEIGHT,DUCK_HEIGHT,GRAVITY,jumpHeight} from './platform-physics.js';
import {RUNNER_ZOOM} from './runner-physics.js';
import ducks from './duck-cycles.json' with {type:'json'};
export const ROUTE_METRICS={
 standingHeight:BODY_HEIGHT*RUNNER_ZOOM,duckHeight:DUCK_HEIGHT*RUNNER_ZOOM,
 duckArtHeight:Math.max(...Object.values(ducks).map(c=>c.maxDrawHeight)),
 ceilingBuffer:12,jumpTopBuffer:4,jumpTimingBuffer:.015,landingRecovery:.24,reactionTime:1
};
/** The underside clears both the low hitbox and every canonical duck pose,
 * yet remains below standing height so walking through is impossible. */
export function overheadClearance():number {
 const m=ROUTE_METRICS;return Math.ceil(Math.max(m.standingHeight-4,Math.max(m.duckHeight,m.duckArtHeight)+m.ceilingBuffer));
}
/** Shared encounter geometry, in screen pixels, derived from the real physics.
 * Use the slowest normal pace so later acceleration cannot make a box too wide. */
export function jumpEnvelope(speed:number):{height:number;flight:number} {
 const worldSpeed=Math.max(1,speed/RUNNER_ZOOM),height=jumpHeight(worldSpeed);
 return {height:height*RUNNER_ZOOM,flight:2*Math.sqrt(2*GRAVITY*height)/GRAVITY};
}
export function encounterGap(speed:number,random:()=>number=Math.random):number {
 // Full jump, landing recovery, and a new reaction window AFTER the last item.
 return Math.max(300,speed*(jumpEnvelope(speed).flight*Math.sqrt(1.35)+ROUTE_METRICS.landingRecovery+ROUTE_METRICS.reactionTime)+BODY_WIDTH*RUNNER_ZOOM)+random()*speed*.25;
}
export function coinGroup(random:()=>number=Math.random):{count:number;step:number;height:number} {
 // Spaced airborne arc; the center coin follows the apex of one jump.
 return {count:3,step:66+random()*4,height:176+random()*8};
}
export function obstacleGeometry(speed:number,desiredWidth:number,desiredHeight:number):{w:number;h:number} {
 const envelope=jumpEnvelope(speed),h=Math.min(desiredHeight,envelope.height*.36);
 const gravity=GRAVITY*RUNNER_ZOOM,v=Math.sqrt(2*gravity*envelope.height);
 // Time BOTH feet are above the top, minus player width and timing tolerance.
 const clearance=2*Math.sqrt(Math.max(0,v*v-2*gravity*(h+ROUTE_METRICS.jumpTopBuffer)))/gravity;
 const w=Math.min(desiredWidth,Math.max(12,speed*(clearance-ROUTE_METRICS.jumpTimingBuffer)-BODY_WIDTH*RUNNER_ZOOM));
 return {w:Math.floor(w),h:Math.floor(h)};
}

export function fallingOnto(previous:{x:number;y:number;w:number;h:number},current:{x:number;y:number;w:number;h:number},obstacle:{x:number;y:number;w:number;h:number},verticalSpeed:number):boolean {
 return verticalSpeed>0&&previous.y+previous.h<=obstacle.y+2&&current.y+current.h>=obstacle.y&&current.x+current.w>obstacle.x&&current.x<obstacle.x+obstacle.w;
}
