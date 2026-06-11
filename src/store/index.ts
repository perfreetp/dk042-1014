import { create } from 'zustand'
import { Skill, Order, Coupon, Notice, ChatMessage, ChatSession, FulfillmentRecord, CouponUsageRecord } from '@/types'
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
  couponUsageRecords: CouponUsageRecord[]

  addSkill: (skill: Skill) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  cancelOrder: (id: string) => void
  addFulfillmentRecord: (orderId: string, record: Omit<FulfillmentRecord, 'id' | 'orderId' | 'createdAt'>) => void
  useCoupon: (id: string, usage: Omit<CouponUsageRecord, 'id' | 'status' | 'usedAt'>) => void
  refundCoupon: (couponId: string, orderId: string) => void
  toggleFavorite: (skillId: string) => void
  getOrCreateChatSessionBySkill: (skillId: string, otherUser: { id: string; name: string; avatar: string; isVerified: boolean }, skill: { id: string; title: string; image: string }) => ChatSession
  getOrCreateChatSessionByOrder: (order: Order) => ChatSession
  addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'chatId' | 'createdAt'>) => void
  getMessages: (chatId: string) => ChatMessage[]
  calculateFinalPrice: (basePrice: number, couponId?: string) => { finalPrice: number; discount: number; coupon?: Coupon }
  isProvider: (order: Order) => boolean
  isCustomer: (order: Order) => boolean
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

const nowDateStr = () => new Date().toLocaleString('zh-CN')

const makeFulfillmentRecord = (orderId: string, actionKey: FulfillmentRecord['actionKey'], action: string, operatorId: string, operatorName: string, operatorAvatar: string, remark?: string): FulfillmentRecord => ({
  id: `fr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  orderId,
  actionKey,
  action,
  operatorId,
  operatorName,
  operatorAvatar,
  remark,
  createdAt: nowDateStr()
})

const enrichedInitOrders: Order[] = initOrders.map(o => {
  const records: FulfillmentRecord[] = [
    makeFulfillmentRecord(o.id, 'created', '下单成功', o.customerId, o.customerName, o.customerAvatar)
  ]
  if (o.status === 'confirmed' || o.status === 'inProgress' || o.status === 'toReview' || o.status === 'completed') {
    records.push(makeFulfillmentRecord(o.id, 'confirmed', '服务者确认接单', o.providerId, o.providerName, o.providerAvatar))
  }
  if (o.status === 'inProgress' || o.status === 'toReview' || o.status === 'completed') {
    records.push(makeFulfillmentRecord(o.id, 'started', '开始服务', o.providerId, o.providerName, o.providerAvatar))
  }
  if (o.status === 'toReview' || o.status === 'completed') {
    records.push(makeFulfillmentRecord(o.id, 'submittedComplete', '服务者提交完成申请', o.providerId, o.providerName, o.providerAvatar))
    records.push(makeFulfillmentRecord(o.id, 'customerConfirmed', '下单人确认完成', o.customerId, o.customerName, o.customerAvatar))
  }
  if (o.status === 'completed') {
    records.push(makeFulfillmentRecord(o.id, 'reviewed', '评价完成', o.customerId, o.customerName, o.customerAvatar))
  }
  return {
    ...o,
    originalPrice: o.price,
    fulfillmentRecords: records
  }
})

export const useAppStore = create<AppState>((set, get) => ({
  skills: [mySkill, ...initSkills],
  orders: [...enrichedInitOrders],
  coupons: initCoupons,
  notices: initNoticeList,
  chatSessions: [],
  chatMessages: {},
  couponUsageRecords: [],

  addSkill: (skill) => set((state) => ({
    skills: [skill, ...state.skills]
  })),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),

  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...updates, updatedAt: nowDateStr() } : o)
  })),

  cancelOrder: (id) => {
    const order = get().orders.find(o => o.id === id)
    if (!order) return
    if (order.couponId) {
      get().refundCoupon(order.couponId, id)
    }
    const record = makeFulfillmentRecord(
      id, 'cancelled', '订单已取消',
      get().isCustomer(order) ? order.customerId : order.providerId,
      get().isCustomer(order) ? order.customerName : order.providerName,
      get().isCustomer(order) ? order.customerAvatar : order.providerAvatar
    )
    set((state) => ({
      orders: state.orders.map(o =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              updatedAt: nowDateStr(),
              fulfillmentRecords: [...(o.fulfillmentRecords || []), record]
            }
          : o
      )
    }))
  },

  addFulfillmentRecord: (orderId, record) => {
    const fullRecord: FulfillmentRecord = {
      ...record,
      id: `fr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      orderId,
      createdAt: nowDateStr()
    }
    set((state) => ({
      orders: state.orders.map(o =>
        o.id === orderId
          ? { ...o, fulfillmentRecords: [...(o.fulfillmentRecords || []), fullRecord], updatedAt: nowDateStr() }
          : o
      )
    }))
  },

  useCoupon: (id, usage) => {
    const record: CouponUsageRecord = {
      ...usage,
      id: `cur_${Date.now()}_${id}`,
      status: 'used',
      usedAt: nowDateStr()
    }
    set((state) => ({
      coupons: state.coupons.map(c =>
        c.id === id ? { ...c, status: 'used' as const, isUsed: true } : c
      ),
      couponUsageRecords: [record, ...state.couponUsageRecords]
    }))
  },

  refundCoupon: (couponId, orderId) => {
    set((state) => ({
      coupons: state.coupons.map(c =>
        c.id === couponId && c.status === 'used' ? { ...c, status: 'available' as const, isUsed: false } : c
      ),
      couponUsageRecords: state.couponUsageRecords.map(r =>
        r.couponId === couponId && r.orderId === orderId && r.status === 'used'
          ? { ...r, status: 'refunded' as const, refundedAt: nowDateStr() }
          : r
      )
    }))
  },

  toggleFavorite: (skillId) => set((state) => ({
    skills: state.skills.map(s =>
      s.id === skillId ? { ...s, isFavorite: !s.isFavorite } : s
    )
  })),

  getOrCreateChatSessionBySkill: (skillId, otherUser, skill) => {
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

  getOrCreateChatSessionByOrder: (order) => {
    const skill = get().skills.find(s => s.id === order.skillId)
    const otherUser = get().isProvider(order)
      ? { id: order.customerId, name: order.customerName, avatar: order.customerAvatar, isVerified: true }
      : { id: order.providerId, name: order.providerName, avatar: order.providerAvatar, isVerified: true }
    const skillInfo = {
      id: order.skillId,
      title: order.skillTitle,
      image: order.skillImage
    }
    return get().getOrCreateChatSessionBySkill(order.skillId, otherUser, skillInfo)
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
          ? { ...s, lastMessage: message.type === 'order' ? '[订单卡片]' : message.content, lastMessageTime: newMessage.createdAt }
          : s
      )
    }))
  },

  getMessages: (chatId) => {
    return get().chatMessages[chatId] || []
  },

  calculateFinalPrice: (basePrice, couponId) => {
    if (!couponId) {
      return { finalPrice: basePrice, discount: 0 }
    }
    const coupon = get().coupons.find(c => c.id === couponId && c.status === 'available')
    if (!coupon) {
      return { finalPrice: basePrice, discount: 0 }
    }
    if (basePrice < coupon.minAmount) {
      return { finalPrice: basePrice, discount: 0 }
    }
    if (coupon.type === 'cash') {
      const finalPrice = Math.max(0, basePrice - coupon.value)
      return { finalPrice, discount: coupon.value, coupon }
    } else {
      const finalPrice = Math.round(basePrice * coupon.value / 10 * 100) / 100
      const discount = basePrice - finalPrice
      return { finalPrice, discount, coupon }
    }
  },

  isProvider: (order) => {
    return order.providerId === currentUser.id
  },

  isCustomer: (order) => {
    return order.customerId === currentUser.id
  }
}))
