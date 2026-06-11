import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Button, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StarRating from '@/components/StarRating'
import { skills } from '@/data/skills'
import { Review } from '@/types'

interface ReviewWithSkill extends Review {
  skillTitle: string
  skillId: string
  reply?: string
}

const ReviewReplyPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithSkill[]>(() => {
    const result: ReviewWithSkill[] = []
    skills.slice(0, 3).forEach(skill => {
      skill.reviews.forEach(review => {
        result.push({
          ...review,
          skillTitle: skill.title,
          skillId: skill.id
        })
      })
    })
    return result
  })

  const [replyContent, setReplyContent] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  const handleReplyChange = (reviewId: string, value: string) => {
    setReplyContent(prev => ({
      ...prev,
      [reviewId]: value
    }))
  }

  const handleSubmitReply = (reviewId: string) => {
    const content = replyContent[reviewId]
    if (!content?.trim()) {
      Taro.showToast({ title: '请输入回复内容', icon: 'none' })
      return
    }

    console.log('[ReviewReply] Submitting reply for:', reviewId)
    setSubmittingId(reviewId)

    setTimeout(() => {
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, reply: content.trim() } : r
      ))
      setReplyContent(prev => {
        const newState = { ...prev }
        delete newState[reviewId]
        return newState
      })
      setSubmittingId(null)
      Taro.showToast({ title: '回复成功', icon: 'success' })
    }, 800)
  }

  const handleReviewClick = (review: ReviewWithSkill) => {
    console.log('[ReviewReply] Review clicked:', review.id)
    Taro.navigateTo({
      url: `/pages/skill-detail/index?id=${review.skillId}`
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.reviewList}>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <View key={review.id} className={styles.reviewCard}>
              <View className={styles.reviewHeader}>
                <Image
                  className={styles.userAvatar}
                  src={review.userAvatar}
                  mode='aspectFill'
                  onError={(e) => console.error('[ReviewReply] Avatar error:', e)}
                />
                <View className={styles.userInfo}>
                  <Text className={styles.userName}>{review.userName}</Text>
                  <View className={styles.reviewMeta}>
                    <StarRating rating={review.rating} />
                    <Text>· {review.createdAt}</Text>
                  </View>
                </View>
                <Text className={styles.skillTag} onClick={() => handleReviewClick(review)}>
                  {review.skillTitle}
                </Text>
              </View>
              <Text className={styles.reviewContent}>{review.content}</Text>
              {review.images.length > 0 && (
                <View className={styles.reviewImages}>
                  {review.images.map((img, index) => (
                    <Image
                      key={index}
                      className={styles.reviewImage}
                      src={img}
                      mode='aspectFill'
                      onError={(e) => console.error('[ReviewReply] Image error:', e)}
                    />
                  ))}
                </View>
              )}
              {review.reply ? (
                <View className={styles.replySection}>
                  <View className={styles.replyHeader}>
                    <Text className={styles.replyLabel}>我的回复</Text>
                    <Text className={styles.replyStatus}>已回复</Text>
                  </View>
                  <Text className={styles.replyContent}>{review.reply}</Text>
                </View>
              ) : (
                <View className={styles.replyInputSection}>
                  <Textarea
                    className={styles.replyTextarea}
                    placeholder='回复用户的评价...'
                    value={replyContent[review.id] || ''}
                    onInput={(e) => handleReplyChange(review.id, e.detail.value)}
                    maxlength={200}
                    autoHeight
                  />
                  <View className={styles.replyActions}>
                    <Button
                      className={classnames(
                        styles.replyBtn,
                        (!replyContent[review.id]?.trim() || submittingId === review.id) && styles.disabled
                      )}
                      disabled={!replyContent[review.id]?.trim() || submittingId === review.id}
                      onClick={() => handleSubmitReply(review.id)}
                    >
                      {submittingId === review.id ? '提交中...' : '回复评价'}
                    </Button>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyTitle}>暂无评价</Text>
            <Text className={styles.emptyDesc}>完成服务后会收到用户的评价~</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ReviewReplyPage
