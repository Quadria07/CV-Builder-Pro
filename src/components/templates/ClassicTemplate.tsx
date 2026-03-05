import React from 'react';
import { CVData } from '../../types/cv';

interface ClassicTemplateProps {
  cvData: CVData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-serif" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold text-black mb-2 uppercase tracking-wide">
          {cvData.personalInfo.name || 'YOUR NAME'}
        </h1>
        <div className="text-sm text-black">
          {cvData.personalInfo.address && (
            <span>{cvData.personalInfo.address}</span>
          )}
          {cvData.personalInfo.phone && (
            <span className="mx-2">| {cvData.personalInfo.phone}</span>
          )}
          {cvData.personalInfo.email && (
            <span className="mx-2">| {cvData.personalInfo.email}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 uppercase tracking-wide border-b border-black pb-1">
            Summary
          </h2>
          <p className="text-sm text-black leading-relaxed text-justify">
            {cvData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 uppercase tracking-wide border-b border-black pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-1">
            {cvData.skills.map((skill, index) => (
              <div key={index} className="text-sm text-black">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work History */}
      {cvData.workHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide border-b border-black pb-1">
            Work History
          </h2>
          {cvData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-black uppercase">{work.position}</h3>
                  <p className="text-sm text-black font-medium">{work.company}</p>
                </div>
                <div className="text-sm text-black text-right">
                  {work.duration}
                </div>
              </div>
              {work.responsibilities.length > 0 && (
                <ul className="text-sm text-black ml-4">
                  {work.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="mb-1">• {responsibility}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide border-b border-black pb-1">
            Educational History
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-black">{edu.degree}</h3>
                  <p className="text-sm text-black">{edu.institution}</p>
                </div>
                <div className="text-sm text-black">
                  {edu.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interests */}
      {cvData.interests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 uppercase tracking-wide border-b border-black pb-1">
            Interests/Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.interests.map((interest, index) => (
              <span key={index} className="text-sm text-black">
                • {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 uppercase tracking-wide border-b border-black pb-1">
            References
          </h2>
          <p className="text-sm text-black">{cvData.references}</p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;