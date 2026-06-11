import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { incomeRecords } from '@/data/orders'
import { currentUser } from '@/data/user'
import { IncomeRecord } from '@/types'

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'income', label: '收入' },
  { key: 'withdraw', label: '提现' }
]

const IncomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')

  const filteredRecords = useMemo(() => {
    console.log('[Income] Filtering records by:', activeTab)
    if (activeTab === 'all') return incomeRecords
    return incomeRecords.filter(r => r.type === activeTab)
  }, [activeTab])

  const handleWithdraw = () => {
    Taro.showModal({
      title: '提现',
      content: `可提现金额：¥${currentUser.balance.toFixed(2)}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提现申请已提交', icon: 'success' })
        }
      }
    })
  }

  const handleRecharge = () => {
    Taro.showToast({ title: '充值功能开发中', icon: 'none' })
  }

  const handleRecordClick = (record: IncomeRecord) => {
    console.log('[Income] Record clicked:', record.id)
    Taro.showToast({ title: `订单号：${record.orderId}`, icon: 'none' })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.balanceCard}>
          <Text className={styles.balanceLabel}>账户余额</Text>
          <Text className={styles.balanceValue}>¥{currentUser.balance.toFixed(2)}</Text>
          <View className={styles.balanceActions}>
            <Button className={styles.actionBtn} onClick={handleWithdraw}>提现</Button>
            <Button className={styles.actionBtn} onClick={handleRecharge}>充值</Button>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{currentUser.totalIncome.toFixed(2)}</Text>
            <Text className={styles.statLabel}>累计收入</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentUser.completedOrders}</Text>
            <Text className={styles.statLabel}>完成订单</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentUser.publishedSkills}</Text>
            <Text className={styles.statLabel}>技能服务</Text>
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
          </View>
        ))}
      </View>

      <View className={styles.recordList}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <View
              key={record.id}
              className={styles.recordCard}
              onClick={() => handleRecordClick(record)}
            >
              <View className={styles.recordInfo}>
                <Text className={styles.recordTitle}>{record.skillTitle}</Text>
                <Text className={styles.recordDate}>{record.createdAt}</Text>
              </View>
              <View className={styles.recordAmount}>
                <Text className={classnames(
                  styles.amountValue,
                  record.type === 'income' ? styles.income : styles.withdraw
                )}>
                  {record.type === 'income' ? '+' : '-'}¥{record.amount.toFixed(2)}
                </Text>
                <Text className={classnames(
                  styles.amountStatus,
                  record.status === 'pending' && styles.pending,
                  record.status === 'failed' && styles.failed
                )}>
                  {record.status === 'success' ? '已到账' : record.status === 'pending' ? '处理中' : '失败'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ textAlign: 'center', padding: '80rpx 0' }}>
            <Text style={{ fontSize: '80rpx' }}>💰</Text>
            <Text style={{ display: 'block', marginTop: '16rpx', color: '#86909C' }}>暂无记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default IncomePage
