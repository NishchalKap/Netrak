import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const sendError = (res: Response, message = 'Error', statusCode = 500, errors?: unknown) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors === undefined ? {} : { errors }),
    requestId: String(res.locals.requestId ?? res.getHeader('X-Request-Id') ?? 'unknown'),
  });
};
