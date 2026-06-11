import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { coupons } from '@/data/user'
import { Coupon } from '@/types'

const tabs = [
  { key: 'available', label: '可使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' }
]

const DiscountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available')

  const filteredCoupons = useMemo(() => {
    console.log('[Discount] Filtering coupons by:', activeTab)
    return coupons.filter(c => c.status === activeTab)
  }, [activeTab])

  const availableCount = coupons.filter(c => c.status === 'available').length

  const handleUseCoupon = (coupon: Coupon) => {
    console.log('[Discount] Use coupon:', coupon.id)
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const handleCouponClick = (coupon: Coupon) => {
    console.log('[Discount] Coupon clicked:', coupon.id)
    if (coupon.status === 'available') {
      Taro.showToast({ title: coupon.description, icon: 'none' })
    }
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
                  <Text className={styles.couponAmount}>{coupon.value}</Text>
                </View>
                <Text className={styles.couponCondition}>满{coupon.minAmount}可用</Text>
              </View>
              <View className={styles.couponRight}>
                <View>
                  <Text className={styles.couponTitle}>{coupon.name}</Text>
                  <Text className={styles.couponDesc}>{coupon.description}</Text>
                  <Text className={styles.couponValidity}>有效期至 {coupon.expireDate}</Text>
                </View>
                <Button
                  className={classnames(
                    styles.couponAction,
                    coupon.status !== 'available' && styles.disabled,
                    styles[coupon.status]
                  )}
                  disabled={coupon.status !== 'available'}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUseCoupon(coupon)
                  }}
                >
                  {coupon.status === 'available' ? '立即使用' : coupon.status === 'used' ? '已使用' : '已过期'}
                </Button>
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
