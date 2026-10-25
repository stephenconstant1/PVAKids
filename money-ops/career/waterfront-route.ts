/** Level 1 only: reserve a full maneuver/recovery gap between encounters.
 * Gap is measured after the last item, rather than between spawn timers. */
export function encounterGap(speed:number,random:()=>number=Math.random):number {
 return Math.max(230,speed*1.35)+50+random()*130;
}
export function coinGroup(random:()=>number=Math.random):{count:number;step:number;height:number} {
 return {count:3+Math.floor(random()*2),step:88+random()*24,height:60+random()*24};
}
