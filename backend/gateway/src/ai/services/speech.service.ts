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

      // Save inference history (try/catch to not fail the whole request)
      try {
        await prisma.aIInferenceHistory.create({
          data: {
            provider: provider.name,
            serviceType: 'speech_to_text',
            status: 'SUCCESS',
            durationMs: Date.now() - startTime,
            response: JSON.parse(JSON.stringify(result))
          }
        });
      } catch (dbErr) {
        logger.warn('Failed to save success inference history', { dbErr });
      }

      // Optionally save transcription if referenceId is provided
      if (referenceId) {
        try {
          await prisma.transcription.create({
            data: {
              referenceId,
              text: result.text,
              language: result.language,
              confidence: result.confidence
            }
          });
        } catch (dbErr) {
          logger.warn('Failed to save transcription', { dbErr });
        }
      }

      return result;
    } catch (error: any) {
      errorStr = error.message;
      
      // Save failure history (try/catch to not fail the whole request)
      try {
        await prisma.aIInferenceHistory.create({
          data: {
            provider: provider.name,
            serviceType: 'speech_to_text',
            status: 'ERROR',
            durationMs: Date.now() - startTime,
            error: errorStr
          }
        });
      } catch (dbErr) {
        logger.warn('Failed to save error inference history', { dbErr });
      }
      
      throw error;
    }
  }
}

export const speechService = new SpeechService();
