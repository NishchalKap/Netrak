import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/AppError';
import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../database/prisma';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';
export interface AuthenticatedUser { id: string; role: UserRole; email: string }

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const USER_ROLES: UserRole[] = ['CITIZEN', 'OFFICER', 'ADMIN'];

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];
  
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication is required', 401));
  }

  try {
    // Verify token using Supabase admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !data.user) {
      return next(new AppError('Invalid authentication token', 401));
    }

    // Fetch user from Prisma to get application role
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, role: true, email: true }
    });

    if (!dbUser || !USER_ROLES.includes(dbUser.role as UserRole)) {
      return next(new AppError('Invalid user or role', 401));
    }

    req.user = { 
      id: dbUser.id, 
      role: dbUser.role as UserRole, 
      email: dbUser.email 
    };
    
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
