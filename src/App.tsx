import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CVEditor from './components/CVEditor';
import { ToastProvider } from './components/ToastProvider';
import { DarkModeProvider } from './components/DarkModeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import FeedbackModal from './components/FeedbackModal';
import { CVData } from './types/cv';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'editor'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [startWithAI, setStartWithAI] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackShownAfterDownload, setFeedbackShownAfterDownload] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: { name: '', address: '', phone: '', email: '', summary: '' },
    skills: [],
    workHistory: [],
    education: [],
    projects: [],
    languages: [],
    interests: [],
    achievements: [],
    references: '',
  });

  // Initialize feedback state from localStorage
  useEffect(() => {
    const hasShownFeedback = localStorage.getItem('cvbuilder_feedback_shown');
    setFeedbackShownAfterDownload(!!hasShownFeedback);
  }, []);

  const handlePDFDownloaded = () => {
    if (!feedbackShownAfterDownload) {
      setFeedbackShownAfterDownload(true);
      localStorage.setItem('cvbuilder_feedback_shown', 'true');
      // Show feedback modal after a brief delay
      setTimeout(() => {
        setShowFeedbackModal(true);
      }, 1500);
    }
  };

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
  };

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
    <ErrorBoundary>
      <DarkModeProvider>
        <ToastProvider>
          {currentPage === 'home' ? (
            <HomePage 
              onTemplateSelect={handleTemplateSelect} 
              onStartAI={handleStartAI}
              onOpenFeedback={() => setShowFeedbackModal(true)}
            />
          ) : (
            <CVEditor
              selectedTemplate={selectedTemplate}
              cvData={cvData}
              setCvData={setCvData}
              onBackToHome={handleBackToHome}
              onTemplateChange={setSelectedTemplate}
              initialTab="edit"
              initialPanel={startWithAI ? 'ai' : null}
              onPDFDownloaded={handlePDFDownloaded}
              onOpenFeedback={() => setShowFeedbackModal(true)}
            />
          )}
          <FeedbackModal 
            isOpen={showFeedbackModal}
            onClose={handleFeedbackModalClose}
            isAutomatic={feedbackShownAfterDownload && showFeedbackModal}
          />
        </ToastProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}

export default App;