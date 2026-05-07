import Joi from "joi"
import { ROLES } from "../constants"

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min":  "Name must be at least 2 characters",
      "string.max":  "Name cannot exceed 50 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid Indian phone number",
      "any.required":        "Phone is required",
    }),

  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.min":          "Password must be at least 8 characters",
      "string.max":          "Password cannot exceed 32 characters",
      "string.pattern.base": "Password must contain uppercase, lowercase, number and special character",
      "any.required":        "Password is required",
    }),

  role: Joi.string()
    .valid(ROLES.SHIPPER, ROLES.TRUCKER)
    .required()
    .messages({
      "any.only":    "Role must be shipper or trucker",
      "any.required": "Role is required",
    }),
})

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password is required",
    }),
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      "any.required": "Refresh token is required",
    }),
})