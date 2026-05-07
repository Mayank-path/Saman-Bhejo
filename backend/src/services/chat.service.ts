import Chat, { IChat } from "../models/Chat.model"
import Shipment from "../models/Shipment.model"
import ApiError from "../utils/ApiError"
import { SHIPMENT_STATUS } from "../constants"

const getOrCreateChat = async (
  shipmentId: string,
  userId:     string
): Promise<IChat> => {

  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new ApiError(404, "Shipment not found")
  }

  if (shipment.status === SHIPMENT_STATUS.OPEN) {
    throw new ApiError(400, "Chat is only available after a bid is accepted")
  }

  const isParticipant =
    shipment.shipper.toString()         === userId ||
    shipment.assignedTrucker?.toString() === userId

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this shipment")
  }

  let chat = await Chat.findOne({ shipment: shipmentId })

  if (!chat) {
    chat = await Chat.create({
      shipment:     shipmentId,
      participants: [shipment.shipper, shipment.assignedTrucker as any],
      messages:     [],
    })
  }

  return chat
}

const getChatHistory = async (
  shipmentId: string,
  userId:     string
): Promise<IChat> => {

  const chat = await Chat.findOne({ shipment: shipmentId })
    .populate("participants", "name avatar role")
    .populate("messages.sender", "name avatar role")

  if (!chat) {
    throw new ApiError(404, "Chat not found")
  }

  const isParticipant = chat.participants.some(
    (p: any) => p._id.toString() === userId
  )

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this chat")
  }

  return chat
}

const sendMessage = async (
  shipmentId: string,
  senderId:   string,
  content:    string
): Promise<IChat> => {

  const chat = await Chat.findOne({ shipment: shipmentId })

  if (!chat) {
    throw new ApiError(404, "Chat not found. Create chat first.")
  }

  const isParticipant = chat.participants.some(
    (p: any) => p.toString() === senderId
  )

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this chat")
  }

  chat.messages.push({
    sender:    senderId as any,
    content,
    readBy:    [senderId as any],
    createdAt: new Date(),
  })

  chat.lastMessage   = content
  chat.lastMessageAt = new Date()

  await chat.save()

  await chat.populate("messages.sender", "name avatar role")

  return chat
}

const markAsRead = async (
  shipmentId: string,
  userId:     string
): Promise<void> => {

  const chat = await Chat.findOne({ shipment: shipmentId })

  if (!chat) return

  chat.messages.forEach((message: any) => {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId)
    }
  })

  await chat.save()
}

export const chatService = {
  getOrCreateChat,
  getChatHistory,
  sendMessage,
  markAsRead,
}