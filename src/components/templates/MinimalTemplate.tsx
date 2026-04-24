import React from 'react';
import { CVData } from '../../types/cv';

interface MinimalTemplateProps {
  cvData: CVData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-sans" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          {cvData.personalInfo.name || 'YOUR NAME'}
        </h1>
        <div className="text-gray-600 space-y-1">
          {cvData.personalInfo.address && (
            <div>{cvData.personalInfo.address}</div>
          )}
          <div className="flex space-x-6">
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
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {cvData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {cvData.skills.map((skill, index) => (
              <div key={index} className="text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work History */}
      {cvData.workHistory.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
            Experience
          </h2>
          {cvData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{work.position}</h3>
                  <p className="text-gray-600">{work.company}</p>
                </div>
                <div className="text-gray-500 text-sm">
                  {work.duration}
                </div>
              </div>
              {work.responsibilities.length > 0 && (
                <ul className="text-gray-700 mt-3 space-y-1">
                  {work.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="text-sm">
                      • {responsibility}
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
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
            Education
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <div className="text-gray-500 text-sm">
                  {edu.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interests */}
      {cvData.interests.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Interests
          </h2>
          <div className="flex flex-wrap gap-4">
            {cvData.interests.map((interest, index) => (
              <span key={index} className="text-gray-700">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects && cvData.projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {cvData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1">{project.technologies.join(', ')}</p>
                )}
                <p className="text-gray-700 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages && cvData.languages.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Languages
          </h2>
          <div className="space-y-2">
            {cvData.languages.map((language) => (
              <div key={language.id} className="flex justify-between">
                <span className="text-gray-700">{language.name}</span>
                <span className="text-gray-500 text-sm">{language.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Awards */}
      {cvData.achievements && cvData.achievements.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Achievements & Awards
          </h2>
          <div className="space-y-3">
            {cvData.achievements.map((achievement) => (
              <div key={achievement.id}>
                <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                <p className="text-gray-700 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            References
          </h2>
          <p className="text-gray-700">{cvData.references}</p>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;