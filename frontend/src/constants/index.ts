export const API_URL = "/api/v1"

export const ROLES = {
  SHIPPER: "shipper",
  TRUCKER: "trucker",
  ADMIN:   "admin",
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

export const GOODS_TYPE = {
  GENERAL:      "general",
  PERISHABLE:   "perishable",
  FRAGILE:      "fragile",
  HAZARDOUS:    "hazardous",
  OVERSIZED:    "oversized",
  LIVESTOCK:    "livestock",
  REFRIGERATED: "refrigerated",
} as const

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
} as const