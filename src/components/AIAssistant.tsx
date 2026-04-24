import React, { useState, useRef } from 'react';
import { Sparkles, FileSearch, Loader2, Wand2, Target, Upload } from 'lucide-react';
import { CVData } from '../types/cv';
import { generateCVFromPrompt, optimizeCVForJob } from '../utils/aiService';
import { useToast } from './ToastProvider';
import { analyticsEvents } from '../utils/analytics';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Helper function to convert CVData to text format
function formatCVToText(cv: CVData): string {
    let text = '';
    
    // Personal Info
    const { name, email, phone, address, summary } = cv.personalInfo;
    if (name) text += `${name}\n`;
    if (email) text += `Email: ${email}\n`;
    if (phone) text += `Phone: ${phone}\n`;
    if (address) text += `Address: ${address}\n`;
    if (summary) text += `\nSummary:\n${summary}\n`;
    
    // Skills
    if (cv.skills && cv.skills.length > 0) {
        text += `\nSkills:\n${cv.skills.join(', ')}\n`;
    }
    
    // Work History
    if (cv.workHistory && cv.workHistory.length > 0) {
        text += `\nWork Experience:\n`;
        cv.workHistory.forEach(work => {
            text += `\n${work.position} at ${work.company}\n${work.duration}\n`;
            if (work.responsibilities && work.responsibilities.length > 0) {
                work.responsibilities.forEach(resp => {
                    text += `• ${resp}\n`;
                });
            }
        });
    }
    
    // Education
    if (cv.education && cv.education.length > 0) {
        text += `\nEducation:\n`;
        cv.education.forEach(edu => {
            text += `\n${edu.degree} from ${edu.institution}\n${edu.duration}\n`;
        });
    }
    
    // Projects
    if (cv.projects && cv.projects.length > 0) {
        text += `\nProjects:\n`;
        cv.projects.forEach(proj => {
            text += `\n${proj.title}\n${proj.description}`;
            if (proj.technologies) text += `\nTechnologies: ${proj.technologies.join(', ')}`;
            text += '\n';
        });
    }
    
    // Languages
    if (cv.languages && cv.languages.length > 0) {
        text += `\nLanguages:\n`;
        cv.languages.forEach(lang => {
            text += `${lang.name} (${lang.proficiency})\n`;
        });
    }
    
    // Interests
    if (cv.interests && cv.interests.length > 0) {
        text += `\nInterests:\n${cv.interests.join(', ')}\n`;
    }
    
    // Achievements
    if (cv.achievements && cv.achievements.length > 0) {
        text += `\nAchievements & Awards:\n`;
        cv.achievements.forEach(achievement => {
            text += `\n${achievement.title}\n${achievement.description}\n`;
        });
    }
    
    // References
    if (cv.references) {
        text += `\nReferences:\n${cv.references}\n`;
    }
    
    return text;
}

interface AIAssistantProps {
    onCVGenerated: (data: CVData) => void;
    currentCV?: CVData;
    compact?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onCVGenerated, currentCV, compact = false }) => {
    const [activeMode, setActiveMode] = useState<'generate' | 'optimize'>('generate');
    const [prompt, setPrompt] = useState('');
    const [cvText, setCvText] = useState('');
    const [jobDetails, setJobDetails] = useState('');
    const [useCurrentCV, setUseCurrentCV] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTarget, setUploadTarget] = useState<'prompt' | 'cvText' | 'jobDetails' | null>(null);
    const { showToast } = useToast();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !uploadTarget) return;

        // File size validation: max 20MB
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        if (file.size > MAX_FILE_SIZE) {
            showToast('File size exceeds 20MB limit. Please upload a smaller file.', 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(true);
        try {
            let extractedText = '';
            const arrayBuffer = await file.arrayBuffer();

            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    extractedText += pageText + '\n\n';
                }
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.toLowerCase().endsWith('.docx')
            ) {
                const result = await mammoth.extractRawText({ arrayBuffer });
                extractedText = result.value;
            } else {
                throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
            }

            if (!extractedText.trim()) throw new Error('Could not extract any text from this file.');

            if (uploadTarget === 'prompt') setPrompt(extractedText);
            else if (uploadTarget === 'cvText') setCvText(extractedText);
            else if (uploadTarget === 'jobDetails') setJobDetails(extractedText);

            showToast('Document text extracted successfully!', 'success');
            analyticsEvents.fileUploadSuccess(file.type === 'application/pdf' ? 'pdf' : 'docx');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to read file.';
            showToast(errorMsg, 'error');
            analyticsEvents.fileUploadError(errorMsg);
        } finally {
            setIsUploading(false);
            setUploadTarget(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = (target: 'prompt' | 'cvText' | 'jobDetails') => {
        setUploadTarget(target);
        fileInputRef.current?.click();
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) { showToast('Please describe yourself and your experience.', 'info'); return; }
        setIsLoading(true);
        analyticsEvents.cvGenerateStart();
        try {
            const data = await generateCVFromPrompt(prompt);
            onCVGenerated(data);
            analyticsEvents.cvGenerateSuccess();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
            showToast(errorMsg, 'error');
            analyticsEvents.cvGenerateError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimize = async () => {
        if (!cvText.trim()) { showToast('Please paste your current CV.', 'info'); return; }
        if (!jobDetails.trim()) { showToast('Please paste the job description.', 'info'); return; }
        setIsLoading(true);
        analyticsEvents.cvOptimizeStart();
        try {
            const data = await optimizeCVForJob(cvText, jobDetails);
            onCVGenerated(data);
            analyticsEvents.cvOptimizeSuccess();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
            showToast(errorMsg, 'error');
            analyticsEvents.cvOptimizeError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const textareaCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none text-sm transition-colors';

    return (
        <div className="space-y-5">
            {/* Mode Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'generate' as const, icon: Wand2, label: 'Generate from Prompt' },
                        { id: 'optimize' as const, icon: Target, label: 'Optimize for Job' },
                    ].map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => { setActiveMode(id); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-all ${activeMode === id
                                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">{id === 'generate' ? 'Generate' : 'Optimize'}</span>
                        </button>
                    ))}
                </div>

                <div className="p-5 sm:p-6">
                    {activeMode === 'generate' ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-teal-500" /> Create Your CV with AI
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Describe your background, or upload your old CV directly.
                                    </p>
                                </div>
                                <button
                                    onClick={() => triggerUpload('prompt')}
                                    disabled={isLoading || isUploading}
                                    className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                                >
                                    {isUploading && uploadTarget === 'prompt' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                    Upload PDF/DOCX
                                </button>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                rows={compact ? 5 : 10}
                                maxLength={15000}
                                className={textareaCls}
                                placeholder={`Example: I'm a software engineer with 5 years of experience specialising in React and Node.js. I work at a startup where I lead frontend development. BSc Computer Science from University of Lagos. Key achievement: built a real-time dashboard that increased engagement by 40%.`}
                                disabled={isLoading}
                            />
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <span className="text-xs text-slate-400">{prompt.length}/15000 characters</span>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate My CV</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
                                    <FileSearch className="w-4 h-4 text-teal-500" /> Optimize CV for a Specific Job
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Paste your current CV and the job description. AI rewrites it to perfectly match the role.
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Your Current CV</label>
                                    <div className="flex items-center gap-3">
                                        {currentCV && (
                                            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={useCurrentCV}
                                                    onChange={(e) => {
                                                        setUseCurrentCV(e.target.checked);
                                                        if (e.target.checked && currentCV) {
                                                            // Convert currentCV to text format
                                                            const cvTextContent = formatCVToText(currentCV);
                                                            setCvText(cvTextContent);
                                                        } else {
                                                            setCvText('');
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                />
                                                <span>Use current CV in editor</span>
                                            </label>
                                        )}
                                        <button
                                            onClick={() => triggerUpload('cvText')}
                                            disabled={isLoading || isUploading || useCurrentCV}
                                            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isUploading && uploadTarget === 'cvText' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                            Upload File
                                        </button>
                                    </div>
                                </div>
                                <textarea value={cvText} onChange={e => setCvText(e.target.value)} rows={8} maxLength={15000} className={textareaCls} placeholder="Paste your entire current CV/resume text here..." disabled={isLoading} />
                                <span className="text-xs text-slate-400">{cvText.length}/15000 characters</span>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Job Description</label>
                                    <button
                                        onClick={() => triggerUpload('jobDetails')}
                                        disabled={isLoading || isUploading}
                                        className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors"
                                    >
                                        {isUploading && uploadTarget === 'jobDetails' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        Upload File
                                    </button>
                                </div>
                                <textarea value={jobDetails} onChange={e => setJobDetails(e.target.value)} rows={8} maxLength={15000} className={textareaCls} placeholder="Paste the full job description here..." disabled={isLoading} />
                                <span className="text-xs text-slate-400">{jobDetails.length}/15000 characters</span>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleOptimize}
                                    disabled={isLoading || !cvText.trim() || !jobDetails.trim()}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</> : <><Target className="w-4 h-4" /> Optimize My CV</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-teal-500 animate-pulse" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-teal-200 animate-ping opacity-30"></div>
                        </div>
                        <h4 className="text-base font-semibold text-slate-800 mb-1">
                            {activeMode === 'generate' ? 'Crafting your CV...' : 'Optimizing for the role...'}
                        </h4>
                        <p className="text-sm text-slate-500 max-w-xs">This takes about 10-15 seconds.</p>
                        <div className="mt-5 w-full max-w-sm space-y-2.5">
                            {[null, 'w-4/5', 'w-3/5'].map((w, i) => (
                                <div key={i} className={`h-2.5 bg-gray-100 rounded-full overflow-hidden ${w || 'w-full'}`}>
                                    <div className="h-full bg-gradient-to-r from-gray-100 via-teal-100 to-gray-100 animate-shimmer" style={{ animationDelay: `${i * 0.2}s` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
            />
        </div>
    );
};

export default AIAssistant;
