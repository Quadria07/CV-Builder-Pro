export interface PersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  skills: string[];
  workHistory: WorkExperience[];
  education: Education[];
  projects: Project[];
  languages: Language[];
  interests: string[];
  achievements: Achievement[];
  references: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  previewColor: string;
}