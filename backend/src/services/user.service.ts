import User, { IUser } from "../models/User.model"
import ApiError from "../utils/ApiError"
import { cloudinary } from "../config/cloudinary"
import { UPLOAD, KYC_STATUS } from "../constants"

const updateProfile = async (
  userId: string,
  input:  Record<string, unknown>
): Promise<IUser> => {

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return user
}

const uploadAvatar = async (
  userId: string,
  file:   Express.Multer.File
): Promise<IUser> => {

  const base64 = file.buffer.toString("base64")
  const dataUri = `data:${file.mimetype};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder:         UPLOAD.AVATAR_FOLDER,
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  })

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: result.secure_url },
    { new: true }
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return user
}

const uploadKycDocuments = async (
  userId: string,
  files: {
    license?:   Express.Multer.File[]
    permit?:    Express.Multer.File[]
    insurance?: Express.Multer.File[]
  }
): Promise<IUser> => {

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (user.kycStatus === KYC_STATUS.APPROVED) {
    throw new ApiError(400, "Your KYC is already approved")
  }

  const uploadFile = async (file: Express.Multer.File, folder: string) => {
    const base64  = file.buffer.toString("base64")
    const dataUri = `data:${file.mimetype};base64,${base64}`
    const result  = await cloudinary.uploader.upload(dataUri, { folder })
    return result.secure_url
  }

  const updates: Record<string, string> = {}

  if (files.license?.[0]) {
    updates["kycDocuments.license"] = await uploadFile(
      files.license[0],
      UPLOAD.KYC_FOLDER
    )
  }

  if (files.permit?.[0]) {
    updates["kycDocuments.permit"] = await uploadFile(
      files.permit[0],
      UPLOAD.KYC_FOLDER
    )
  }

  if (files.insurance?.[0]) {
    updates["kycDocuments.insurance"] = await uploadFile(
      files.insurance[0],
      UPLOAD.KYC_FOLDER
    )
  }

  updates["kycStatus"] = KYC_STATUS.SUBMITTED

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  )

  return updatedUser!
}

const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return user
}

export const userService = {
  updateProfile,
  uploadAvatar,
  uploadKycDocuments,
  getUserById,
}