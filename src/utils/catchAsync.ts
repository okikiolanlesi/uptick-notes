import { NextFunction, Request, Response } from "express";

export default (fn: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
