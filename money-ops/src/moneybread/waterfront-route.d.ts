export declare const ROUTE_METRICS: {
    standingHeight: number;
    duckHeight: number;
    duckArtHeight: number;
    ceilingBuffer: number;
    jumpTopBuffer: number;
    jumpTimingBuffer: number;
    landingRecovery: number;
    reactionTime: number;
};
/** The underside clears both the low hitbox and every canonical duck pose,
 * yet remains below standing height so walking through is impossible. */
export declare function overheadClearance(): number;
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
export declare function fallingOnto(previous: {
    x: number;
    y: number;
    w: number;
    h: number;
}, current: {
    x: number;
    y: number;
    w: number;
    h: number;
}, obstacle: {
    x: number;
    y: number;
    w: number;
    h: number;
}, verticalSpeed: number): boolean;
