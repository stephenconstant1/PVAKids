export declare const jobScenes: Record<string, {
    title: string;
    mentor: string;
    name: string;
    need: string;
    value: string;
    items: string[];
    tasks: string[];
}>;
/** Original object illustrations; character pixels come only from canonical assets. */
export declare function jobSceneArt(job: string, category?: number): string;
