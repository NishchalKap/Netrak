import { AIProvider } from './provider.interface';

export interface LLMMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  text: string;
  provider: string;
  metadata?: Record<string, any>;
}

export interface LLMProvider extends AIProvider {
  /**
   * Send a prompt to the LLM and get a response
   */
  generate(request: LLMRequest): Promise<LLMResponse>;
}
