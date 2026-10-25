import { ArrayTileMap } from './platform-physics.js';
export declare const runnerTiles: {
    tileSize: number;
    floorRow: number;
    repeatX: boolean;
    zoom: number;
    level: number[][];
};
export declare const RUNNER_ZOOM: number;
export declare function runnerBody(screenCenterX: number): import("./platform-physics.js").Body;
export declare function runnerMap(): ArrayTileMap;
