import { LLMProvider, LLMRequest, LLMResponse } from '../../interfaces/llm-provider.interface';
import { env } from '../../../config/env';
import { AppError } from '../../../common/AppError';
import { logger } from '../../../common/logger';

export class GeminiProvider implements LLMProvider {
  public readonly name = 'gemini';
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxRetries = 3;
  private readonly timeoutMs = 30000;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      logger.warn('Gemini configuration is missing. LLMProvider will fail health checks.');
    }
    this.apiKey = env.GEMINI_API_KEY || '';
    this.model = env.GEMINI_MODEL;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hi' }] }]
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);
      return response.ok;
    } catch (error) {
      logger.error('Gemini LLMProvider health check failed', { error });
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
          throw new AppError(`Gemini error: ${response.statusText}`, response.status);
        } else {
          const errBody = await response.text().catch(() => 'Unknown error');
          throw new AppError(`Gemini request failed: ${errBody}`, response.status);
        }
      } catch (error: any) {
        lastError = error;
        if (error.name === 'AbortError') {
          lastError = new AppError('Gemini request timed out', 504);
        }

        if (lastError instanceof AppError && lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          throw lastError;
        }

        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          logger.warn(`Retrying Gemini request (attempt ${attempt}/${this.maxRetries}) after ${Math.round(delay)}ms`);
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }

    throw lastError;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new AppError('Gemini LLMProvider is not configured', 503);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Convert our LLMMessage format to Gemini's format
    const contents = request.messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const generationConfig: Record<string, any> = {};
    if (request.temperature !== undefined) generationConfig.temperature = request.temperature;
    if (request.maxTokens !== undefined) generationConfig.maxOutputTokens = request.maxTokens;

    const payload = {
      contents,
      ...(Object.keys(generationConfig).length > 0 ? { generationConfig } : {})
    };

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        text,
        provider: this.name,
        metadata: {
          model: this.model,
          ...data.usageMetadata
        }
      };
    } catch (error: any) {
      logger.error('Gemini generation failed', { error: error.message });
      throw new AppError(`LLM generation failed: ${error.message}`, error.statusCode || 500);
    }
  }
}
