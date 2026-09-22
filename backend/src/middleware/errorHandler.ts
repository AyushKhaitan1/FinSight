import { ErrorRequestHandler } from 'express';

/**
 * Terminal Express error handler. Logs the real error server-side and returns
 * the generic response the route handlers previously produced in their
 * duplicated catch blocks, so behaviour is unchanged. Registered after all
 * routes in server.ts.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Unhandled route error:', err);
  res.status(500).json({ error: 'Server error' });
};
