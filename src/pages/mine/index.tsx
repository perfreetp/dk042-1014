import React, { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { currentUser } from '@/data/user'

const menuItems = [
  { id: 'skill-manage', icon: '📝', text: '技能管理', path: '/pages/skill-manage/index' },
  { id: 'income', icon: '💰', text: '收入记录', path: '/pages/income/index' },
  { id: 'favorites', icon: '⭐', text: '我的收藏', path: '/pages/favorites/index' },
  { id: 'review-reply', icon: '💬', text: '评价回复', path: '/pages/review-reply/index' }
]

const serviceItems = [
  { id: 'verification', icon: '✅', text: '实名认证', desc: '完成认证，提升信任度', path: '/pages/verification/index' },
  { id: 'discount', icon: '🎁', text: '邻里优惠', desc: '专属优惠券等你领', path: '/pages/discount/index' },
  { id: 'feedback', icon: '📮', text: '纠纷反馈', desc: '遇到问题请反馈', path: '/pages/feedback/index' },
  { id: 'notice', icon: '📢', text: '平台公告', desc: '了解平台最新动态', path: '/pages/notice/index' }
]

const MinePage: React.FC = () => {
  const [isAccepting, setIsAccepting] = useState(currentUser.isAcceptingOrders)
  const storeSkills = useAppStore(state => state.skills)
  const storeOrders = useAppStore(state => state.orders)

  const publishedCount = useMemo(() => {
    return storeSkills.filter(s => s.provider.id === currentUser.id).length
  }, [storeSkills])

  const completedCount = useMemo(() => {
    return storeOrders.filter(o => o.status === 'completed' && (o.providerId === currentUser.id || o.customerId === currentUser.id)).length
  }, [storeOrders])

  const favoriteCount = useMemo(() => {
    return storeSkills.filter(s => s.isFavorite).length
  }, [storeSkills])

  const handleNavigate = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const handleSwitchChange = (e) => {
    const newValue = e.detail.value
    setIsAccepting(newValue)
    Taro.showToast({
      title: newValue ? '已开启接单' : '已关闭接单',
      icon: 'success'
    })
  }

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'skills':
        Taro.navigateTo({ url: '/pages/skill-manage/index' })
        break
      case 'orders':
        Taro.switchTab({ url: '/pages/orders/index' })
        break
      case 'favorites':
        Taro.navigateTo({ url: '/pages/favorites/index' })
        break
    }
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userCard}>
          <Image
            className={styles.avatar}
            src={currentUser.avatar}
            mode='aspectFill'
          />
          <View className={styles.userInfo}>
            <View className={styles.userNameRow}>
              <Text className={styles.userName}>{currentUser.name}</Text>
              {currentUser.isVerified ? (
                <Text className={styles.verifiedBadge}>✓ 已认证</Text>
              ) : (
                <Text className={styles.unverifiedBadge}>未认证</Text>
              )}
            </View>
            <Text className={styles.userLocation}>📍 {currentUser.neighborhood}</Text>
            <Text className={styles.userPhone}>{currentUser.phone}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem} onClick={() => handleStatClick('skills')}>
            <Text className={styles.statValue}>{publishedCount}</Text>
            <Text className={styles.statLabel}>发布技能</Text>
          </View>
          <View className={styles.statItem} onClick={() => handleStatClick('orders')}>
            <Text className={styles.statValue}>{completedCount}</Text>
            <Text className={styles.statLabel}>完成订单</Text>
          </View>
          <View className={styles.statItem} onClick={() => handleStatClick('favorites')}>
            <Text className={styles.statValue}>{favoriteCount}</Text>
            <Text className={styles.statLabel}>收藏数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{currentUser.balance}</Text>
            <Text className={styles.statLabel}>账户余额</Text>
          </View>
        </View>
      </View>

      <View className={styles.orderSwitchCard}>
        <View className={styles.switchInfo}>
          <Text className={styles.switchTitle}>
            接单开关
            {isAccepting && <Text style={{ color: '#36B37E', fontSize: '22rpx' }}>● 接单中</Text>}
          </Text>
          <Text className={styles.switchDesc}>
            {isAccepting ? '关闭后将无法收到新的订单预约' : '开启后邻居可以向您发起预约'}
          </Text>
        </View>
        <Switch
          checked={isAccepting}
          color='#FF7A45'
          onChange={handleSwitchChange}
        />
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.menuTitle}>常用功能</Text>
        <View className={styles.menuGrid}>
          {menuItems.map(item => (
            <View
              key={item.id}
              className={styles.menuItem}
              onClick={() => handleNavigate(item.path)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <Text className={styles.menuText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.serviceSection}>
        {serviceItems.map(item => (
          <View
            key={item.id}
            className={styles.serviceItem}
            onClick={() => handleNavigate(item.path)}
          >
            <View className={styles.serviceIcon}>{item.icon}</View>
            <View className={styles.serviceInfo}>
              <Text className={styles.serviceTitle}>{item.text}</Text>
              <Text className={styles.serviceDesc}>{item.desc}</Text>
            </View>
            <Text className={styles.serviceArrow}>›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default MinePage
