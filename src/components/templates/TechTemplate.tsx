import React from 'react';
import { MapPin, Phone, Mail, Terminal } from 'lucide-react';
import { CVData } from '../../types/cv';

interface TechTemplateProps {
  cvData: CVData;
}

const TechTemplate: React.FC<TechTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-mono" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {cvData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <div className="text-teal-400 text-sm">
              <div className="mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1.5" />{cvData.personalInfo.address}</div>
              <div className="flex space-x-4">
                {cvData.personalInfo.phone && (
                  <span className="flex items-center"><Phone className="w-4 h-4 mr-1.5" />{cvData.personalInfo.phone}</span>
                )}
                {cvData.personalInfo.email && (
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1.5" />{cvData.personalInfo.email}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-teal-400 opacity-50"><Terminal className="w-12 h-12" strokeWidth={1.5} /></div>
        </div>
      </div>

      {/* Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            ABOUT
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-600">
            <p className="text-gray-700 leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            SKILLS
          </h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-teal-400 mr-2">▶</span>
                  <code className="text-sm">{skill}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Work History */}
      {cvData.workHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            EXPERIENCE
          </h2>
          {cvData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    <code>{work.position}</code>
                  </h3>
                  <p className="text-teal-600 font-medium">{work.company}</p>
                </div>
                <div className="bg-teal-600 text-white px-3 py-1 rounded text-sm">
                  {work.duration}
                </div>
              </div>
              {work.responsibilities.length > 0 && (
                <div className="mt-3">
                  <div className="text-gray-500 text-sm mb-2">{'{ responsibilities: ['}</div>
                  <ul className="text-gray-700 ml-4 space-y-1">
                    {work.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-teal-600 mr-2">-</span>
                        <code className="text-sm">{responsibility}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="text-gray-500 text-sm mt-2">{'} ]'}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            EDUCATION
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    <code>{edu.degree}</code>
                  </h3>
                  <p className="text-teal-600">{edu.institution}</p>
                </div>
                <div className="text-gray-600 text-sm bg-gray-200 px-2 py-1 rounded">
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
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            INTERESTS
          </h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="bg-teal-600 text-white px-3 py-1 rounded text-sm">
                  <code>{interest}</code>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-600 mb-3 flex items-center">
            <span className="text-gray-400 mr-2">{'// '}</span>
            REFERENCES
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-600">
            <code className="text-gray-700">{cvData.references}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTemplate;