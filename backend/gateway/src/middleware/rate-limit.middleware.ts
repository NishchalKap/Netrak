import { NextFunction, Request, Response } from 'express';
import { sendError } from '../common/response';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  key?: (req: Request) => string;
  message?: string;
  maxBuckets?: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter({
  windowMs,
  maxRequests,
  key = (req) => req.ip || req.socket.remoteAddress || 'unknown',
  message = 'Too many requests. Try again later.',
  maxBuckets = 50_000,
}: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    let bucketKey = key(req).slice(0, 512);
    if (!buckets.has(bucketKey) && buckets.size >= maxBuckets) {
      for (const [candidate, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(candidate);
      }
      if (buckets.size >= maxBuckets) bucketKey = '__capacity_overflow__';
    }
    const current = buckets.get(bucketKey);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    bucket.count += 1;
    buckets.set(bucketKey, bucket);

    const remaining = Math.max(0, maxRequests - bucket.count);
    const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('RateLimit-Limit', maxRequests);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSeconds);
    res.setHeader('RateLimit-Policy', `${maxRequests};w=${Math.ceil(windowMs / 1000)}`);

    if (bucket.count > maxRequests) {
      res.setHeader('Retry-After', resetSeconds);
      return sendError(res, message, 429);
    }
    return next();
  };
}

export function emailRateLimitKey(req: Request) {
  const suppliedEmail = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : 'unknown';
  return `${req.ip || req.socket.remoteAddress || 'unknown'}:${suppliedEmail.slice(0, 254)}`;
}
