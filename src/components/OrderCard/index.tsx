import React from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { Order, OrderStatus } from '@/types'
import { useAppStore } from '@/store'

interface OrderCardProps {
  order: Order
  onAction?: (action: string, order: Order) => void
}

const statusMap: Record<OrderStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  inProgress: '进行中',
  completing: '待确认完成',
  toReview: '待评价',
  completed: '已完成',
  cancelled: '已取消'
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAction }) => {
  const isProvider = useAppStore(state => state.isProvider)
  const isCustomer = useAppStore(state => state.isCustomer)
  const asProvider = isProvider(order)
  const asCustomer = isCustomer(order)

  const contactLabel = asProvider ? '联系下单人' : (asCustomer ? '联系服务者' : '联系对方')

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${order.id}`
    })
  }

  const handleAction = (action: string, e) => {
    e.stopPropagation()
    if (onAction) {
      onAction(action, order)
    } else {
      Taro.showToast({ title: `${action}功能开发中`, icon: 'none' })
    }
  }

  const renderActions = () => {
    const actions: { key: string; label: string; primary?: boolean }[] = []

    if (asProvider) {
      switch (order.status) {
        case 'pending':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'cancel', label: '取消订单' })
          actions.push({ key: 'confirm', label: '确认接单', primary: true })
          break
        case 'confirmed':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'start', label: '开始服务', primary: true })
          break
        case 'inProgress':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'submitComplete', label: '提交完成', primary: true })
          break
        case 'completing':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'submitComplete', label: '再次提交', primary: true })
          break
        case 'toReview':
          actions.push({ key: 'contact', label: contactLabel })
          break
        case 'completed':
          actions.push({ key: 'contact', label: contactLabel })
          break
        default:
          actions.push({ key: 'contact', label: contactLabel, primary: true })
      }
    } else if (asCustomer) {
      switch (order.status) {
        case 'pending':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'cancel', label: '取消订单', primary: true })
          break
        case 'confirmed':
          actions.push({ key: 'contact', label: contactLabel, primary: true })
          break
        case 'inProgress':
          actions.push({ key: 'contact', label: contactLabel, primary: true })
          break
        case 'completing':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'customerReject', label: '要求补充' })
          actions.push({ key: 'customerConfirm', label: '确认完成', primary: true })
          break
        case 'toReview':
          actions.push({ key: 'review', label: '去评价', primary: true })
          break
        case 'completed':
          actions.push({ key: 'contact', label: contactLabel })
          actions.push({ key: 'reorder', label: '再来一单', primary: true })
          break
        default:
          actions.push({ key: 'reorder', label: '再来一单', primary: true })
      }
    } else {
      actions.push({ key: 'contact', label: contactLabel, primary: true })
    }

    return actions.map(action => (
      <Button
        key={action.key}
        className={classnames(styles.actionBtn, action.primary && styles.primary)}
        onClick={(e) => handleAction(action.key, e)}
      >
        {action.label}
      </Button>
    ))
  }

  return (
    <View className={styles.orderCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.skillInfo}>
          <Image
            className={styles.skillImage}
            src={order.skillImage}
            mode='aspectFill'
            onError={(e) => console.error('[OrderCard] Image load error:', e)}
          />
          <Text className={styles.skillTitle}>{order.skillTitle}</Text>
        </View>
        <Text className={classnames(styles.statusText, styles[order.status])}>
          {statusMap[order.status]}
        </Text>
      </View>

      <View className={styles.cardContent}>
        <View className={styles.providerInfo}>
          <Image
            className={styles.providerAvatar}
            src={order.providerAvatar}
            mode='aspectFill'
          />
          <View className={styles.providerText}>
            <Text className={styles.providerName}>
              {asProvider ? '我（服务者）' : order.providerName}
            </Text>
            <Text className={styles.roleTag}>
              {asProvider ? '服务者' : '下单人'}
            </Text>
          </View>
        </View>
        <View className={styles.priceWrap}>
          {order.couponId && (
            <Text className={styles.originalPrice}>¥{order.originalPrice}</Text>
          )}
          <Text className={styles.price}>¥{order.price}</Text>
        </View>
      </View>

      <View className={styles.orderInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>预约时间</Text>
          <Text className={styles.infoValue}>{order.bookingTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>服务地点</Text>
          <Text className={styles.infoValue}>{order.serviceArea}</Text>
        </View>
        {order.couponId && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>优惠券</Text>
            <Text className={classnames(styles.infoValue, styles.couponValue)}>
              {order.couponName} -¥{order.couponDiscount?.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      <View className={styles.cardActions}>
        {renderActions()}
      </View>
    </View>
  )
}

export default OrderCard
