
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, MOCK_DATA } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  connectGitHub: () => Promise<void>;
  connectLeetCode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would check for session/token and fetch user data
        // For demo purposes, we'll use mock data with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, check localStorage for auth state
        const savedUser = localStorage.getItem('achievo_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes we'll use the mock data
      const mockUser = MOCK_DATA.user;
      setUser(mockUser);
      localStorage.setItem('achievo_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user based on mock data
      const newUser: User = {
        ...MOCK_DATA.user,
        id: `user-${Date.now()}`,
        name,
        email,
        created_at: new Date().toISOString(),
        integrations: {
          github: false,
          leetcode: false
        }
      };
      
      setUser(newUser);
      localStorage.setItem('achievo_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('achievo_user');
  };

  const connectGitHub = async () => {
    setIsLoading(true);
    try {
      // Simulate GitHub OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          integrations: {
            ...user.integrations,
            github: true
          }
        };
        setUser(updatedUser);
        localStorage.setItem('achievo_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('GitHub connection failed', error);
      throw new Error('GitHub connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const connectLeetCode = async () => {
    setIsLoading(true);
    try {
      // Simulate LeetCode API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          integrations: {
            ...user.integrations,
            leetcode: true
          }
        };
        setUser(updatedUser);
        localStorage.setItem('achievo_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('LeetCode connection failed', error);
      throw new Error('LeetCode connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        connectGitHub,
        connectLeetCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
