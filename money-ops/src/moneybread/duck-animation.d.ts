export declare const duckVariations: readonly ["kneeling tuck", "compact squat", "forward slide", "reverse slide", "low lunge", "side crouch"];
export interface DuckMotion {
    variant: number;
    elapsedMs: number;
    onsetMs: number;
    releasing: boolean;
    recoveryMs: number;
    recoveryDurationMs: number;
}
/** No repeat on consecutive triggers; held keys and pointer repeats never reroll. */
export declare function createDuck(previous?: number, random?: () => number): DuckMotion;
export declare function duckFrame(motion: DuckMotion, reduced?: boolean): number;
