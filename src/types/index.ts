// Core type definitions for the Student Job Board application

export interface User {
  id: string;
  email: string;
  role: 'student' | 'faculty' | 'staff' | 'company_rep' | 'admin';
  firstName: string;
  lastName: string;
  department?: string;
  company?: string;
  createdAt: string;
  lastLogin: string;
}

export interface ContactMethod {
  type: 'email' | 'careers_page' | 'phone';
  value: string;
  instructions?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  jobType: 'internship' | 'full-time' | 'contract';
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  applicationDeadline: string;
  contactMethod: ContactMethod;
  postedBy: string;
  approvedBy?: string;
  status: 'draft' | 'pending' | 'approved' | 'archived';
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  applicationCount: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}