import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { Coupon } from '@/types'

const tabs = [
  { key: 'available', label: '可使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' }
]

const DiscountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available')
  const coupons = useAppStore(state => state.coupons)
  const useCoupon = useAppStore(state => state.useCoupon)

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => c.status === activeTab)
  }, [activeTab, coupons])

  const availableCount = coupons.filter(c => c.status === 'available').length

  const handleUseCoupon = (coupon: Coupon) => {
    useCoupon(coupon.id)
    Taro.showToast({ title: '优惠券已使用，正在跳转首页', icon: 'none' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }

  const handleCouponClick = (coupon: Coupon) => {
    if (coupon.status === 'available') {
      Taro.showToast({ title: coupon.description, icon: 'none' })
    }
  }

  const formatValue = (coupon: Coupon) => {
    if (coupon.value >= 1) return coupon.value
    return (coupon.value * 10).toFixed(1)
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>邻里优惠</Text>
        <Text className={styles.subtitle}>专属优惠，邻里共享</Text>
        <Text className={styles.couponCount}>{availableCount}</Text>
        <Text className={styles.couponCountLabel}>张可用优惠券</Text>
      </View>

      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.couponList}>
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map(coupon => (
            <View
              key={coupon.id}
              className={classnames(
                styles.couponCard,
                coupon.status === 'expired' && styles.expired,
                coupon.status === 'used' && styles.used
              )}
              onClick={() => handleCouponClick(coupon)}
            >
              {coupon.status !== 'available' && (
                <View className={classnames(styles.couponBadge, styles[coupon.status])}>
                  {coupon.status === 'used' ? '已使用' : '已过期'}
                </View>
              )}
              <View className={styles.couponLeft}>
                <View>
                  <Text className={styles.couponAmountUnit}>¥</Text>
                  <Text className={styles.couponAmount}>{formatValue(coupon)}</Text>
                </View>
                <Text className={styles.couponCondition}>满{coupon.minAmount}可用</Text>
              </View>
              <View className={styles.couponRight}>
                <View>
                  <Text className={styles.couponTitle}>{coupon.name}</Text>
                  <Text className={styles.couponDesc}>{coupon.description}</Text>
                  <Text className={styles.couponValidity}>有效期至 {coupon.expireDate}</Text>
                </View>
                {coupon.status === 'available' ? (
                  <Button
                    className={styles.couponAction}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseCoupon(coupon)
                    }}
                  >
                    立即使用
                  </Button>
                ) : (
                  <Button
                    className={classnames(styles.couponAction, styles.disabled)}
                    disabled
                  >
                    {coupon.status === 'used' ? '已使用' : '已过期'}
                  </Button>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎫</Text>
            <Text className={styles.emptyTitle}>暂无优惠券</Text>
            <Text className={styles.emptyDesc}>多多关注平台活动，领取更多优惠~</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default DiscountPage
