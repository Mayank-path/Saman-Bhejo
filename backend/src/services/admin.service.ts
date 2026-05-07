import User, { IUser } from "../models/User.model"
import Shipment from "../models/Shipment.model"
import Bid from "../models/Bid.model"
import ApiError from "../utils/ApiError"
import { KYC_STATUS, ROLES } from "../constants"
import { notificationService } from "./notification.service"

const getPendingKyc = async (): Promise<IUser[]> => {
  return await User.find({
    role:      ROLES.TRUCKER,
    kycStatus: KYC_STATUS.SUBMITTED,
  }).select("+kycDocuments")
}

const approveKyc = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (user.kycStatus !== KYC_STATUS.SUBMITTED) {
    throw new ApiError(400, "No pending KYC submission found for this user")
  }

  user.kycStatus  = KYC_STATUS.APPROVED
  user.isVerified = true
  await user.save()

  await notificationService.createNotification(
    userId,
    "kyc_update",
    "KYC Approved",
    "Your KYC documents have been verified. You can now place bids.",
    {}
  )

  return user
}

const rejectKyc = async (
  userId: string,
  reason: string
): Promise<IUser> => {

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (user.kycStatus !== KYC_STATUS.SUBMITTED) {
    throw new ApiError(400, "No pending KYC submission found for this user")
  }

  user.kycStatus = KYC_STATUS.REJECTED
  await user.save()

  await notificationService.createNotification(
    userId,
    "kyc_update",
    "KYC Rejected",
    `Your KYC documents were rejected. Reason: ${reason}. Please resubmit.`,
    { reason }
  )

  return user
}

const getAllUsers = async (
  page:   number = 1,
  limit:  number = 10,
  role?:  string,
  search?: string
): Promise<{ users: IUser[], total: number }> => {

  const query: Record<string, unknown> = {}

  if (role)   query.role = role
  if (search) query.$or  = [
    { name:  { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
    { phone: { $regex: search, $options: "i" } },
  ]

  const skip  = (page - 1) * limit
  const total = await User.countDocuments(query)
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return { users, total }
}

const toggleUserStatus = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (user.role === ROLES.ADMIN) {
    throw new ApiError(400, "Cannot deactivate admin account")
  }

  user.isActive = !user.isActive
  await user.save()

  return user
}

const getPlatformStats = async (): Promise<Record<string, unknown>> => {
  const [
    totalUsers,
    totalShippers,
    totalTruckers,
    totalShipments,
    totalBids,
    pendingKyc,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.SHIPPER }),
    User.countDocuments({ role: ROLES.TRUCKER }),
    Shipment.countDocuments(),
    Bid.countDocuments(),
    User.countDocuments({ kycStatus: KYC_STATUS.SUBMITTED }),
  ])

  return {
    totalUsers,
    totalShippers,
    totalTruckers,
    totalShipments,
    totalBids,
    pendingKyc,
  }
}

export const adminService = {
  getPendingKyc,
  approveKyc,
  rejectKyc,
  getAllUsers,
  toggleUserStatus,
  getPlatformStats,
}