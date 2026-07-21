import { AIProvider } from '../interfaces/provider.interface';
import { SpeechProvider } from '../interfaces/speech-provider.interface';
import { LLMProvider } from '../interfaces/llm-provider.interface';
import { DatabricksSpeechProvider } from './speech/databricks-speech.provider';
import { GeminiProvider } from './llm/GeminiProvider';
import { env } from '../../config/env';
import { AppError } from '../../common/AppError';
import { logger } from '../../common/logger';

export class AIServiceRegistry {
  private static instance: AIServiceRegistry;
  private speechProvider?: SpeechProvider;
  private llmProvider?: LLMProvider;

  private constructor() {
    this.initializeProviders();
  }

  public static getInstance(): AIServiceRegistry {
    if (!AIServiceRegistry.instance) {
      AIServiceRegistry.instance = new AIServiceRegistry();
    }
    return AIServiceRegistry.instance;
  }

  private initializeProviders() {
    // Initialize Speech Provider
    try {
      if (env.AI_SPEECH_PROVIDER === 'databricks') {
        this.speechProvider = new DatabricksSpeechProvider();
        logger.info('Initialized Databricks Speech Provider');
      } else {
        logger.warn(`Unknown speech provider: ${env.AI_SPEECH_PROVIDER}`);
      }
    } catch (error) {
      logger.error('Failed to initialize speech provider', { error });
    }

    // Initialize LLM Provider
    try {
      if (env.AI_LLM_PROVIDER === 'gemini') {
        this.llmProvider = new GeminiProvider();
        logger.info('Initialized Gemini LLM Provider');
      } else {
        logger.warn(`Unknown LLM provider: ${env.AI_LLM_PROVIDER}`);
      }
    } catch (error) {
      logger.error('Failed to initialize LLM provider', { error });
    }
  }

  public getSpeechProvider(): SpeechProvider {
    if (!this.speechProvider) {
      throw new AppError('Speech provider is not configured', 501);
    }
    return this.speechProvider;
  }

  public getLLMProvider(): LLMProvider {
    if (!this.llmProvider) {
      throw new AppError('LLM provider is not configured', 501);
    }
    return this.llmProvider;
  }
}

export const aiRegistry = AIServiceRegistry.getInstance();
