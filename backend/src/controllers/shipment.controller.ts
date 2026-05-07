import { Response } from "express"
import { shipmentService } from "../services/shipment.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"
import { PAGINATION } from "../constants"

export const createShipment = catchAsync(async (req: AuthRequest, res: Response) => {
  const shipment = await shipmentService.createShipment(
    req.user!._id.toString(),
    req.body
  )

  res.status(201).json(
    new ApiResponse(201, "Shipment created successfully", shipment)
  )
})

export const getMyShipments = catchAsync(async (req: AuthRequest, res: Response) => {
  const page  = parseInt(req.query.page  as string) || PAGINATION.DEFAULT_PAGE
  const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT

  const { shipments, total } = await shipmentService.getMyShipments(
    req.user!._id.toString(),
    page,
    limit
  )

  res.status(200).json(
    new ApiResponse(200, "Shipments fetched", {
      shipments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  )
})

export const getNearbyShipments = catchAsync(async (req: AuthRequest, res: Response) => {
  const { lat, lng } = req.query
  const page  = parseInt(req.query.page  as string) || PAGINATION.DEFAULT_PAGE
  const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT

  if (!lat || !lng) {
    return res.status(400).json(
      new ApiResponse(400, "lat and lng query parameters are required", null)
    )
  }

  const { shipments, total } = await shipmentService.getNearbyShipments(
    parseFloat(lat as string),
    parseFloat(lng as string),
    page,
    limit
  )

  res.status(200).json(
    new ApiResponse(200, "Nearby shipments fetched", {
      shipments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  )
})

export const getShipmentById = catchAsync(async (req: AuthRequest, res: Response) => {
  const shipment = await shipmentService.getShipmentById(
    req.params.id as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Shipment fetched", shipment)
  )
})

export const cancelShipment = catchAsync(async (req: AuthRequest, res: Response) => {
  const shipment = await shipmentService.cancelShipment(
    req.params.id as string,
    req.user!._id.toString(),
    req.body.reason
  )

  res.status(200).json(
    new ApiResponse(200, "Shipment cancelled", shipment)
  )
})