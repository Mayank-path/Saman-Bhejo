import mongoose, { Document, Schema } from "mongoose"
import { PAYMENT_STATUS } from "../constants"
import type { PaymentStatus } from "../constants"

export interface IPayment extends Document {
  shipment: mongoose.Types.ObjectId
  shipper: mongoose.Types.ObjectId
  trucker: mongoose.Types.ObjectId
  amount: number
  platformFee: number
  truckerAmount: number
  currency: string
  status: PaymentStatus
  stripePaymentIntentId: string
  stripeTransferId: string | null
  stripeRefundId: string | null
  paidAt: Date | null
  releasedAt: Date | null
  refundedAt: Date | null
  failureReason: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      unique: true,
    },

    shipper: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trucker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [100, "Minimum amount is ₹100"],
    },

    platformFee: {
      type: Number,
      required: true,
    },

    truckerAmount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "inr",
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      select: false,
    },

    stripeTransferId: {
      type: String,
      default: null,
      select: false,
    },

    stripeRefundId: {
      type: String,
      default: null,
      select: false,
    },

    paidAt:     { type: Date, default: null },
    releasedAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },

    failureReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)


PaymentSchema.index({ shipper: 1 })
PaymentSchema.index({ trucker: 1 })
PaymentSchema.index({ status: 1 })

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema)

export default Payment