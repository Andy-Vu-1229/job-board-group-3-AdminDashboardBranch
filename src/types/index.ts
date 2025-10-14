// Core type definitions for the Student Job Board application

export interface User {
  email: string;
  password?: string; // Optional for security (don't expose in UI)
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'COMPANY_REP' | 'ADMIN';
  phoneNumber?: string;
  // Student fields
  graduationYear?: number;
  // Company rep fields
  companyName?: string;
  jobTitle?: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMethod {
  type: 'EMAIL' | 'CAREERS_PAGE';
  value: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  industry: string;
  jobType: 'INTERNSHIP' | 'FULL_TIME' | 'CONTRACT';
  description: string;
  skills: string[];
  deadline: string;
  contactMethod: ContactMethod;
  postedBy: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'ARCHIVED';
  viewCount: number;
  applicationCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}