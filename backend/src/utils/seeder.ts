import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import User from "../models/User.model"
import { ROLES, KYC_STATUS } from "../constants"
import logger from "../config/logger"

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    logger.info("Connected to DB for seeding")

    const existingAdmin = await User.findOne({ role: ROLES.ADMIN })

    if (existingAdmin) {
      logger.info("Admin already exists")
      process.exit(0)
    }

    await User.create({
      name:      "Super Admin",
      email:     process.env.ADMIN_EMAIL,
      phone:     "9999999999",
      password:  process.env.ADMIN_PASSWORD,
      role:      ROLES.ADMIN,
      kycStatus: KYC_STATUS.APPROVED,
      isVerified: true,
      isActive:   true,
    })

    logger.info("Admin created successfully")
    process.exit(0)
  } catch (error) {
    logger.error(`Seeding failed: ${error}`)
    process.exit(1)
  }
}

seedAdmin()