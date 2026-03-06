import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Download, Eye, Edit3, Plus, Trash2,
  Sparkles, BarChart3, Loader2, ChevronDown, Wand2, X, LayoutTemplate
} from 'lucide-react';
import { CVData } from '../types/cv';
import CVPreview from './CVPreview';
import AIAssistant from './AIAssistant';
import ATSAnalyzer from './ATSAnalyzer';
import { generatePDF } from '../utils/pdfGenerator';
import { useToast } from './ToastProvider';

interface CVEditorProps {
  selectedTemplate: string;
  cvData: CVData;
  setCvData: (data: CVData) => void;
  onBackToHome: () => void;
  onTemplateChange?: (templateId: string) => void;
  initialTab?: 'edit' | 'preview';
  initialPanel?: 'ai' | 'ats' | null;
}

type Tab = 'edit' | 'preview';
type Panel = 'ai' | 'ats' | null;

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm bg-white transition-colors';
const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5';
const cardCls = 'bg-white p-5 sm:p-6 rounded-xl border border-gray-100';

const CVEditor: React.FC<CVEditorProps> = ({
  selectedTemplate,
  cvData,
  setCvData,
  onBackToHome,
  onTemplateChange,
  initialTab = 'edit',
  initialPanel = null,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [openPanel, setOpenPanel] = useState<Panel>(initialPanel);
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  // Scroll to top when the editor mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ─── Data handlers ─────────────────────────────────────────── */
  const handlePersonalInfoChange = (field: string, value: string) =>
    setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, [field]: value } });

  const handleSkillsChange = (v: string) =>
    setCvData({ ...cvData, skills: v.split('\n').filter(s => s.trim()) });

  const handleWorkChange = (index: number, field: string, value: string | string[]) => {
    const updated = [...cvData.workHistory];
    if (field === 'responsibilities') {
      updated[index] = { ...updated[index], responsibilities: typeof value === 'string' ? value.split('\n').filter(r => r.trim()) : value };
    } else {
      updated[index] = { ...updated[index], [field]: value as string };
    }
    setCvData({ ...cvData, workHistory: updated });
  };

  const addWork = () => setCvData({ ...cvData, workHistory: [...cvData.workHistory, { id: Date.now().toString(), position: '', company: '', duration: '', responsibilities: [] }] });
  const removeWork = (i: number) => setCvData({ ...cvData, workHistory: cvData.workHistory.filter((_, idx) => idx !== i) });

  const handleEduChange = (index: number, field: string, value: string) => {
    const updated = [...cvData.education];
    updated[index] = { ...updated[index], [field]: value };
    setCvData({ ...cvData, education: updated });
  };

  const addEdu = () => setCvData({ ...cvData, education: [...cvData.education, { id: Date.now().toString(), degree: '', institution: '', duration: '' }] });
  const removeEdu = (i: number) => setCvData({ ...cvData, education: cvData.education.filter((_, idx) => idx !== i) });

  const handleInterestsChange = (v: string) =>
    setCvData({ ...cvData, interests: v.split('\n').filter(i => i.trim()) });

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(cvData, selectedTemplate);
      showToast('PDF downloaded successfully!', 'success');
    } catch {
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAICVGenerated = (data: CVData) => {
    setCvData(data);
    setOpenPanel(null);
    showToast('CV generated! Review and refine below.', 'success');
  };

  const togglePanel = (panel: Panel) =>
    setOpenPanel(prev => (prev === panel ? null : panel));

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBackToHome} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <h1 className="text-base font-semibold text-slate-800 hidden sm:block">CV Editor</h1>
          </div>

          {/* Center: 2 tabs */}
          <nav className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
            {[
              { id: 'edit' as Tab, label: 'Edit Content', icon: <Edit3 className="w-5 h-5 sm:w-3.5 sm:h-3.5" /> },
              { id: 'preview' as Tab, label: 'Preview', icon: <Eye className="w-5 h-5 sm:w-3.5 sm:h-3.5" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-teal-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── EDIT TAB ─────────────────────────────────────────── */}
        {activeTab === 'edit' && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Left: AI toolbar + form */}
            <div className="space-y-4 order-2 lg:order-1">

              {/* ── AI & ATS Toolbar ─────────────────────────── */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Toolbar row */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
                  <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700 flex-1">AI Tools</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePanel('ai')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${openPanel === 'ai'
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'border-gray-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
                        }`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Generate / Optimize</span>
                      <span className="sm:hidden">AI</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${openPanel === 'ai' ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      onClick={() => togglePanel('ats')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${openPanel === 'ats'
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'border-gray-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
                        }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      ATS Score
                      <ChevronDown className={`w-3 h-3 transition-transform ${openPanel === 'ats' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* AI panel (collapsible) */}
                {openPanel === 'ai' && (
                  <div className="border-b border-gray-50">
                    <div className="flex items-center justify-between px-4 pt-4 pb-1">
                      <p className="text-xs text-slate-400">Choose a mode below to generate or rewrite your CV with AI.</p>
                      <button onClick={() => setOpenPanel(null)} className="text-slate-300 hover:text-slate-500 transition-colors ml-2 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-4 pb-4">
                      <AIAssistant onCVGenerated={handleAICVGenerated} compact />
                    </div>
                  </div>
                )}

                {/* ATS panel (collapsible) */}
                {openPanel === 'ats' && (
                  <div className="border-b border-gray-50">
                    <div className="flex items-center justify-between px-4 pt-4 pb-1">
                      <p className="text-xs text-slate-400">Analyse your current CV against ATS criteria.</p>
                      <button onClick={() => setOpenPanel(null)} className="text-slate-300 hover:text-slate-500 transition-colors ml-2 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-4 pb-4">
                      <ATSAnalyzer cvData={cvData} compact />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Template Selection ──────────────────────── */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-teal-600" />
                  CV Template
                </h3>
                <div className="relative">
                  <select
                    value={selectedTemplate}
                    onChange={(e) => onTemplateChange?.(e.target.value)}
                    className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm bg-white text-slate-700 font-medium cursor-pointer transition-colors"
                    aria-label="Select Template"
                  >
                    <option value="classic">Classic Professional</option>
                    <option value="modern">Modern Executive</option>
                    <option value="creative">Creative Professional</option>
                    <option value="minimal">Minimal Clean</option>
                    <option value="executive">Executive Elite</option>
                    <option value="tech">Tech Professional</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* ── Form fields ──────────────────────────────── */}
              {/* Personal Info */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your full name' },
                    { label: 'Address', field: 'address', type: 'text', placeholder: 'Your address' },
                    { label: 'Phone', field: 'phone', type: 'text', placeholder: 'Your phone number' },
                    { label: 'Email', field: 'email', type: 'email', placeholder: 'Your email address' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className={labelCls}>{label}</label>
                      <input
                        type={type}
                        value={(cvData.personalInfo as unknown as Record<string, string>)[field] || ''}
                        onChange={e => handlePersonalInfoChange(field, e.target.value)}
                        className={inputCls}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Professional Summary</label>
                    <textarea value={cvData.personalInfo.summary || ''} onChange={e => handlePersonalInfoChange('summary', e.target.value)} rows={4} className={inputCls} placeholder="Your professional summary" />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Skills</h3>
                <label className={labelCls}>Skills (one per line)</label>
                <textarea value={cvData.skills.join('\n')} onChange={e => handleSkillsChange(e.target.value)} rows={5} className={inputCls} placeholder={'React\nTypeScript\nNode.js'} />
              </div>

              {/* Work Experience */}
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-800">Work Experience</h3>
                  <button onClick={addWork} className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.workHistory.map((work, idx) => (
                    <div key={work.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600">Experience {idx + 1}</span>
                        <button onClick={() => removeWork(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div><label className={labelCls}>Position</label><input type="text" value={work.position} onChange={e => handleWorkChange(idx, 'position', e.target.value)} className={inputCls} placeholder="Job title" /></div>
                        <div><label className={labelCls}>Company</label><input type="text" value={work.company} onChange={e => handleWorkChange(idx, 'company', e.target.value)} className={inputCls} placeholder="Company name" /></div>
                      </div>
                      <div className="mb-3"><label className={labelCls}>Duration</label><input type="text" value={work.duration} onChange={e => handleWorkChange(idx, 'duration', e.target.value)} className={inputCls} placeholder="Jan 2020 - Present" /></div>
                      <div><label className={labelCls}>Responsibilities (one per line)</label><textarea value={work.responsibilities.join('\n')} onChange={e => handleWorkChange(idx, 'responsibilities', e.target.value)} rows={4} className={inputCls} placeholder="Key responsibilities..." /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-800">Education</h3>
                  <button onClick={addEdu} className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.education.map((edu, idx) => (
                    <div key={edu.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600">Education {idx + 1}</span>
                        <button onClick={() => removeEdu(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div><label className={labelCls}>Degree</label><input type="text" value={edu.degree} onChange={e => handleEduChange(idx, 'degree', e.target.value)} className={inputCls} placeholder="Degree name" /></div>
                        <div><label className={labelCls}>Institution</label><input type="text" value={edu.institution} onChange={e => handleEduChange(idx, 'institution', e.target.value)} className={inputCls} placeholder="University name" /></div>
                      </div>
                      <div><label className={labelCls}>Duration</label><input type="text" value={edu.duration} onChange={e => handleEduChange(idx, 'duration', e.target.value)} className={inputCls} placeholder="2018 - 2022" /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Interests</h3>
                <label className={labelCls}>Interests / Hobbies (one per line)</label>
                <textarea value={cvData.interests.join('\n')} onChange={e => handleInterestsChange(e.target.value)} rows={3} className={inputCls} placeholder={'Reading\nOpen source'} />
              </div>

              {/* References */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">References</h3>
                <textarea value={cvData.references} onChange={e => setCvData({ ...cvData, references: e.target.value })} rows={2} className={inputCls} placeholder="Available on request" />
              </div>
            </div>

            {/* Right: sticky live preview */}
            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Live Preview</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[80vh] overflow-y-auto bg-white">
                  <div style={{ width: '794px', transform: 'scale(0.62)', transformOrigin: 'top left', marginBottom: 'calc((0.62 - 1) * 100%)' }}>
                    <CVPreview cvData={cvData} template={selectedTemplate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW TAB ──────────────────────────────────────── */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-x-auto relative">
              <div className="min-w-[794px]">
                <CVPreview cvData={cvData} template={selectedTemplate} />
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4 sm:hidden">
              Swipe horizontally to view the full document
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CVEditor;