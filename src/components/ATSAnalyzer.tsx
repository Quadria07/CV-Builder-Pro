import React, { useState } from 'react';
import { BarChart3, CheckCircle, AlertTriangle, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { analyzeCV } from '../utils/aiService';
import { ATSScore } from '../types/ats';
import { ATSSkeleton } from './Skeletons';
import { useToast } from './ToastProvider';
import { CVData } from '../types/cv';

interface ATSAnalyzerProps {
    cvData: CVData;
    compact?: boolean;
}

function scoreColor(score: number, max: number) {
    const pct = (score / max) * 100;
    if (pct >= 75) return { bar: 'bg-teal-500', text: 'text-teal-600' };
    if (pct >= 50) return { bar: 'bg-amber-400', text: 'text-amber-600' };
    return { bar: 'bg-red-400', text: 'text-red-500' };
}

function overallColor(score: number) {
    if (score >= 75) return { ring: 'stroke-teal-500', text: 'text-teal-600', label: 'Strong' };
    if (score >= 50) return { ring: 'stroke-amber-400', text: 'text-amber-600', label: 'Good' };
    return { ring: 'stroke-red-400', text: 'text-red-500', label: 'Needs Work' };
}

function cvDataToText(cv: CVData): string {
    const lines: string[] = [];
    lines.push(cv.personalInfo.name || '');
    lines.push(cv.personalInfo.email || '', cv.personalInfo.phone || '', cv.personalInfo.address || '');
    if (cv.personalInfo.summary) lines.push('\nSummary:', cv.personalInfo.summary);
    if (cv.skills.length) lines.push('\nSkills:', cv.skills.join(', '));
    cv.workHistory.forEach(w => {
        lines.push(`\n${w.position} at ${w.company} (${w.duration})`);
        w.responsibilities.forEach(r => lines.push(`- ${r}`));
    });
    cv.education.forEach(e => lines.push(`\n${e.degree}, ${e.institution} (${e.duration})`));
    if (cv.interests.length) lines.push('\nInterests:', cv.interests.join(', '));
    return lines.filter(Boolean).join('\n');
}

const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({ cvData }) => {
    const [result, setResult] = useState<ATSScore | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleAnalyze = async () => {
        const text = cvDataToText(cvData);
        if (!cvData.personalInfo.name && !text.trim()) {
            showToast('Please fill in your CV first before analyzing.', 'info');
            return;
        }
        setIsLoading(true);
        try {
            const score = await analyzeCV(text);
            setResult(score);
            showToast('ATS analysis complete!', 'success');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Analysis failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const overall = result ? overallColor(result.overall) : null;

    if (isLoading) return <ATSSkeleton />;

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-5">
                    <BarChart3 className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">ATS Score and Feedback</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                    Get an instant score on how well your CV will perform with applicant tracking systems,
                    plus specific tips to improve it.
                </p>
                <button
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 bg-teal-500 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-teal-600 transition-colors"
                >
                    <Sparkles className="w-4 h-4" />
                    Analyze My CV
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Overall Score */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Circular score */}
                    <div className="relative flex-shrink-0">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42"
                                fill="none"
                                className={overall!.ring}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(result.overall / 100) * 264} 264`}
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-bold ${overall!.text}`}>{result.overall}</span>
                            <span className="text-xs text-slate-400">/100</span>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-slate-800 mb-1">
                            ATS Score: <span className={overall!.text}>{overall!.label}</span>
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {result.overall >= 75
                                ? 'Your CV is well-optimized. A few tweaks could push it further.'
                                : result.overall >= 50
                                    ? 'Good foundation. Address the improvements below to rank higher.'
                                    : 'Your CV needs significant work to pass ATS filters. Follow the tips below.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Score Breakdown</h4>
                <div className="space-y-4">
                    {result.breakdown.map((item) => {
                        const colors = scoreColor(item.score, item.max);
                        const pct = Math.round((item.score / item.max) * 100);
                        return (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    <span className={`text-sm font-semibold ${colors.text}`}>{item.score}/{item.max}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                                    <div
                                        className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                {item.tip && (
                                    <p className="text-xs text-slate-400 leading-relaxed">{item.tip}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Strengths + Improvements */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
                    <h4 className="text-sm font-semibold text-teal-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-teal-700 flex items-start gap-2">
                                <span className="text-teal-400 mt-0.5 flex-shrink-0">+</span>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                    <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Improvements
                    </h4>
                    <ul className="space-y-2">
                        {result.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5 flex-shrink-0">!</span>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Re-analyze */}
            <div className="text-center">
                <button
                    onClick={handleAnalyze}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Re-analyze
                </button>
            </div>
        </div>
    );
};

export default ATSAnalyzer;
