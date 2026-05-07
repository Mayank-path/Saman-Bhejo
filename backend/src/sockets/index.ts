import { Server, Socket } from "socket.io"
import http from "http"
import jwt from "jsonwebtoken"
import logger from "../config/logger"

let io: Server

export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  })

  // middleware — verify JWT token on socket connection
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication required"))
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string }

      socket.data.userId = decoded.id
      next()
    } catch (err) {
      next(new Error("Invalid token"))
    }
  })

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId
    logger.info(`Socket connected: ${socket.id} user: ${userId}`)
    
    socket.join(`user:${userId}`)
    logger.info(`User ${userId} joined personal room`)

    // join a shipment room to receive messages
    // frontend calls: socket.emit("joinRoom", shipmentId)
    socket.on("joinRoom", (shipmentId: string) => {
      socket.join(`shipment:${shipmentId}`)
      logger.info(`User ${userId} joined room shipment:${shipmentId}`)
    })

    // leave a shipment room
    socket.on("leaveRoom", (shipmentId: string) => {
      socket.leave(`shipment:${shipmentId}`)
      logger.info(`User ${userId} left room shipment:${shipmentId}`)
    })

    // typing indicator
    // frontend calls: socket.emit("typing", { shipmentId, isTyping: true })
    socket.on("typing", ({ shipmentId, isTyping }: { shipmentId: string, isTyping: boolean }) => {
      socket.to(`shipment:${shipmentId}`).emit("userTyping", {
        userId,
        isTyping,
      })
    })

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

// use this anywhere in the app to emit events
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}