import React from 'react';
import { CVData } from '../../types/cv';

interface ExecutiveTemplateProps {
  cvData: CVData;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-serif" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="border-b-4 border-indigo-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {cvData.personalInfo.name || 'YOUR NAME'}
        </h1>
        <div className="text-gray-600">
          {cvData.personalInfo.address && (
            <div className="mb-2">{cvData.personalInfo.address}</div>
          )}
          <div className="flex space-x-6">
            {cvData.personalInfo.phone && (
              <span className="flex items-center">
                <span className="font-medium">T:</span> {cvData.personalInfo.phone}
              </span>
            )}
            {cvData.personalInfo.email && (
              <span className="flex items-center">
                <span className="font-medium">E:</span> {cvData.personalInfo.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {cvData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            CORE COMPETENCIES
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-y-2 gap-x-8">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Work History */}
      {cvData.workHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            PROFESSIONAL EXPERIENCE
          </h2>
          {cvData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-6 border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{work.position}</h3>
                  <p className="text-indigo-600 font-medium">{work.company}</p>
                </div>
                <div className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                  {work.duration}
                </div>
              </div>
              {work.responsibilities.length > 0 && (
                <ul className="text-gray-700 mt-3 space-y-1">
                  {work.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-indigo-600 mr-2">▪</span>
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
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            EDUCATION & QUALIFICATIONS
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-indigo-600">{edu.institution}</p>
                </div>
                <div className="text-gray-600 text-sm font-medium">
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
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            INTERESTS & ACTIVITIES
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-3">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-4"></div>
            REFERENCES
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{cvData.references}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;