import React, { useEffect, useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem, ScrollView, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import StarRating from '@/components/StarRating'
import { useAppStore } from '@/store'
import { Skill, Review } from '@/types'

const SkillDetailPage: React.FC = () => {
  const router = useRouter()
  const storeSkills = useAppStore(state => state.skills)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const data = storeSkills.find(s => s.id === id)
      if (data) {
        setSkill(data)
        setIsFavorite(data.isFavorite)
      } else {
        Taro.showToast({ title: '技能不存在', icon: 'none' })
      }
    }
  }, [router.params.id, storeSkills])

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    })
  }

  const handleBooking = () => {
    if (!skill) return
    Taro.navigateTo({
      url: `/pages/booking/index?skillId=${skill.id}`
    })
  }

  const handleContact = () => {
    Taro.showToast({ title: '沟通功能开发中', icon: 'none' })
  }

  if (!skill) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <Swiper
          className={styles.bannerSwiper}
          autoplay
          circular
          indicatorDots
          indicatorColor='rgba(255,255,255,0.5)'
          indicatorActiveColor='#fff'
        >
          {skill.images.map((img, index) => (
            <SwiperItem key={index}>
              <Image
                className={styles.bannerImage}
                src={img}
                mode='aspectFill'
              />
            </SwiperItem>
          ))}
        </Swiper>

        <View className={styles.infoCard}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{skill.title}</Text>
            <Text className={styles.favoriteBtn} onClick={handleFavorite}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </View>
          <View className={styles.tagRow}>
            <Text className={styles.categoryTag}>{skill.categoryName}</Text>
            {skill.isVerified && <Text className={styles.verifiedTag}>✓ 服务者已认证</Text>}
          </View>
          <View className={styles.priceRow}>
            <Text className={styles.priceSymbol}>¥</Text>
            <Text className={styles.priceValue}>{skill.priceMin}</Text>
            {skill.priceMax > skill.priceMin && (
              <Text className={styles.priceSymbol}>-{skill.priceMax}</Text>
            )}
            <Text className={styles.priceUnit}>/{skill.priceUnit}</Text>
          </View>

          <View className={styles.providerCard}>
            <Image
              className={styles.providerAvatar}
              src={skill.provider.avatar}
              mode='aspectFill'
            />
            <View className={styles.providerInfo}>
              <Text className={styles.providerName}>
                {skill.provider.name}
                {skill.provider.isVerified && <Text style={{ color: '#36B37E', fontSize: '22rpx' }}> ✓</Text>}
              </Text>
              <View className={styles.providerMeta}>
                <StarRating rating={skill.provider.rating} />
                <Text>完成 {skill.provider.completedOrders} 单</Text>
                <Text>{skill.provider.neighborhood}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📋 服务描述</Text>
          <Text className={styles.sectionContent}>{skill.description}</Text>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>⏰ 可约时间</Text>
          <View className={styles.timeList}>
            {skill.availableTime.map((time, index) => (
              <Text key={index} className={styles.timeItem}>• {time}</Text>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📍 服务区域</Text>
          <View className={styles.areaTags}>
            {skill.serviceArea.map((area, index) => (
              <Text key={index} className={styles.areaTag}>{area}</Text>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>🖼️ 作品展示</Text>
          <View className={styles.galleryGrid}>
            {skill.images.map((img, index) => (
              <Image
                key={index}
                className={styles.galleryImage}
                src={img}
                mode='aspectFill'
              />
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            ⭐ 评价 ({skill.reviewCount})
            <Text style={{ fontSize: '26rpx', color: '#FF7A45', fontWeight: 'normal' }}>
              {skill.rating}分
            </Text>
          </Text>
          <View className={styles.reviewList}>
            {skill.reviews.map((review: Review) => (
              <View key={review.id} className={styles.reviewItem}>
                <View className={styles.reviewHeader}>
                  <Image
                    className={styles.reviewAvatar}
                    src={review.userAvatar}
                    mode='aspectFill'
                  />
                  <View className={styles.reviewInfo}>
                    <Text className={styles.reviewName}>{review.userName}</Text>
                    <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
                      <StarRating rating={review.rating} />
                      <Text className={styles.reviewDate}>{review.createdAt}</Text>
                    </View>
                  </View>
                </View>
                <Text className={styles.reviewContent}>{review.content}</Text>
                {review.reply && (
                  <View className={styles.reviewReply}>
                    <Text className={styles.reviewReplyText}>
                      <Text style={{ color: '#FF7A45', fontWeight: 500 }}>服务者回复：</Text>
                      {review.reply}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleContact}>
          <Text>发起沟通</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleBooking}>
          <Text>立即预约</Text>
        </View>
      </View>
    </View>
  )
}

export default SkillDetailPage
