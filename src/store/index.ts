import { create } from 'zustand'
import { Skill, Order, Coupon, Notice, ChatMessage, ChatSession } from '@/types'
import { skills as initSkills } from '@/data/skills'
import { orders as initOrders } from '@/data/orders'
import { discounts as initDiscounts, notices as initNotices, currentUser } from '@/data/user'

interface AppState {
  skills: Skill[]
  orders: Order[]
  coupons: Coupon[]
  notices: Notice[]
  chatSessions: ChatSession[]
  chatMessages: Record<string, ChatMessage[]>

  addSkill: (skill: Skill) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  useCoupon: (id: string) => void
  toggleFavorite: (skillId: string) => void
  getOrCreateChatSession: (skillId: string, otherUser: { id: string; name: string; avatar: string; isVerified: boolean }, skill: { id: string; title: string; image: string }) => ChatSession
  addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'chatId' | 'createdAt'>) => void
  getMessages: (chatId: string) => ChatMessage[]
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

const parseDiscountValue = (discountStr: string): { type: 'cash' | 'discount'; value: number } => {
  if (discountStr.includes('折')) {
    const num = parseFloat(discountStr)
    return { type: 'discount', value: isNaN(num) ? 8 : num }
  }
  const num = parseFloat(discountStr.replace(/[^0-9.]/g, ''))
  return { type: 'cash', value: isNaN(num) ? 50 : num }
}

const initCoupons: Coupon[] = [
  ...initDiscounts.map(d => {
    const { type, value } = parseDiscountValue(d.discount)
    return {
      id: d.id,
      name: d.title,
      description: d.description,
      type,
      value,
      minAmount: d.minAmount,
      expireDate: d.expireDate,
      status: (d.isUsed ? 'used' : 'available') as Coupon['status'],
      isUsed: d.isUsed,
      images: []
    }
  }),
  {
    id: 'd5',
    name: '周末特惠券',
    description: '周末服务专享优惠',
    type: 'cash' as const,
    value: 20,
    minAmount: 80,
    expireDate: '2023-12-31',
    status: 'expired' as const,
    isUsed: false,
    images: []
  },
  {
    id: 'd6',
    name: '国庆优惠券',
    description: '国庆假期限时优惠',
    type: 'discount' as const,
    value: 8.5,
    minAmount: 500,
    expireDate: '2023-10-07',
    status: 'expired' as const,
    isUsed: false,
    images: []
  }
]

const initNoticeList: Notice[] = initNotices.map(n => ({
  ...n,
  images: [] as string[]
}))

export const useAppStore = create<AppState>((set, get) => ({
  skills: [mySkill, ...initSkills],
  orders: [...initOrders],
  coupons: initCoupons,
  notices: initNoticeList,
  chatSessions: [],
  chatMessages: {},

  addSkill: (skill) => set((state) => ({
    skills: [skill, ...state.skills]
  })),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),

  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o)
  })),

  useCoupon: (id) => set((state) => ({
    coupons: state.coupons.map(c =>
      c.id === id ? { ...c, status: 'used' as const, isUsed: true } : c
    )
  })),

  toggleFavorite: (skillId) => set((state) => ({
    skills: state.skills.map(s =>
      s.id === skillId ? { ...s, isFavorite: !s.isFavorite } : s
    )
  })),

  getOrCreateChatSession: (skillId, otherUser, skill) => {
    const existing = get().chatSessions.find(
      s => s.skillId === skillId && s.otherUserId === otherUser.id
    )
    if (existing) return existing

    const newSession: ChatSession = {
      id: `chat_${Date.now()}_${skillId}`,
      skillId,
      skillTitle: skill.title,
      skillImage: skill.image,
      otherUserId: otherUser.id,
      otherUserName: otherUser.name,
      otherUserAvatar: otherUser.avatar,
      otherUserVerified: otherUser.isVerified,
      unreadCount: 0,
      createdAt: new Date().toISOString()
    }
    set((state) => ({
      chatSessions: [newSession, ...state.chatSessions],
      chatMessages: { ...state.chatMessages, [newSession.id]: [] }
    }))
    return newSession
  },

  addMessage: (chatId, message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      createdAt: new Date().toISOString()
    }
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatId]: [...(state.chatMessages[chatId] || []), newMessage]
      },
      chatSessions: state.chatSessions.map(s =>
        s.id === chatId
          ? { ...s, lastMessage: message.content, lastMessageTime: newMessage.createdAt }
          : s
      )
    }))
  },

  getMessages: (chatId) => {
    return get().chatMessages[chatId] || []
  }
}))
