import { NextFunction, Request, Response } from 'express'

import ApiError from "../types/apiError"

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log(err)
  if (err instanceof ApiError)
    return res.status(err.code).json({ code: err.code, error: err.message })

  return res.status(500).json({ code: 500, error: 'Something went wrong' })
}

export default errorHandler