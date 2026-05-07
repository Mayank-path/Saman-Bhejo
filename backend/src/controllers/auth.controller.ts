import { Response } from "express"
import { authService } from "../services/auth.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"

export const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const { user, tokens } = await authService.register(req.body)

  res.status(201).json(
    new ApiResponse(201, "Registration successful", {
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
      },
      tokens,
    })
  )
})

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { user, tokens } = await authService.login(req.body)

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
        kycStatus: user.kycStatus,
        isVerified: user.isVerified,
      },
      tokens,
    })
  )
})

export const refreshToken = catchAsync(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body
  const tokens = await authService.refreshToken(refreshToken)

  res.status(200).json(
    new ApiResponse(200, "Token refreshed", tokens)
  )
})

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user!._id.toString())

  res.status(200).json(
    new ApiResponse(200, "Logged out successfully", null)
  )
})

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  res.status(200).json(
    new ApiResponse(200, "User fetched", {
      _id:        req.user!._id,
      name:       req.user!.name,
      email:      req.user!.email,
      phone:      req.user!.phone,
      role:       req.user!.role,
      avatar:     req.user!.avatar,
      kycStatus:  req.user!.kycStatus,
      isVerified: req.user!.isVerified,
      rating:     req.user!.rating,
      createdAt:  req.user!.createdAt,
    })
  )
})