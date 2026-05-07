import mongoose, { Document, Schema } from "mongoose"
import { SHIPMENT_STATUS, GOODS_TYPE } from "../constants"
import type { ShipmentStatus, GoodsType } from "../constants"

export interface IShipment extends Document {
  shipper: mongoose.Types.ObjectId
  assignedTrucker: mongoose.Types.ObjectId | null
  acceptedBid: mongoose.Types.ObjectId | null

  title: string
  description: string
  goodsType: GoodsType
  weightTons: number
  quantity: number
  images: string[]

  pickup: {
    address: string
    city: string
    state: string
    location: {
      type: string
      coordinates: [number, number]
    }
  }

  delivery: {
    address: string
    city: string
    state: string
    location: {
      type: string
      coordinates: [number, number]
    }
  }

  distanceKm: number
  status: ShipmentStatus
  scheduledDate: Date
  estimatedDeliveryDate: Date | null
  actualDeliveryDate: Date | null

  budget: {
    min: number
    max: number
  }

  bidCount: number
  biddingExpiresAt: Date
  radiusKm: number
  isRadiusExpanded: boolean

  otp: string | null
  otpExpiry: Date | null

  cancellationReason: string
  cancelledBy: mongoose.Types.ObjectId | null

  createdAt: Date
  updatedAt: Date
}

const locationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
)

const ShipmentSchema = new Schema<IShipment>(
  {
    shipper: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shipper is required"],
    },

    assignedTrucker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedBid: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    goodsType: {
      type: String,
      enum: Object.values(GOODS_TYPE),
      required: [true, "Goods type is required"],
    },

    weightTons: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0.1, "Weight must be at least 0.1 tons"],
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    images: [{ type: String }],

    pickup: {
      address:  { type: String, required: [true, "Pickup address is required"] },
      city:     { type: String, required: [true, "Pickup city is required"] },
      state:    { type: String, required: [true, "Pickup state is required"] },
      location: { type: locationSchema, required: true },
    },

    delivery: {
      address:  { type: String, required: [true, "Delivery address is required"] },
      city:     { type: String, required: [true, "Delivery city is required"] },
      state:    { type: String, required: [true, "Delivery state is required"] },
      location: { type: locationSchema, required: true },
    },

    distanceKm: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUS),
      default: SHIPMENT_STATUS.OPEN,
    },

    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },

    estimatedDeliveryDate: { type: Date, default: null },
    actualDeliveryDate:    { type: Date, default: null },

    budget: {
      min: { type: Number, required: [true, "Minimum budget is required"], min: 0 },
      max: { type: Number, required: [true, "Maximum budget is required"], min: 0 },
    },

    bidCount: { type: Number, default: 0 },

    biddingExpiresAt: {
      type: Date,
      required: true,
    },

    radiusKm: {
      type: Number,
      default: 100,
    },

    isRadiusExpanded: {
      type: Boolean,
      default: false,
    },

    otp:       { type: String, default: null, select: false },
    otpExpiry: { type: Date,   default: null, select: false },

    cancellationReason: { type: String, default: "" },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

ShipmentSchema.index({ "pickup.location": "2dsphere" })
ShipmentSchema.index({ "delivery.location": "2dsphere" })
ShipmentSchema.index({ shipper: 1 })
ShipmentSchema.index({ assignedTrucker: 1 })
ShipmentSchema.index({ status: 1 })
ShipmentSchema.index({ biddingExpiresAt: 1 })

const Shipment = mongoose.model<IShipment>("Shipment", ShipmentSchema)

export default Shipment