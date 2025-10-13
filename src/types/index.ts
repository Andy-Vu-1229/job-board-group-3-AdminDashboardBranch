// Core type definitions for the Student Job Board application

export interface User {
  cognitoId: string;
  role: 'STUDENT' | 'COMPANY_REP' | 'ADMIN';
  phoneNumber: string;
  // Cognito fields (will be fetched separately)
  firstName?: string;
  lastName?: string;
  email?: string;
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