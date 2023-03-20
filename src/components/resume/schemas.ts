export interface JobInfo {
  company: string;
  location: string;
  logo?: string;
  title: string;
  start: string;
  end: string;
  showDetails?: boolean;
}

export type DegreeType = {
  degree: string;
  field?: string;
  institution: string;
  graduation: string;
  gpa?: string;
  hide?: boolean;
};

export type ProjectType = {
  name: string;
  tags?: string[];
  description: string;
  date: string;
  hide?: boolean;
  details?: boolean;
};
