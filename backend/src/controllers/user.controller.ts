import { Response } from "express"
import { userService } from "../services/user.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"

export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  res.status(200).json(
    new ApiResponse(200, "Profile fetched", req.user!)
  )
})

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateProfile(
    req.user!._id.toString(),
    req.body
  )

  res.status(200).json(
    new ApiResponse(200, "Profile updated", user)
  )
})

export const uploadAvatar = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json(
      new ApiResponse(400, "No file uploaded", null)
    )
  }

  const user = await userService.uploadAvatar(
    req.user!._id.toString(),
    req.file
  )

  res.status(200).json(
    new ApiResponse(200, "Avatar uploaded", { avatar: user.avatar })
  )
})

export const uploadKycDocuments = catchAsync(async (req: AuthRequest, res: Response) => {
  const files = req.files as {
    license?:   Express.Multer.File[]
    permit?:    Express.Multer.File[]
    insurance?: Express.Multer.File[]
  }

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json(
      new ApiResponse(400, "No files uploaded", null)
    )
  }

  const user = await userService.uploadKycDocuments(
    req.user!._id.toString(),
    files
  )

  res.status(200).json(
    new ApiResponse(200, "KYC documents uploaded successfully. Pending admin review.", {
      kycStatus:    user.kycStatus,
      kycDocuments: user.kycDocuments,
    })
  )
})

export const getUserById = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.getUserById(req.params.id as string)

  res.status(200).json(
    new ApiResponse(200, "User fetched", {
      _id:                user._id,
      name:               user.name,
      avatar:             user.avatar,
      role:               user.role,
      rating:             user.rating,
      totalRatings:       user.totalRatings,
      onTimeDeliveryRate: user.onTimeDeliveryRate,
      totalDeliveries:    user.totalDeliveries,
      vehicleType:        user.vehicleType,
      vehicleNumber:      user.vehicleNumber,
    })
  )
})