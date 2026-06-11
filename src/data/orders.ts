import { Order, OrderStatus, IncomeRecord } from '@/types'

export const orders: Order[] = [
  {
    id: 'o1',
    skillId: '1',
    skillTitle: '专业家电维修',
    skillImage: 'https://picsum.photos/id/1/300/300',
    providerId: 'p1',
    providerName: '张师傅',
    providerAvatar: 'https://picsum.photos/id/64/200/200',
    customerId: 'me',
    customerName: '我',
    customerAvatar: 'https://picsum.photos/id/64/200/200',
    status: 'pending',
    price: 150,
    bookingTime: '2024-01-20 14:00',
    serviceArea: '阳光小区3号楼',
    requirement: '家里空调不制冷了，需要上门维修',
    referenceImages: [],
    createdAt: '2024-01-18 10:30',
    updatedAt: '2024-01-18 10:30'
  },
  {
    id: 'o2',
    skillId: '3',
    skillTitle: '专业宠物寄养',
    skillImage: 'https://picsum.photos/id/659/300/300',
    providerId: 'p3',
    providerName: '王小姐',
    providerAvatar: 'https://picsum.photos/id/237/200/200',
    customerId: 'me',
    customerName: '我',
    customerAvatar: 'https://picsum.photos/id/64/200/200',
    status: 'inProgress',
    price: 600,
    bookingTime: '2024-01-20 至 2024-01-25',
    serviceArea: '丽景苑2号楼',
    requirement: '金毛犬，7岁，性格温顺，每天需要遛两次',
    referenceImages: [
      'https://picsum.photos/id/237/300/300'
    ],
    createdAt: '2024-01-15 16:00',
    updatedAt: '2024-01-18 09:00'
  },
  {
    id: 'o3',
    skillId: '6',
    skillTitle: '手工针织定制',
    skillImage: 'https://picsum.photos/id/225/300/300',
    providerId: 'p6',
    providerName: '张阿姨',
    providerAvatar: 'https://picsum.photos/id/177/200/200',
    customerId: 'me',
    customerName: '我',
    customerAvatar: 'https://picsum.photos/id/64/200/200',
    status: 'toReview',
    price: 180,
    bookingTime: '2024-01-10',
    serviceArea: '丽景苑5号楼',
    requirement: '定制一条围巾，灰色，送妈妈生日礼物',
    referenceImages: [
      'https://picsum.photos/id/225/300/300'
    ],
    createdAt: '2024-01-02 14:20',
    updatedAt: '2024-01-15 11:30'
  },
  {
    id: 'o4',
    skillId: '5',
    skillTitle: '电脑系统安装调试',
    skillImage: 'https://picsum.photos/id/6/300/300',
    providerId: 'p5',
    providerName: '小周',
    providerAvatar: 'https://picsum.photos/id/119/200/200',
    customerId: 'me',
    customerName: '我',
    customerAvatar: 'https://picsum.photos/id/64/200/200',
    status: 'completed',
    price: 80,
    bookingTime: '2024-01-05 19:00',
    serviceArea: '幸福家园8号楼',
    requirement: '笔记本电脑重装系统，安装办公软件',
    referenceImages: [],
    createdAt: '2024-01-03 20:00',
    updatedAt: '2024-01-05 21:00'
  },
  {
    id: 'o5',
    skillId: '7',
    skillTitle: '深度保洁服务',
    skillImage: 'https://picsum.photos/id/598/300/300',
    providerId: 'p7',
    providerName: '刘阿姨',
    providerAvatar: 'https://picsum.photos/id/1027/200/200',
    customerId: 'me',
    customerName: '我',
    customerAvatar: 'https://picsum.photos/id/64/200/200',
    status: 'completed',
    price: 200,
    bookingTime: '2024-01-08 09:00',
    serviceArea: '阳光小区1号楼',
    requirement: '全屋深度清洁，重点厨房和卫生间',
    referenceImages: [],
    createdAt: '2024-01-06 10:00',
    updatedAt: '2024-01-08 13:00'
  }
]

export const getOrdersByStatus = (status: OrderStatus | 'all'): Order[] => {
  if (status === 'all') return orders
  return orders.filter(o => o.status === status)
}

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(o => o.id === id)
}

export const incomeRecords: IncomeRecord[] = [
  {
    id: 'i1',
    orderId: 'o10',
    skillTitle: '英语外教一对一',
    amount: 280,
    type: 'income',
    status: 'success',
    createdAt: '2024-01-18 15:30'
  },
  {
    id: 'i2',
    orderId: 'o11',
    skillTitle: '英语外教一对一',
    amount: 280,
    type: 'income',
    status: 'success',
    createdAt: '2024-01-16 20:00'
  },
  {
    id: 'i3',
    orderId: 'o12',
    skillTitle: '英语外教一对一',
    amount: 280,
    type: 'income',
    status: 'success',
    createdAt: '2024-01-14 19:30'
  },
  {
    id: 'i4',
    orderId: '',
    skillTitle: '提现到银行卡',
    amount: 500,
    type: 'withdraw',
    status: 'success',
    createdAt: '2024-01-12 10:00'
  },
  {
    id: 'i5',
    orderId: 'o13',
    skillTitle: '英语外教一对一',
    amount: 280,
    type: 'income',
    status: 'success',
    createdAt: '2024-01-10 18:00'
  }
]
