import dotenv from "dotenv"
dotenv.config()

import http from "http"
import app from "./app"
import connectDB from "./config/db"
import { connectRedis } from "./config/redis"
import logger from "./config/logger"
import { initSocket } from "./sockets"
import { startJobs } from "./jobs"
import { connectCloudinary } from "./config/cloudinary"


import "./models/User.model"
import "./models/Shipment.model"
import "./models/Bid.model"
import "./models/Chat.model"
import "./models/Review.model"
import "./models/Payment.model"
import "./models/Notification.model"

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

initSocket(server)

const boot = async () => {
  try {
    await connectDB()
    await connectRedis()
    connectCloudinary()
    startJobs()

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error(`Boot failed: ${error}`)
    process.exit(1)
  }
}

boot()

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`)
  server.close(() => {
    logger.info("Server closed.")
    process.exit(0)
  })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT",  () => shutdown("SIGINT"))

process.on("unhandledRejection", (reason: unknown) => {
  logger.error(`Unhandled Rejection: ${reason}`)
  server.close(() => process.exit(1))
})

process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})