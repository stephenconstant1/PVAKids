/** All coordinates are floating-point WORLD pixels. Camera zoom never changes
 * the 16×16 solid boxes or the independent 12×26 standing player hitbox. */
export declare const TILE = 16;
export declare const BODY_WIDTH = 12, BODY_HEIGHT = 26, DUCK_HEIGHT = 14;
export declare const WALK_SPEED: number, RUN_SPEED: number;
export declare const GRAVITY = 4800, ACCELERATION = 1200, DECELERATION = 1800;
export interface TileMap {
    solid(x: number, y: number): boolean;
}
export declare class ArrayTileMap implements TileMap {
    readonly level: readonly (readonly number[])[];
    readonly repeatX: boolean;
    constructor(level: readonly (readonly number[])[], repeatX?: boolean);
    solid(x: number, y: number): boolean;
}
export interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    w: number;
    h: number;
    grounded: boolean;
    left: boolean;
    right: boolean;
    ceiling: boolean;
    tilesChecked: number;
}
export declare function createBody(x: number, y: number): Body;
export declare function overlappedTiles(box: {
    x: number;
    y: number;
    w: number;
    h: number;
}): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare function overlapsSolid(body: {
    x: number;
    y: number;
    w: number;
    h: number;
}, map: TileMap): boolean;
export declare function setCrouched(body: Body, map: TileMap, crouched: boolean): boolean;
export declare function jumpHeight(speed: number): number;
export declare function launchJump(body: Body, boots?: boolean): boolean;
/** Delta-driven integration with bounded steps. Horizontal and vertical
 * resolution stay separate even on slow frames or at high velocities. */
export declare function stepBody(body: Body, map: TileMap, targetVx: number, delta: number): void;
