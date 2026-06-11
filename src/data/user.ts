import { User, Notice, Discount, FeedbackRecord } from '@/types'

export const currentUser: User = {
  id: 'me',
  name: '邻居小王',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  neighborhood: '阳光小区',
  isVerified: true,
  isAcceptingOrders: true,
  balance: 1280.00,
  totalIncome: 8600.00,
  favoriteCount: 12,
  publishedSkills: 3,
  completedOrders: 56
}

export const notices: Notice[] = [
  {
    id: 'n1',
    title: '春节服务通知',
    content: '春节期间（1月28日-2月10日）平台正常运营，部分服务提供者可能调整服务时间，请提前预约。祝大家新春快乐！',
    type: 'notice',
    createdAt: '2024-01-15'
  },
  {
    id: 'n2',
    title: '新用户专享福利',
    content: '新用户注册即送50元优惠券，首单满100元可用。邀请好友注册双方各得30元优惠券，多邀多得！',
    type: 'activity',
    createdAt: '2024-01-10'
  },
  {
    id: 'n3',
    title: '实名认证功能上线',
    content: '为保障交易安全，平台已上线实名认证功能。完成认证可获得"已认证"标识，提升信任度，接单量提升30%！',
    type: 'system',
    createdAt: '2024-01-05'
  },
  {
    id: 'n4',
    title: '平台服务规范更新',
    content: '《邻里技能共享平台服务规范》已更新，请各位用户仔细阅读，共同维护良好的社区服务环境。',
    type: 'system',
    createdAt: '2024-01-01'
  }
]

export const discounts: Discount[] = [
  {
    id: 'd1',
    title: '新用户专享券',
    description: '全场通用，满100元可用',
    discount: '50元',
    minAmount: 100,
    expireDate: '2024-02-28',
    isUsed: false
  },
  {
    id: 'd2',
    title: '邻里优惠',
    description: '同小区用户专享，满200元可用',
    discount: '8折',
    minAmount: 200,
    expireDate: '2024-03-31',
    isUsed: false
  },
  {
    id: 'd3',
    title: '邀请好友券',
    description: '全场通用，满50元可用',
    discount: '30元',
    minAmount: 50,
    expireDate: '2024-02-15',
    isUsed: true
  },
  {
    id: 'd4',
    title: '春节特惠券',
    description: '家政清洁类服务专用',
    discount: '立减80元',
    minAmount: 300,
    expireDate: '2024-02-10',
    isUsed: false
  }
]

export const feedbackRecords: FeedbackRecord[] = [
  {
    id: 'f1',
    orderId: 'o1',
    type: '服务质量问题',
    description: '维修后空调仍然不制冷，师傅说需要更换零件，但没有提前告知费用',
    images: [],
    status: 'processing',
    createdAt: '2024-01-18',
    reply: '您好，我们已联系服务提供者核实情况，将在24小时内给您答复，请耐心等待。'
  },
  {
    id: 'f2',
    orderId: 'o3',
    type: '其他问题',
    description: '建议平台增加围巾颜色选项，方便用户选择',
    images: [],
    status: 'resolved',
    createdAt: '2024-01-10',
    reply: '感谢您的宝贵建议！我们已将您的建议反馈给产品团队，后续会优化相关功能。'
  }
]
