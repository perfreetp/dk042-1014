import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { notices } from '@/data/user'
import { Notice } from '@/types'

const NoticePage: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const getTagInfo = (type: string) => {
    switch (type) {
      case 'important':
        return { text: '重要', class: styles.important }
      case 'new':
        return { text: '新功能', class: styles.new }
      case 'activity':
        return { text: '活动', class: styles.activity }
      default:
        return { text: '公告', class: '' }
    }
  }

  const toggleExpand = (id: string) => {
    console.log('[Notice] Toggle expand:', id)
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleImagePreview = (images: string[], current: string) => {
    console.log('[Notice] Preview image:', current)
    Taro.previewImage({
      urls: images,
      current
    })
  }

  const handleNoticeClick = (notice: Notice) => {
    console.log('[Notice] Notice clicked:', notice.id)
    toggleExpand(notice.id)
  }

  const renderContent = (content: string, isExpanded: boolean) => {
    if (isExpanded || content.length <= 150) {
      return content
    }
    return content.slice(0, 150) + '...'
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.noticeList}>
        {notices.length > 0 ? (
          notices.map(notice => {
            const tagInfo = getTagInfo(notice.type)
            const isExpanded = expandedIds.has(notice.id)
            const needsExpand = notice.content.length > 150

            return (
              <View
                key={notice.id}
                className={styles.noticeCard}
                onClick={() => handleNoticeClick(notice)}
              >
                <View className={styles.noticeHeader}>
                  <Text className={styles.noticeTitle}>{notice.title}</Text>
                  <Text className={classnames(styles.noticeTag, tagInfo.class)}>
                    {tagInfo.text}
                  </Text>
                </View>
                <View className={styles.noticeBody}>
                  <Text className={styles.noticeDate}>📅 {notice.createdAt}</Text>
                  <Text className={styles.noticeContent}>
                    {renderContent(notice.content, isExpanded)}
                  </Text>
                  {notice.images.length > 0 && (isExpanded || !needsExpand) && (
                    <View className={styles.noticeImages}>
                      {notice.images.map((img, index) => (
                        <Image
                          key={index}
                          className={styles.noticeImage}
                          src={img}
                          mode='aspectFill'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImagePreview(notice.images, img)
                          }}
                          onError={(e) => console.error('[Notice] Image error:', e)}
                        />
                      ))}
                    </View>
                  )}
                </View>
                {needsExpand && (
                  <View className={styles.noticeFooter}>
                    <Text className={styles.noticeExpand}>
                      {isExpanded ? '收起' : '展开全文'}
                      <Text>{isExpanded ? '↑' : '↓'}</Text>
                    </Text>
                  </View>
                )}
              </View>
            )
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📢</Text>
            <Text className={styles.emptyTitle}>暂无公告</Text>
            <Text className={styles.emptyDesc}>平台活动和重要通知将在这里展示~</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default NoticePage
