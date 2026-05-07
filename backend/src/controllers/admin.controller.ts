import { Response } from "express"
import { adminService } from "../services/admin.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"
import { PAGINATION } from "../constants"

export const getPendingKyc = catchAsync(async (req: AuthRequest, res: Response) => {
  const users = await adminService.getPendingKyc()

  res.status(200).json(
    new ApiResponse(200, "Pending KYC requests fetched", users)
  )
})

export const approveKyc = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await adminService.approveKyc(req.params.userId as string)

  res.status(200).json(
    new ApiResponse(200, "KYC approved successfully", user)
  )
})

export const rejectKyc = catchAsync(async (req: AuthRequest, res: Response) => {
  const { reason } = req.body

  if (!reason) {
    return res.status(400).json(
      new ApiResponse(400, "Rejection reason is required", null)
    )
  }

  const user = await adminService.rejectKyc(
    req.params.userId as string,
    reason
  )

  res.status(200).json(
    new ApiResponse(200, "KYC rejected", user)
  )
})

export const getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const page   = parseInt(req.query.page   as string) || PAGINATION.DEFAULT_PAGE
  const limit  = parseInt(req.query.limit  as string) || PAGINATION.DEFAULT_LIMIT
  const role   = req.query.role   as string | undefined
  const search = req.query.search as string | undefined

  const { users, total } = await adminService.getAllUsers(page, limit, role, search)

  res.status(200).json(
    new ApiResponse(200, "Users fetched", {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  )
})

export const toggleUserStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await adminService.toggleUserStatus(req.params.id as string)

  res.status(200).json(
    new ApiResponse(200, `User ${user.isActive ? "activated" : "deactivated"}`, {
      _id:      user._id,
      isActive: user.isActive,
    })
  )
})

export const getPlatformStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const stats = await adminService.getPlatformStats()

  res.status(200).json(
    new ApiResponse(200, "Platform stats fetched", stats)
  )
})