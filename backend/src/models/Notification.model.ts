import mongoose, { Document, Schema } from "mongoose"
import { NOTIFICATION_TYPE } from "../constants"
import type { } from "../constants"

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId
  type: string
  title: string
  message: string
  data: Record<string, unknown>
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

NotificationSchema.index({ recipient: 1 })
NotificationSchema.index({ isRead: 1 })
NotificationSchema.index({ createdAt: -1 })

const Notification = mongoose.model<INotification>("Notification", NotificationSchema)

export default Notification