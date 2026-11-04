/** Flattened reference art stays still. Motion belongs to separate cues and UI. */
export declare const jobComicPanels: {
    text: string;
    description: string;
    cue: string;
    focus: number[];
}[];
export interface JobComicContext {
    brief?: string;
    lessonText?: string;
    title: string;
    coreIdea: string;
    guide: {
        id: string;
        name: string;
    };
    scripture: {
        text: string;
        reference: string;
    };
    vocabulary: {
        term: string;
        definition: string;
    }[];
}
export interface JobComicOptions {
    route?: 'job' | 'lesson';
    paused?: boolean;
    muted?: boolean;
    context?: JobComicContext;
    coreIdea?: string;
    lessonText?: string;
}
export declare function jobComicPracticeMath(): {
    payment: number;
    materials: 25;
    labor: 40;
    overhead: 15;
    total: number;
    remaining: number;
};
export declare function jobComicRead(step: number, coreIdea?: string): string;
export declare function renderJobComic(step: number, e: (v: unknown) => string, options?: JobComicOptions): string;
