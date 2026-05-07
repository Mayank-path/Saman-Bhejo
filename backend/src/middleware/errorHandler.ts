import { Request, Response, NextFunction } from "express"
import ApiError from "../utils/ApiError"
import logger from "../config/logger"

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.message} — ${req.method} ${req.originalUrl}`)

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success:    false,
      statusCode: err.statusCode,
      message:    err.message,
    })
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success:    false,
      statusCode: 400,
      message:    err.message,
    })
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success:    false,
      statusCode: 400,
      message:    "Invalid ID format",
    })
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0]
    return res.status(400).json({
      success:    false,
      statusCode: 400,
      message:    `${field} already exists`,
    })
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success:    false,
      statusCode: 401,
      message:    "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success:    false,
      statusCode: 401,
      message:    "Token expired",
    })
  }

  return res.status(500).json({
    success:    false,
    statusCode: 500,
    message:    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message,
  })
}

export default errorHandler