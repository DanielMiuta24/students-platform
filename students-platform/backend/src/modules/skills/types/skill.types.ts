export enum ProficiencyLevel {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
  expert = 'expert',
}

export interface SkillEntry {
  name: string;
  escoUri?: string;
  proficiency: ProficiencyLevel;
  verified: boolean;
}

export interface LanguageEntry {
  language: string;
  level: string; // A1 | A2 | B1 | B2 | C1 | C2 | Native
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year?: number;
  url?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  current: boolean;
}

export interface SkillProfileDTO {
  skills?: SkillEntry[];
  languages?: LanguageEntry[];
  certifications?: CertificationEntry[];
  education?: EducationEntry[];
  headline?: string;
  isPublic?: boolean;
}

export interface SearchProfilesParams {
  skill?: string;
  language?: string;
  page?: number;
  limit?: number;
}
