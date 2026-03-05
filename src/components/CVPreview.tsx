import React from 'react';
import { CVData } from '../types/cv';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';

interface CVPreviewProps {
  cvData: CVData;
  template: string;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate cvData={cvData} />;
      case 'modern':
        return <ModernTemplate cvData={cvData} />;
      case 'creative':
        return <CreativeTemplate cvData={cvData} />;
      case 'minimal':
        return <MinimalTemplate cvData={cvData} />;
      case 'executive':
        return <ExecutiveTemplate cvData={cvData} />;
      case 'tech':
        return <TechTemplate cvData={cvData} />;
      default:
        return <ClassicTemplate cvData={cvData} />;
    }
  };

  return (
    <div 
      id="cv-preview" 
      className="bg-white shadow-lg mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '0',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default CVPreview;