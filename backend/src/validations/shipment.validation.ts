import Joi from "joi"
import { GOODS_TYPE } from "../constants"

export const createShipmentSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.min":   "Title must be at least 5 characters",
      "string.max":   "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters",
    }),

  goodsType: Joi.string()
    .valid(...Object.values(GOODS_TYPE))
    .required()
    .messages({
      "any.only":    `Goods type must be one of: ${Object.values(GOODS_TYPE).join(", ")}`,
      "any.required": "Goods type is required",
    }),

  weightTons: Joi.number()
    .min(0.1)
    .max(100)
    .required()
    .messages({
      "number.min":   "Weight must be at least 0.1 tons",
      "number.max":   "Weight cannot exceed 100 tons",
      "any.required": "Weight is required",
    }),

  quantity: Joi.number()
    .min(1)
    .optional(),

  pickup: Joi.object({
    address: Joi.string().required().messages({ "any.required": "Pickup address is required" }),
    city:    Joi.string().required().messages({ "any.required": "Pickup city is required" }),
    state:   Joi.string().required().messages({ "any.required": "Pickup state is required" }),
    location: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .messages({ "any.required": "Pickup coordinates are required" }),
    }).required(),
  }).required(),

  delivery: Joi.object({
    address: Joi.string().required().messages({ "any.required": "Delivery address is required" }),
    city:    Joi.string().required().messages({ "any.required": "Delivery city is required" }),
    state:   Joi.string().required().messages({ "any.required": "Delivery state is required" }),
    location: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .messages({ "any.required": "Delivery coordinates are required" }),
    }).required(),
  }).required(),

  scheduledDate: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Scheduled date must be in the future",
      "any.required": "Scheduled date is required",
    }),

  budget: Joi.object({
    min: Joi.number().min(100).required().messages({ "any.required": "Minimum budget is required" }),
    max: Joi.number().min(100).required().messages({ "any.required": "Maximum budget is required" }),
  }).required(),
})

export const cancelShipmentSchema = Joi.object({
  reason: Joi.string()
    .min(10)
    .max(300)
    .required()
    .messages({
      "string.min":   "Cancellation reason must be at least 10 characters",
      "any.required": "Cancellation reason is required",
    }),
})