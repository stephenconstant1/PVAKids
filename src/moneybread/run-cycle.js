import data from './run-cycles.json' with { type: 'json' };
import jumps from './jump-cycles.json' with { type: 'json' };
import ducks from './duck-cycles.json' with { type: 'json' };
export const runCycles = data;
export const jumpCycles = jumps;
export const duckCycles = ducks;
/** Flight is driven by the existing physics; landing/recovery consumes .24s.
 * Frames clamp instead of wrapping. No input delay or physics changes. */
export function jumpFrame(motion, reduced = false) {
    if (reduced)
        return motion.landed ? 15 : 5;
    return motion.landed ? Math.min(15, 10 + Math.floor(motion.landingMs / 40)) :
        Math.min(9, Math.floor(Math.max(0, motion.elapsedMs) / motion.flightMs * 10));
}
/** Row-major order follows the supplied sheets: 0..7, then 8..15. */
export function runFrame(cycle, elapsedMs, reduced = false) {
    return reduced ? 0 : Math.floor(Math.max(0, elapsedMs) * cycle.fps / 1000) % cycle.frameCount;
}
export class CharacterRunCycle {
    cycle;
    image;
    ready = false;
    failed = false;
    frame = 0;
    constructor(id, kind = 'run', onSettled = () => { }) {
        this.cycle = (kind === 'duck' ? duckCycles : kind === 'jump' ? jumpCycles : runCycles)[id];
        this.image = new Image();
        this.image.onload = () => { this.ready = true; onSettled(); };
        this.image.onerror = () => { this.failed = true; onSettled(); };
        if (this.cycle)
            this.image.src = new URL('../../' + this.cycle.image + '?v=46.0', import.meta.url).href;
        else
            this.failed = true;
        this.ready = Boolean(this.image.complete && this.image.naturalWidth);
    }
    /** Uniform scale and measured anchors only. Never rotate/warp individual art. */
    draw(ctx, height, elapsedMs, reduced = false) {
        const c = this.cycle;
        if (!c || !this.ready || !this.image.naturalWidth)
            return false;
        return this.drawFrame(ctx, height, runFrame(c, elapsedMs, reduced));
    }
    drawFrame(ctx, height, frame) {
        const c = this.cycle;
        if (!c || !this.ready || !this.image.naturalWidth)
            return false;
        this.frame = Math.max(0, Math.min(c.frameCount - 1, frame));
        const scale = height / c.designHeight;
        ctx.drawImage(this.image, (this.frame % c.columns) * c.cellWidth, Math.floor(this.frame / c.columns) * c.cellHeight, c.cellWidth, c.cellHeight, Math.round(-c.anchorX * scale), Math.round(height / 2 - c.frames[this.frame].groundY * scale), c.cellWidth * scale, c.cellHeight * scale);
        return true;
    }
}
