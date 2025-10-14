// Mock data for development and testing
import { JobPosting, User } from '../types';

export const mockUsers: User[] = [
  {
    email: 'student@university.edu',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT',
    phoneNumber: '555-0123',
    graduationYear: 2025,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    email: 'admin@university.edu',
    password: 'password',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    role: 'ADMIN',
    phoneNumber: '555-0456',
    createdAt: '2024-01-10T09:00:00Z',
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    jobType: 'INTERNSHIP',
    description: 'Join our dynamic team as a Software Engineering Intern and gain hands-on experience with cutting-edge technologies. You will work alongside senior developers on real-world projects that impact thousands of users.',
    skills: ['JavaScript', 'React', 'Git', 'Problem Solving'],
    deadline: '2024-10-15T23:59:59Z',
    contactMethod: {
      type: 'EMAIL',
      value: 'internships@techcorp.com'
    },
    postedBy: '2',
    status: 'APPROVED',
    viewCount: 45,
    applicationCount: 12,
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Marketing Assistant',
    company: 'Creative Agency Plus',
    industry: 'Marketing & Advertising',
    jobType: 'FULL_TIME',
    description: 'We are seeking a creative and motivated Marketing Assistant to join our growing team. This role offers excellent opportunities for professional development in digital marketing and brand management.',
    skills: ['Communication', 'Social Media', 'Microsoft Office', 'Creativity'],
    deadline: '2024-10-30T23:59:59Z',
    contactMethod: {
      type: 'CAREERS_PAGE',
      value: 'https://creativeagencyplus.com/careers'
    },
    postedBy: '2',
    status: 'APPROVED',
    viewCount: 32,
    applicationCount: 8,
    createdAt: '2024-09-22T14:30:00Z',
    updatedAt: '2024-09-22T14:30:00Z'
  }
];

// Mock authentication function
export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock authentication
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    return user;
  }
  
  throw new Error('Invalid email or password');
};