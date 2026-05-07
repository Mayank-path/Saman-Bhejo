import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import compression from "compression"
import logger from "./config/logger"
import { globalRateLimiter } from "./middleware/security/rateLimiter"
import errorHandler from "./middleware/errorHandler"
import notFound from "./middleware/notFound"
import authRoutes from "./routes/auth.routes"
import shipmentRoutes from "./routes/shipment.routes"
import bidRoutes from "./routes/bid.routes"
import chatRoutes from "./routes/chat.routes"
import reviewRoutes from "./routes/review.routes"
import notificationRoutes from "./routes/notification.routes"
import userRoutes from "./routes/user.routes"
import adminRoutes from "./routes/admin.routes"



const app = express()

app.use(helmet())

app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}))

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))

app.use(compression())

app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message.trim()) },
    skip:   () => process.env.NODE_ENV === "test",
  })
)

app.use("/api", globalRateLimiter)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/shipments", shipmentRoutes)
app.use("/api/v1/bids", bidRoutes)
app.use("/api/v1/chats", chatRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/admin", adminRoutes)



app.get("/health", (req, res) => {
  res.status(200).json({
    success:   true,
    message:   "Server is running",
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
  })
})

app.use(notFound)
app.use(errorHandler)

export default app