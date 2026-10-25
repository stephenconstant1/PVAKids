/** Level 1 only: reserve a full maneuver/recovery gap between encounters.
 * Gap is measured after the last item, rather than between spawn timers. */
export function encounterGap(speed, random = Math.random) {
    return Math.max(230, speed * 1.35) + 50 + random() * 130;
}
export function coinGroup(random = Math.random) {
    return { count: 3 + Math.floor(random() * 2), step: 88 + random() * 24, height: 60 + random() * 24 };
}
