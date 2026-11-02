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
export declare function newJobPractice(job: string): JobPractice;
export declare function jobTotals(plan: JobPractice): {
    payment: number;
    total: number;
    remaining: number;
} | null;
export declare function renderJobPractice(plan: JobPractice, guide: string, e: (v: unknown) => string): string;
export declare function jobFeedback(plan: JobPractice, e: (v: unknown) => string): string;
