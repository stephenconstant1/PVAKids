/** Level 1's supplied panorama. Ground is at image y=584 of 720, matching
 * runner y=292 after uniform .5 scaling. Prepare a blended repeat once. */
export declare class WaterfrontScene {
    readonly image: HTMLImageElement;
    ready: boolean;
    failed: boolean;
    tile: HTMLCanvasElement | undefined;
    offset: number;
    readonly nearImage: HTMLImageElement;
    nearReady: boolean;
    nearGlow: HTMLCanvasElement | undefined;
    layerOffsets: {
        far: number;
        near: number;
        trees: number;
        water: number;
        railing: number;
        path: number;
    };
    constructor();
    private prepare;
    draw(ctx: CanvasRenderingContext2D, width: number, height: number, distance: number, time: number, reduced: boolean): boolean;
}
