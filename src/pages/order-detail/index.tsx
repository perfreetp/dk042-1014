import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { getOrderById } from '@/data/orders'
import { Order, OrderStatus } from '@/types'
import StarRating from '@/components/StarRating'

const detailStyles = {
  page: {
    minHeight: '100vh',
    background: '#FFF7F2',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 140rpx)'
  },
  statusBar: {
    background: 'linear-gradient(135deg, #FF7A45 0%, #FFA47A 100%)',
    padding: '48rpx 32rpx',
    paddingTop: 'calc(env(safe-area-inset-top) + 48rpx)'
  },
  statusText: {
    fontSize: '36rpx',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8rpx'
  },
  statusDesc: {
    fontSize: '26rpx',
    color: 'rgba(255,255,255,0.85)'
  },
  content: {
    margin: '-24rpx 32rpx 0'
  },
  infoCard: {
    background: '#fff',
    borderRadius: '16rpx',
    padding: '24rpx',
    marginBottom: '16rpx',
    boxShadow: '0 2rpx 12rpx rgba(255, 122, 69, 0.06)'
  },
  skillRow: {
    display: 'flex',
    gap: '16rpx',
    marginBottom: '16rpx',
    paddingBottom: '16rpx',
    borderBottom: '1rpx solid #F7F0EB'
  },
  skillImage: {
    width: '120rpx',
    height: '120rpx',
    borderRadius: '12rpx',
    flexShrink: 0
  },
  skillInfo: {
    flex: 1,
    minWidth: 0
  },
  skillTitle: {
    fontSize: '30rpx',
    fontWeight: 600,
    color: '#1D2129',
    marginBottom: '8rpx'
  },
  skillPrice: {
    fontSize: '32rpx',
    fontWeight: 'bold',
    color: '#FF5722'
  },
  providerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12rpx',
    marginBottom: '16rpx'
  },
  providerAvatar: {
    width: '56rpx',
    height: '56rpx',
    borderRadius: '999rpx'
  },
  providerName: {
    fontSize: '26rpx',
    color: '#4E5969',
    flex: 1
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12rpx'
  },
  infoLabel: {
    fontSize: '26rpx',
    color: '#86909C',
    width: '140rpx',
    flexShrink: 0
  },
  infoValue: {
    fontSize: '26rpx',
    color: '#1D2129',
    flex: 1,
    lineHeight: 1.5
  },
  sectionTitle: {
    fontSize: '28rpx',
    fontWeight: 600,
    color: '#1D2129',
    marginBottom: '16rpx'
  },
  refImages: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12rpx'
  },
  refImage: {
    width: '160rpx',
    height: '160rpx',
    borderRadius: '12rpx'
  },
  reviewSection: {
    background: '#fff',
    borderRadius: '16rpx',
    padding: '24rpx',
    marginBottom: '16rpx',
    boxShadow: '0 2rpx 12rpx rgba(255, 122, 69, 0.06)'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16rpx',
    marginBottom: '16rpx'
  },
  ratingLabel: {
    fontSize: '26rpx',
    color: '#4E5969',
    width: '100rpx'
  },
  textareaField: {
    width: '100%',
    minHeight: '160rpx',
    borderRadius: '12rpx',
    background: '#FFF7F2',
    padding: '16rpx',
    fontSize: '26rpx',
    color: '#1D2129',
    boxSizing: 'border-box',
    lineHeight: 1.6
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '20rpx 32rpx',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 20rpx)',
    boxShadow: '0 -4rpx 16rpx rgba(0, 0, 0, 0.06)',
    display: 'flex',
    gap: '16rpx'
  },
  btnSecondary: {
    flex: 1,
    height: '80rpx',
    borderRadius: '48rpx',
    background: '#FFF0E8',
    color: '#FF7A45',
    fontSize: '28rpx',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPrimary: {
    flex: 1,
    height: '80rpx',
    borderRadius: '48rpx',
    background: 'linear-gradient(135deg, #FF7A45 0%, #FFA47A 100%)',
    color: '#fff',
    fontSize: '28rpx',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnFull: {
    width: '100%',
    height: '80rpx',
    borderRadius: '48rpx',
    background: 'linear-gradient(135deg, #FF7A45 0%, #FFA47A 100%)',
    color: '#fff',
    fontSize: '28rpx',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const statusMap: Record<OrderStatus, { text: string; desc: string }> = {
  pending: { text: '待确认', desc: '等待服务者确认订单' },
  confirmed: { text: '已确认', desc: '服务者已确认订单，请按时赴约' },
  inProgress: { text: '进行中', desc: '服务正在进行中' },
  toReview: { text: '待评价', desc: '服务已完成，请给服务者评价' },
  completed: { text: '已完成', desc: '订单已完成' },
  cancelled: { text: '已取消', desc: '订单已取消' }
}

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const id = router.params.id
    const action = router.params.action
    console.log('[OrderDetail] Order ID:', id, 'Action:', action)
    if (id) {
      const data = getOrderById(id as string)
      if (data) {
        setOrder(data)
        if (action === 'review') {
          setShowReview(true)
        }
      }
    }
  }, [router.params.id, router.params.action])

  const handleAction = (action: string) => {
    console.log('[OrderDetail] Action:', action)
    switch (action) {
      case 'cancel':
        Taro.showModal({
          title: '确认取消',
          content: '确定要取消这个订单吗？',
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({ title: '订单已取消', icon: 'success' })
            }
          }
        })
        break
      case 'contact':
        Taro.showToast({ title: '沟通功能开发中', icon: 'none' })
        break
      case 'complete':
        Taro.showToast({ title: '服务已完成', icon: 'success' })
        break
      case 'review':
        setShowReview(true)
        break
      case 'reorder':
        if (order) {
          Taro.navigateTo({
            url: `/pages/skill-detail/index?id=${order.skillId}`
          })
        }
        break
      default:
        Taro.showToast({ title: `${action}功能开发中`, icon: 'none' })
    }
  }

  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      Taro.showToast({ title: '请填写评价内容', icon: 'none' })
      return
    }
    setIsSubmitting(true)
    Taro.showLoading({ title: '提交中...' })
    setTimeout(() => {
      setIsSubmitting(false)
      Taro.hideLoading()
      Taro.showToast({ title: '评价成功！', icon: 'success' })
      setShowReview(false)
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/orders/index' })
      }, 1500)
    }, 1000)
  }

  const renderActions = () => {
    if (!order) return null
    const actions: { key: string; label: string; primary?: boolean }[] = []

    switch (order.status) {
      case 'pending':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'cancel', label: '取消订单', primary: true })
        break
      case 'confirmed':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'complete', label: '开始服务', primary: true })
        break
      case 'inProgress':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'complete', label: '完成服务', primary: true })
        break
      case 'toReview':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'review', label: '去评价', primary: true })
        break
      case 'completed':
        actions.push({ key: 'reorder', label: '再来一单', primary: true })
        break
      default:
        actions.push({ key: 'reorder', label: '再来一单', primary: true })
    }

    if (showReview) {
      return (
        <Button
          style={detailStyles.btnFull}
          onClick={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '提交评价'}
        </Button>
      )
    }

    return (
      <>
        {actions.filter(a => !a.primary).map(action => (
          <Button
            key={action.key}
            style={detailStyles.btnSecondary}
            onClick={() => handleAction(action.key)}
          >
            {action.label}
          </Button>
        ))}
        {actions.filter(a => a.primary).map(action => (
          <Button
            key={action.key}
            style={detailStyles.btnPrimary}
            onClick={() => handleAction(action.key)}
          >
            {action.label}
          </Button>
        ))}
      </>
    )
  }

  if (!order) {
    return (
      <View style={detailStyles.page}>
        <View style={{ textAlign: 'center', padding: '80rpx 0' }}>
          <Text style={{ fontSize: '80rpx' }}>⏳</Text>
          <Text style={{ display: 'block', marginTop: '16rpx', color: '#86909C' }}>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY style={detailStyles.page}>
      <View style={detailStyles.statusBar}>
        <Text style={detailStyles.statusText}>{statusMap[order.status].text}</Text>
        <Text style={detailStyles.statusDesc}>{statusMap[order.status].desc}</Text>
      </View>

      <View style={detailStyles.content}>
        {showReview ? (
          <View style={detailStyles.reviewSection}>
            <Text style={detailStyles.sectionTitle}>评价服务</Text>
            <View style={detailStyles.ratingRow}>
              <Text style={detailStyles.ratingLabel}>服务评分</Text>
              <View style={{ display: 'flex', gap: '16rpx' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text
                    key={star}
                    style={{
                      fontSize: '48rpx',
                      color: star <= rating ? '#FFAB00' : '#C9CDD4'
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>
            <View style={detailStyles.ratingRow}>
              <Text style={detailStyles.ratingLabel}>评价内容</Text>
            </View>
            <Textarea
              style={detailStyles.textareaField}
              placeholder='请分享您的服务体验，帮助其他邻居了解~'
              value={reviewContent}
              onInput={(e) => setReviewContent(e.detail.value)}
              maxlength={500}
              autoHeight
            />
          </View>
        ) : (
          <>
            <View style={detailStyles.infoCard}>
              <View style={detailStyles.skillRow}>
                <Image
                  style={detailStyles.skillImage}
                  src={order.skillImage}
                  mode='aspectFill'
                  onError={(e) => console.error('[OrderDetail] Skill image error:', e)}
                />
                <View style={detailStyles.skillInfo}>
                  <Text style={detailStyles.skillTitle}>{order.skillTitle}</Text>
                  <Text style={detailStyles.skillPrice}>¥{order.price}</Text>
                </View>
              </View>
              <View style={detailStyles.providerRow}>
                <Image
                  style={detailStyles.providerAvatar}
                  src={order.providerAvatar}
                  mode='aspectFill'
                />
                <Text style={detailStyles.providerName}>{order.providerName}</Text>
              </View>
            </View>

            <View style={detailStyles.infoCard}>
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>预约时间</Text>
                <Text style={detailStyles.infoValue}>{order.bookingTime}</Text>
              </View>
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>服务地点</Text>
                <Text style={detailStyles.infoValue}>{order.serviceArea}</Text>
              </View>
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>需求描述</Text>
                <Text style={detailStyles.infoValue}>{order.requirement}</Text>
              </View>
              {order.referenceImages.length > 0 && (
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>参考图片</Text>
                  <View style={detailStyles.refImages}>
                    {order.referenceImages.map((img, index) => (
                      <Image
                        key={index}
                        style={detailStyles.refImage}
                        src={img}
                        mode='aspectFill'
                        onError={(e) => console.error('[OrderDetail] Ref image error:', e)}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={detailStyles.infoCard}>
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>订单编号</Text>
                <Text style={detailStyles.infoValue}>{order.id}</Text>
              </View>
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>创建时间</Text>
                <Text style={detailStyles.infoValue}>{order.createdAt}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <View style={{ height: '120rpx' }} />
    </ScrollView>

    <View style={detailStyles.bottomBar}>
      {renderActions()}
    </View>
  )
}

export default OrderDetailPage
