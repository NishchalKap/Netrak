import { Request, Response, NextFunction } from 'express';
import { speechService } from '../services/speech.service';
import { sendSuccess } from '../../common/response';
import { AppError } from '../../common/AppError';

/**
 * @openapi
 * /ai/speech/transcribe:
 *   post:
 *     tags:
 *       - AI
 *     summary: Transcribe audio to text
 *     description: Upload an audio file to transcribe it using the configured AI Speech provider (e.g., Databricks).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The audio file to transcribe
 *               referenceId:
 *                 type: string
 *                 description: Optional reference ID to associate with the transcription
 *               language:
 *                 type: string
 *                 description: Optional language hint (e.g., 'en', 'hi')
 *               model:
 *                 type: string
 *                 description: Optional model override
 *     responses:
 *       200:
 *         description: Transcription successful
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Provider error
 */
export const transcribeAudio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('No audio file provided', 400);
    }

    const { referenceId, language, model } = req.body;

    const result = await speechService.transcribeAudio(
      req.file.buffer,
      req.file.mimetype,
      referenceId,
      language,
      model
    );

    return sendSuccess(res, result, 'Transcription completed successfully');
  } catch (error) {
    next(error);
  }
};
