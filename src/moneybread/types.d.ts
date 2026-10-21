export type DistrictId = 'homes' | 'shops' | 'park' | 'transit' | 'hospital' | 'school' | 'bank' | 'studio';
export interface SourceOption {
    id: string;
    label: string;
    detail: string;
    feedback?: string;
    effects?: Record<string, number>;
}
export interface SourceLesson {
    id: number;
    title: string;
    coreIdea: string;
    terms: string[];
    brief: string;
    lesson: string;
    sourceFiles: string[];
    district: DistrictId;
    dialogue: {
        speaker: string;
        text: string;
    }[];
    decision: {
        prompt: string;
        options: SourceOption[];
    } | null;
    challenge: {
        prompt?: string;
        title?: string;
        options?: SourceOption[];
    } | null;
}
export interface BreadWallet {
    available: number;
    income: number;
    spent: number;
    saved: number;
    invested: number;
    investmentResult: number;
}
export interface Week {
    lessonDone: boolean;
    job?: string;
    earned: number;
    allocation?: string;
    investment?: string;
    principal: number;
    project?: DistrictId;
    projectCost: number;
    reflection?: string;
    term?: string;
    application?: string;
    lessonFeedback?: string;
    settled: boolean;
}
export interface CityState {
    version: 1;
    wallet: BreadWallet;
    weeks: Record<number, Week>;
    buildings: Record<DistrictId, number>;
    condition: number;
    notice: string;
    serial: number;
    motion: 'earn' | 'build' | 'allocate' | 'reflect' | 'none';
    legacy: number[];
    lastProject?: DistrictId;
}
export interface CareerProfile {
    mode?: string;
    completed: number[];
    moneybread?: CityState;
    name: string;
    avatar: string;
    active?: {
        id: number;
        practice?: boolean;
    } | null;
    [key: string]: unknown;
}
export interface CityUI {
    view: 'city' | 'school' | 'work' | 'wallet' | 'progress';
    district: DistrictId;
    preview?: number;
    reset: boolean;
    error?: string;
}
export type CityAction = {
    type: 'work';
    job: string;
} | {
    type: 'allocate';
    plan: string;
} | {
    type: 'build';
    district: DistrictId;
} | {
    type: 'withdraw';
} | {
    type: 'reflect';
    text: string;
    term: string;
} | {
    type: 'reset';
};
