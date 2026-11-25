export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  scope: string;
  highlights: string[];
  tags: string[];
  hasGisDemo?: boolean;
}
