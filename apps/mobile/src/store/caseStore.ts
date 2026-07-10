import { create } from 'zustand';
import { caseApi } from '@/services/caseApi';
import { Case, CreateCaseInput, Evidence, UpdateCaseInput } from '../types';
import { makeLocalId } from '@/utils';

interface CaseState {
  cases: Case[];
  selectedCase: Case | null;
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  setCases: (cases: Case[]) => void;
  fetchCases: () => Promise<Case[]>;
  fetchCaseById: (id: string) => Promise<Case | null>;
  createCase: (input: CreateCaseInput) => Promise<Case>;
  updateCase: (id: string, input: UpdateCaseInput) => Promise<Case | null>;
  addEvidence: (caseId: string, evidence: Omit<Evidence, 'id' | 'createdAt'>) => Evidence | null;
  clearError: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: seedCases,
  selectedCase: null,
  isLoading: false,
  error: null,
  lastSyncedAt: null,
  setCases: (cases) => set({ cases: cases.map(normalizeCase), lastSyncedAt: new Date().toISOString() }),
  fetchCases: async () => {
    set({ isLoading: true, error: null });
    try {
      const cases = (await caseApi.getCases()).map(normalizeCase);
      set({ cases, isLoading: false, lastSyncedAt: new Date().toISOString() });
      return cases;
    } catch (error) {
      set((state) => ({
        cases: state.cases.length ? state.cases : seedCases,
        isLoading: false,
        error: getCaseErrorMessage(error),
      }));
      return get().cases;
    }
  },
  fetchCaseById: async (id) => {
    const cached = get().cases.find((caseItem) => caseItem.id === id) ?? null;
    set({ selectedCase: cached, error: null });

    try {
      const remoteCase = normalizeCase(await caseApi.getCaseById(id));
      set((state) => ({
        selectedCase: remoteCase,
        cases: upsertCase(state.cases, remoteCase),
      }));
      return remoteCase;
    } catch {
      return cached;
    }
  },
  createCase: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const remoteCase = normalizeCase(
        await caseApi.createCase({
          title: input.title,
          description: input.description,
        })
      );
      const createdCase = enrichCase(remoteCase, input);
      set((state) => ({
        cases: [createdCase, ...state.cases],
        selectedCase: createdCase,
        isLoading: false,
      }));
      return createdCase;
    } catch (error) {
      const localCase = createLocalCase(input);
      set((state) => ({
        cases: [localCase, ...state.cases],
        selectedCase: localCase,
        isLoading: false,
        error: getCaseErrorMessage(error),
      }));
      return localCase;
    }
  },
  updateCase: async (id, input) => {
    const current = get().cases.find((caseItem) => caseItem.id === id);
    if (!current) return null;

    try {
      const remoteCase = normalizeCase(await caseApi.updateCase(id, input));
      const updatedCase = { ...current, ...remoteCase, ...input, updatedAt: new Date().toISOString() };
      set((state) => ({
        cases: upsertCase(state.cases, updatedCase),
        selectedCase: updatedCase,
      }));
      return updatedCase;
    } catch {
      const updatedCase = { ...current, ...input, updatedAt: new Date().toISOString() };
      set((state) => ({
        cases: upsertCase(state.cases, updatedCase),
        selectedCase: updatedCase,
      }));
      return updatedCase;
    }
  },
  addEvidence: (caseId, evidenceInput) => {
    const existingCase = get().cases.find((caseItem) => caseItem.id === caseId);
    if (!existingCase) return null;

    const evidence: Evidence = {
      ...evidenceInput,
      id: makeLocalId('evidence'),
      createdAt: new Date().toISOString(),
    };
    const updatedCase: Case = {
      ...existingCase,
      evidence: [evidence, ...(existingCase.evidence ?? [])],
      timeline: [
        {
          id: makeLocalId('timeline'),
          title: 'Evidence added',
          detail: evidence.label,
          createdAt: evidence.createdAt,
        },
        ...(existingCase.timeline ?? []),
      ],
      updatedAt: evidence.createdAt,
    };

    set((state) => ({
      cases: upsertCase(state.cases, updatedCase),
      selectedCase: updatedCase,
    }));

    return evidence;
  },
  clearError: () => set({ error: null }),
}));

const now = new Date().toISOString();

const seedCases: Case[] = [
  {
    id: 'local-case-digital-arrest',
    title: 'Suspected digital arrest call',
    description: 'Caller claimed to be from cyber police and demanded a verification transfer.',
    status: 'IN_PROGRESS',
    category: 'digital_arrest',
    riskLevel: 'critical',
    location: 'Mumbai',
    createdAt: now,
    updatedAt: now,
    evidence: [],
    timeline: [
      {
        id: 'timeline-digital-arrest-opened',
        title: 'Case opened',
        detail: 'Complaint captured from citizen dashboard.',
        createdAt: now,
      },
    ],
  },
  {
    id: 'local-case-upi-qr',
    title: 'QR collect request fraud',
    description: 'Merchant reported a swapped QR code and two unauthorized collect requests.',
    status: 'OPEN',
    category: 'upi_fraud',
    riskLevel: 'high',
    location: 'Pune',
    createdAt: now,
    updatedAt: now,
    evidence: [],
    timeline: [
      {
        id: 'timeline-upi-opened',
        title: 'Report received',
        detail: 'Awaiting identifier verification.',
        createdAt: now,
      },
    ],
  },
];

function normalizeCase(caseItem: Case): Case {
  const timestamp = new Date().toISOString();

  return {
    ...caseItem,
    status: caseItem.status ?? 'OPEN',
    riskLevel: caseItem.riskLevel ?? inferRisk(caseItem.title, caseItem.description),
    category: caseItem.category ?? inferCategory(caseItem.title, caseItem.description),
    evidence: caseItem.evidence ?? [],
    timeline:
      caseItem.timeline ??
      [
        {
          id: makeLocalId('timeline'),
          title: 'Case created',
          detail: caseItem.status === 'CLOSED' ? 'Case is marked closed.' : 'Case is ready for review.',
          createdAt: caseItem.createdAt ?? timestamp,
        },
      ],
    createdAt: caseItem.createdAt ?? timestamp,
    updatedAt: caseItem.updatedAt ?? timestamp,
  };
}

function enrichCase(caseItem: Case, input: CreateCaseInput): Case {
  return {
    ...caseItem,
    category: input.category ?? caseItem.category,
    location: input.location ?? caseItem.location,
    riskLevel: input.riskLevel ?? caseItem.riskLevel,
  };
}

function createLocalCase(input: CreateCaseInput): Case {
  const createdAt = new Date().toISOString();

  return {
    id: makeLocalId('case'),
    title: input.title,
    description: input.description,
    status: input.riskLevel === 'critical' ? 'ESCALATED' : 'OPEN',
    category: input.category ?? inferCategory(input.title, input.description),
    riskLevel: input.riskLevel ?? inferRisk(input.title, input.description),
    location: input.location,
    evidence: [],
    timeline: [
      {
        id: makeLocalId('timeline'),
        title: input.riskLevel === 'critical' ? 'Emergency escalation created' : 'Report created',
        detail: input.description,
        createdAt,
      },
    ],
    createdAt,
    updatedAt: createdAt,
  };
}

function upsertCase(cases: Case[], nextCase: Case) {
  const exists = cases.some((caseItem) => caseItem.id === nextCase.id);
  if (!exists) return [nextCase, ...cases];
  return cases.map((caseItem) => (caseItem.id === nextCase.id ? nextCase : caseItem));
}

function inferCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('arrest') || text.includes('police')) return 'digital_arrest';
  if (text.includes('upi') || text.includes('qr')) return 'upi_fraud';
  if (text.includes('investment') || text.includes('trading')) return 'investment_scam';
  if (text.includes('note') || text.includes('currency')) return 'counterfeit_currency';
  if (text.includes('loan')) return 'loan_app';
  if (text.includes('sim')) return 'sim_swap';
  return 'other';
}

function inferRisk(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('arrest') || text.includes('threat') || text.includes('large transfer')) return 'critical';
  if (text.includes('upi') || text.includes('mule') || text.includes('qr')) return 'high';
  if (text.includes('loan') || text.includes('sim')) return 'medium';
  return 'medium';
}

function getCaseErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Case service unavailable';
}
