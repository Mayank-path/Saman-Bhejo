import mongoose, { Document, Schema } from "mongoose"

export interface IMessage {
  sender: mongoose.Types.ObjectId
  content: string
  readBy: mongoose.Types.ObjectId[]
  createdAt: Date
}

export interface IChat extends Document {
  shipment: mongoose.Types.ObjectId
  participants: mongoose.Types.ObjectId[]
  messages: IMessage[]
  lastMessage: string
  lastMessageAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const ChatSchema = new Schema<IChat>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      unique: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    messages: [MessageSchema],

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)


ChatSchema.index({ participants: 1 })
ChatSchema.index({ lastMessageAt: -1 })

const Chat = mongoose.model<IChat>("Chat", ChatSchema)

export default Chat