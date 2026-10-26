/** All coordinates are floating-point WORLD pixels. Camera zoom never changes
 * the 16×16 solid boxes or the independent 12×26 standing player hitbox. */
export const TILE = 16;
export const BODY_WIDTH = 12, BODY_HEIGHT = 26, DUCK_HEIGHT = 14;
export const WALK_SPEED = 1.56 * 60, RUN_SPEED = 2.56 * 60;
export const GRAVITY = 4800, ACCELERATION = 1200, DECELERATION = 1800;
const EPS = 1e-7;
export class ArrayTileMap {
    level;
    repeatX;
    constructor(level, repeatX = false) {
        this.level = level;
        this.repeatX = repeatX;
    }
    solid(x, y) {
        const row = this.level[y];
        if (!row?.length)
            return false;
        const column = this.repeatX ? ((x % row.length) + row.length) % row.length : x;
        return row[column] === 1; // row FIRST: level[tileY][tileX]
    }
}
export function createBody(x, y) {
    return { x, y, vx: 0, vy: 0, ax: 0, ay: GRAVITY, w: BODY_WIDTH, h: BODY_HEIGHT, grounded: false, left: false, right: false, ceiling: false, tilesChecked: 0 };
}
export function overlappedTiles(box) {
    return { left: Math.floor(box.x / TILE), right: Math.floor((box.x + box.w - EPS) / TILE), top: Math.floor(box.y / TILE), bottom: Math.floor((box.y + box.h - EPS) / TILE) };
}
export function overlapsSolid(body, map) {
    const b = overlappedTiles(body);
    for (let y = b.top; y <= b.bottom; y++)
        for (let x = b.left; x <= b.right; x++)
            if (map.solid(x, y))
                return true;
    return false;
}
/** Dynamic overhead hazards supplement solid tiles when restoring standing height. */
export function setCrouched(body, map, crouched, obstacles = []) {
    const h = crouched ? DUCK_HEIGHT : BODY_HEIGHT;
    if (body.h === h)
        return true;
    const y = body.y + body.h - h;
    if (!crouched) {
        const standing = { ...body, y, h };
        if (overlapsSolid(standing, map) || obstacles.some(o => standing.x < o.x + o.w - EPS && standing.x + standing.w > o.x + EPS && standing.y < o.y + o.h - EPS && standing.y + standing.h > o.y + EPS))
            return false;
    }
    body.y = y;
    body.h = h;
    return true;
}
export function jumpHeight(speed) {
    const t = Math.max(0, Math.min(1, (Math.abs(speed) - WALK_SPEED) / (RUN_SPEED - WALK_SPEED)));
    return TILE * (4 + t);
}
export function launchJump(body, boots = false) {
    if (!body.grounded)
        return false;
    body.vy = -Math.sqrt(2 * GRAVITY * jumpHeight(body.vx) * (boots ? 1.35 : 1));
    body.grounded = false;
    return true;
}
function approach(value, target, amount) {
    return value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
}
function resolve(body, map, axis, movement) {
    if (!movement)
        return;
    const b = overlappedTiles(body);
    let position = body[axis], hit = false;
    // Only the overlapped rows/columns are visited. Substeps prevent tunneling.
    for (let y = b.top; y <= b.bottom; y++)
        for (let x = b.left; x <= b.right; x++) {
            body.tilesChecked++;
            if (!map.solid(x, y))
                continue;
            hit = true;
            if (axis === 'x')
                position = movement > 0 ? Math.min(position, x * TILE - body.w) : Math.max(position, (x + 1) * TILE);
            else
                position = movement > 0 ? Math.min(position, y * TILE - body.h) : Math.max(position, (y + 1) * TILE);
        }
    if (!hit)
        return;
    body[axis] = position;
    if (axis === 'x') {
        body.vx = 0;
        if (movement > 0)
            body.right = true;
        else
            body.left = true;
    }
    else {
        body.vy = 0;
        if (movement > 0)
            body.grounded = true;
        else
            body.ceiling = true;
    }
}
/** Delta-driven integration with bounded steps. Horizontal and vertical
 * resolution stay separate even on slow frames or at high velocities. */
export function stepBody(body, map, targetVx, delta) {
    if (!Number.isFinite(delta) || delta <= 0)
        return;
    body.left = body.right = body.ceiling = false;
    body.tilesChecked = 0;
    const duration = Math.min(delta, .25), maxV = Math.max(Math.abs(body.vx), Math.abs(targetVx), Math.abs(body.vy) + GRAVITY * duration);
    const steps = Math.max(1, Math.ceil(duration / (1 / 240)), Math.ceil(maxV * duration / (TILE / 2))), dt = duration / steps;
    for (let i = 0; i < steps; i++) {
        const oldVx = body.vx;
        body.vx = approach(oldVx, targetVx, (targetVx === 0 ? DECELERATION : ACCELERATION) * dt);
        body.ax = (body.vx - oldVx) / dt;
        const dx = (oldVx + body.vx) * .5 * dt;
        body.x += dx;
        resolve(body, map, 'x', dx);
        body.ay = GRAVITY;
        const dy = body.vy * dt + .5 * body.ay * dt * dt;
        body.vy += body.ay * dt;
        body.y += dy;
        body.grounded = false;
        resolve(body, map, 'y', dy);
    }
}
