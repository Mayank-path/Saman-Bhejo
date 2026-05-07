import { Response, NextFunction } from "express"
import { AuthRequest } from "./authenticate"
import ApiError from "../../utils/ApiError"
import { ROLES } from "../../constants"
import type { Role } from "../../constants"

const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated")
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      throw new ApiError(403, "You are not authorized to perform this action")
    }

    next()
  }
}

export default authorize