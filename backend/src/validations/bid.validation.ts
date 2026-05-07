import Joi from "joi"

export const createBidSchema = Joi.object({
  shipmentId: Joi.string()
    .required()
    .messages({
      "any.required": "Shipment ID is required",
    }),

  amount: Joi.number()
    .min(100)
    .max(999999)
    .required()
    .messages({
      "number.min":   "Minimum bid is ₹100",
      "number.max":   "Maximum bid is ₹999999",
      "any.required": "Bid amount is required",
    }),

  note: Joi.string()
    .max(300)
    .optional()
    .messages({
      "string.max": "Note cannot exceed 300 characters",
    }),

  estimatedPickupDate: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Estimated pickup date must be in the future",
      "any.required": "Estimated pickup date is required",
    }),

  estimatedDeliveryDate: Joi.date()
    .greater(Joi.ref("estimatedPickupDate"))
    .required()
    .messages({
      "date.greater": "Estimated delivery date must be after pickup date",
      "any.required": "Estimated delivery date is required",
    }),
})

export const withdrawBidSchema = Joi.object({
  reason: Joi.string()
    .min(10)
    .max(300)
    .required()
    .messages({
      "string.min":   "Reason must be at least 10 characters",
      "any.required": "Reason is required",
    }),
})