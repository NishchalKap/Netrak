import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/AppError';
import { sendError } from '../common/response';
import { logger } from '../common/logger';

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const requestId = String(res.locals.requestId ?? res.getHeader('X-Request-Id') ?? 'unknown');

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      field: issue.path.join('.') || 'request',
      message: issue.message,
    }));
    return sendError(res, 'Validation failed', 400, issues);
  }

  if (isMalformedJsonError(error)) {
    return sendError(res, 'Malformed JSON request', 400);
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) logger.error('Operational request error', { requestId, method: req.method, path: req.path, message: error.message });
    return sendError(res, error.message, error.statusCode);
  }

  logger.error('Unhandled request error', {
    requestId,
    method: req.method,
    path: req.path,
    error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { type: typeof error },
  });
  return sendError(res, 'Internal Server Error', 500);
};

export function isMalformedJsonError(error: unknown) {
  if (!(error instanceof SyntaxError) || typeof error !== 'object' || error === null) return false;
  const parserError = error as SyntaxError & { status?: unknown; type?: unknown };
  return parserError.status === 400 && parserError.type === 'entity.parse.failed';
}
