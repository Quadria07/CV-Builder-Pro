import React, { useState } from 'react';
import HomePage from './components/HomePage';
import CVEditor from './components/CVEditor';
import { ToastProvider } from './components/ToastProvider';
import { CVData } from './types/cv';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'editor'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [startWithAI, setStartWithAI] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: { name: '', address: '', phone: '', email: '', summary: '' },
    skills: [],
    workHistory: [],
    education: [],
    interests: [],
    references: 'Available on request',
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStartWithAI(false);
    setCurrentPage('editor');
  };

  const handleStartAI = () => {
    setStartWithAI(true);
    setCurrentPage('editor');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setStartWithAI(false);
  };

  return (
    <ToastProvider>
      {currentPage === 'home' ? (
        <HomePage onTemplateSelect={handleTemplateSelect} onStartAI={handleStartAI} />
      ) : (
        <CVEditor
          selectedTemplate={selectedTemplate}
          cvData={cvData}
          setCvData={setCvData}
          onBackToHome={handleBackToHome}
          onTemplateChange={setSelectedTemplate}
          initialTab="edit"
          initialPanel={startWithAI ? 'ai' : null}
        />
      )}
    </ToastProvider>
  );
}

export default App;