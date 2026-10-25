/** Level 1 only: reserve a full maneuver/recovery gap between encounters.
 * Gap is measured after the last item, rather than between spawn timers. */
export declare function encounterGap(speed: number, random?: () => number): number;
export declare function coinGroup(random?: () => number): {
    count: number;
    step: number;
    height: number;
};
