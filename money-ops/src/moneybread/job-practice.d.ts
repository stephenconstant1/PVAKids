export interface JobPractice {
    job: string;
    materials: number;
    labor: number;
    overhead: number;
    checked: boolean;
    reflection: string;
}
export declare const practiceBudget = 100;
export declare const minimumCosts: {
    readonly materials: 25;
    readonly labor: 40;
    readonly overhead: 15;
};
export declare const practiceError = "Enter whole dollars: materials at least $25, labor at least $40, and overhead at least $15 (maximum $10,000 each).";
export declare function canCheckJob(plan: JobPractice): boolean;
export declare const customerNeeds: Record<string, {
    customer: string;
    need: string;
    value: string;
    materials: string;
    labor: string;
    overhead: string;
}>;
export declare function newJobPractice(job: string): JobPractice;
export declare function jobTotals(plan: JobPractice): {
    payment: number;
    total: number;
    remaining: number;
} | null;
export declare function renderJobPractice(plan: JobPractice, guide: string, e: (v: unknown) => string): string;
export declare function jobFeedback(plan: JobPractice, e: (v: unknown) => string): string;
