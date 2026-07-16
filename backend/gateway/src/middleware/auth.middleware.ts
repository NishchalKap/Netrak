import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../common/AppError';

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';
export interface AuthenticatedUser { id: string; role: UserRole }
const USER_ROLES: UserRole[] = ['CITIZEN', 'OFFICER', 'ADMIN'];

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication is required', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    }) as JwtPayload;
    if (typeof decoded.id !== 'string' || decoded.sub !== decoded.id || !USER_ROLES.includes(decoded.role as UserRole)) {
      return next(new AppError('Invalid authentication token', 401));
    }
    req.user = { id: decoded.id, role: decoded.role as UserRole };
    next();
  } catch {
    return next(new AppError('Authentication has expired or is invalid', 401));
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
};
