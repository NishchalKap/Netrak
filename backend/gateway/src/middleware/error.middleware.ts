import { Request, Response } from 'express';
import { AppError } from '../common/AppError';
import { sendError } from '../common/response';
import { logger } from '../common/logger';

export const errorHandler = (err: any, _req: Request, res: Response) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    return sendError(res, message, statusCode, err.errors);
  } else {
    logger.error('Unhandled Error:', err);
  }

  sendError(res, message, statusCode);
};
