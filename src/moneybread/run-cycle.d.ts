export interface RunCycle {
    name: string;
    image: string;
    columns: number;
    frameCount: number;
    fps: number;
    cellWidth: number;
    cellHeight: number;
    anchorX: number;
    groundY: number;
    designHeight: number;
    frames: readonly {
        index: number;
        sourceRect: readonly number[];
        anchorX: number;
        groundY: number;
        contentRect: readonly number[];
    }[];
}
export declare const runCycles: Record<string, RunCycle>;
export declare const jumpCycles: Record<string, RunCycle>;
export interface JumpMotion {
    elapsedMs: number;
    flightMs: number;
    landed: boolean;
    landingMs: number;
}
/** Flight is driven by the existing physics; landing/recovery consumes .24s.
 * Frames clamp instead of wrapping. No input delay or physics changes. */
export declare function jumpFrame(motion: JumpMotion, reduced?: boolean): number;
/** Row-major order follows the supplied sheets: 0..7, then 8..15. */
export declare function runFrame(cycle: RunCycle, elapsedMs: number, reduced?: boolean): number;
export declare class CharacterRunCycle {
    readonly cycle: RunCycle | undefined;
    readonly image: HTMLImageElement;
    ready: boolean;
    failed: boolean;
    frame: number;
    constructor(id: string, kind?: 'run' | 'jump', onSettled?: () => void);
    /** Uniform scale and measured anchors only. Never rotate/warp individual art. */
    draw(ctx: CanvasRenderingContext2D, height: number, elapsedMs: number, reduced?: boolean): boolean;
    drawFrame(ctx: CanvasRenderingContext2D, height: number, frame: number): boolean;
}
