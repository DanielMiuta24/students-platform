import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();

  return (keyExtractor: (req: Request) => string) =>
    (req: Request, res: Response, next: NextFunction) => {
      const key = keyExtractor(req);
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return next();
      }

      if (entry.count >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
        });
      }

      entry.count++;
      return next();
    };
}

export const otpRequestLimiter = createRateLimiter(3, 15 * 60 * 1000)(
  (req) => `otp-req:${req.body?.email ?? req.ip}`
);

export const otpVerifyLimiter = createRateLimiter(5, 15 * 60 * 1000)(
  (req) => `otp-verify:${req.body?.email ?? req.ip}`
);
