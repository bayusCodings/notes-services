import { Request, Response, NextFunction } from 'express';

export const NotFoundErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error('Route not found');
  err.status = 404;
  next(err);
}

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  res.status(status).json({
    status,
    message: err.message
  });
}

export const AsyncError = (fn: any) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
};

