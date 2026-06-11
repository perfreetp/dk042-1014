import React from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { Order, OrderStatus } from '@/types'

interface OrderCardProps {
  order: Order
  onAction?: (action: string, order: Order) => void
}

const statusMap: Record<OrderStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  inProgress: '进行中',
  toReview: '待评价',
  completed: '已完成',
  cancelled: '已取消'
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAction }) => {
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

    switch (order.status) {
      case 'pending':
        actions.push({ key: 'cancel', label: '取消订单' })
        actions.push({ key: 'contact', label: '联系对方', primary: true })
        break
      case 'confirmed':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'start', label: '开始服务', primary: true })
        break
      case 'inProgress':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'complete', label: '完成服务', primary: true })
        break
      case 'toReview':
        actions.push({ key: 'review', label: '去评价', primary: true })
        break
      case 'completed':
        actions.push({ key: 'contact', label: '联系对方' })
        actions.push({ key: 'reorder', label: '再来一单', primary: true })
        break
      default:
        actions.push({ key: 'reorder', label: '再来一单', primary: true })
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
          <Text className={styles.providerName}>{order.providerName}</Text>
        </View>
        <Text className={styles.price}>¥{order.price}</Text>
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
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>需求描述</Text>
          <Text className={styles.infoValue}>{order.requirement}</Text>
        </View>
      </View>

      <View className={styles.cardActions}>
        {renderActions()}
      </View>
    </View>
  )
}

export default OrderCard
