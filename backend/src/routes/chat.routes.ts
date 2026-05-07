import { Router } from "express"
import {
  getOrCreateChat,
  getChatHistory,
  sendMessage,
  markAsRead,
} from "../controllers/chat.controller"
import authenticate from "../middleware/auth/authenticate"
import validate from "../middleware/validate"
import { sendMessageSchema } from "../validations/chat.validation"

const router = Router()

router.use(authenticate)

router.post("/:shipmentId",         getOrCreateChat)
router.get("/:shipmentId",          getChatHistory)
router.post("/:shipmentId/message", validate(sendMessageSchema), sendMessage)
router.patch("/:shipmentId/read",   markAsRead)

export default router