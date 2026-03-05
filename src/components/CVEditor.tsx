import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, Edit3, Plus, Trash2, Sparkles } from 'lucide-react';
import { CVData, WorkExperience, Education } from '../types/cv';
import CVPreview from './CVPreview';
import AIAssistant from './AIAssistant';
import { generatePDF } from '../utils/pdfGenerator';

interface CVEditorProps {
  selectedTemplate: string;
  cvData: CVData;
  setCvData: (data: CVData) => void;
  onBackToHome: () => void;
  onTemplateChange: (templateId: string) => void;
  initialTab?: 'edit' | 'preview' | 'ai';
}

const CVEditor: React.FC<CVEditorProps> = ({
  selectedTemplate,
  cvData,
  setCvData,
  onBackToHome,
  onTemplateChange,
  initialTab = 'edit'
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'ai'>(initialTab);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value
      }
    });
  };

  const handleSkillsChange = (skills: string) => {
    setCvData({
      ...cvData,
      skills: skills.split('\n').filter(skill => skill.trim() !== '')
    });
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string | string[]) => {
    const updatedWorkHistory = [...cvData.workHistory];
    if (field === 'responsibilities') {
      updatedWorkHistory[index] = {
        ...updatedWorkHistory[index],
        responsibilities: typeof value === 'string' ? value.split('\n').filter(r => r.trim() !== '') : value
      };
    } else {
      updatedWorkHistory[index] = {
        ...updatedWorkHistory[index],
        [field]: value
      };
    }
    setCvData({
      ...cvData,
      workHistory: updatedWorkHistory
    });
  };

  const addWorkExperience = () => {
    setCvData({
      ...cvData,
      workHistory: [
        ...cvData.workHistory,
        {
          id: Date.now().toString(),
          position: '',
          company: '',
          duration: '',
          responsibilities: []
        }
      ]
    });
  };

  const removeWorkExperience = (index: number) => {
    setCvData({
      ...cvData,
      workHistory: cvData.workHistory.filter((_, i) => i !== index)
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...cvData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      education: updatedEducation
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          degree: '',
          institution: '',
          duration: ''
        }
      ]
    });
  };

  const removeEducation = (index: number) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index)
    });
  };

  const handleInterestsChange = (interests: string) => {
    setCvData({
      ...cvData,
      interests: interests.split('\n').filter(interest => interest.trim() !== '')
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(cvData, selectedTemplate);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAICVGenerated = (data: CVData) => {
    setCvData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ai'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'edit'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Edit3 className="w-4 h-4 inline mr-2" />
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ai' ? (
          <div className="max-w-4xl mx-auto">
            <AIAssistant onCVGenerated={handleAICVGenerated} />
          </div>
        ) : activeTab === 'edit' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                    <textarea
                      value={cvData.personalInfo.summary}
                      onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your professional summary"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (one per line)</label>
                  <textarea
                    value={cvData.skills.join('\n')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your skills (one per line)"
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                  <button
                    onClick={addWorkExperience}
                    className="flex items-center space-x-1 text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {cvData.workHistory.map((work, index) => (
                    <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Experience {index + 1}</h4>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <input
                            type="text"
                            value={work.position}
                            onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Job title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <input
                            type="text"
                            value={work.company}
                            onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Company name"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={work.duration}
                          onChange={(e) => handleWorkExperienceChange(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., Jan 2020 - Present"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                        <textarea
                          value={work.responsibilities.join('\n')}
                          onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="List your key responsibilities"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center space-x-1 text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Education {index + 1}</h4>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Degree name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="School/University name"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., 2018-2022"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests/Hobbies</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interests (one per line)</label>
                  <textarea
                    value={cvData.interests.join('\n')}
                    onChange={(e) => handleInterestsChange(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your interests/hobbies"
                  />
                </div>
              </div>

              {/* References */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
                  <textarea
                    value={cvData.references}
                    onChange={(e) => setCvData({ ...cvData, references: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="References information"
                  />
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <CVPreview cvData={cvData} template={selectedTemplate} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <CVPreview cvData={cvData} template={selectedTemplate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVEditor;