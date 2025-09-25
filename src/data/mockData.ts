// Mock data for development and testing
import { JobPosting, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@university.edu',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Computer Science',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-09-24T08:30:00Z'
  },
  {
    id: '2',
    email: 'faculty@university.edu',
    role: 'faculty',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    department: 'Engineering',
    createdAt: '2024-01-10T09:00:00Z',
    lastLogin: '2024-09-23T14:20:00Z'
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    companyName: 'TechCorp Solutions',
    industry: 'Technology',
    jobType: 'internship',
    description: 'Join our dynamic team as a Software Engineering Intern and gain hands-on experience with cutting-edge technologies. You will work alongside senior developers on real-world projects that impact thousands of users.',
    responsibilities: [
      'Develop and maintain web applications using React and Node.js',
      'Participate in code reviews and team meetings',
      'Write unit tests and documentation',
      'Collaborate with cross-functional teams'
    ],
    requiredSkills: ['JavaScript', 'React', 'Git', 'Problem Solving'],
    preferredSkills: ['TypeScript', 'Node.js', 'AWS', 'Agile Methodologies'],
    applicationDeadline: '2024-10-15T23:59:59Z',
    contactMethod: {
      type: 'email',
      value: 'internships@techcorp.com',
      instructions: 'Please include your resume and a brief cover letter explaining your interest in the position.'
    },
    postedBy: '2',
    approvedBy: '2',
    status: 'approved',
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z',
    viewCount: 45,
    applicationCount: 12
  },
  {
    id: '2',
    title: 'Marketing Assistant',
    companyName: 'Creative Agency Plus',
    industry: 'Marketing & Advertising',
    jobType: 'full-time',
    description: 'We are seeking a creative and motivated Marketing Assistant to join our growing team. This role offers excellent opportunities for professional development in digital marketing and brand management.',
    responsibilities: [
      'Assist with social media content creation and management',
      'Support marketing campaign development and execution',
      'Conduct market research and competitor analysis',
      'Help organize marketing events and promotional activities'
    ],
    requiredSkills: ['Communication', 'Social Media', 'Microsoft Office', 'Creativity'],
    preferredSkills: ['Adobe Creative Suite', 'Google Analytics', 'Content Writing', 'Project Management'],
    applicationDeadline: '2024-10-30T23:59:59Z',
    contactMethod: {
      type: 'careers_page',
      value: 'https://creativeagencyplus.com/careers',
      instructions: 'Apply through our careers page and upload your portfolio along with your resume.'
    },
    postedBy: '2',
    approvedBy: '2',
    status: 'approved',
    createdAt: '2024-09-22T14:30:00Z',
    updatedAt: '2024-09-22T14:30:00Z',
    viewCount: 32,
    applicationCount: 8
  },
  {
    id: '3',
    title: 'Data Science Research Assistant',
    companyName: 'University Research Lab',
    industry: 'Research & Development',
    jobType: 'contract',
    description: 'Join our research team to work on cutting-edge data science projects in healthcare analytics. This position offers valuable research experience and the opportunity to contribute to published academic work.',
    responsibilities: [
      'Analyze large healthcare datasets using Python and R',
      'Develop machine learning models for predictive analytics',
      'Create data visualizations and research reports',
      'Present findings to research team and stakeholders'
    ],
    requiredSkills: ['Python', 'Statistics', 'Data Analysis', 'Research Methods'],
    preferredSkills: ['R', 'Machine Learning', 'SQL', 'Healthcare Knowledge'],
    applicationDeadline: '2024-11-01T23:59:59Z',
    contactMethod: {
      type: 'email',
      value: 'research@university.edu',
      instructions: 'Send resume, transcript, and a brief statement of research interests.'
    },
    postedBy: '2',
    approvedBy: '2',
    status: 'approved',
    createdAt: '2024-09-18T09:15:00Z',
    updatedAt: '2024-09-18T09:15:00Z',
    viewCount: 28,
    applicationCount: 5
  },
  {
    id: '4',
    title: 'UX/UI Design Intern',
    companyName: 'Design Studio Pro',
    industry: 'Design & Creative',
    jobType: 'internship',
    description: 'Gain hands-on experience in user experience and interface design while working on real client projects. Perfect opportunity for students passionate about creating intuitive and beautiful digital experiences.',
    responsibilities: [
      'Create wireframes and prototypes for web and mobile applications',
      'Conduct user research and usability testing',
      'Collaborate with developers to implement designs',
      'Participate in design critiques and brainstorming sessions'
    ],
    requiredSkills: ['Design Thinking', 'Figma', 'User Research', 'Communication'],
    preferredSkills: ['Adobe XD', 'Sketch', 'HTML/CSS', 'Animation'],
    applicationDeadline: '2024-10-20T23:59:59Z',
    contactMethod: {
      type: 'email',
      value: 'design-internships@designstudiopro.com',
      instructions: 'Please include your portfolio link and explain why you are interested in UX/UI design.'
    },
    postedBy: '2',
    approvedBy: '2',
    status: 'approved',
    createdAt: '2024-09-21T11:45:00Z',
    updatedAt: '2024-09-21T11:45:00Z',
    viewCount: 67,
    applicationCount: 18
  },
  {
    id: '5',
    title: 'Financial Analyst Trainee',
    companyName: 'Global Finance Corp',
    industry: 'Finance & Banking',
    jobType: 'full-time',
    description: 'Start your finance career with our comprehensive trainee program. You will receive mentorship from senior analysts while working on real financial modeling and investment analysis projects.',
    responsibilities: [
      'Build financial models and perform valuation analysis',
      'Prepare investment research reports',
      'Support senior analysts with client presentations',
      'Monitor market trends and economic indicators'
    ],
    requiredSkills: ['Excel', 'Financial Analysis', 'Analytical Thinking', 'Attention to Detail'],
    preferredSkills: ['Bloomberg Terminal', 'VBA', 'SQL', 'CFA Level 1'],
    applicationDeadline: '2024-11-15T23:59:59Z',
    contactMethod: {
      type: 'careers_page',
      value: 'https://globalfinancecorp.com/careers/trainee-program',
      instructions: 'Complete our online application and assessment. Strong academic performance required.'
    },
    postedBy: '2',
    approvedBy: '2',
    status: 'approved',
    createdAt: '2024-09-19T16:20:00Z',
    updatedAt: '2024-09-19T16:20:00Z',
    viewCount: 41,
    applicationCount: 15
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