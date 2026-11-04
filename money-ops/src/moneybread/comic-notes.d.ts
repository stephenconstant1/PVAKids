import type { JobComicContext } from './job-comic.js';
export type NotesTab = 'scene' | 'lesson' | 'words' | 'scripture';
export interface ComicNote {
    title: string;
    body: string;
    kind?: 'math' | 'word' | 'scripture' | 'guide';
    wordIndex?: number;
    related?: number[];
}
export interface NotesInput {
    index: number;
    title: string;
    description: string;
    context?: JobComicContext;
    lessonText?: string;
    math: {
        payment: number;
        materials: number;
        labor: number;
        overhead: number;
        remaining: number;
    };
}
export declare function comicNoteGroups(input: NotesInput): Record<NotesTab, ComicNote[]>;
export declare function renderComicNotes(input: NotesInput, e: (v: unknown) => string): string;
export declare function selectComicNotes(root: HTMLElement, tab: NotesTab, index?: number, focus?: boolean): void;
export declare function openComicNotes(root: HTMLElement | null, tab?: NotesTab, focus?: boolean): void;
export declare function closeComicNotes(root: HTMLElement | null): void;
export declare function changeComicNotes(root: HTMLElement | null, direction: number): void;
export declare function comicNotesRead(root: HTMLElement | null): string;
