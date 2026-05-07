import { Response } from "express"
import { chatService } from "../services/chat.service"
import ApiResponse from "../utils/ApiResponse"
import catchAsync from "../utils/catchAsync"
import { AuthRequest } from "../middleware/auth/authenticate"
import { getIO } from "../sockets"

export const getOrCreateChat = catchAsync(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.getOrCreateChat(
    req.params.shipmentId as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Chat ready", chat)
  )
})

export const getChatHistory = catchAsync(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.getChatHistory(
    req.params.shipmentId as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Chat history fetched", chat)
  )
})

export const sendMessage = catchAsync(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.sendMessage(
    req.params.shipmentId as string,
    req.user!._id.toString(),
    req.body.content
  )

  // get the last message that was just added
  const newMessage = chat.messages[chat.messages.length - 1]

  // emit to all participants in real time via socket
  const io = getIO()
  io.to(`shipment:${req.params.shipmentId}`).emit("newMessage", {
    shipmentId: req.params.shipmentId,
    message:    newMessage,
  })

  res.status(201).json(
    new ApiResponse(201, "Message sent", newMessage)
  )
})

export const markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  await chatService.markAsRead(
    req.params.shipmentId as string,
    req.user!._id.toString()
  )

  res.status(200).json(
    new ApiResponse(200, "Messages marked as read", null)
  )
})