import type { CareerProfile, CityState, CityAction, DistrictId, Week } from './types.js';
export declare const districts: {
    id: DistrictId;
    name: string;
    role: string;
    icon: string;
    color: string;
}[];
export declare const jobs: {
    id: string;
    name: string;
    skill: string;
    income: number;
    cost: number;
    detail: string;
}[];
export declare const plans: {
    id: string;
    name: string;
    saved: number;
    invested: number;
    detail: string;
}[];
export declare function freshCity(legacy?: number[]): CityState;
export declare function validCity(value: unknown): value is CityState;
export declare function attachCity<T extends CareerProfile>(p: T): T;
export declare function currentLevel(s: CityState): number;
export declare function canOpen(s: CityState, id: number): boolean;
export declare function week(s: CityState, id?: number): Week;
export declare function noteLesson<T extends CareerProfile>(p: T, id: number): T;
export declare function outcome(id: number, plan: string): number;
export declare function cityCondition(s: CityState): string;
export declare function applyCity(s: CityState, action: CityAction, completed: number[]): CityState;
