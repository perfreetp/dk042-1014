import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
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
  const usageRecords = useAppStore(state => state.couponUsageRecords)

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => c.status === activeTab)
  }, [activeTab, coupons])

  const availableCount = coupons.filter(c => c.status === 'available').length
  const cashCount = coupons.filter(c => c.status === 'available' && c.type === 'cash').length
  const discountCount = coupons.filter(c => c.status === 'available' && c.type === 'discount').length
  const usedCount = usageRecords.filter(r => r.status === 'used').length
  const refundedCount = usageRecords.filter(r => r.status === 'refunded').length

  const handleUseCoupon = (coupon: Coupon) => {
    Taro.showToast({ title: '正在跳转首页找服务', icon: 'none' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/index/index' })
    }, 1200)
  }

  const handleGoUsage = () => {
    Taro.navigateTo({ url: '/pages/coupon-usage/index' })
  }

  const handleCouponClick = (coupon: Coupon) => {
    if (coupon.status === 'available') {
      Taro.showToast({ title: coupon.description, icon: 'none' })
    }
  }

  const formatDisplayValue = (coupon: Coupon) => {
    if (coupon.type === 'cash') {
      return coupon.value
    }
    return coupon.value.toFixed(1)
  }

  const getUnitText = (coupon: Coupon) => {
    return coupon.type === 'cash' ? '¥' : '折'
  }

  const isDiscountType = (coupon: Coupon) => coupon.type === 'discount'

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerRow}>
          <View>
            <Text className={styles.title}>邻里优惠</Text>
            <Text className={styles.subtitle}>专属优惠，邻里共享</Text>
          </View>
          <View className={styles.usageEntry} onClick={handleGoUsage}>
            <Text className={styles.usageEntryText}>使用明细 ›</Text>
          </View>
        </View>
        <View className={styles.couponStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{availableCount}</Text>
            <Text className={styles.statLabel}>张可用</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{cashCount}</Text>
            <Text className={styles.statLabel}>张现金券</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{discountCount}</Text>
            <Text className={styles.statLabel}>张折扣券</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
            {tab.key === 'available' && availableCount > 0 && (
              <Text className={styles.tabBadge}>{availableCount}</Text>
            )}
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
                isDiscountType(coupon) && styles.couponDiscount,
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
              <View className={classnames(
                styles.couponLeft,
                isDiscountType(coupon) && styles.couponLeftDiscount
              )}>
                <View className={styles.couponValueRow}>
                  {isDiscountType(coupon) ? (
                    <>
                      <Text className={styles.couponAmount}>{formatDisplayValue(coupon)}</Text>
                      <Text className={styles.couponUnit}>{getUnitText(coupon)}</Text>
                    </>
                  ) : (
                    <>
                      <Text className={styles.couponAmountUnit}>¥</Text>
                      <Text className={styles.couponAmount}>{formatDisplayValue(coupon)}</Text>
                    </>
                  )}
                </View>
                <Text className={styles.couponCondition}>满{coupon.minAmount}可用</Text>
                <Text className={styles.couponTypeTag}>
                  {isDiscountType(coupon) ? '折扣券' : '现金券'}
                </Text>
              </View>
              <View className={styles.couponRight}>
                <View>
                  <Text className={styles.couponTitle}>{coupon.name}</Text>
                  <Text className={styles.couponDesc}>{coupon.description}</Text>
                  <Text className={styles.couponValidity}>有效期至 {coupon.expireDate}</Text>
                </View>
                {coupon.status === 'available' ? (
                  <View
                    className={classnames(
                      styles.couponAction,
                      isDiscountType(coupon) && styles.couponActionDiscount
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseCoupon(coupon)
                    }}
                  >
                    <Text>立即使用</Text>
                  </View>
                ) : (
                  <View className={classnames(styles.couponAction, styles.disabled)}>
                    <Text>{coupon.status === 'used' ? '已使用' : '已过期'}</Text>
                  </View>
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
