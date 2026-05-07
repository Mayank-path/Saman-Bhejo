import { Router } from "express"
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from "../controllers/auth.controller"
import validate from "../middleware/validate"
import authenticate from "../middleware/auth/authenticate"
import { authRateLimiter } from "../middleware/security/rateLimiter"
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/auth.validation"

const router = Router()

router.post("/register", authRateLimiter, validate(registerSchema), register)
router.post("/login",    authRateLimiter, validate(loginSchema),    login)
router.post("/refresh",  validate(refreshTokenSchema),              refreshToken)
router.post("/logout",   authenticate,                              logout)
router.get("/me",        authenticate,                              getMe)

export default router