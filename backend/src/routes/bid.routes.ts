import { Router } from "express"
import {
  placeBid,
  getBidsByShipment,
  acceptBid,
  withdrawBid,
} from "../controllers/bid.controller"
import authenticate from "../middleware/auth/authenticate"
import authorize from "../middleware/auth/authorize"
import validate from "../middleware/validate"
import { ROLES } from "../constants"
import { createBidSchema, withdrawBidSchema } from "../validations/bid.validation"
import { bidRateLimiter } from "../middleware/security/rateLimiter"

const router = Router()

router.use(authenticate)

router.post("/",
  authorize(ROLES.TRUCKER),
  bidRateLimiter,
  validate(createBidSchema),
  placeBid
)

router.get("/shipment/:id",
  authorize(ROLES.SHIPPER),
  getBidsByShipment
)

router.patch("/:id/accept",
  authorize(ROLES.SHIPPER),
  acceptBid
)

router.patch("/:id/withdraw",
  authorize(ROLES.TRUCKER),
  validate(withdrawBidSchema),
  withdrawBid
)

export default router