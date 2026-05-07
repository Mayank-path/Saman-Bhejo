import { Response } from "express"
import { bidService } from "../services/bid.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"

export const placeBid = catchAsync(async (req: AuthRequest, res: Response) => {
  const bid = await bidService.placeBid(
    req.user!._id.toString(),
    req.body
  )

  res.status(201).json(
    new ApiResponse(201, "Bid placed successfully", bid)
  )
})

export const getBidsByShipment = catchAsync(async (req: AuthRequest, res: Response) => {
  const bids = await bidService.getBidsByShipment(
    req.params.id as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Bids fetched", bids)
  )
})

export const acceptBid = catchAsync(async (req: AuthRequest, res: Response) => {
  const bid = await bidService.acceptBid(
    req.params.id as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Bid accepted successfully", bid)
  )
})

export const withdrawBid = catchAsync(async (req: AuthRequest, res: Response) => {
  const bid = await bidService.withdrawBid(
    req.params.id as string,
    req.user!._id.toString(),
    req.body.reason
  )

  res.status(200).json(
    new ApiResponse(200, "Bid withdrawn successfully", bid)
  )
})