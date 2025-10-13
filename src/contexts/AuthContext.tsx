import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
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
      // Check if user is authenticated with Cognito
      const cognitoUser = await getCurrentUser();
      
      if (cognitoUser) {
        // Fetch user attributes from Cognito
        const userAttributes = await fetchUserAttributes();
        
        // Fetch extended user data from DynamoDB
        const { data: userData } = await client.models.User.get({
          cognitoId: cognitoUser.userId
        });

        if (userData) {
          // Combine Cognito and DynamoDB data
          const fullUser: User = {
            cognitoId: userData.cognitoId,
            role: userData.role!,
            phoneNumber: userData.phoneNumber || undefined,
            firstName: userAttributes.given_name,
            lastName: userAttributes.family_name,
            email: userAttributes.email,
            graduationYear: userData.graduationYear || undefined,
            companyName: userData.companyName || undefined,
            jobTitle: userData.jobTitle || undefined,
            industry: userData.industry || undefined,
            createdAt: userData.createdAt || undefined,
            updatedAt: userData.updatedAt || undefined,
          };
          
          setUser(fullUser);
        } else {
          // User exists in Cognito but not in DynamoDB - sign them out
          console.warn('User exists in Cognito but not in DynamoDB');
          await signOut();
          setUser(null);
        }
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

  const login = async (_email: string, _password: string): Promise<void> => {
    // This function is called after successful Amplify signIn
    // to refresh the user state
    await checkAuthState();
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
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