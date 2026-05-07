import cron from "node-cron"
import Notification from "../models/Notification.model"
import logger from "../config/logger"

// runs every day at midnight
export const cleanupJob = cron.schedule("0 0 * * *", async () => {
  logger.info("Running cleanup job...")

  try {
    // delete notifications older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const deleted = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead:    true,
    })

    logger.info(`Cleanup job: deleted ${deleted.deletedCount} old notifications`)

  } catch (error) {
    logger.error(`Cleanup job failed: ${error}`)
  }
 
})