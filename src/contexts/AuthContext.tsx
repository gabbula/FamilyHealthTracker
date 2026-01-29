import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  enable2FA: () => Promise<string>;
  verify2FA: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulated login - in production, this would call Firebase Auth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
      twoFactorEnabled: false,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, _password: string, name: string) => {
    // Simulated signup - in production, this would call Firebase Auth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date(),
      twoFactorEnabled: false,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const enable2FA = async (): Promise<string> => {
    // Simulated 2FA setup - returns QR code or secret
    if (user) {
      const updatedUser = { ...user, twoFactorEnabled: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return 'MOCK2FASECRET123456';
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    // Simulated 2FA verification
    return code === '123456';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    enable2FA,
    verify2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
