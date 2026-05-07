import { Router } from "express"
import {
  getPendingKyc,
  approveKyc,
  rejectKyc,
  getAllUsers,
  toggleUserStatus,
  getPlatformStats,
} from "../controllers/admin.controller"
import authenticate from "../middleware/auth/authenticate"
import authorize from "../middleware/auth/authorize"
import { ROLES } from "../constants"

const router = Router()

router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

router.get("/kyc",                    getPendingKyc)
router.patch("/kyc/:userId/approve",  approveKyc)
router.patch("/kyc/:userId/reject",   rejectKyc)
router.get("/users",                  getAllUsers)
router.patch("/users/:id/toggle",     toggleUserStatus)
router.get("/stats",                  getPlatformStats)

export default router