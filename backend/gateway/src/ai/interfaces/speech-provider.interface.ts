import { AIProvider } from './provider.interface';

export interface TranscriptionRequest {
  audioBuffer: Buffer;
  mimetype: string;
  language?: string;
  model?: string;
}

export interface TranscriptionResponse {
  text: string;
  language: string;
  confidence?: number;
  provider: string;
  metadata?: Record<string, any>;
}

export interface SpeechProvider extends AIProvider {
  /**
   * Transcribe audio to text
   */
  transcribe(request: TranscriptionRequest): Promise<TranscriptionResponse>;
}
