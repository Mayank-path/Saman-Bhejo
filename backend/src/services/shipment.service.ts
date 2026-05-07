import Shipment, { IShipment } from "../models/Shipment.model"
import ApiError from "../utils/ApiError"
import { SHIPMENT_STATUS, GEO, BID_RULES } from "../constants"
import { getCache, setCache, deleteCache } from "../config/redis"

interface CreateShipmentInput {
  title:         string
  description:   string
  goodsType:     string
  weightTons:    number
  quantity:      number
  pickup:        object
  delivery:      object
  scheduledDate: Date
  budget:        { min: number, max: number }
}

const createShipment = async (
  shipperId: string,
  input: CreateShipmentInput
): Promise<IShipment> => {

  const biddingExpiresAt = new Date()
  biddingExpiresAt.setHours(biddingExpiresAt.getHours() + BID_RULES.EXPIRY_HOURS)

  const shipment = await Shipment.create({
    ...input,
    shipper:          shipperId,
    biddingExpiresAt,
    radiusKm:         GEO.DEFAULT_RADIUS_KM,
  })

  await deleteCache(`shipments:${shipperId}`)

  return shipment
}

const getMyShipments = async (
  shipperId: string,
  page:  number = 1,
  limit: number = 10
): Promise<{ shipments: IShipment[], total: number }> => {

  const cacheKey = `shipments:${shipperId}:${page}:${limit}`
  const cached   = await getCache<{ shipments: IShipment[], total: number }>(cacheKey)
  if (cached) return cached

  const skip  = (page - 1) * limit
  const total = await Shipment.countDocuments({ shipper: shipperId })

  const shipments = await Shipment.find({ shipper: shipperId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("assignedTrucker", "name phone rating avatar")
    .populate("acceptedBid",     "amount estimatedDeliveryDate")

  const result = { shipments, total }
  await setCache(cacheKey, result, 120)

  return result
}

const getNearbyShipments = async (
  lat:   number,
  lng:   number,
  page:  number = 1,
  limit: number = 10
): Promise<{ shipments: IShipment[], total: number }> => {

  const cacheKey = `nearby:${lat}:${lng}:${page}`
  const cached   = await getCache<{ shipments: IShipment[], total: number }>(cacheKey)
  if (cached) return cached

  const skip = (page - 1) * limit

  const query = {
    status: SHIPMENT_STATUS.OPEN,
    biddingExpiresAt: { $gt: new Date() },
    "pickup.location": {
      $near: {
        $geometry: {
          type:        "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: GEO.DEFAULT_RADIUS_KM * 1000,
      },
    },
  }

  const total     = await Shipment.countDocuments(query)
  const shipments = await Shipment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("shipper", "name phone rating avatar")

  const result = { shipments, total }
  await setCache(cacheKey, result, 60)

  return result
}

const getShipmentById = async (
  shipmentId: string,
  userId:     string
): Promise<IShipment> => {

  const shipment = await Shipment.findById(shipmentId)
    .populate("shipper",         "name phone rating avatar")
    .populate("assignedTrucker", "name phone rating avatar vehicleType vehicleNumber")
    .populate("acceptedBid",     "amount estimatedDeliveryDate estimatedPickupDate")

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  return shipment
}

const cancelShipment = async (
  shipmentId: string,
  userId:     string,
  reason:     string
): Promise<IShipment> => {

  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  if (shipment.shipper.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to cancel this shipment")
  }

  if ([SHIPMENT_STATUS.COMPLETED, SHIPMENT_STATUS.CANCELLED].includes(shipment.status as any)) {
    throw new ApiError(400, "This shipment cannot be cancelled")
  }

  if (shipment.status === SHIPMENT_STATUS.IN_TRANSIT) {
    throw new ApiError(400, "Cannot cancel a shipment that is already in transit")
  }

  shipment.status             = SHIPMENT_STATUS.CANCELLED
  shipment.cancellationReason = reason
  shipment.cancelledBy        = userId as any
  await shipment.save()

  await deleteCache(`shipments:${userId}`)

  return shipment
}

export const shipmentService = {
  createShipment,
  getMyShipments,
  getNearbyShipments,
  getShipmentById,
  cancelShipment,
}