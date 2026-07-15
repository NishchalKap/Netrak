import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { caseRepository, notificationRepository, systemRepository, threatRepository } from './repositories';
import type { CaseRecord, CaseStatus, EvidenceType } from '@/types';

const pollInterval = Number(import.meta.env.VITE_POLL_INTERVAL || 60000);

export const queryKeys = {
  cases: ['cases'] as const,
  case: (id: string) => ['cases', id] as const,
  threats: ['threats'] as const,
  notifications: ['notifications'] as const,
  health: ['health'] as const,
};

export function useCases() {
  return useQuery({ queryKey: queryKeys.cases, queryFn: ({ signal }) => caseRepository.list(signal), staleTime: 15000, gcTime: 600000, refetchInterval: pollInterval, networkMode: 'offlineFirst' });
}

export function useCase(id: string) {
  const client = useQueryClient();
  return useQuery({ queryKey: queryKeys.case(id), queryFn: ({ signal }) => caseRepository.detail(id, signal), enabled: Boolean(id), staleTime: 15000, gcTime: 600000, initialData: () => client.getQueryData<CaseRecord[]>(queryKeys.cases)?.find((item) => item.id === id), networkMode: 'offlineFirst' });
}

export function useThreats() {
  return useQuery({ queryKey: queryKeys.threats, queryFn: ({ signal }) => threatRepository.list(signal), staleTime: 60000, gcTime: 900000, refetchInterval: pollInterval, networkMode: 'offlineFirst' });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: ({ signal }) => notificationRepository.list(signal), staleTime: 30000, gcTime: 600000, refetchInterval: pollInterval, networkMode: 'offlineFirst' });
}

export function useHealth() {
  return useQuery({ queryKey: queryKeys.health, queryFn: ({ signal }) => systemRepository.health(signal), staleTime: 15000, refetchInterval: pollInterval });
}

export function useCaseActions() {
  const client = useQueryClient();
  const refresh = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.cases }),
      id ? client.invalidateQueries({ queryKey: queryKeys.case(id) }) : Promise.resolve(),
    ]);
  };
  const createCase = useMutation({ mutationFn: caseRepository.create, onSuccess: () => refresh() });
  const updateCase = useMutation({ mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string; status?: CaseStatus } }) => caseRepository.update(id, data), onSuccess: (_, variables) => refresh(variables.id) });
  const deleteCase = useMutation({ mutationFn: caseRepository.remove, onSuccess: () => refresh() });
  const addEvidence = useMutation({ mutationFn: ({ id, data }: { id: string; data: { type: EvidenceType; label: string; reference: string; notes?: string } }) => caseRepository.addEvidence(id, data), onSuccess: (_, variables) => refresh(variables.id) });
  return { createCase, updateCase, deleteCase, addEvidence };
}
