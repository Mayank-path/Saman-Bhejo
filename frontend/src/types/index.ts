export interface User {
    _id:                string
    name:               string
    email:              string
    phone:              string
    role:               "shipper" | "trucker" | "admin"
    avatar:             string
    isVerified:         boolean
    isActive:           boolean
    kycStatus:          "pending" | "submitted" | "approved" | "rejected"
    vehicleType:        string
    vehicleNumber:      string
    vehicleCapacityTons: number
    rating:             number
    totalRatings:       number
    onTimeDeliveryRate: number
    totalDeliveries:    number
    createdAt:          string
  }
  
  export interface Shipment {
    _id:                   string
    shipper:               User | string
    assignedTrucker:       User | null
    acceptedBid:           Bid  | null
    title:                 string
    description:           string
    goodsType:             string
    weightTons:            number
    quantity:              number
    images:                string[]
    pickup:                Location
    delivery:              Location
    distanceKm:            number
    status:                string
    scheduledDate:         string
    estimatedDeliveryDate: string | null
    actualDeliveryDate:    string | null
    budget:                { min: number, max: number }
    bidCount:              number
    biddingExpiresAt:      string
    radiusKm:              number
    createdAt:             string
  }
  
  export interface Location {
    address:  string
    city:     string
    state:    string
    location: {
      type:        string
      coordinates: [number, number]
    }
  }
  
  export interface Bid {
    _id:                   string
    shipment:              string
    trucker:               User
    amount:                number
    note:                  string
    estimatedPickupDate:   string
    estimatedDeliveryDate: string
    status:                string
    score:                 number
    createdAt:             string
  }
  
  export interface Message {
    _id:       string
    sender:    User
    content:   string
    readBy:    string[]
    createdAt: string
  }
  
  export interface Chat {
    _id:           string
    shipment:      string
    participants:  User[]
    messages:      Message[]
    lastMessage:   string
    lastMessageAt: string
  }
  
  export interface Notification {
    _id:       string
    type:      string
    title:     string
    message:   string
    data:      Record<string, unknown>
    isRead:    boolean
    createdAt: string
  }
  
  export interface AuthTokens {
    accessToken:  string
    refreshToken: string
  }
  
  export interface ApiResponse<T> {
    success:    boolean
    statusCode: number
    message:    string
    data:       T
  }
  
  export interface PaginatedResponse<T> {
    data:       T[]
    pagination: {
      total: number
      page:  number
      limit: number
      pages: number
    }
  }