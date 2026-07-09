import { create } from 'zustand';
import { Case } from '../types';

interface CaseState {
  cases: Case[];
  setCases: (cases: Case[]) => void;
}

export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  setCases: (cases) => set({ cases }),
}));
