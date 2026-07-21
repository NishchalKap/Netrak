import { aiRegistry } from '../providers/registry';
import { LLMRequest, LLMResponse } from '../interfaces/llm-provider.interface';
import { prisma } from '../../database/prisma';
import { logger } from '../../common/logger';

export class LLMService {
  async generate(request: LLMRequest, inputRef?: string): Promise<LLMResponse> {
    const provider = aiRegistry.getLLMProvider();
    const result = await provider.generate(request);

    // Try to save to AIResult
    try {
      await prisma.aIResult.create({
        data: {
          provider: provider.name,
          serviceType: 'llm',
          inputRef,
          output: JSON.parse(JSON.stringify(result))
        }
      });
    } catch (dbErr) {
      logger.warn('Failed to save AIResult', { dbErr });
    }

    return result;
  }
}

export const llmService = new LLMService();
