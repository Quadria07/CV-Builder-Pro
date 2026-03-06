import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, Edit3, Plus, Trash2, Sparkles, BarChart3, Loader2, Menu, X } from 'lucide-react';
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
  initialTab?: 'edit' | 'preview' | 'ai' | 'ats';
}

type Tab = 'ai' | 'edit' | 'ats' | 'preview';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'edit', label: 'Edit Content', icon: <Edit3 className="w-4 h-4" /> },
  { id: 'ats', label: 'ATS Score', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
];

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm bg-white transition-colors';
const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5';
const cardCls = 'bg-white p-5 sm:p-6 rounded-xl border border-gray-100';

const CVEditor: React.FC<CVEditorProps> = ({
  selectedTemplate,
  cvData,
  setCvData,
  onBackToHome,
  onTemplateChange,
  initialTab = 'ai',
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { showToast } = useToast();

  /* ─── Handlers ────────────────────────────────────────────────── */
  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, [field]: value } });
  };

  const handleSkillsChange = (skills: string) => {
    setCvData({ ...cvData, skills: skills.split('\n').filter(s => s.trim() !== '') });
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string | string[]) => {
    const updated = [...cvData.workHistory];
    if (field === 'responsibilities') {
      updated[index] = { ...updated[index], responsibilities: typeof value === 'string' ? value.split('\n').filter(r => r.trim() !== '') : value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setCvData({ ...cvData, workHistory: updated });
  };

  const addWorkExperience = () => {
    setCvData({ ...cvData, workHistory: [...cvData.workHistory, { id: Date.now().toString(), position: '', company: '', duration: '', responsibilities: [] }] });
  };

  const removeWorkExperience = (index: number) => {
    setCvData({ ...cvData, workHistory: cvData.workHistory.filter((_, i) => i !== index) });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = [...cvData.education];
    updated[index] = { ...updated[index], [field]: value };
    setCvData({ ...cvData, education: updated });
  };

  const addEducation = () => {
    setCvData({ ...cvData, education: [...cvData.education, { id: Date.now().toString(), degree: '', institution: '', duration: '' }] });
  };

  const removeEducation = (index: number) => {
    setCvData({ ...cvData, education: cvData.education.filter((_, i) => i !== index) });
  };

  const handleInterestsChange = (interests: string) => {
    setCvData({ ...cvData, interests: interests.split('\n').filter(i => i.trim() !== '') });
  };

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
    showToast('CV generated! Switch to "Edit Content" to review.', 'success');
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  /* ─── Render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <h1 className="text-base font-semibold text-slate-800 truncate hidden sm:block">CV Editor</h1>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-1.5 bg-teal-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(p => !p)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* AI Assistant */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto">
            <AIAssistant onCVGenerated={handleAICVGenerated} />
          </div>
        )}

        {/* ATS Score */}
        {activeTab === 'ats' && (
          <div className="max-w-2xl mx-auto">
            <ATSAnalyzer cvData={cvData} />
          </div>
        )}

        {/* Edit + Live Preview (side-by-side on large, stacked on mobile) */}
        {activeTab === 'edit' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Edit Panel */}
            <div className="space-y-5 order-2 lg:order-1">
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
                    <textarea
                      value={cvData.personalInfo.summary || ''}
                      onChange={e => handlePersonalInfoChange('summary', e.target.value)}
                      rows={4}
                      className={inputCls}
                      placeholder="Your professional summary"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Skills</h3>
                <label className={labelCls}>Skills (one per line)</label>
                <textarea
                  value={cvData.skills.join('\n')}
                  onChange={e => handleSkillsChange(e.target.value)}
                  rows={6}
                  className={inputCls}
                  placeholder="React&#10;TypeScript&#10;Node.js"
                />
              </div>

              {/* Work Experience */}
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-800">Work Experience</h3>
                  <button onClick={addWorkExperience} className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.workHistory.map((work, index) => (
                    <div key={work.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600">Experience {index + 1}</span>
                        <button onClick={() => removeWorkExperience(index)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={labelCls}>Position</label>
                          <input type="text" value={work.position} onChange={e => handleWorkExperienceChange(index, 'position', e.target.value)} className={inputCls} placeholder="Job title" />
                        </div>
                        <div>
                          <label className={labelCls}>Company</label>
                          <input type="text" value={work.company} onChange={e => handleWorkExperienceChange(index, 'company', e.target.value)} className={inputCls} placeholder="Company name" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className={labelCls}>Duration</label>
                        <input type="text" value={work.duration} onChange={e => handleWorkExperienceChange(index, 'duration', e.target.value)} className={inputCls} placeholder="Jan 2020 - Present" />
                      </div>
                      <div>
                        <label className={labelCls}>Responsibilities (one per line)</label>
                        <textarea value={work.responsibilities.join('\n')} onChange={e => handleWorkExperienceChange(index, 'responsibilities', e.target.value)} rows={4} className={inputCls} placeholder="Key responsibilities..." />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-800">Education</h3>
                  <button onClick={addEducation} className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600">Education {index + 1}</span>
                        <button onClick={() => removeEducation(index)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={labelCls}>Degree</label>
                          <input type="text" value={edu.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} className={inputCls} placeholder="Degree name" />
                        </div>
                        <div>
                          <label className={labelCls}>Institution</label>
                          <input type="text" value={edu.institution} onChange={e => handleEducationChange(index, 'institution', e.target.value)} className={inputCls} placeholder="University name" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Duration</label>
                        <input type="text" value={edu.duration} onChange={e => handleEducationChange(index, 'duration', e.target.value)} className={inputCls} placeholder="2018 - 2022" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Interests</h3>
                <label className={labelCls}>Interests / Hobbies (one per line)</label>
                <textarea value={cvData.interests.join('\n')} onChange={e => handleInterestsChange(e.target.value)} rows={3} className={inputCls} placeholder="Reading&#10;Open source" />
              </div>

              {/* References */}
              <div className={cardCls}>
                <h3 className="text-base font-semibold text-slate-800 mb-4">References</h3>
                <textarea value={cvData.references} onChange={e => setCvData({ ...cvData, references: e.target.value })} rows={2} className={inputCls} placeholder="Available on request" />
              </div>
            </div>

            {/* Live Preview - sticky scaled panel on desktop */}
            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Live Preview</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[80vh] overflow-y-auto bg-white">
                  {/* Scale the 794px CV down so it fits the ~50% column without clipping */}
                  <div style={{ width: '794px', transform: 'scale(0.62)', transformOrigin: 'top left', marginBottom: 'calc((0.62 - 1) * 100%)' }}>
                    <CVPreview cvData={cvData} template={selectedTemplate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview tab (full width) */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <CVPreview cvData={cvData} template={selectedTemplate} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CVEditor;