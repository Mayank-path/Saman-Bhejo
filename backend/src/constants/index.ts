export const ROLES = {
    SHIPPER: "shipper",
    TRUCKER: "trucker",
    ADMIN:   "admin",
  } as const
  
  export const KYC_STATUS = {
    PENDING:   "pending",
    SUBMITTED: "submitted",
    APPROVED:  "approved",
    REJECTED:  "rejected",
  } as const
  
  export const SHIPMENT_STATUS = {
    OPEN:       "open",
    ASSIGNED:   "assigned",
    IN_TRANSIT: "in_transit",
    DELIVERED:  "delivered",
    COMPLETED:  "completed",
    CANCELLED:  "cancelled",
    DISPUTED:   "disputed",
  } as const
  
  export const BID_STATUS = {
    PENDING:   "pending",
    ACCEPTED:  "accepted",
    REJECTED:  "rejected",
    WITHDRAWN: "withdrawn",
    EXPIRED:   "expired",
  } as const
  
  export const PAYMENT_STATUS = {
    PENDING:  "pending",
    HELD:     "held",
    RELEASED: "released",
    REFUNDED: "refunded",
    FAILED:   "failed",
  } as const
  
  export const NOTIFICATION_TYPE = {
    BID_RECEIVED:    "bid_received",
    BID_ACCEPTED:    "bid_accepted",
    BID_REJECTED:    "bid_rejected",
    SHIPMENT_UPDATE: "shipment_update",
    PAYMENT_UPDATE:  "payment_update",
    CHAT_MESSAGE:    "chat_message",
    KYC_UPDATE:      "kyc_update",
    SYSTEM:          "system",
  } as const
  
  export const GOODS_TYPE = {
    GENERAL:      "general",
    PERISHABLE:   "perishable",
    FRAGILE:      "fragile",
    HAZARDOUS:    "hazardous",
    OVERSIZED:    "oversized",
    LIVESTOCK:    "livestock",
    REFRIGERATED: "refrigerated",
  } as const
  
  export const VEHICLE_TYPE = {
    MINI_TRUCK:   "mini_truck",
    PICKUP:       "pickup",
    MEDIUM_TRUCK: "medium_truck",
    HEAVY_TRUCK:  "heavy_truck",
    TRAILER:      "trailer",
    REFRIGERATED: "refrigerated",
    TANKER:       "tanker",
  } as const
  
  export const BID_SCORE_WEIGHTS = {
    PRICE:   0.60,
    RATING:  0.25,
    ON_TIME: 0.15,
  } as const
  
  export const GEO = {
    DEFAULT_RADIUS_KM:  100,
    EXPANDED_RADIUS_KM: 200,
    EXPAND_AFTER_MINS:  30,
    MAX_RADIUS_KM:      500,
  } as const
  
  export const BID_RULES = {
    MAX_BIDS_PER_SHIPMENT: 20,
    EXPIRY_HOURS:          24,
    MIN_AMOUNT:            100,
    MAX_AMOUNT:            999999,
    CANCELLATION_PENALTY:  0.10,
  } as const
  
  export const RATE_LIMITS = {
    GLOBAL_WINDOW_MS: 15 * 60 * 1000,
    GLOBAL_MAX:       100,
    AUTH_WINDOW_MS:   15 * 60 * 1000,
    AUTH_MAX:         10,
    BID_WINDOW_MS:    60 * 1000,
    BID_MAX:          5,
    OTP_WINDOW_MS:    10 * 60 * 1000,
    OTP_MAX:          3,
  } as const
  
  export const PAGINATION = {
    DEFAULT_PAGE:  1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT:     100,
  } as const
  
  export const UPLOAD = {
    MAX_FILE_SIZE_MB:    10,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ALLOWED_DOC_TYPES:   ["application/pdf", "image/jpeg", "image/png"],
    KYC_FOLDER:          "logistic-app/kyc",
    GOODS_FOLDER:        "logistic-app/goods",
    AVATAR_FOLDER:       "logistic-app/avatars",
  } as const
  
  export type Role           = typeof ROLES[keyof typeof ROLES]
  export type KycStatus      = typeof KYC_STATUS[keyof typeof KYC_STATUS]
  export type ShipmentStatus = typeof SHIPMENT_STATUS[keyof typeof SHIPMENT_STATUS]
  export type BidStatus      = typeof BID_STATUS[keyof typeof BID_STATUS]
  export type PaymentStatus  = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]
  export type GoodsType      = typeof GOODS_TYPE[keyof typeof GOODS_TYPE]
  export type VehicleType    = typeof VEHICLE_TYPE[keyof typeof VEHICLE_TYPE]