import { aiRegistry } from '../providers/registry';
import { TranscriptionRequest, TranscriptionResponse } from '../interfaces/speech-provider.interface';
import { prisma } from '../../database/prisma';
import { logger } from '../../common/logger';

export class SpeechService {
  async transcribeAudio(
    audioBuffer: Buffer,
    mimetype: string,
    referenceId?: string,
    language?: string,
    model?: string
  ): Promise<TranscriptionResponse> {
    const provider = aiRegistry.getSpeechProvider();
    
    const startTime = Date.now();
    let result: TranscriptionResponse | null = null;
    let errorStr: string | null = null;

    try {
      result = await provider.transcribe({
        audioBuffer,
        mimetype,
        language,
        model
      });

      // Save inference history
      await prisma.aIInferenceHistory.create({
        data: {
          provider: provider.name,
          serviceType: 'speech_to_text',
          status: 'SUCCESS',
          durationMs: Date.now() - startTime,
          response: JSON.parse(JSON.stringify(result))
        }
      });

      // Optionally save transcription if referenceId is provided
      if (referenceId) {
        await prisma.transcription.create({
          data: {
            referenceId,
            text: result.text,
            language: result.language,
            confidence: result.confidence
          }
        });
      }

      return result;
    } catch (error: any) {
      errorStr = error.message;
      
      // Save failure history
      await prisma.aIInferenceHistory.create({
        data: {
          provider: provider.name,
          serviceType: 'speech_to_text',
          status: 'ERROR',
          durationMs: Date.now() - startTime,
          error: errorStr
        }
      });
      
      throw error;
    }
  }
}

export const speechService = new SpeechService();
