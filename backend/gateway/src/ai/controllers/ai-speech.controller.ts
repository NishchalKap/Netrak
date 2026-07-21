import { Request, Response, NextFunction } from 'express';
import { speechService } from '../services/speech.service';
import { sendSuccess } from '../../common/response';
import { AppError } from '../../common/AppError';

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
