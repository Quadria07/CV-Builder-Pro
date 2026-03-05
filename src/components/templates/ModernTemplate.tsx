import React from 'react';
import { CVData } from '../../types/cv';

interface ModernTemplateProps {
  cvData: CVData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-sans" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {cvData.personalInfo.name || 'YOUR NAME'}
        </h1>
        <div className="text-sm opacity-90">
          {cvData.personalInfo.address && (
            <div className="mb-1">{cvData.personalInfo.address}</div>
          )}
          <div className="flex space-x-4">
            {cvData.personalInfo.phone && (
              <span>{cvData.personalInfo.phone}</span>
            )}
            {cvData.personalInfo.email && (
              <span>{cvData.personalInfo.email}</span>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {cvData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            Core Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {cvData.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work History */}
      {cvData.workHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            Professional Experience
          </h2>
          {cvData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{work.position}</h3>
                  <p className="text-purple-600 font-medium">{work.company}</p>
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {work.duration}
                </div>
              </div>
              {work.responsibilities.length > 0 && (
                <ul className="text-gray-700 mt-3 space-y-1">
                  {work.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{responsibility}</span>
                    </li>
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
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            Education
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-purple-600">{edu.institution}</p>
                </div>
                <div className="text-gray-600 text-sm">
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
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            Interests & Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.interests.map((interest, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-4">
            References
          </h2>
          <p className="text-gray-700">{cvData.references}</p>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;