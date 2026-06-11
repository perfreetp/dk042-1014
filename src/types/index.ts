export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Skill {
  id: string
  title: string
  categoryId: string
  categoryName: string
  description: string
  priceMin: number
  priceMax: number
  priceUnit: string
  provider: Provider
  availableTime: string[]
  serviceArea: string[]
  images: string[]
  reviews: Review[]
  rating: number
  reviewCount: number
  isFavorite: boolean
  isVerified: boolean
  createdAt: string
}

export interface Provider {
  id: string
  name: string
  avatar: string
  isVerified: boolean
  rating: number
  completedOrders: number
  neighborhood: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  images: string[]
  reply?: string
  createdAt: string
}

export interface Order {
  id: string
  skillId: string
  skillTitle: string
  skillImage: string
  providerId: string
  providerName: string
  providerAvatar: string
  customerId: string
  customerName: string
  customerAvatar: string
  status: OrderStatus
  price: number
  bookingTime: string
  serviceArea: string
  requirement: string
  referenceImages: string[]
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'inProgress' | 'toReview' | 'completed' | 'cancelled'

export interface User {
  id: string
  name: string
  avatar: string
  phone: string
  neighborhood: string
  isVerified: boolean
  isAcceptingOrders: boolean
  balance: number
  totalIncome: number
  favoriteCount: number
  publishedSkills: number
  completedOrders: number
}

export interface IncomeRecord {
  id: string
  orderId: string
  skillTitle: string
  amount: number
  type: 'income' | 'withdraw'
  status: 'success' | 'pending' | 'failed'
  createdAt: string
}

export interface Notice {
  id: string
  title: string
  content: string
  type: 'system' | 'activity' | 'notice'
  createdAt: string
  images?: string[]
}

export interface Discount {
  id: string
  title: string
  description: string
  discount: string
  minAmount: number
  expireDate: string
  isUsed: boolean
}

export interface Coupon {
  id: string
  name: string
  description: string
  value: number
  minAmount: number
  expireDate: string
  status: 'available' | 'used' | 'expired'
  isUsed: boolean
  images?: string[]
}

export interface FeedbackRecord {
  id: string
  orderId: string
  type: string
  description: string
  images: string[]
  status: 'pending' | 'processing' | 'resolved'
  createdAt: string
  reply?: string
}
