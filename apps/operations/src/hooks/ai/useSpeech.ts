import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/lib/config';

export interface TranscriptionRequest {
  file: File;
  referenceId?: string;
  language?: string;
  model?: string;
}

export interface TranscriptionResponse {
  text: string;
  language: string;
  confidence?: number;
  provider: string;
  metadata?: any;
}

async function transcribeAudio(data: TranscriptionRequest): Promise<TranscriptionResponse> {
  const formData = new FormData();
  formData.append('file', data.file);
  
  if (data.referenceId) formData.append('referenceId', data.referenceId);
  if (data.language) formData.append('language', data.language);
  if (data.model) formData.append('model', data.model);

  // Fallback to fetch if api client doesn't support FormData well
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/ai/speech/transcribe`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Transcription failed');
  }

  const result = await response.json();
  return result.data;
}

export function useSpeech() {
  const transcribeMutation = useMutation({
    mutationFn: transcribeAudio,
    onError: (error) => {
      console.error('Speech transcription error:', error);
    }
  });

  return {
    transcribe: transcribeMutation.mutateAsync,
    isTranscribing: transcribeMutation.isPending,
    error: transcribeMutation.error
  };
}
