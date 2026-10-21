type Point = readonly [number, number];
type Limb = 'leftLeg' | 'rightLeg' | 'leftArm' | 'rightArm';
interface Rig {
    source: string;
    head: readonly Point[];
    torso: readonly Point[];
    bones: Record<Limb, readonly [Point, Point, Point]>;
    faceGuard: readonly number[];
    clothSample: Point;
    pantsSample: Point;
    sourceSha256: string;
}
export declare const runnerRigs: Record<string, Rig>;
export interface StridePose {
    leftLeg: number;
    rightLeg: number;
    leftArm: number;
    rightArm: number;
    leftKnee: number;
    rightKnee: number;
    leftElbow: number;
    rightElbow: number;
    lean: number;
}
export declare function stridePose(ms: number): StridePose;
export declare function strideJoints(id: string, w: number, h: number, ms: number): Record<Limb, {
    root: Point;
    joint: Point;
    end: Point;
    upper: number;
    lower: number;
}> | undefined;
export declare function drawStride(ctx: CanvasRenderingContext2D, image: HTMLImageElement, id: string, width: number, height: number, ms: number): void;
export {};
