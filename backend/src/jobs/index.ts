import { bidExpiryJob } from "./bidExpiry.job"
import { cleanupJob } from "./cleanup.job"
import logger from "../config/logger"

export const startJobs = (): void => {
  bidExpiryJob.start()
  cleanupJob.start()
  logger.info("Cron jobs started")
}