import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../../models/User.model"
import ApiError from "../../utils/ApiError"
import catchAsync from "../../utils/catchAsync"

export interface AuthRequest extends Request {
  user?: IUser
}

const authenticate = catchAsync(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token provided")
  }

  const token = authHeader.split(" ")[1]

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string }

  const user = await User.findById(decoded.id)

  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  if (!user.isActive) {
    throw new ApiError(401, "Your account has been deactivated")
  }

  req.user = user
  next()
})

export default authenticate