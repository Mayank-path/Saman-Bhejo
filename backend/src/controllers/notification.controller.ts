import { Response } from "express"
import { notificationService } from "../services/notification.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"
import { PAGINATION } from "../constants"

export const getMyNotifications = catchAsync(async (req: AuthRequest, res: Response) => {
  const page  = parseInt(req.query.page  as string) || PAGINATION.DEFAULT_PAGE
  const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT

  const { notifications, total, unread } = await notificationService.getMyNotifications(
    req.user!._id.toString(),
    page,
    limit
  )

  res.status(200).json(
    new ApiResponse(200, "Notifications fetched", {
      notifications,
      unread,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  )
})

export const markAllAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  await notificationService.markAllAsRead(req.user!._id.toString())

  res.status(200).json(
    new ApiResponse(200, "All notifications marked as read", null)
  )
})

export const markOneAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  await notificationService.markOneAsRead(
    req.params.id as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Notification marked as read", null)
  )
})