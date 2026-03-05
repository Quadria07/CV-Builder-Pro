import { CVData } from '../types/cv';

const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/ai`
    : '/api';

interface AIResponse {
    success: boolean;
    data: CVData;
    error?: string;
}

function ensureIds(data: CVData): CVData {
    return {
        ...data,
        workHistory: (data.workHistory || []).map((w, i) => ({
            ...w,
            id: w.id || Date.now().toString() + i,
            responsibilities: w.responsibilities || [],
        })),
        education: (data.education || []).map((e, i) => ({
            ...e,
            id: e.id || Date.now().toString() + i,
        })),
        skills: data.skills || [],
        interests: data.interests || [],
        references: data.references || 'Available on request',
    };
}

export async function generateCVFromPrompt(prompt: string): Promise<CVData> {
    const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `Server error (${response.status})`);
    }

    const result: AIResponse = await response.json();
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate CV data.');
    }

    return ensureIds(result.data);
}

export async function optimizeCVForJob(
    cvText: string,
    jobDetails: string
): Promise<CVData> {
    const response = await fetch(`${API_BASE}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobDetails }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `Server error (${response.status})`);
    }

    const result: AIResponse = await response.json();
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to optimize CV.');
    }

    return ensureIds(result.data);
}
