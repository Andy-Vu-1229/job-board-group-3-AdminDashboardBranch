import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { User, AuthContextType } from '../types';

const client = generateClient<Schema>();

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      // Check if user is stored in localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Query DynamoDB for user with matching email and password
      const { data: users } = await client.models.User.list({
        filter: {
          email: { eq: email },
          password: { eq: password }
        }
      });

      if (users && users.length > 0) {
        const userData = users[0];
        const user: User = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role!,
          phoneNumber: userData.phoneNumber || undefined,
          graduationYear: userData.graduationYear || undefined,
          companyName: userData.companyName || undefined,
          jobTitle: userData.jobTitle || undefined,
          industry: userData.industry || undefined,
          createdAt: userData.createdAt || undefined,
          updatedAt: userData.updatedAt || undefined,
        };
        
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};