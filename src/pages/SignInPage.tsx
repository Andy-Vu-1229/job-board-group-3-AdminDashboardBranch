import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, confirmSignUp, SignInInput } from 'aws-amplify/auth';
import { useAuth } from '../hooks/useAuth';
import './SignInPage.css';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const signInInput: SignInInput = {
        username: email,
        password: password,
      };

      const { isSignedIn, nextStep } = await signIn(signInInput);

      if (isSignedIn) {
        // Let the AuthContext handle the user state update
        await login(email, password);
        navigate('/dashboard');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setShowVerification(true);
        setError('Please enter the verification code sent to your email.');
      } else if (nextStep.signInStep === 'RESET_PASSWORD') {
        setError('Password reset required. Please check your email for reset instructions.');
      } else {
        console.log('Sign in next step:', nextStep);
        setError('Sign in incomplete. Please try again or contact support.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);

      // Handle specific Amplify Auth errors
      if (err.name === 'NotAuthorizedException') {
        setError('Invalid email or password. Please try again.');
      } else if (err.name === 'UserNotFoundException') {
        setError('No account found with this email address. Please check your email or create an account.');
      } else if (err.name === 'TooManyRequestsException') {
        setError('Too many failed attempts. Please wait a moment before trying again.');
      } else if (err.name === 'LimitExceededException') {
        setError('Account temporarily locked due to too many failed attempts. Please try again later.');
      } else {
        setError(err.message || 'An error occurred during sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      // Now try to sign in again
      const signInInput: SignInInput = {
        username: email,
        password: password,
      };

      const { isSignedIn } = await signIn(signInInput);

      if (isSignedIn) {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Verification error:', err);

      if (err.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please try again.');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>DawgsConnect</h1>
          <p>University of Georgia Student Job Board</p>
          <p className="signin-subtitle">Sign in to access job opportunities</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby={error ? "error-message" : undefined}
              className={error ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby={error ? "error-message" : undefined}
              className={error ? 'error' : ''}
            />
          </div>

          {error && (
            <div id="error-message" className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="signin-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Email Verification Form */}
        {showVerification && (
          <div className="verification-section">
            <h3>Email Verification Required</h3>
            <p>Please enter the verification code sent to {email}</p>

            <form onSubmit={handleVerification} className="verification-form">
              <div className="form-group">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          </div>
        )}

        <div className="create-account-link">
          <p>Don't have an account? <a href="/create-account">Create one here</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;