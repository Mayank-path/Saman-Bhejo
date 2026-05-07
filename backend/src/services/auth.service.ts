import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User.model"
import ApiError from "../utils/ApiError"

interface RegisterInput {
  name:     string
  email:    string
  phone:    string
  password: string
  role:     string
}

interface LoginInput {
  email:    string
  password: string
}

interface TokenPayload {
  id: string
}

interface AuthTokens {
  accessToken:  string
  refreshToken: string
}

// ── Token Generators ──────────────────────────────────────────────────────────

const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { id: userId } as TokenPayload,
    process.env.JWT_SECRET as string,
    { expiresIn:  "15m" }
  )
}

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId } as TokenPayload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  )
}

const generateTokens = (userId: string): AuthTokens => {
  return {
    accessToken:  generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  }
}

// ── Register ──────────────────────────────────────────────────────────────────

const register = async (input: RegisterInput): Promise<{ user: IUser, tokens: AuthTokens }> => {
  const { name, email, phone, password, role } = input

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(400, "Email already registered")
    }
    throw new ApiError(400, "Phone number already registered")
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  })

  const tokens = generateTokens(user._id.toString())

  user.refreshToken = tokens.refreshToken
  await user.save()

  return { user, tokens }
}

// ── Login ─────────────────────────────────────────────────────────────────────

const login = async (input: LoginInput): Promise<{ user: IUser, tokens: AuthTokens }> => {
  const { email, password } = input

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  if (!user.isActive) {
    throw new ApiError(401, "Your account has been deactivated")
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password")
  }

  const tokens = generateTokens(user._id.toString())

  user.refreshToken = tokens.refreshToken
  await user.save()

  return { user, tokens }
}

// ── Refresh Token ─────────────────────────────────────────────────────────────

const refreshToken = async (token: string): Promise<{ accessToken: string }> => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as TokenPayload

  const user = await User.findById(decoded.id).select("+refreshToken")

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, "Invalid refresh token")
  }

  const accessToken = generateAccessToken(user._id.toString())

  return { accessToken }
}

// ── Logout ────────────────────────────────────────────────────────────────────

const logout = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}

export const authService = {
  register,
  login,
  refreshToken,
  logout,
}