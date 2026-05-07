import { Router } from "express"
import {
  createReview,
  getReviewsByUser,
} from "../controllers/review.controller"
import authenticate from "../middleware/auth/authenticate"
import validate from "../middleware/validate"
import { createReviewSchema } from "../validations/review.validation"

const router = Router()

router.use(authenticate)

router.post("/shipment/:shipmentId",  validate(createReviewSchema), createReview)
router.get("/user/:userId",           getReviewsByUser)

export default router