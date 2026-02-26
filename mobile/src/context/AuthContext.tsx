import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MotoristaData, LoginResponse } from '../types/auth';
import { saveMotoristaData, getMotoristaData, clearMotoristaData } from '../services/storage';
import { setUnauthorizedCallback } from '../services/api';

interface AuthContextData {
  user: MotoristaData | null;
  isLoading: boolean;
  signIn: (data: LoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MotoristaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = useCallback(async () => {
    await clearMotoristaData();
    setUser(null);
  }, []);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await getMotoristaData();
        if (storedUser) setUser(storedUser);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  useEffect(() => {
    setUnauthorizedCallback(handleSignOut);
  }, [handleSignOut]);

  const signIn = useCallback(async (data: LoginResponse) => {
    const motoristaData: MotoristaData = {
      id: data.id,
      username: data.username,
      token: data.token,
      userType: data.userType,
    };
    await saveMotoristaData(motoristaData);
    setUser(motoristaData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
