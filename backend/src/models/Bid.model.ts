import mongoose, { Document, Schema } from "mongoose"
import { BID_STATUS, BID_SCORE_WEIGHTS } from "../constants"
import type { BidStatus } from "../constants"

export interface IBid extends Document {
  shipment: mongoose.Types.ObjectId
  trucker: mongoose.Types.ObjectId
  amount: number
  note: string
  estimatedPickupDate: Date
  estimatedDeliveryDate: Date
  status: BidStatus
  score: number
  isAutoExpired: boolean
  cancellationReason: string
  createdAt: Date
  updatedAt: Date
}

const BidSchema = new Schema<IBid>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: [true, "Shipment is required"],
    },

    trucker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Trucker is required"],
    },

    amount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [100, "Minimum bid is ₹100"],
      max: [999999, "Maximum bid is ₹999999"],
    },

    note: {
      type: String,
      trim: true,
      maxlength: [300, "Note cannot exceed 300 characters"],
      default: "",
    },

    estimatedPickupDate: {
      type: Date,
      required: [true, "Estimated pickup date is required"],
    },

    estimatedDeliveryDate: {
      type: Date,
      required: [true, "Estimated delivery date is required"],
    },

    status: {
      type: String,
      enum: Object.values(BID_STATUS),
      default: BID_STATUS.PENDING,
    },

    score: {
      type: Number,
      default: 0,
    },

    isAutoExpired: {
      type: Boolean,
      default: false,
    },

    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

BidSchema.index({ shipment: 1 })
BidSchema.index({ trucker: 1 })
BidSchema.index({ status: 1 })
BidSchema.index({ shipment: 1, trucker: 1 }, { unique: true })

BidSchema.pre("save", async function () {
  if (!this.isModified("amount")) return

  const User = mongoose.model("User")
  const trucker = await User.findById(this.trucker)

  if (!trucker) return

  const maxAmount = 999999

  const normalizedPrice  = 1 - this.amount / maxAmount
  const normalizedRating = trucker.rating / 5
  const normalizedOnTime = trucker.onTimeDeliveryRate / 100

  this.score =
    normalizedPrice  * BID_SCORE_WEIGHTS.PRICE +
    normalizedRating * BID_SCORE_WEIGHTS.RATING +
    normalizedOnTime * BID_SCORE_WEIGHTS.ON_TIME
})

const Bid = mongoose.model<IBid>("Bid", BidSchema)

export default Bid