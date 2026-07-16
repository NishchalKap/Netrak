import { create } from 'zustand';
import { caseApi } from '@/services/caseApi';
import { Case, CreateCaseInput, Evidence } from '../types';
import { getApiErrorMessage } from '@/services/apiError';
import { useUserStore } from './userStore';

type DataSource = 'idle' | 'online' | 'cached';

interface CaseState {
  cases: Case[];
  selectedCase: Case | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  mutationError: string | null;
  lastSyncedAt: string | null;
  source: DataSource;
  fetchCases: (force?: boolean) => Promise<Case[]>;
  fetchCaseById: (id: string) => Promise<Case | null>;
  createCase: (input: CreateCaseInput) => Promise<Case | null>;
  deleteCase: (id: string) => Promise<boolean>;
  addEvidence: (caseId: string, evidence: Omit<Evidence, 'id' | 'createdAt'>) => Promise<Evidence | null>;
  clearError: () => void;
}

let casesRequest: Promise<Case[]> | null = null;
let selectedCaseRequestId = 0;
const CASES_TTL_MS = 20000;

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  selectedCase: null,
  isLoading: false,
  isMutating: false,
  error: null,
  mutationError: null,
  lastSyncedAt: null,
  source: 'idle',
  fetchCases: async (force = false) => {
    if (casesRequest) return casesRequest;
    const { cases, lastSyncedAt } = get();
    if (!force && cases.length && isFresh(lastSyncedAt, CASES_TTL_MS)) return cases;
    set({ isLoading: true, error: null });
    casesRequest = caseApi.getCases()
      .then(async (items) => {
        const profile = useUserStore.getState().profile ?? await useUserStore.getState().fetchProfile();
        const visibleItems = profile?.role === 'CITIZEN'
          ? items.filter((item) => item.userId === profile.id)
          : items;
        const cases = visibleItems.map(normalizeCase);
        set({ cases, isLoading: false, source: 'online', lastSyncedAt: new Date().toISOString() });
        return cases;
      })
      .catch((error) => {
        const cached = get().cases;
        set({ isLoading: false, source: cached.length ? 'cached' : 'idle', error: getApiErrorMessage(error, 'Cases are unavailable. Pull to retry.') });
        return cached;
      })
      .finally(() => { casesRequest = null; });
    return casesRequest;
  },
  fetchCaseById: async (id) => {
    const requestId = ++selectedCaseRequestId;
    const cached = get().cases.find((item) => item.id === id) ?? null;
    set({ selectedCase: cached, isLoading: !cached, error: null });
    try {
      const remote = normalizeCase(await caseApi.getCaseById(id));
      const profile = useUserStore.getState().profile ?? await useUserStore.getState().fetchProfile();
      if (profile?.role === 'CITIZEN' && remote.userId !== profile.id) {
        throw new Error('This case is not available to your account.');
      }
      if (requestId === selectedCaseRequestId) {
        set((state) => ({ selectedCase: remote, cases: upsertCase(state.cases, remote), isLoading: false, source: 'online', lastSyncedAt: new Date().toISOString() }));
      }
      return remote;
    } catch (error) {
      if (requestId === selectedCaseRequestId) {
        set({ isLoading: false, source: cached ? 'cached' : 'idle', error: getApiErrorMessage(error, 'This case could not be loaded.') });
      }
      return cached;
    }
  },
  createCase: async (input) => {
    set({ isMutating: true, mutationError: null });
    try {
      const created = normalizeCase(await caseApi.createCase(input));
      set((state) => ({ cases: upsertCase(state.cases, created), selectedCase: created, isMutating: false, source: 'online' }));
      return created;
    } catch (error) {
      set({ isMutating: false, mutationError: getApiErrorMessage(error, 'Your report could not be submitted. Nothing was saved.') });
      return null;
    }
  },
  deleteCase: async (id) => {
    const previous = get().cases;
    const removed = previous.find((item) => item.id === id) ?? null;
    if (!removed) return false;
    set({ cases: previous.filter((item) => item.id !== id), selectedCase: null, isMutating: true, mutationError: null });
    try {
      await caseApi.deleteCase(id);
      set({ isMutating: false });
      return true;
    } catch (error) {
      set({ cases: previous, selectedCase: removed, isMutating: false, mutationError: getApiErrorMessage(error, 'The case was not deleted.') });
      return false;
    }
  },
  addEvidence: async (caseId, input) => {
    set({ isMutating: true, mutationError: null });
    try {
      const evidence = await caseApi.addEvidence(caseId, input);
      const current = get().cases.find((item) => item.id === caseId) ?? get().selectedCase;
      if (current?.id === caseId) {
        const updated: Case = {
          ...current,
          evidence: [evidence, ...(current.evidence ?? [])],
          updatedAt: evidence.createdAt,
        };
        set((state) => ({ cases: upsertCase(state.cases, updated), selectedCase: updated, isMutating: false, source: 'online' }));
      } else {
        set({ isMutating: false });
      }
      return evidence;
    } catch (error) {
      set({ isMutating: false, mutationError: getApiErrorMessage(error, 'Evidence could not be attached. Nothing was saved.') });
      return null;
    }
  },
  clearError: () => set({ error: null, mutationError: null }),
}));

function normalizeCase(item: Case): Case {
  return {
    ...item,
    status: item.status ?? 'OPEN',
    riskLevel: item.riskLevel ?? inferRisk(item.title, item.description),
    category: item.category ?? inferCategory(item.title, item.description),
    evidence: item.evidence ?? [],
    timeline: item.timeline ?? [],
  };
}

function upsertCase(cases: Case[], next: Case) {
  return cases.some((item) => item.id === next.id) ? cases.map((item) => item.id === next.id ? next : item) : [next, ...cases];
}

function isFresh(timestamp: string | null, ttl: number) {
  return Boolean(timestamp && Date.now() - new Date(timestamp).getTime() < ttl);
}

function inferCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('arrest') || text.includes('police')) return 'digital_arrest' as const;
  if (text.includes('upi') || text.includes('qr')) return 'upi_fraud' as const;
  if (text.includes('investment') || text.includes('trading')) return 'investment_scam' as const;
  if (text.includes('note') || text.includes('currency')) return 'counterfeit_currency' as const;
  if (text.includes('loan')) return 'loan_app' as const;
  if (text.includes('sim')) return 'sim_swap' as const;
  return 'other' as const;
}

function inferRisk(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('arrest') || text.includes('threat') || text.includes('large transfer')) return 'critical' as const;
  if (text.includes('upi') || text.includes('mule') || text.includes('qr')) return 'high' as const;
  return 'medium' as const;
}
