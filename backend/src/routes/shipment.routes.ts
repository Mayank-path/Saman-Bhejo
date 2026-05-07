import { Router } from "express"
import {
  createShipment,
  getMyShipments,
  getNearbyShipments,
  getShipmentById,
  cancelShipment,
} from "../controllers/shipment.controller"
import authenticate from "../middleware/auth/authenticate"
import authorize from "../middleware/auth/authorize"
import validate from "../middleware/validate"
import { ROLES } from "../constants"
import {
  createShipmentSchema,
  cancelShipmentSchema,
} from "../validations/shipment.validation"

const router = Router()

router.use(authenticate)

router.post("/",
  authorize(ROLES.SHIPPER),
  validate(createShipmentSchema),
  createShipment
)

router.get("/",
  authorize(ROLES.SHIPPER),
  getMyShipments
)

router.get("/nearby",
  authorize(ROLES.TRUCKER),
  getNearbyShipments
)

router.get("/:id",
  getShipmentById
)

router.patch("/:id/cancel",
  authorize(ROLES.SHIPPER),
  validate(cancelShipmentSchema),
  cancelShipment
)

export default router