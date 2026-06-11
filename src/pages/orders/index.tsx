import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import OrderCard from '@/components/OrderCard'
import EmptyState from '@/components/EmptyState'
import { useAppStore } from '@/store'
import { Order, OrderStatus } from '@/types'

interface TabItem {
  key: OrderStatus | 'all'
  label: string
}

const tabs: TabItem[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'confirmed', label: '已确认' },
  { key: 'inProgress', label: '进行中' },
  { key: 'completing', label: '待确认完成' },
  { key: 'toReview', label: '待评价' },
  { key: 'completed', label: '已完成' }
]

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')
  const orders = useAppStore(state => state.orders)
  const updateOrder = useAppStore(state => state.updateOrder)
  const cancelOrder = useAppStore(state => state.cancelOrder)
  const addFulfillmentRecord = useAppStore(state => state.addFulfillmentRecord)
  const getOrCreateChatSessionByOrder = useAppStore(state => state.getOrCreateChatSessionByOrder)
  const isProviderFn = useAppStore(state => state.isProvider)
  const isCustomerFn = useAppStore(state => state.isCustomer)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [rejectOrder, setRejectOrder] = useState<Order | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders
    return orders.filter(o => o.status === activeTab)
  }, [activeTab, orders])

  const handleTabClick = (key: OrderStatus | 'all') => {
    setActiveTab(key)
  }

  const handleContact = (order: Order) => {
    const session = getOrCreateChatSessionByOrder(order)
    Taro.navigateTo({
      url: `/pages/chat/index?chatId=${session.id}`
    })
  }

  const handleAction = (action: string, order: Order) => {
    const asProvider = isProviderFn(order)
    const asCustomer = isCustomerFn(order)

    switch (action) {
      case 'cancel':
        Taro.showModal({
          title: '确认取消',
          content: asProvider
            ? '确定要取消这个订单吗？取消后优惠券将退回给下单人。'
            : '确定要取消这个订单吗？取消后优惠券将退回。',
          success: (res) => {
            if (res.confirm) {
              cancelOrder(order.id)
              Taro.showToast({ title: '订单已取消', icon: 'success' })
            }
          }
        })
        break
      case 'confirm':
        Taro.showModal({
          title: '确认接单',
          content: '确认接单后，请按时提供服务',
          success: (res) => {
            if (res.confirm) {
              updateOrder(order.id, { status: 'confirmed' })
              addFulfillmentRecord(order.id, {
                actionKey: 'confirmed',
                action: '服务者确认接单',
                operatorId: order.providerId,
                operatorName: order.providerName,
                operatorAvatar: order.providerAvatar
              })
              Taro.showToast({ title: '接单成功', icon: 'success' })
            }
          }
        })
        break
      case 'start':
        Taro.showModal({
          title: '开始服务',
          content: '确认开始服务后，订单状态将更新为进行中',
          success: (res) => {
            if (res.confirm) {
              updateOrder(order.id, { status: 'inProgress' })
              addFulfillmentRecord(order.id, {
                actionKey: 'started',
                action: '开始服务',
                operatorId: order.providerId,
                operatorName: order.providerName,
                operatorAvatar: order.providerAvatar
              })
              Taro.showToast({ title: '服务已开始', icon: 'success' })
            }
          }
        })
        break
      case 'submitComplete':
      case 'markDone':
        Taro.showModal({
          title: '提交完成申请',
          content: '确认服务已完成？下单人将收到确认通知。',
          success: (res) => {
            if (res.confirm) {
              updateOrder(order.id, { status: 'completing' })
              addFulfillmentRecord(order.id, {
                actionKey: 'submittedComplete',
                action: '服务者提交完成申请',
                operatorId: order.providerId,
                operatorName: order.providerName,
                operatorAvatar: order.providerAvatar
              })
              Taro.showToast({ title: '已提交完成申请', icon: 'success' })
            }
          }
        })
        break
      case 'customerConfirm':
        Taro.showModal({
          title: '确认完成',
          content: '确认服务已完成且满意？确认后将进入评价环节。',
          success: (res) => {
            if (res.confirm) {
              updateOrder(order.id, { status: 'toReview' })
              addFulfillmentRecord(order.id, {
                actionKey: 'customerConfirmed',
                action: '下单人确认完成',
                operatorId: order.customerId,
                operatorName: order.customerName,
                operatorAvatar: order.customerAvatar
              })
              Taro.showToast({ title: '已确认完成，请评价', icon: 'success' })
            }
          }
        })
        break
      case 'customerReject':
        setRejectOrder(order)
        setRejectReason('')
        break
      case 'contact':
        handleContact(order)
        break
      case 'review':
        Taro.navigateTo({
          url: `/pages/order-detail/index?id=${order.id}&action=review`
        })
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

  const handleSubmitReject = () => {
    if (!rejectOrder || !rejectReason.trim()) {
      Taro.showToast({ title: '请填写补充说明', icon: 'none' })
      return
    }
    updateOrder(rejectOrder.id, { status: 'inProgress' })
    addFulfillmentRecord(rejectOrder.id, {
      actionKey: 'customerRejected',
      action: '下单人要求补充服务',
      operatorId: rejectOrder.customerId,
      operatorName: rejectOrder.customerName,
      operatorAvatar: rejectOrder.customerAvatar,
      remark: rejectReason.trim()
    })
    Taro.showToast({ title: '已通知服务者补充', icon: 'success' })
    setRejectOrder(null)
    setRejectReason('')
  }

  const handlePullDownRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <ScrollView
        scrollY
        className={styles.scrollView}
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={handlePullDownRefresh}
      >
        <View className={styles.tabBar}>
          <ScrollView scrollX className={styles.tabScroll}>
            {tabs.map(tab => (
              <View
                key={tab.key}
                className={classnames(styles.tabItem, activeTab === tab.key && styles.tabActive)}
                onClick={() => handleTabClick(tab.key)}
              >
                <Text className={styles.tabText}>{tab.label}</Text>
                {tab.key !== 'all' && orders.filter(o => o.status === tab.key).length > 0 && (
                  <Text className={styles.tabBadge}>
                    {orders.filter(o => o.status === tab.key).length}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.orderList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={handleAction}
              />
            ))
          ) : (
            <EmptyState
              icon='📋'
              title='暂无订单'
              desc='快去首页发现感兴趣的技能服务吧~'
            />
          )}
        </View>

        <View style={{ height: '40rpx' }} />
      </ScrollView>

      {rejectOrder && (
        <View className={styles.modalMask} onClick={() => { setRejectOrder(null); setRejectReason('') }}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>要求补充服务</Text>
            <Text className={styles.modalDesc}>
              请描述需要补充的内容，服务者将重新完善服务。
            </Text>
            <Textarea
              className={styles.modalTextarea}
              placeholder='请输入需要补充的内容...'
              value={rejectReason}
              onInput={(e) => setRejectReason(e.detail.value)}
              maxlength={200}
              autoHeight
            />
            <View className={styles.modalActions}>
              <View className={styles.modalBtnCancel} onClick={() => { setRejectOrder(null); setRejectReason('') }}>
                取消
              </View>
              <View className={styles.modalBtnConfirm} onClick={handleSubmitReject}>
                提交
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default OrdersPage
