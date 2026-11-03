export interface JobPractice {
    job: string;
    materials: number;
    labor: number;
    overhead: number;
    checked: boolean;
    reflection: string;
}
export declare const customerNeeds: Record<string, {
    customer: string;
    need: string;
    value: string;
    materials: string;
    labor: string;
    overhead: string;
}>;
export declare const JOB_PRACTICE_PAYMENT = 100;
export declare const MINIMUM_JOB_COSTS: Readonly<{
    readonly materials: 25;
    readonly labor: 40;
    readonly overhead: 15;
}>;
export declare const practiceBudget = 100;
export declare const minimumCosts: Readonly<{
    readonly materials: 25;
    readonly labor: 40;
    readonly overhead: 15;
}>;
export declare const practiceError = "Enter whole dollars: materials at least $25, labor at least $40, and overhead at least $15.";
export declare function canCheckJob(plan: JobPractice): boolean;
export type JobCostCategory = keyof typeof MINIMUM_JOB_COSTS;
export declare function newJobPractice(job: string): JobPractice;
export declare function jobTotals(plan: JobPractice): {
    payment: number;
    total: number;
    remaining: number;
} | null;
export declare function jobPlanError(plan: JobPractice): string;
export declare function jobStepDisabled(plan: JobPractice, category: JobCostCategory, direction: number): boolean;
export declare function stepJobCost(plan: JobPractice, category: JobCostCategory, direction: number): number;
export declare function renderJobPractice(plan: JobPractice, guide: string, e: (v: unknown) => string): string;
export declare function jobFeedback(plan: JobPractice, e: (v: unknown) => string): string;
