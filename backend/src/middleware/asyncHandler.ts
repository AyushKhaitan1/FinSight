import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so any thrown error or rejected promise is
 * forwarded to Express's error-handling middleware via `next(err)`, instead of
 * being swallowed or repeated in a per-handler try/catch.
 *
 * The generic lets handlers keep their narrower request type (e.g. AuthRequest):
 *   router.get('/', asyncHandler<AuthRequest>(async (req, res) => { ... }));
 */
export const asyncHandler =
  <Req extends Request = Request>(
    fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req as Req, res, next).catch(next);
  };
