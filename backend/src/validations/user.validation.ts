import Joi from "joi"

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid Indian phone number",
    }),

  vehicleType: Joi.string()
    .optional(),

  vehicleNumber: Joi.string()
    .optional(),

  vehicleCapacityTons: Joi.number()
    .min(0.1)
    .optional(),

  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    address:     Joi.string().optional(),
    city:        Joi.string().optional(),
    state:       Joi.string().optional(),
  }).optional(),
})