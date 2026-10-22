export declare const landmarkArt: {
    id: string;
    tile: number;
    architecture: string;
}[];
export declare const constructionStages: string[];
/** Art metadata is keyed by existing landmark ID, never inferred from a lesson.
 * The source image contains eight completed buildings. A ghosted plan, a reveal
 * from the foundation up, and temporary scaffolding show the saved 0–4 stage.
 * This is a visual presentation only; purchases still use src/city.js rules. */
export declare function landmarkArtwork(id: string, name: string, stage: number, scope?: string): string;
