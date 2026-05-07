import Joi from "joi"

export const sendMessageSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      "string.min":   "Message cannot be empty",
      "string.max":   "Message cannot exceed 1000 characters",
      "any.required": "Message content is required",
    }),
})