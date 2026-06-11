export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/orders/index',
    'pages/publish/index',
    'pages/mine/index',
    'pages/skill-detail/index',
    'pages/booking/index',
    'pages/order-detail/index',
    'pages/skill-manage/index',
    'pages/income/index',
    'pages/favorites/index',
    'pages/review-reply/index',
    'pages/verification/index',
    'pages/discount/index',
    'pages/feedback/index',
    'pages/notice/index',
    'pages/chat/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7A45',
    navigationBarTitleText: '邻里技能共享',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF7A45',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
