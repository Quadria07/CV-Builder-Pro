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

export interface CVData {
  personalInfo: PersonalInfo;
  skills: string[];
  workHistory: WorkExperience[];
  education: Education[];
  interests: string[];
  references: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  previewColor: string;
}