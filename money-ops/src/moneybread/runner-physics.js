import data from './runner-tiles.json' with { type: 'json' };
import { ArrayTileMap, BODY_HEIGHT, BODY_WIDTH, TILE, createBody } from './platform-physics.js';
export const runnerTiles = data;
export const RUNNER_ZOOM = data.zoom;
export function runnerBody(screenCenterX) {
    const b = createBody(screenCenterX / RUNNER_ZOOM - BODY_WIDTH / 2, data.floorRow * TILE - BODY_HEIGHT);
    b.grounded = true;
    return b;
}
export function runnerMap() { return new ArrayTileMap(data.level.map(row => [...row]), data.repeatX); }
