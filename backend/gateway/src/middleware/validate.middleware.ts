import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse JSON or form-data
      let data = req.body;
      
      // If it's form-data and has some fields that need to be JSON parsed, but mostly for primitives
      // For this case, we just pass it through, but zod can handle strings that need to be coerced
      const parsed = await schema.parseAsync(data);
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
