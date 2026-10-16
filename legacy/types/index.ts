export interface SequenceConfig {
  /** Unique key, also the folder name under /public/frames. */
  id: 'hero' | 'mid' | 'skills';
  /** Total number of frames in the sequence. */
  count: number;
  /** Human readable description used for the canvas aria-label. */
  alt: string;
}

export interface SkillGroup {
  title: string;
  items: readonly string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  demo?: string;
  repo?: string;
  metric?: { value: string; label: string };
}

export interface ServiceItem {
  index: string;
  title: string;
  description: string;
  deliverables: readonly string[];
}

export interface EducationItem {
  institution: string;
  qualification: string;
  period: string;
  location: string;
  result: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
}

export interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}
