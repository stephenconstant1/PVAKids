import { BODY_WIDTH, GRAVITY, jumpHeight } from './platform-physics.js';
import { RUNNER_ZOOM } from './runner-physics.js';
/** Shared encounter geometry, in screen pixels, derived from the real physics.
 * Use the slowest normal pace so later acceleration cannot make a box too wide. */
export function jumpEnvelope(speed) {
    const worldSpeed = Math.max(1, speed / RUNNER_ZOOM), height = jumpHeight(worldSpeed);
    return { height: height * RUNNER_ZOOM, flight: 2 * Math.sqrt(2 * GRAVITY * height) / GRAVITY };
}
export function encounterGap(speed, random = Math.random) {
    // Full jump, landing recovery, and a new reaction window AFTER the last item.
    return Math.max(300, speed * (jumpEnvelope(speed).flight + .24 + .65)) + random() * speed * .25;
}
export function coinGroup(random = Math.random) {
    // All rewards intersect the standing body; no compulsory jump through hazards.
    return { count: 3 + Math.floor(random() * 2), step: 96 + random() * 24, height: 64 + random() * 12 };
}
export function obstacleGeometry(speed, desiredWidth, desiredHeight) {
    const envelope = jumpEnvelope(speed), h = Math.min(desiredHeight, envelope.height * .18);
    const gravity = GRAVITY * RUNNER_ZOOM, v = Math.sqrt(2 * gravity * envelope.height);
    // Time BOTH feet are above the top, minus player width and timing tolerance.
    const clearance = 2 * Math.sqrt(Math.max(0, v * v - 2 * gravity * (h + 8))) / gravity;
    const w = Math.min(desiredWidth, Math.max(12, speed * (clearance - .045) - BODY_WIDTH * RUNNER_ZOOM));
    return { w: Math.floor(w), h: Math.floor(h) };
}
