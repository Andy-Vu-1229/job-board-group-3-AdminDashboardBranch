import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import './CreateAccountPage.css';

const client = generateClient<Schema>();

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  // Student fields
  graduationYear: string;
  // Company rep fields
  companyName: string;
  jobTitle: string;
  industry: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  graduationYear?: string;
  companyName?: string;
  jobTitle?: string;
  industry?: string;
  general?: string;
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
    graduationYear: '',
    companyName: '',
    jobTitle: '',
    industry: ''
  });



  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

      case 'graduationYear':
        if (formData.role === 'STUDENT' && !value) return 'Graduation year is required for students';
        return '';

      case 'companyName':
        if (formData.role === 'COMPANY_REP' && !value.trim()) return 'Company name is required';
        return '';

      case 'jobTitle':
        if (formData.role === 'COMPANY_REP' && !value.trim()) return 'Job title is required';
        return '';

      case 'industry':
        if (formData.role === 'COMPANY_REP' && !value) return 'Industry is required';
        return '';

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
        case 'STUDENT':
          requiredFields = [...baseFields, 'graduationYear'];
          break;
        case 'COMPANY_REP':
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
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const signUpInput: SignUpInput = {
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName,
            phone_number: formData.phoneNumber,
          },
        },
      };

      const { isSignUpComplete, userId } = await signUp(signUpInput);

      if (isSignUpComplete) {
        // Create user record in DynamoDB
        await createUserRecord(userId!);
        alert('Account created successfully! You can now sign in.');
        navigate('/signin');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.name === 'UsernameExistsException') {
        setErrors(prev => ({ ...prev, general: 'An account with this email already exists.' }));
      } else if (error.name === 'InvalidPasswordException') {
        setErrors(prev => ({ ...prev, general: 'Password does not meet requirements.' }));
      } else if (error.name === 'InvalidParameterException') {
        setErrors(prev => ({ ...prev, general: 'Invalid email format or other parameter error.' }));
      } else {
        setErrors(prev => ({ ...prev, general: error.message || 'Error creating account. Please try again.' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const createUserRecord = async (cognitoId: string) => {
    try {
      const userData: any = {
        cognitoId,
        role: formData.role as 'STUDENT' | 'COMPANY_REP' | 'ADMIN',
        phoneNumber: formData.phoneNumber,
      };

      // Add role-specific fields
      if (formData.role === 'STUDENT') {
        userData.graduationYear = parseInt(formData.graduationYear);
      } else if (formData.role === 'COMPANY_REP') {
        userData.companyName = formData.companyName;
        userData.jobTitle = formData.jobTitle;
        userData.industry = formData.industry;
      }

      await client.models.User.create(userData);
    } catch (error) {
      console.error('Error creating user record:', error);
      throw new Error('Failed to create user profile');
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
                    value="STUDENT"
                    checked={formData.role === 'STUDENT'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">MIS Student</span>
                </label>



                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="COMPANY_REP"
                    checked={formData.role === 'COMPANY_REP'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Company Representative</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={formData.role === 'ADMIN'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                  <span className="radio-label">Admin</span>
                </label>
              </div>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>
          </div>

          {/* Student-specific fields */}
          {formData.role === 'STUDENT' && (
            <div className="form-section">
              <h2>MIS Student Information</h2>
              <p className="section-description">
                Welcome to the MIS program! Please provide your expected graduation year to help us connect you with relevant opportunities.
              </p>

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
          )}

          {/* Company rep-specific fields */}
          {formData.role === 'COMPANY_REP' && (
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


              </div>
            </div>
          )}

          {errors.general && (
            <div className="error-message" role="alert">
              {errors.general}
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