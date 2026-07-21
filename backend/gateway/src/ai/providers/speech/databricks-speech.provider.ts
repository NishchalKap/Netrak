import { SpeechProvider, TranscriptionRequest, TranscriptionResponse } from '../../interfaces/speech-provider.interface';
import { env } from '../../../config/env';
import { AppError } from '../../../common/AppError';
import { logger } from '../../../common/logger';

export class DatabricksSpeechProvider implements SpeechProvider {
  public readonly name = 'databricks';
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly maxRetries = 3;
  private readonly timeoutMs = 30000;

  constructor() {
    if (!env.DATABRICKS_SPEECH_URL || !env.DATABRICKS_API_KEY) {
      // Don't throw immediately to allow app to start, but health check will fail
      logger.warn('Databricks configuration is missing. SpeechProvider will fail health checks.');
    }
    this.baseUrl = env.DATABRICKS_SPEECH_URL || '';
    this.apiKey = env.DATABRICKS_API_KEY || '';
  }

  async healthCheck(): Promise<boolean> {
    if (!this.baseUrl || !this.apiKey) return false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: controller.signal
      });
      clearTimeout(timeout);
      return response.ok;
    } catch (error) {
      logger.error('Databricks SpeechProvider health check failed', { error });
      return false;
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
        
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          return response;
        }

        if (response.status >= 500 || response.status === 429) {
          // Retryable errors
          throw new AppError(`Provider error: ${response.statusText}`, response.status);
        } else {
          // Non-retryable
          const errBody = await response.text().catch(() => 'Unknown error');
          throw new AppError(`Provider request failed: ${errBody}`, response.status);
        }
      } catch (error: any) {
        lastError = error;
        if (error.name === 'AbortError') {
          lastError = new AppError('Provider request timed out', 504);
        }
        
        // Don't retry if it's a 4xx error (except 429)
        if (lastError instanceof AppError && lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          throw lastError;
        }

        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          logger.warn(`Retrying Databricks request (attempt ${attempt}/${this.maxRetries}) after ${Math.round(delay)}ms`);
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    
    throw lastError;
  }

  async transcribe(request: TranscriptionRequest): Promise<TranscriptionResponse> {
    if (!this.baseUrl || !this.apiKey) {
      throw new AppError('Databricks SpeechProvider is not configured', 503);
    }

    const base64Audio = Buffer.from(request.audioBuffer).toString('base64');
    
    const payload = {
      inputs: {
        audio_base64: base64Audio,
        ...(request.language && { language: request.language }),
        ...(request.model && { model: request.model })
      }
    };

    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/speech/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return {
        text: data.transcription,
        language: data.detected_language?.code || 'unknown',
        confidence: data.detected_language?.confidence,
        provider: this.name,
        metadata: {
          scam_keywords: data.scam_keywords,
          authority_impersonation: data.authority_impersonation,
          money_request: data.money_request,
          risk: data.risk,
          ai_voice: data.ai_voice,
          processing_time_ms: data.processing_time_ms
        }
      };
    } catch (error: any) {
      logger.error('Databricks transcription failed', { error: error.message });
      throw new AppError(`Transcription failed: ${error.message}`, error.statusCode || 500);
    }
  }
}
