import cron from "node-cron"
import Shipment from "../models/Shipment.model"
import Bid from "../models/Bid.model"
import { SHIPMENT_STATUS, BID_STATUS, GEO } from "../constants"
import { notificationService } from "../services/notification.service"
import logger from "../config/logger"

// runs every 5 minutes
export const bidExpiryJob = cron.schedule("*/5 * * * *", async () => {
  logger.info("Running bid expiry job...")

  try {
    // ── Step 1: Find all OPEN shipments whose bidding time has expired ────────
    const expiredShipments = await Shipment.find({
      status:           SHIPMENT_STATUS.OPEN,
      biddingExpiresAt: { $lt: new Date() },
    })

    for (const shipment of expiredShipments) {
      // mark all pending bids on this shipment as expired
      await Bid.updateMany(
        {
          shipment: shipment._id,
          status:   BID_STATUS.PENDING,
        },
        {
          status:        BID_STATUS.EXPIRED,
          isAutoExpired: true,
        }
      )

      // mark shipment as cancelled if no bid was accepted
      if (!shipment.acceptedBid) {
        shipment.status             = SHIPMENT_STATUS.CANCELLED
        shipment.cancellationReason = "No bids received within the bidding window"
        await shipment.save()

        // notify shipper
        await notificationService.createNotification(
          shipment.shipper.toString(),
          "shipment_update",
          "Shipment Expired",
          "Your shipment received no bids and has been closed. You can repost it.",
          { shipmentId: shipment._id }
        )

        logger.info(`Shipment ${shipment._id} expired — no bids received`)
      }
    }

    // ── Step 2: Auto expand radius after 30 minutes if no bids ───────────────
    const thirtyMinsAgo = new Date(Date.now() - GEO.EXPAND_AFTER_MINS * 60 * 1000)

    const shipmentsToExpand = await Shipment.find({
      status:           SHIPMENT_STATUS.OPEN,
      isRadiusExpanded: false,
      bidCount:         0,
      createdAt:        { $lt: thirtyMinsAgo },
      biddingExpiresAt: { $gt: new Date() },
    })

    for (const shipment of shipmentsToExpand) {
      shipment.radiusKm         = GEO.EXPANDED_RADIUS_KM
      shipment.isRadiusExpanded = true
      await shipment.save()

      // notify shipper that radius was expanded
      await notificationService.createNotification(
        shipment.shipper.toString(),
        "shipment_update",
        "Search Radius Expanded",
        `No bids received yet. We expanded the search radius to ${GEO.EXPANDED_RADIUS_KM}km to find more truckers.`,
        { shipmentId: shipment._id }
      )

      logger.info(`Shipment ${shipment._id} radius expanded to ${GEO.EXPANDED_RADIUS_KM}km`)
    }

  } catch (error) {
    logger.error(`Bid expiry job failed: ${error}`)
  }

})