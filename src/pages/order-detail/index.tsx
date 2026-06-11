import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Button, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { Order, OrderStatus } from '@/types'
import StarRating from '@/components/StarRating'

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
  const storeOrders = useAppStore(state => state.orders)
  const updateOrder = useAppStore(state => state.updateOrder)
  const [order, setOrder] = useState<Order | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const id = router.params.id
    const action = router.params.action
    if (id) {
      const data = storeOrders.find(o => o.id === id)
      if (data) {
        setOrder(data)
        if (action === 'review') {
          setShowReview(true)
        }
      }
    }
  }, [router.params.id, router.params.action, storeOrders])

  const handleAction = (action: string) => {
    if (!order) return
    switch (action) {
      case 'cancel':
        Taro.showModal({
          title: '确认取消',
          content: '确定要取消这个订单吗？',
          success: (res) => {
            if (res.confirm) {
              updateOrder(order.id, { status: 'cancelled' })
              Taro.showToast({ title: '订单已取消', icon: 'success' })
            }
          }
        })
        break
      case 'contact':
        Taro.showToast({ title: '沟通功能开发中', icon: 'none' })
        break
      case 'complete':
        updateOrder(order.id, { status: 'toReview' })
        Taro.showToast({ title: '服务已完成，请评价', icon: 'success' })
        break
      case 'review':
        setShowReview(true)
        break
      case 'reorder':
        Taro.navigateTo({
          url: `/pages/skill-detail/index?id=${order.skillId}`
        })
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
      if (order) {
        updateOrder(order.id, { status: 'completed' })
      }
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
        actions.push({ key: 'complete', label: '完成服务', primary: true })
        break
      case 'inProgress':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'complete', label: '完成服务', primary: true })
        break
      case 'toReview':
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
        <View className={styles.btnFull} onClick={handleSubmitReview}>
          <Text>{isSubmitting ? '提交中...' : '提交评价'}</Text>
        </View>
      )
    }

    return (
      <>
        {actions.filter(a => !a.primary).map(action => (
          <View
            key={action.key}
            className={styles.btnSecondary}
            onClick={() => handleAction(action.key)}
          >
            <Text>{action.label}</Text>
          </View>
        ))}
        {actions.filter(a => a.primary).map(action => (
          <View
            key={action.key}
            className={styles.btnPrimary}
            onClick={() => handleAction(action.key)}
          >
            <Text>{action.label}</Text>
          </View>
        ))}
      </>
    )
  }

  if (!order) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.statusBar}>
          <Text className={styles.statusText}>{statusMap[order.status].text}</Text>
          <Text className={styles.statusDesc}>{statusMap[order.status].desc}</Text>
        </View>

        <View className={styles.content}>
          {showReview ? (
            <View className={styles.reviewSection}>
              <Text className={styles.sectionTitle}>评价服务</Text>
              <View className={styles.ratingRow}>
                <Text className={styles.ratingLabel}>服务评分</Text>
                <View className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Text
                      key={star}
                      className={classnames(styles.star, star <= rating && styles.starActive)}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
              <View className={styles.ratingRow}>
                <Text className={styles.ratingLabel}>评价内容</Text>
              </View>
              <Textarea
                className={styles.textareaField}
                placeholder='请分享您的服务体验，帮助其他邻居了解~'
                value={reviewContent}
                onInput={(e) => setReviewContent(e.detail.value)}
                maxlength={500}
                autoHeight
              />
            </View>
          ) : (
            <>
              <View className={styles.infoCard}>
                <View className={styles.skillRow}>
                  <Image
                    className={styles.skillImage}
                    src={order.skillImage}
                    mode='aspectFill'
                  />
                  <View className={styles.skillInfo}>
                    <Text className={styles.skillTitle}>{order.skillTitle}</Text>
                    <Text className={styles.skillPrice}>¥{order.price}</Text>
                  </View>
                </View>
                <View className={styles.providerRow}>
                  <Image
                    className={styles.providerAvatar}
                    src={order.providerAvatar}
                    mode='aspectFill'
                  />
                  <Text className={styles.providerName}>{order.providerName}</Text>
                </View>
              </View>

              <View className={styles.infoCard}>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>预约时间</Text>
                  <Text className={styles.infoValue}>{order.bookingTime}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>服务地点</Text>
                  <Text className={styles.infoValue}>{order.serviceArea}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>需求描述</Text>
                  <Text className={styles.infoValue}>{order.requirement}</Text>
                </View>
                {order.referenceImages.length > 0 && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>参考图片</Text>
                    <View className={styles.refImages}>
                      {order.referenceImages.map((img, index) => (
                        <Image
                          key={index}
                          className={styles.refImage}
                          src={img}
                          mode='aspectFill'
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View className={styles.infoCard}>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>订单编号</Text>
                  <Text className={styles.infoValue}>{order.id}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>创建时间</Text>
                  <Text className={styles.infoValue}>{order.createdAt}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        {renderActions()}
      </View>
    </View>
  )
}

export default OrderDetailPage
