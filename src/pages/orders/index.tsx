import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import OrderCard from '@/components/OrderCard'
import EmptyState from '@/components/EmptyState'
import { orders, getOrdersByStatus } from '@/data/orders'
import { Order, OrderStatus } from '@/types'

interface TabItem {
  key: OrderStatus | 'all'
  label: string
}

const tabs: TabItem[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'inProgress', label: '进行中' },
  { key: 'toReview', label: '待评价' },
  { key: 'completed', label: '已完成' }
]

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredOrders = useMemo(() => {
    console.log('[Orders] Filtering orders by status:', activeTab)
    return getOrdersByStatus(activeTab)
  }, [activeTab])

  const handleTabClick = (key: OrderStatus | 'all') => {
    console.log('[Orders] Tab clicked:', key)
    setActiveTab(key)
  }

  const handleAction = (action: string, order: Order) => {
    console.log('[Orders] Action:', action, 'order:', order.id)
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
        Taro.showToast({ title: '正在发起沟通...', icon: 'loading' })
        setTimeout(() => {
          Taro.showToast({ title: '沟通功能开发中', icon: 'none' })
        }, 1000)
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

  const handlePullDownRefresh = () => {
    console.log('[Orders] Pull down refresh')
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  React.useEffect(() => {
    Taro.eventCenter.on('__taroPullDownRefresh', handlePullDownRefresh)
    return () => {
      Taro.eventCenter.off('__taroPullDownRefresh', handlePullDownRefresh)
    }
  }, [])

  return (
    <ScrollView
      scrollY
      className={styles.page}
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
    </ScrollView>
  )
}

export default OrdersPage
