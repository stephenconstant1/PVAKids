import type { DistrictId } from './types.js';
export interface LessonDestination {
    lessonId: number;
    title: string;
    name: string;
    sourceLocation: string;
    sourceFiles: string[];
    district: DistrictId;
    x: number;
    y: number;
}
export declare const destinations: LessonDestination[];
export declare const missingDestinations: number[];
export declare function destination(id: number): LessonDestination | undefined;
