import React, { useState } from 'react';
import { Sparkles, FileSearch, Loader2, AlertCircle, Wand2, Target } from 'lucide-react';
import { CVData } from '../types/cv';
import { generateCVFromPrompt, optimizeCVForJob } from '../utils/aiService';

interface AIAssistantProps {
    onCVGenerated: (data: CVData) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onCVGenerated }) => {
    const [activeMode, setActiveMode] = useState<'generate' | 'optimize'>('generate');
    const [prompt, setPrompt] = useState('');
    const [cvText, setCvText] = useState('');
    const [jobDetails, setJobDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe yourself and your experience.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await generateCVFromPrompt(prompt);
            onCVGenerated(data);
            setSuccess('CV generated successfully! Switch to the "Edit Content" tab to review and refine.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimize = async () => {
        if (!cvText.trim()) {
            setError('Please paste your current CV.');
            return;
        }
        if (!jobDetails.trim()) {
            setError('Please paste the job description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await optimizeCVForJob(cvText, jobDetails);
            onCVGenerated(data);
            setSuccess('CV optimized for the job! Switch to "Edit Content" to review the changes.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Mode Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => { setActiveMode('generate'); setError(null); setSuccess(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all ${activeMode === 'generate'
                                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Wand2 className="w-4 h-4" />
                        Generate from Prompt
                    </button>
                    <button
                        onClick={() => { setActiveMode('optimize'); setError(null); setSuccess(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all ${activeMode === 'optimize'
                                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Target className="w-4 h-4" />
                        Optimize for Job
                    </button>
                </div>

                <div className="p-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{success}</p>
                        </div>
                    )}

                    {activeMode === 'generate' ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-teal-500" />
                                    Create Your CV with AI
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Describe yourself, your experience, skills, and education. The more detail you provide, the better your CV will be.
                                </p>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={10}
                                maxLength={5000}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                                placeholder={`Example: I'm a software engineer with 5 years of experience specializing in React, Node.js, and TypeScript. I've worked at two startups where I led frontend development teams. I have a BSc in Computer Science from University of Lagos. My key achievements include building a real-time dashboard that increased user engagement by 40% and migrating a legacy codebase to React which reduced load times by 60%. I'm skilled in Git, CI/CD, AWS, and agile methodologies. I'm interested in AI/ML and open source contributions.`}
                                disabled={isLoading}
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{prompt.length}/5000 characters</span>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate My CV
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileSearch className="w-5 h-5 text-teal-500" />
                                    Optimize CV for a Specific Job
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Paste your current CV and the job description. AI will rewrite your CV to perfectly match the role — using the right keywords, action verbs, and ATS-friendly formatting.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Current CV</label>
                                <textarea
                                    value={cvText}
                                    onChange={(e) => setCvText(e.target.value)}
                                    rows={8}
                                    maxLength={15000}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                                    placeholder="Paste your entire current CV/resume text here..."
                                    disabled={isLoading}
                                />
                                <span className="text-xs text-gray-400">{cvText.length}/15000 characters</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                                <textarea
                                    value={jobDetails}
                                    onChange={(e) => setJobDetails(e.target.value)}
                                    rows={8}
                                    maxLength={10000}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                                    placeholder="Paste the job description, requirements, and any details about the role you're applying for..."
                                    disabled={isLoading}
                                />
                                <span className="text-xs text-gray-400">{jobDetails.length}/10000 characters</span>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleOptimize}
                                    disabled={isLoading || !cvText.trim() || !jobDetails.trim()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Optimizing...
                                        </>
                                    ) : (
                                        <>
                                            <Target className="w-4 h-4" />
                                            Optimize My CV
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-teal-500 animate-pulse" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-teal-300 animate-ping opacity-25"></div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {activeMode === 'generate' ? 'Crafting Your CV...' : 'Optimizing for the Role...'}
                        </h4>
                        <p className="text-sm text-gray-500 max-w-sm">
                            {activeMode === 'generate'
                                ? 'AI is writing a professional CV tailored to your experience. This takes about 10-15 seconds.'
                                : 'AI is rewriting your CV to match the job requirements with the right keywords and structure.'}
                        </p>
                        {/* Shimmer bars */}
                        <div className="mt-6 w-full max-w-md space-y-3">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-gray-200 via-teal-100 to-gray-200 animate-shimmer"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden w-4/5">
                                <div className="h-full bg-gradient-to-r from-gray-200 via-teal-100 to-gray-200 animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden w-3/5">
                                <div className="h-full bg-gradient-to-r from-gray-200 via-teal-100 to-gray-200 animate-shimmer" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
