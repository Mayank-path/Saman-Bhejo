import Notification, { INotification } from "../models/Notification.model"
import { NOTIFICATION_TYPE } from "../constants"
import { getIO } from "../sockets"
import logger from "../config/logger"

const createNotification = async (
  recipientId: string,
  type:        string,
  title:       string,
  message:     string,
  data:        Record<string, unknown> = {}
): Promise<INotification> => {

  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    data,
  })

  try {
    const io = getIO()
    io.to(`user:${recipientId}`).emit("notification", {
      _id:     notification._id,
      type,
      title,
      message,
      data,
      isRead:  false,
      createdAt: notification.createdAt,
    })
  } catch (err) {
    logger.error(`Socket notification failed: ${err}`)
  }

  return notification
}

const getMyNotifications = async (
  userId: string,
  page:   number = 1,
  limit:  number = 10
): Promise<{ notifications: INotification[], total: number, unread: number }> => {

  const skip  = (page - 1) * limit
  const total = await Notification.countDocuments({ recipient: userId })
  const unread = await Notification.countDocuments({ recipient: userId, isRead: false })

  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return { notifications, total, unread }
}

const markAllAsRead = async (userId: string): Promise<void> => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  )
}

const markOneAsRead = async (
  notificationId: string,
  userId:         string
): Promise<void> => {
  await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true }
  )
}

// helper functions used by other services
const notifyBidReceived = async (
  shipperId:   string,
  truckerName: string,
  shipmentId:  string,
  amount:      number
): Promise<void> => {
  await createNotification(
    shipperId,
    NOTIFICATION_TYPE.BID_RECEIVED,
    "New Bid Received",
    `${truckerName} placed a bid of ₹${amount} on your shipment`,
    { shipmentId, amount }
  )
}

const notifyBidAccepted = async (
  truckerId:  string,
  shipmentId: string,
  amount:     number
): Promise<void> => {
  await createNotification(
    truckerId,
    NOTIFICATION_TYPE.BID_ACCEPTED,
    "Bid Accepted",
    `Your bid of ₹${amount} has been accepted`,
    { shipmentId, amount }
  )
}

const notifyBidRejected = async (
  truckerId:  string,
  shipmentId: string
): Promise<void> => {
  await createNotification(
    truckerId,
    NOTIFICATION_TYPE.BID_REJECTED,
    "Bid Rejected",
    "Your bid was not selected for this shipment",
    { shipmentId }
  )
}

export const notificationService = {
  createNotification,
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
  notifyBidReceived,
  notifyBidAccepted,
  notifyBidRejected,
}