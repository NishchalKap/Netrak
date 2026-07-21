import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      Object.defineProperty(req, 'body', { value: parsed, configurable: true, writable: true });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.params);
      Object.defineProperty(req, 'params', { value: parsed, configurable: true, writable: true });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      Object.defineProperty(req, 'query', { value: parsed, configurable: true, writable: true });
      next();
    } catch (error) {
      next(error);
    }
  };
};
