import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/lib/config';

export interface ThreatClassificationRequest {
  text: string;
  sourceId?: string;
}

export interface ThreatClassificationResponse {
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  categories: string[];
  confidence: number;
  provider: string;
}

async function classifyThreat(data: ThreatClassificationRequest): Promise<ThreatClassificationResponse> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/ai/threat/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Threat classification failed');
  }

  const result = await response.json();
  return result.data;
}

export function useThreatIntel() {
  const classifyMutation = useMutation({
    mutationFn: classifyThreat,
    onError: (error) => {
      console.error('Threat classification error:', error);
    }
  });

  return {
    classify: classifyMutation.mutateAsync,
    isClassifying: classifyMutation.isPending,
    error: classifyMutation.error
  };
}
