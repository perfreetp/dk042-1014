import { create } from 'zustand'
import { Skill, Order, Coupon, Notice } from '@/types'
import { skills as initSkills } from '@/data/skills'
import { orders as initOrders } from '@/data/orders'
import { discounts as initDiscounts, notices as initNotices, currentUser } from '@/data/user'

interface AppState {
  skills: Skill[]
  orders: Order[]
  coupons: Coupon[]
  notices: Notice[]

  addSkill: (skill: Skill) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  useCoupon: (id: string) => void
}

const mySkill: Skill = {
  id: 'my1',
  title: '英语口语陪练',
  categoryId: '2',
  categoryName: '家教',
  description: '大学英语六级，口语流利，可陪练日常对话、旅游英语，帮助提升口语自信。',
  priceMin: 50,
  priceMax: 80,
  priceUnit: '小时',
  provider: {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    isVerified: currentUser.isVerified,
    rating: 5.0,
    completedOrders: 8,
    neighborhood: currentUser.neighborhood
  },
  availableTime: ['工作日 18:00-22:00', '周末全天'],
  serviceArea: [currentUser.neighborhood, '线上'],
  images: ['https://picsum.photos/id/1027/750/500'],
  reviews: [],
  rating: 5.0,
  reviewCount: 8,
  isFavorite: false,
  isVerified: currentUser.isVerified,
  createdAt: '2024-01-20'
}

const initCoupons: Coupon[] = [
  ...initDiscounts.map(d => ({
    id: d.id,
    name: d.title,
    description: d.description,
    value: parseFloat(d.discount) || 50,
    minAmount: d.minAmount,
    expireDate: d.expireDate,
    status: (d.isUsed ? 'used' : 'available') as Coupon['status'],
    isUsed: d.isUsed,
    images: []
  })),
  {
    id: 'd5',
    name: '周末特惠券',
    description: '周末服务专享优惠',
    value: 20,
    minAmount: 80,
    expireDate: '2023-12-31',
    status: 'expired',
    isUsed: false,
    images: []
  },
  {
    id: 'd6',
    name: '国庆优惠券',
    description: '国庆假期限时优惠',
    value: 100,
    minAmount: 500,
    expireDate: '2023-10-07',
    status: 'expired',
    isUsed: false,
    images: []
  }
]

const initNoticeList: Notice[] = initNotices.map(n => ({
  ...n,
  images: [] as string[]
}))

export const useAppStore = create<AppState>((set) => ({
  skills: [mySkill, ...initSkills],
  orders: [...initOrders],
  coupons: initCoupons,
  notices: initNoticeList,

  addSkill: (skill) => set((state) => ({
    skills: [skill, ...state.skills]
  })),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),

  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...updates } : o)
  })),

  useCoupon: (id) => set((state) => ({
    coupons: state.coupons.map(c =>
      c.id === id ? { ...c, status: 'used' as const, isUsed: true } : c
    )
  }))
}))
