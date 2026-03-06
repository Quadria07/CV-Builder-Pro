export interface ATSScore {
    overall: number;
    breakdown: {
        label: string;
        score: number;
        max: number;
        tip: string;
    }[];
    strengths: string[];
    improvements: string[];
}

export interface ATSResponse {
    success: boolean;
    data: ATSScore;
    error?: string;
}
