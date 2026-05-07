import { Router } from "express"
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadKycDocuments,
  getUserById,
} from "../controllers/user.controller"
import authenticate from "../middleware/auth/authenticate"
import authorize from "../middleware/auth/authorize"
import validate from "../middleware/validate"
import { upload } from "../middleware/upload/multer"
import { updateProfileSchema } from "../validations/user.validation"
import { ROLES } from "../constants"

const router = Router()

router.use(authenticate)

router.get("/profile",                    getProfile)
router.patch("/profile",                  validate(updateProfileSchema), updateProfile)
router.post("/avatar",                    upload.single("avatar"),       uploadAvatar)
router.post("/kyc",
  authorize(ROLES.TRUCKER),
  upload.fields([
    { name: "license",   maxCount: 1 },
    { name: "permit",    maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  uploadKycDocuments
)
router.get("/:id",                        getUserById)

export default router