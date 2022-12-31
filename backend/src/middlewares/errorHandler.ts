import { NextFunction, Request, Response } from "express";

import ApiError from "../types/apiError";

export const apiErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError)
    return res.status(err.code).json({ code: err.code, error: err.message });

  return res.status(500).json({ code: 500, error: "Something went wrong" });
};

export const invalidRouteHandler = (
  req: Request,
  res: Response,
) => {
  const error = new Error("No route found");
  res.json({
    message: error.message,
  });
};
