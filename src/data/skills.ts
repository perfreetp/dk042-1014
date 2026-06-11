import { Skill } from '@/types'

export const skills: Skill[] = [
  {
    id: '1',
    title: '专业家电维修',
    categoryId: '1',
    categoryName: '维修',
    description: '10年家电维修经验，擅长空调、洗衣机、冰箱等各类家电维修，上门服务，价格透明。',
    priceMin: 50,
    priceMax: 200,
    priceUnit: '次',
    provider: {
      id: 'p1',
      name: '张师傅',
      avatar: 'https://picsum.photos/id/64/200/200',
      isVerified: true,
      rating: 4.9,
      completedOrders: 128,
      neighborhood: '阳光小区'
    },
    availableTime: ['周一至周五 9:00-18:00', '周末 10:00-17:00'],
    serviceArea: ['阳光小区', '幸福家园', '丽景苑', '周边3公里'],
    images: [
      'https://picsum.photos/id/1/750/500',
      'https://picsum.photos/id/2/750/500',
      'https://picsum.photos/id/3/750/500'
    ],
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: '李先生',
        userAvatar: 'https://picsum.photos/id/91/200/200',
        rating: 5,
        content: '张师傅技术很好，家里空调修好了，收费也合理，推荐！',
        images: [],
        reply: '感谢您的信任，有任何问题随时联系我~',
        createdAt: '2024-01-15'
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: '王阿姨',
        userAvatar: 'https://picsum.photos/id/177/200/200',
        rating: 5,
        content: '上门很准时，洗衣机修好了，还帮我检查了其他家电，很贴心。',
        images: [],
        createdAt: '2024-01-10'
      }
    ],
    rating: 4.9,
    reviewCount: 56,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-12-01'
  },
  {
    id: '2',
    title: '小学数学家教',
    categoryId: '2',
    categoryName: '家教',
    description: '重点师范大学毕业，5年小学教学经验，擅长数学思维训练，帮助孩子提高成绩。',
    priceMin: 100,
    priceMax: 150,
    priceUnit: '小时',
    provider: {
      id: 'p2',
      name: '李老师',
      avatar: 'https://picsum.photos/id/338/200/200',
      isVerified: true,
      rating: 4.8,
      completedOrders: 86,
      neighborhood: '幸福家园'
    },
    availableTime: ['周一至周五 18:00-21:00', '周末 9:00-18:00'],
    serviceArea: ['幸福家园', '阳光小区', '丽景苑'],
    images: [
      'https://picsum.photos/id/64/750/500',
      'https://picsum.photos/id/91/750/500'
    ],
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: '陈妈妈',
        userAvatar: 'https://picsum.photos/id/1027/200/200',
        rating: 5,
        content: '李老师很有耐心，孩子数学成绩从70分提到了90分，非常感谢！',
        images: [],
        createdAt: '2024-01-12'
      }
    ],
    rating: 4.8,
    reviewCount: 32,
    isFavorite: true,
    isVerified: true,
    createdAt: '2023-11-15'
  },
  {
    id: '3',
    title: '专业宠物寄养',
    categoryId: '3',
    categoryName: '宠物照看',
    description: '家中宽敞整洁，有独立宠物活动区域，科学喂养，定时遛弯，提供每日视频汇报。',
    priceMin: 80,
    priceMax: 120,
    priceUnit: '天',
    provider: {
      id: 'p3',
      name: '王小姐',
      avatar: 'https://picsum.photos/id/237/200/200',
      isVerified: true,
      rating: 5.0,
      completedOrders: 64,
      neighborhood: '丽景苑'
    },
    availableTime: ['全年无休', '节假日提前预约'],
    serviceArea: ['丽景苑', '阳光小区', '幸福家园'],
    images: [
      'https://picsum.photos/id/659/750/500',
      'https://picsum.photos/id/718/750/500',
      'https://picsum.photos/id/783/750/500',
      'https://picsum.photos/id/1025/750/500'
    ],
    reviews: [
      {
        id: 'r4',
        userId: 'u4',
        userName: '赵女士',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        rating: 5,
        content: '出差一周，把我家金毛寄养在王姐家，照顾得特别好，每天都有视频，很放心！',
        images: [],
        createdAt: '2024-01-08'
      }
    ],
    rating: 5.0,
    reviewCount: 45,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-10-20'
  },
  {
    id: '4',
    title: '家庭写真摄影',
    categoryId: '4',
    categoryName: '摄影',
    description: '专业人像摄影师，擅长家庭纪实、亲子、生日宴拍摄，提供精修底片。',
    priceMin: 399,
    priceMax: 999,
    priceUnit: '次',
    provider: {
      id: 'p4',
      name: '陈摄影师',
      avatar: 'https://picsum.photos/id/91/200/200',
      isVerified: true,
      rating: 4.9,
      completedOrders: 42,
      neighborhood: '阳光小区'
    },
    availableTime: ['周末及节假日', '工作日需提前3天预约'],
    serviceArea: ['全市区'],
    images: [
      'https://picsum.photos/id/1015/750/500',
      'https://picsum.photos/id/1018/750/500',
      'https://picsum.photos/id/1036/750/500'
    ],
    reviews: [
      {
        id: 'r5',
        userId: 'u5',
        userName: '刘先生',
        userAvatar: 'https://picsum.photos/id/177/200/200',
        rating: 5,
        content: '陈老师拍的亲子照太好看了，自然不做作，家人都很满意！',
        images: [],
        createdAt: '2024-01-05'
      }
    ],
    rating: 4.9,
    reviewCount: 28,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-09-10'
  },
  {
    id: '5',
    title: '电脑系统安装调试',
    categoryId: '5',
    categoryName: '电脑设置',
    description: '电脑系统重装、软件安装、网络调试、打印机共享设置，解决各种电脑问题。',
    priceMin: 30,
    priceMax: 100,
    priceUnit: '次',
    provider: {
      id: 'p5',
      name: '小周',
      avatar: 'https://picsum.photos/id/119/200/200',
      isVerified: true,
      rating: 4.7,
      completedOrders: 95,
      neighborhood: '幸福家园'
    },
    availableTime: ['工作日 19:00-22:00', '周末全天'],
    serviceArea: ['幸福家园', '阳光小区', '丽景苑'],
    images: [
      'https://picsum.photos/id/6/750/500',
      'https://picsum.photos/id/8/750/500'
    ],
    reviews: [
      {
        id: 'r6',
        userId: 'u6',
        userName: '孙叔叔',
        userAvatar: 'https://picsum.photos/id/338/200/200',
        rating: 5,
        content: '小伙子技术好，耐心细致，我这个电脑小白也教会了很多知识。',
        images: [],
        createdAt: '2024-01-03'
      }
    ],
    rating: 4.7,
    reviewCount: 67,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-08-25'
  },
  {
    id: '6',
    title: '手工针织定制',
    categoryId: '6',
    categoryName: '手工制作',
    description: '手工编织围巾、帽子、毛衣、玩偶，可来图定制，选用优质毛线，温暖舒适。',
    priceMin: 50,
    priceMax: 300,
    priceUnit: '件',
    provider: {
      id: 'p6',
      name: '张阿姨',
      avatar: 'https://picsum.photos/id/177/200/200',
      isVerified: true,
      rating: 4.9,
      completedOrders: 36,
      neighborhood: '丽景苑'
    },
    availableTime: ['周一至周日 9:00-21:00'],
    serviceArea: ['小区自提', '满100元免费配送'],
    images: [
      'https://picsum.photos/id/225/750/500',
      'https://picsum.photos/id/230/750/500',
      'https://picsum.photos/id/582/750/500'
    ],
    reviews: [
      {
        id: 'r7',
        userId: 'u7',
        userName: '周小姐',
        userAvatar: 'https://picsum.photos/id/237/200/200',
        rating: 5,
        content: '织的围巾太好看了，手感柔软，送给妈妈的生日礼物特别喜欢！',
        images: [],
        createdAt: '2024-01-01'
      }
    ],
    rating: 4.9,
    reviewCount: 24,
    isFavorite: true,
    isVerified: true,
    createdAt: '2023-07-15'
  },
  {
    id: '7',
    title: '深度保洁服务',
    categoryId: '7',
    categoryName: '家政清洁',
    description: '专业保洁阿姨，自带清洁工具，全屋深度清洁，厨房卫生间重点处理，满意再付款。',
    priceMin: 150,
    priceMax: 300,
    priceUnit: '次',
    provider: {
      id: 'p7',
      name: '刘阿姨',
      avatar: 'https://picsum.photos/id/1027/200/200',
      isVerified: true,
      rating: 4.8,
      completedOrders: 156,
      neighborhood: '阳光小区'
    },
    availableTime: ['周一至周六 8:00-18:00'],
    serviceArea: ['阳光小区', '幸福家园', '丽景苑', '周边5公里'],
    images: [
      'https://picsum.photos/id/598/750/500'
    ],
    reviews: [
      {
        id: 'r8',
        userId: 'u8',
        userName: '吴先生',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        rating: 5,
        content: '打扫得非常干净，角角落落都照顾到了，以后固定找刘阿姨！',
        images: [],
        createdAt: '2023-12-28'
      }
    ],
    rating: 4.8,
    reviewCount: 89,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-06-20'
  },
  {
    id: '8',
    title: '水电维修改造',
    categoryId: '1',
    categoryName: '维修',
    description: '持证电工，专业水电维修、线路改造、灯具安装、水管维修，24小时紧急服务。',
    priceMin: 80,
    priceMax: 500,
    priceUnit: '次',
    provider: {
      id: 'p8',
      name: '黄师傅',
      avatar: 'https://picsum.photos/id/160/200/200',
      isVerified: true,
      rating: 4.9,
      completedOrders: 203,
      neighborhood: '幸福家园'
    },
    availableTime: ['24小时服务', '紧急情况随叫随到'],
    serviceArea: ['全市区'],
    images: [
      'https://picsum.photos/id/9/750/500',
      'https://picsum.photos/id/201/750/500'
    ],
    reviews: [
      {
        id: 'r9',
        userId: 'u9',
        userName: '郑女士',
        userAvatar: 'https://picsum.photos/id/91/200/200',
        rating: 5,
        content: '晚上水管爆了，黄师傅半小时就到了，很快修好，太感谢了！',
        images: [],
        createdAt: '2023-12-25'
      }
    ],
    rating: 4.9,
    reviewCount: 112,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-05-10'
  },
  {
    id: '9',
    title: '英语外教一对一',
    categoryId: '2',
    categoryName: '家教',
    description: '美国籍外教，纯正美式发音，成人/儿童英语教学，日常口语、商务英语均可。',
    priceMin: 200,
    priceMax: 350,
    priceUnit: '小时',
    provider: {
      id: 'p9',
      name: 'Mike',
      avatar: 'https://picsum.photos/id/338/200/200',
      isVerified: true,
      rating: 4.8,
      completedOrders: 78,
      neighborhood: '丽景苑'
    },
    availableTime: ['周一至周五 10:00-20:00', '周末 9:00-18:00'],
    serviceArea: ['丽景苑', '阳光小区', '线上教学'],
    images: [
      'https://picsum.photos/id/1027/750/500'
    ],
    reviews: [
      {
        id: 'r10',
        userId: 'u10',
        userName: '冯先生',
        userAvatar: 'https://picsum.photos/id/177/200/200',
        rating: 5,
        content: 'Mike教学很专业，也很有趣味，孩子现在对英语学习兴趣很浓厚。',
        images: [],
        createdAt: '2023-12-20'
      }
    ],
    rating: 4.8,
    reviewCount: 56,
    isFavorite: false,
    isVerified: true,
    createdAt: '2023-04-15'
  },
  {
    id: '10',
    title: '宠物遛弯服务',
    categoryId: '3',
    categoryName: '宠物照看',
    description: '每天定时遛狗，专业牵引绳，可接送，适合上班族和出差人士，风雨无阻。',
    priceMin: 30,
    priceMax: 50,
    priceUnit: '次',
    provider: {
      id: 'p10',
      name: '小林',
      avatar: 'https://picsum.photos/id/237/200/200',
      isVerified: true,
      rating: 5.0,
      completedOrders: 312,
      neighborhood: '阳光小区'
    },
    availableTime: ['早 7:00-9:00', '晚 18:00-21:00', '中午 12:00-14:00'],
    serviceArea: ['阳光小区', '幸福家园', '丽景苑'],
    images: [
      'https://picsum.photos/id/1025/750/500',
      'https://picsum.photos/id/783/750/500'
    ],
    reviews: [
      {
        id: 'r11',
        userId: 'u11',
        userName: '何女士',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        rating: 5,
        content: '小林很负责，每天准时来遛狗，还发视频给我，我家毛孩子特别喜欢他！',
        images: [],
        createdAt: '2023-12-18'
      }
    ],
    rating: 5.0,
    reviewCount: 189,
    isFavorite: true,
    isVerified: true,
    createdAt: '2023-03-20'
  }
]

export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(s => s.id === id)
}

export const getSkillsByCategory = (categoryId: string): Skill[] => {
  return skills.filter(s => s.categoryId === categoryId)
}

export const getFavoriteSkills = (): Skill[] => {
  return skills.filter(s => s.isFavorite)
}
