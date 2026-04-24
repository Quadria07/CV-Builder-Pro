import React from 'react';
import { User, Zap, Briefcase, GraduationCap, Heart, FileText, Code, Globe, Award } from 'lucide-react';
import { CVData } from '../../types/cv';

interface CreativeTemplateProps {
  cvData: CVData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ cvData }) => {
  return (
    <div className="w-full h-full p-8 bg-white font-sans" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-32 rounded-2xl"></div>
        <div className="absolute -bottom-4 left-8 bg-white rounded-2xl p-6 shadow-lg border-4 border-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {cvData.personalInfo.name || 'YOUR NAME'}
          </h1>
          <div className="text-sm text-gray-600">
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
      </div>

      <div className="mt-12">
        {/* Summary */}
        {cvData.personalInfo.summary && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed">
                {cvData.personalInfo.summary}
              </p>
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work History */}
        {cvData.workHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            </div>
            {cvData.workHistory.map((work, index) => (
              <div key={work.id} className="mb-6 relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{work.position}</h3>
                      <p className="text-blue-600 font-medium">{work.company}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {work.duration}
                    </div>
                  </div>
                  {work.responsibilities.length > 0 && (
                    <ul className="text-gray-700 mt-3 space-y-2">
                      {work.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white mr-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="mb-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600">{edu.institution}</p>
                    </div>
                    <div className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                      {edu.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {cvData.interests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white mr-3">
                <Heart className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Interests</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects && cvData.projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <Code className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{project.title}</h3>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cvData.languages && cvData.languages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Languages</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cvData.languages.map((language) => (
                <div key={language.id} className="bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg p-3">
                  <p className="font-semibold">{language.name}</p>
                  <p className="text-sm text-green-50">{language.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements & Awards */}
        {cvData.achievements && cvData.achievements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white mr-3">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Achievements & Awards</h2>
            </div>
            <div className="space-y-3">
              {cvData.achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg p-4">
                  <p className="font-bold text-sm mb-1">{achievement.title}</p>
                  <p className="text-sm leading-relaxed">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {cvData.references && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white mr-3">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">References</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
              <p className="text-gray-700">{cvData.references}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;