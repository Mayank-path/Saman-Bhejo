import Review, { IReview } from "../models/Review.model"
import Shipment from "../models/Shipment.model"
import ApiError from "../utils/ApiError"
import { SHIPMENT_STATUS } from "../constants"

const createReview = async (
  shipmentId: string,
  reviewerId: string,
  input: {
    rating:  number
    comment: string
  }
): Promise<IReview> => {

  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  if (shipment.status !== SHIPMENT_STATUS.COMPLETED) {
    throw new ApiError(400, "You can only review completed shipments")
  }

  const isShipper = shipment.shipper.toString()          === reviewerId
  const isTrucker = shipment.assignedTrucker?.toString() === reviewerId

  if (!isShipper && !isTrucker) {
    throw new ApiError(403, "You are not a participant of this shipment")
  }

  const revieweeId = isShipper
    ? shipment.assignedTrucker?.toString()
    : shipment.shipper.toString()

  if (!revieweeId) {
    throw new ApiError(400, "Cannot determine reviewee")
  }

  const existingReview = await Review.findOne({
    shipment: shipmentId,
    reviewer: reviewerId,
  })

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this shipment")
  }

  const review = await Review.create({
    shipment: shipmentId,
    reviewer: reviewerId,
    reviewee: revieweeId,
    rating:   input.rating,
    comment:  input.comment,
  })

  return review
}

const getReviewsByUser = async (
  userId: string
): Promise<IReview[]> => {

  const reviews = await Review.find({ reviewee: userId })
    .populate("reviewer", "name avatar role")
    .populate("shipment", "title pickup delivery")
    .sort({ createdAt: -1 })

  return reviews
}

export const reviewService = {
  createReview,
  getReviewsByUser,
}