import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FamilyData } from '../types/family';
import { getRelationshipToUser } from '../utils/familyRelations';

interface AuthContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  getRelationship: (memberId: string, familyData: FamilyData) => string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [username, setUsernameState] = useState<string | null>(() => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername || null;
  });

  // Wrapper for setUsername that also updates localStorage
  const setUsername = (newUsername: string | null) => {
    setUsernameState(newUsername);
    if (newUsername) {
      localStorage.setItem('username', newUsername);
    } else {
      localStorage.removeItem('username');
    }
  };

  // Add logout function
  const logout = () => {
    setUsernameState(null);
    localStorage.removeItem('username');
  };

  const getRelationship = (memberId: string, familyData: FamilyData): string => {
    return getRelationshipToUser(memberId, username, familyData);
  };

  return (
    <AuthContext.Provider value={{ username, setUsername, getRelationship, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 