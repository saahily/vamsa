import React, { createContext, useContext, useState } from 'react';
import { Viewport } from 'reactflow';
import { sampleFamilyData } from '../data/sampleData';

interface FamilyTreeState {
  currentYear: number;
  focusedMemberId: string | null;
  viewport: Viewport | null;
}

interface FamilyTreeContextType {
  state: FamilyTreeState;
  setState: (state: Partial<FamilyTreeState>) => void;
  resetState: () => void;
}

const initialState: FamilyTreeState = {
  currentYear: new Date().getFullYear(),
  focusedMemberId: null,
  viewport: null,
};

const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined);

export function FamilyTreeProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<FamilyTreeState>(initialState);

  const setState = (newState: Partial<FamilyTreeState>) => {
    setStateInternal(prev => ({ ...prev, ...newState }));
  };

  const resetState = () => {
    setStateInternal(initialState);
  };

  return (
    <FamilyTreeContext.Provider value={{ state, setState, resetState }}>
      {children}
    </FamilyTreeContext.Provider>
  );
}

export function useFamilyTree() {
  const context = useContext(FamilyTreeContext);
  if (context === undefined) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
}