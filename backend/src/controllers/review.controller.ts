import { Response } from "express"
import { reviewService } from "../services/review.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"

export const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const review = await reviewService.createReview(
    req.params.shipmentId as string,
    req.user!._id.toString(),
    req.body
  )

  res.status(201).json(
    new ApiResponse(201, "Review submitted successfully", review)
  )
})

export const getReviewsByUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const reviews = await reviewService.getReviewsByUser(
    req.params.userId as string
  )

  res.status(200).json(
    new ApiResponse(200, "Reviews fetched", reviews)
  )
})