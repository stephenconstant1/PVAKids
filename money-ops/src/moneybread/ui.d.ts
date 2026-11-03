import type { CareerProfile, CityState, CityUI } from './types.js';
export declare const escapeHTML: (value: unknown) => string;
export declare function careerNextStep(p: CareerProfile, s: CityState): {
    id: number;
    label: string;
    action: string;
    detail: string;
};
export declare function renderCity(p: CareerProfile, ui: CityUI): string;
