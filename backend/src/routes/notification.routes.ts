import { Router } from "express"
import {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
} from "../controllers/notification.controller"
import authenticate from "../middleware/auth/authenticate"

const router = Router()

router.use(authenticate)

router.get("/",              getMyNotifications)
router.patch("/read-all",    markAllAsRead)
router.patch("/:id/read",    markOneAsRead)

export default router