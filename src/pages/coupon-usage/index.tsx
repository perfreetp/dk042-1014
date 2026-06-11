import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { CouponUsageRecord } from '@/types'

const CouponUsagePage: React.FC = () => {
  const usageRecords = useAppStore(state => state.couponUsageRecords)
  const [filterStatus, setFilterStatus] = useState<'all' | 'used' | 'refunded'>('all')

  const filteredRecords = useMemo(() => {
    if (filterStatus === 'all') return usageRecords
    return usageRecords.filter(r => r.status === filterStatus)
  }, [usageRecords, filterStatus])

  const stats = useMemo(() => {
    const totalUsed = usageRecords.filter(r => r.status === 'used').length
    const totalRefunded = usageRecords.filter(r => r.status === 'refunded').length
    const totalDiscount = usageRecords.reduce((sum, r) => sum + (r.status === 'used' ? r.discountAmount : 0), 0)
    return { totalUsed, totalRefunded, totalDiscount }
  }, [usageRecords])

  const handleGoOrder = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${orderId}`
    })
  }

  const filterTabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'used' as const, label: '已使用' },
    { key: 'refunded' as const, label: '已退回' }
  ]

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollView}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>💳 优惠券使用明细</Text>
          <View className={styles.statsWrap}>
            <View className={styles.statsItem}>
              <Text className={styles.statsNum}>{stats.totalUsed}</Text>
              <Text className={styles.statsLabel}>已使用</Text>
            </View>
            <View className={styles.statsDivider} />
            <View className={styles.statsItem}>
              <Text className={styles.statsNum}>{stats.totalRefunded}</Text>
              <Text className={styles.statsLabel}>已退回</Text>
            </View>
            <View className={styles.statsDivider} />
            <View className={styles.statsItem}>
              <Text className={classnames(styles.statsNum, styles.statsHighlight)}>
                ¥{stats.totalDiscount.toFixed(2)}
              </Text>
              <Text className={styles.statsLabel}>累计优惠</Text>
            </View>
          </View>
        </View>

        <View className={styles.filterBar}>
          {filterTabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.filterTab, filterStatus === tab.key && styles.filterTabActive)}
              onClick={() => setFilterStatus(tab.key)}
            >
              <Text className={classnames(styles.filterText, filterStatus === tab.key && styles.filterTextActive)}>
                {tab.label}
              </Text>
            </View>
          ))}
        </View>

        <View className={styles.listWrap}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <View
                key={record.id}
                className={styles.recordCard}
                onClick={() => handleGoOrder(record.orderId)}
              >
                <View className={styles.cardHeader}>
                  <View className={styles.couponInfo}>
                    <Text className={styles.couponName}>{record.couponName}</Text>
                    <View className={classnames(
                      styles.statusTag,
                      record.status === 'used' ? styles.statusUsed : styles.statusRefunded
                    )}>
                      <Text className={styles.statusText}>
                        {record.status === 'used' ? '已使用' : '已退回'}
                      </Text>
                    </View>
                  </View>
                  <Text className={styles.discountAmount}>
                    -¥{record.discountAmount.toFixed(2)}
                  </Text>
                </View>

                <View className={styles.cardBody}>
                  <View className={styles.orderRow}>
                    <Text className={styles.orderLabel}>抵扣订单</Text>
                    <View className={styles.orderInfo}>
                      <Text className={styles.orderTitle}>{record.orderTitle}</Text>
                      <Text className={styles.orderArrow}>›</Text>
                    </View>
                  </View>
                  <View className={styles.priceRow}>
                    <Text className={styles.priceLabel}>原价</Text>
                    <Text className={styles.originalPrice}>¥{record.originalPrice.toFixed(2)}</Text>
                    <Text className={styles.priceLabel}>实付</Text>
                    <Text className={styles.finalPrice}>¥{record.finalPrice.toFixed(2)}</Text>
                  </View>
                </View>

                <View className={styles.cardFooter}>
                  <Text className={styles.useTime}>
                    {record.status === 'used' ? '使用时间：' : '退回时间：'}
                    {record.status === 'used' ? record.usedAt : (record.refundedAt || '-')}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyWrap}>
              <Text className={styles.emptyIcon}>📜</Text>
              <Text className={styles.emptyTitle}>暂无使用记录</Text>
              <Text className={styles.emptyDesc}>
                {filterStatus === 'refunded' ? '还没有优惠券被退回哦~' : '快去使用优惠券吧！'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: '60rpx' }} />
      </ScrollView>
    </View>
  )
}

export default CouponUsagePage
