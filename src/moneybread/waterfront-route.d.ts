/** Shared encounter geometry, in screen pixels, derived from the real physics.
 * Use the slowest normal pace so later acceleration cannot make a box too wide. */
export declare function jumpEnvelope(speed: number): {
    height: number;
    flight: number;
};
export declare function encounterGap(speed: number, random?: () => number): number;
export declare function coinGroup(random?: () => number): {
    count: number;
    step: number;
    height: number;
};
export declare function obstacleGeometry(speed: number, desiredWidth: number, desiredHeight: number): {
    w: number;
    h: number;
};
