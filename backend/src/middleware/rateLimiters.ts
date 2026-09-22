import rateLimit from 'express-rate-limit';

/**
 * Brute-force / credential-stuffing protection for the authentication routes.
 * Limits attempts per IP; tunable via env. Uses the already-installed
 * express-rate-limit dependency.
 */
export const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later.' },
});
