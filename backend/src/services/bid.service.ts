import Bid, { IBid } from "../models/Bid.model"
import Shipment from "../models/Shipment.model"
import User from "../models/User.model"
import ApiError from "../utils/ApiError"
import { BID_STATUS, SHIPMENT_STATUS, BID_RULES, KYC_STATUS } from "../constants"
import { getCache, setCache, deleteCache } from "../config/redis"
import { notificationService } from "./notification.service"


const placeBid = async (
  truckerId: string,
  input: {
    shipmentId:           string
    amount:               number
    note:                 string
    estimatedPickupDate:  Date
    estimatedDeliveryDate: Date
  }
): Promise<IBid> => {

  const trucker = await User.findById(truckerId)

  if (!trucker) {
    throw new ApiError(404, "Trucker not found")
  }

  if (trucker.kycStatus !== KYC_STATUS.APPROVED) {
    throw new ApiError(403, "Your KYC is not approved yet. You cannot place bids.")
  }

  const shipment = await Shipment.findById(input.shipmentId)

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  if (shipment.status !== SHIPMENT_STATUS.OPEN) {
    throw new ApiError(400, "This shipment is no longer accepting bids")
  }

  if (new Date() > shipment.biddingExpiresAt) {
    throw new ApiError(400, "Bidding has expired for this shipment")
  }

  if (shipment.bidCount >= BID_RULES.MAX_BIDS_PER_SHIPMENT) {
    throw new ApiError(400, "This shipment has reached maximum number of bids")
  }

  if (shipment.shipper.toString() === truckerId) {
    throw new ApiError(400, "You cannot bid on your own shipment")
  }

  const existingBid = await Bid.findOne({
    shipment: input.shipmentId,
    trucker:  truckerId,
  })

  if (existingBid) {
    throw new ApiError(400, "You have already placed a bid on this shipment")
  }

  const bid = await Bid.create({
    shipment:             input.shipmentId,
    trucker:              truckerId,
    amount:               input.amount,
    note:                 input.note,
    estimatedPickupDate:  input.estimatedPickupDate,
    estimatedDeliveryDate: input.estimatedDeliveryDate,
  })

  await Shipment.findByIdAndUpdate(input.shipmentId, {
    $inc: { bidCount: 1 },
  })

  await deleteCache(`bids:${input.shipmentId}`)

  const truckerUser = await User.findById(truckerId)
  if (truckerUser) {
    await notificationService.notifyBidReceived(
      shipment.shipper.toString(),
      truckerUser.name,
      input.shipmentId,
      input.amount
    )
  }

  return bid
}

const getBidsByShipment = async (
  shipmentId: string,
  userId:     string
): Promise<IBid[]> => {

  const cacheKey = `bids:${shipmentId}`
  const cached   = await getCache<IBid[]>(cacheKey)
  if (cached) return cached

  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  if (shipment.shipper.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to view these bids")
  }

  const bids = await Bid.find({ shipment: shipmentId })
    .populate("trucker", "name phone rating avatar vehicleType vehicleNumber onTimeDeliveryRate totalDeliveries")
    .sort({ score: -1 })

  await setCache(cacheKey, bids, 60)

  return bids
}

const acceptBid = async (
    bidId:     string,
    shipperId: string
  ): Promise<IBid> => {
  
    const bid = await Bid.findById(bidId)
  
    if (!bid) {
      throw new ApiError(404, "Bid not found")
    }
  
    const shipment = await Shipment.findById(bid.shipment)
  
    if (!shipment) {
      throw new ApiError(404, "Shipment not found")
    }
  
    if (shipment.shipper.toString() !== shipperId) {
      throw new ApiError(403, "You are not authorized to accept this bid")
    }
  
    if (shipment.status !== SHIPMENT_STATUS.OPEN) {
      throw new ApiError(400, "This shipment is no longer accepting bids")
    }
  
    if (bid.status !== BID_STATUS.PENDING) {
      throw new ApiError(400, "This bid is no longer available")
    }
  
    bid.status = BID_STATUS.ACCEPTED
    await bid.save()
  
    await Bid.updateMany(
      {
        shipment: bid.shipment,
        _id:      { $ne: bidId },
        status:   BID_STATUS.PENDING,
      },
      { status: BID_STATUS.REJECTED }
    )
  
    await Shipment.findByIdAndUpdate(bid.shipment, {
      status:          SHIPMENT_STATUS.ASSIGNED,
      assignedTrucker: bid.trucker,
      acceptedBid:     bidId,
    })
  
    await deleteCache(`bids:${bid.shipment}`)

    await notificationService.notifyBidAccepted(
      bid.trucker.toString(),
      bid.shipment.toString(),
      bid.amount
    )
  
    return bid
  }
const withdrawBid = async (
  bidId:    string,
  truckerId: string,
  reason:   string
): Promise<IBid> => {

  const bid = await Bid.findById(bidId)

  if (!bid) {
    throw new ApiError(404, "Bid not found")
  }

  if (bid.trucker.toString() !== truckerId) {
    throw new ApiError(403, "You are not authorized to withdraw this bid")
  }

  if (bid.status !== BID_STATUS.PENDING) {
    throw new ApiError(400, "You can only withdraw pending bids")
  }

  bid.status             = BID_STATUS.WITHDRAWN
  bid.cancellationReason = reason
  await bid.save()

  await Shipment.findByIdAndUpdate(bid.shipment, {
    $inc: { bidCount: -1 },
  })

  await deleteCache(`bids:${bid.shipment}`)

  return bid
}

export const bidService = {
  placeBid,
  getBidsByShipment,
  acceptBid,
  withdrawBid,
}