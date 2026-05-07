import multer from "multer"
import ApiError from "../../utils/ApiError"
import { UPLOAD } from "../../constants"

const storage = multer.memoryStorage()

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    ...UPLOAD.ALLOWED_IMAGE_TYPES,
    ...UPLOAD.ALLOWED_DOC_TYPES,
  ]

  if (allowedTypes.includes(file.mimetype as any )) {
    cb(null, true)
  } else {
    cb(new ApiError(400, "Invalid file type. Only images and PDFs are allowed") as any)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
})