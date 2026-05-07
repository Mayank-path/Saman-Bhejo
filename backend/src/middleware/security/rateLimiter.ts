import rateLimit from "express-rate-limit"
import { Request, Response } from "express"
import { RATE_LIMITS } from "../../constants"

const rateLimitResponse = (req: Request, res: Response) => {
  res.status(429).json({
    success:    false,
    statusCode: 429,
    message:    "Too many requests. Please try again later.",
  })
}

// ── Global Rate Limiter ───────────────────────────────────────────────────────
// Applied to ALL routes
// 100 requests per 15 minutes per IP
export const globalRateLimiter = rateLimit({
  windowMs:         RATE_LIMITS.GLOBAL_WINDOW_MS,
  max:              RATE_LIMITS.GLOBAL_MAX,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          rateLimitResponse,
})

// ── Auth Rate Limiter ─────────────────────────────────────────────────────────
// Applied to login and register routes only
// 10 requests per 15 minutes per IP
// Prevents brute force password attacks
export const authRateLimiter = rateLimit({
  windowMs:         RATE_LIMITS.AUTH_WINDOW_MS,
  max:              RATE_LIMITS.AUTH_MAX,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          rateLimitResponse,
})

// ── Bid Rate Limiter ──────────────────────────────────────────────────────────
// Applied to bid placement route only
// 5 bids per minute per IP
// Prevents bid spamming
export const bidRateLimiter = rateLimit({
  windowMs:         RATE_LIMITS.BID_WINDOW_MS,
  max:              RATE_LIMITS.BID_MAX,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          rateLimitResponse,
})

// ── OTP Rate Limiter ──────────────────────────────────────────────────────────
// Applied to OTP request route only
// 3 requests per 10 minutes per IP
// Prevents OTP spam
export const otpRateLimiter = rateLimit({
  windowMs:         RATE_LIMITS.OTP_WINDOW_MS,
  max:              RATE_LIMITS.OTP_MAX,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          rateLimitResponse,
})