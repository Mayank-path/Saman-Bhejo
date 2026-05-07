import mongoose, { Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import { ROLES, KYC_STATUS } from "../constants"
import type { Role, KycStatus } from "../constants"

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  password: string
  role: Role
  avatar: string
  isVerified: boolean
  isActive: boolean

  kycStatus: KycStatus
  kycDocuments: {
    license: string
    permit: string
    insurance: string
  }

  vehicleType: string
  vehicleNumber: string
  vehicleCapacityTons: number

  location: {
    type: string
    coordinates: [number, number]
    address: string
    city: string
    state: string
  }

  rating: number
  totalRatings: number
  onTimeDeliveryRate: number
  totalDeliveries: number

  refreshToken: string | null
  passwordResetToken: string | null
  passwordResetExpiry: Date | null

  createdAt: Date
  updatedAt: Date

  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, "Role is required"],
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    kycStatus: {
      type: String,
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.PENDING,
    },

    kycDocuments: {
      license:   { type: String, default: "" },
      permit:    { type: String, default: "" },
      insurance: { type: String, default: "" },
    },

    vehicleType:         { type: String, default: "" },
    vehicleNumber:       { type: String, default: "" },
    vehicleCapacityTons: { type: Number, default: 0 },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: { type: String, default: "" },
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
    },

    rating:              { type: Number, default: 0, min: 0, max: 5 },
    totalRatings:        { type: Number, default: 0 },
    onTimeDeliveryRate:  { type: Number, default: 0, min: 0, max: 100 },
    totalDeliveries:     { type: Number, default: 0 },

    refreshToken:        { type: String, default: null, select: false },
    passwordResetToken:  { type: String, default: null, select: false },
    passwordResetExpiry: { type: Date,   default: null, select: false },
  },
  {
    timestamps: true,
  }
)

UserSchema.index({ location: "2dsphere" })

UserSchema.index({ role: 1 })

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 12)
  })

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>("User", UserSchema)

export default User