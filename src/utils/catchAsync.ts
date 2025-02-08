import { Request, Response, NextFunction } from "express";

const catchAsync =
  <T extends Function>(fn: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
  };

export default catchAsync;
