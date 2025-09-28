import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccountPage.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  // Student fields
  major: string;
  graduationYear: string;
  // Faculty fields
  department: string;
  // Company rep fields
  companyName: string;
  jobTitle: string;
  industry: string;
  website: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  major?: string;
  graduationYear?: string;
  department?: string;
  companyName?: string;
  jobTitle?: string;
  industry?: string;
  website?: string;
}

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    major: '',
    graduationYear: '',
    department: '',
    companyName: '',
    jobTitle: '',
    industry: '',
    website: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Mock data for departments
  const departments = [
    { value: '', label: 'Select Department' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business', label: 'Business' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Physics', label: 'Physics' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Economics', label: 'Economics' }
  ];

  const industries = [
    { value: '', label: 'Select Industry' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Media', label: 'Media' },
    { value: 'Non-profit', label: 'Non-profit' },
    { value: 'Government', label: 'Government' },
    { value: 'Other', label: 'Other' }
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';

      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';

      case 'email': {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      }

      case 'phoneNumber': {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-()]{10,}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) return 'Please enter a valid phone number';
        return '';
      }

      case 'password': {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return '';
      }

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      case 'role':
        if (!value) return 'Please select a role';
        return '';

      case 'major':
        if (formData.role === 'student' && !value.trim()) return 'Major is required for students';
        return '';

      case 'graduationYear':
        if (formData.role === 'student' && !value) return 'Graduation year is required for students';
        return '';

      case 'department':
        if (formData.role === 'faculty' && !value) return 'Department is required for faculty';
        return '';

      case 'companyName':
        if (formData.role === 'company_rep' && !value.trim()) return 'Company name is required';
        return '';

      case 'jobTitle':
        if (formData.role === 'company_rep' && !value.trim()) return 'Job title is required';
        return '';

      case 'industry':
        if (formData.role === 'company_rep' && !value) return 'Industry is required';
        return '';

      case 'website': {
        if (formData.role === 'company_rep' && value.trim()) {
          const urlRegex = /^https?:\/\/.+\..+/;
          if (!urlRegex.test(value)) return 'Please enter a valid URL (starting with http:// or https://)';
        }
        return '';
      }

      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Also validate confirm password if password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };



  useEffect(() => {
    const checkFormValidity = () => {
      const baseFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword', 'role'];
      let requiredFields = baseFields;

      switch (formData.role) {
        case 'student':
          requiredFields = [...baseFields, 'major', 'graduationYear'];
          break;
        case 'faculty':
          requiredFields = [...baseFields, 'department'];
          break;
        case 'company_rep':
          requiredFields = [...baseFields, 'companyName', 'jobTitle', 'industry'];
          break;
        default:
          requiredFields = baseFields;
      }

      const hasAllFields = requiredFields.every(field => {
        const value = formData[field as keyof FormData];
        return value && value.toString().trim() !== '';
      });

      const hasNoErrors = Object.values(errors).every(error => !error);

      setIsFormValid(hasAllFields && hasNoErrors);
    };

    checkFormValidity();
  }, [formData, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      alert('Account created successfully! Please check your email to verify your account.');

      // Navigate back to sign in
      navigate('/signin');

    } catch (error) {
      alert('Error creating account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <div className="create-account-header">
          <button
            onClick={handleBackToSignIn}
            className="back-button"
            aria-label="Back to sign in"
          >
            ← Back to Sign In
          </button>
          <h1>Create Your Account</h1>
          <p>Join the DawgsConnect community</p>
        </div>

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-section">
            <h2>Personal Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create a strong password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Role Selection</h2>

            <div className="form-group">
              <label>Select Your Role *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Student</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={formData.role === 'faculty'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Faculty</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="company_rep"
                    checked={formData.role === 'company_rep'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Company Representative</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Admin</span>
                </label>
              </div>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>
          </div>

          {/* Student-specific fields */}
          {formData.role === 'student' && (
            <div className="form-section">
              <h2>Student Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="major">Major *</label>
                  <input
                    type="text"
                    id="major"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className={errors.major ? 'error' : ''}
                    placeholder="e.g., Computer Science"
                  />
                  {errors.major && <span className="error-text">{errors.major}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="graduationYear">Expected Graduation Year *</label>
                  <select
                    id="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className={errors.graduationYear ? 'error' : ''}
                  >
                    <option value="">Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.graduationYear && <span className="error-text">{errors.graduationYear}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Faculty-specific fields */}
          {formData.role === 'faculty' && (
            <div className="form-section">
              <h2>Faculty Information</h2>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={errors.department ? 'error' : ''}
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>
            </div>
          )}

          {/* Company rep-specific fields */}
          {formData.role === 'company_rep' && (
            <div className="form-section">
              <h2>Company Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={errors.companyName ? 'error' : ''}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="jobTitle">Your Job Title *</label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className={errors.jobTitle ? 'error' : ''}
                    placeholder="e.g., HR Manager"
                  />
                  {errors.jobTitle && <span className="error-text">{errors.jobTitle}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industry">Industry *</label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={errors.industry ? 'error' : ''}
                  >
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                  {errors.industry && <span className="error-text">{errors.industry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="website">Company Website</label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={errors.website ? 'error' : ''}
                    placeholder="https://company.com"
                  />
                  {errors.website && <span className="error-text">{errors.website}</span>}
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;