import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, LoginCredentials, SignUpCredentials } from '../types/user';
import { login, signUp, logout } from './authService';
import { 
  getUserData, 
  storeUserData, 
  getToken, 
  storeToken, 
  clearStorage 
} from '../utils/secureStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  error: string | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context with default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSigningIn: false,
  isSigningUp: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

// Auth provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getToken();
        if (token) {
          const userData = await getUserData();
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to load user data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Sign in function
  const signInUser = async (credentials: LoginCredentials) => {
    setIsSigningIn(true);
    setError(null);
    
    try {
      const user = await login(credentials);
      await storeUserData(user);
      await storeToken('mock-jwt-token'); // In a real app, this would be a JWT from the API
      setUser(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during sign in');
      throw e; // Re-throw to allow caller to handle
    } finally {
      setIsSigningIn(false);
    }
  };

  // Sign up function
  const signUpUser = async (credentials: SignUpCredentials) => {
    setIsSigningUp(true);
    setError(null);
    
    try {
      const user = await signUp(credentials);
      await storeUserData(user);
      await storeToken('mock-jwt-token'); // In a real app, this would be a JWT from the API
      setUser(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during sign up');
      throw e; // Re-throw to allow caller to handle
    } finally {
      setIsSigningUp(false);
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await logout(); // API call if needed
      await clearStorage();
      setUser(null);
    } catch (e) {
      console.error('Error signing out:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        isSigningIn,
        isSigningUp,
        error,
        signIn: signInUser,
        signUp: signUpUser,
        signOut: signOutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 