import React, { useEffect, useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem, ScrollView, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import StarRating from '@/components/StarRating'
import { getSkillById } from '@/data/skills'
import { Skill, Review } from '@/types'
import classnames from 'classnames'

const detailStyles = {
  page: {
    minHeight: '100vh',
    background: '#FFF7F2',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 140rpx)'
  },
  bannerSwiper: {
    height: '400rpx'
  },
  bannerImage: {
    width: '100%',
    height: '100%'
  },
  infoCard: {
    background: '#fff',
    borderRadius: '16rpx',
    padding: '32rpx',
    margin: '-32rpx 32rpx 0',
    position: 'relative',
    zIndex: 10,
    boxShadow: '0 4rpx 16rpx rgba(255, 122, 69, 0.08)'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16rpx'
  },
  title: {
    fontSize: '36rpx',
    fontWeight: 600,
    color: '#1D2129',
    flex: 1,
    marginRight: '16rpx'
  },
  favoriteBtn: {
    fontSize: '40rpx',
    color: '#FF7A45'
  },
  tagRow: {
    display: 'flex',
    gap: '12rpx',
    marginBottom: '16rpx',
    flexWrap: 'wrap'
  },
  categoryTag: {
    padding: '4rpx 12rpx',
    borderRadius: '4rpx',
    background: '#FFF0E8',
    color: '#FF7A45',
    fontSize: '22rpx'
  },
  verifiedTag: {
    padding: '4rpx 12rpx',
    borderRadius: '4rpx',
    background: 'rgba(54, 179, 126, 0.1)',
    color: '#36B37E',
    fontSize: '22rpx'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8rpx',
    marginBottom: '24rpx'
  },
  priceSymbol: {
    fontSize: '28rpx',
    color: '#FF5722',
    fontWeight: 500
  },
  priceValue: {
    fontSize: '40rpx',
    color: '#FF5722',
    fontWeight: 'bold'
  },
  priceUnit: {
    fontSize: '24rpx',
    color: '#86909C'
  },
  providerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16rpx',
    padding: '24rpx 0',
    borderTop: '1rpx solid #F7F0EB',
    borderBottom: '1rpx solid #F7F0EB'
  },
  providerAvatar: {
    width: '88rpx',
    height: '88rpx',
    borderRadius: '999rpx'
  },
  providerInfo: {
    flex: 1
  },
  providerName: {
    fontSize: '30rpx',
    fontWeight: 600,
    color: '#1D2129',
    marginBottom: '8rpx',
    display: 'flex',
    alignItems: 'center',
    gap: '8rpx'
  },
  providerMeta: {
    display: 'flex',
    gap: '16rpx',
    fontSize: '24rpx',
    color: '#86909C'
  },
  sectionCard: {
    background: '#fff',
    borderRadius: '16rpx',
    padding: '32rpx',
    margin: '24rpx 32rpx 0',
    boxShadow: '0 2rpx 12rpx rgba(255, 122, 69, 0.06)'
  },
  sectionTitle: {
    fontSize: '32rpx',
    fontWeight: 600,
    color: '#1D2129',
    marginBottom: '20rpx',
    display: 'flex',
    alignItems: 'center',
    gap: '8rpx'
  },
  sectionContent: {
    fontSize: '28rpx',
    color: '#4E5969',
    lineHeight: 1.6
  },
  timeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12rpx'
  },
  timeItem: {
    fontSize: '26rpx',
    color: '#4E5969',
    paddingLeft: '20rpx',
    position: 'relative'
  },
  areaTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12rpx'
  },
  areaTag: {
    padding: '8rpx 20rpx',
    borderRadius: '32rpx',
    background: '#FFF7F2',
    color: '#FF7A45',
    fontSize: '24rpx'
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12rpx'
  },
  galleryImage: {
    aspectRatio: '1',
    borderRadius: '12rpx'
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24rpx'
  },
  reviewItem: {
    paddingBottom: '24rpx',
    borderBottom: '1rpx solid #F7F0EB'
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12rpx',
    marginBottom: '12rpx'
  },
  reviewAvatar: {
    width: '64rpx',
    height: '64rpx',
    borderRadius: '999rpx'
  },
  reviewInfo: {
    flex: 1
  },
  reviewName: {
    fontSize: '26rpx',
    color: '#1D2129',
    fontWeight: 500,
    marginBottom: '4rpx'
  },
  reviewDate: {
    fontSize: '22rpx',
    color: '#86909C'
  },
  reviewContent: {
    fontSize: '26rpx',
    color: '#4E5969',
    lineHeight: 1.6,
    marginBottom: '12rpx'
  },
  reviewReply: {
    background: '#FFF7F2',
    borderRadius: '12rpx',
    padding: '16rpx',
    marginTop: '12rpx'
  },
  reviewReplyText: {
    fontSize: '24rpx',
    color: '#4E5969',
    lineHeight: 1.5
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '24rpx 32rpx',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 24rpx)',
    boxShadow: '0 -4rpx 16rpx rgba(0, 0, 0, 0.06)',
    display: 'flex',
    gap: '16rpx'
  },
  btnSecondary: {
    flex: 1,
    height: '88rpx',
    borderRadius: '48rpx',
    background: '#FFF0E8',
    color: '#FF7A45',
    fontSize: '30rpx',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPrimary: {
    flex: 2,
    height: '88rpx',
    borderRadius: '48rpx',
    background: 'linear-gradient(135deg, #FF7A45 0%, #FFA47A 100%)',
    color: '#fff',
    fontSize: '30rpx',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const SkillDetailPage: React.FC = () => {
  const router = useRouter()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const id = router.params.id
    console.log('[SkillDetail] Skill ID:', id)
    if (id) {
      const data = getSkillById(id as string)
      if (data) {
        setSkill(data)
        setIsFavorite(data.isFavorite)
        console.log('[SkillDetail] Skill loaded:', data.title)
      } else {
        Taro.showToast({ title: '技能不存在', icon: 'none' })
      }
    }
  }, [router.params.id])

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
      <View style={detailStyles.page}>
        <View style={detailStyles.sectionCard}>
          <Text style={{ textAlign: 'center', color: '#86909C', display: 'block' }}>
            加载中...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY style={detailStyles.page}>
      <Swiper
        style={detailStyles.bannerSwiper}
        autoplay
        circular
        indicatorDots
        indicatorColor='rgba(255,255,255,0.5)'
        indicatorActiveColor='#fff'
      >
        {skill.images.map((img, index) => (
          <SwiperItem key={index}>
            <Image
              style={detailStyles.bannerImage}
              src={img}
              mode='aspectFill'
              onError={(e) => console.error('[SkillDetail] Banner error:', e)}
            />
          </SwiperItem>
        ))}
      </Swiper>

      <View style={detailStyles.infoCard}>
        <View style={detailStyles.titleRow}>
          <Text style={detailStyles.title}>{skill.title}</Text>
          <Text style={detailStyles.favoriteBtn} onClick={handleFavorite}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </View>
        <View style={detailStyles.tagRow}>
          <Text style={detailStyles.categoryTag}>{skill.categoryName}</Text>
          {skill.isVerified && <Text style={detailStyles.verifiedTag}>✓ 服务者已认证</Text>}
        </View>
        <View style={detailStyles.priceRow}>
          <Text style={detailStyles.priceSymbol}>¥</Text>
          <Text style={detailStyles.priceValue}>{skill.priceMin}</Text>
          {skill.priceMax > skill.priceMin && (
            <Text style={detailStyles.priceSymbol}>-{skill.priceMax}</Text>
          )}
          <Text style={detailStyles.priceUnit}>/{skill.priceUnit}</Text>
        </View>

        <View style={detailStyles.providerCard}>
          <Image
            style={detailStyles.providerAvatar}
            src={skill.provider.avatar}
            mode='aspectFill'
          />
          <View style={detailStyles.providerInfo}>
            <Text style={detailStyles.providerName}>
              {skill.provider.name}
              {skill.provider.isVerified && <Text style={{ color: '#36B37E', fontSize: '22rpx' }}>✓</Text>}
            </Text>
            <View style={detailStyles.providerMeta}>
              <StarRating rating={skill.provider.rating} />
              <Text>完成 {skill.provider.completedOrders} 单</Text>
              <Text>{skill.provider.neighborhood}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={detailStyles.sectionCard}>
        <Text style={detailStyles.sectionTitle}>📋 服务描述</Text>
        <Text style={detailStyles.sectionContent}>{skill.description}</Text>
      </View>

      <View style={detailStyles.sectionCard}>
        <Text style={detailStyles.sectionTitle}>⏰ 可约时间</Text>
        <View style={detailStyles.timeList}>
          {skill.availableTime.map((time, index) => (
            <Text key={index} style={detailStyles.timeItem}>• {time}</Text>
          ))}
        </View>
      </View>

      <View style={detailStyles.sectionCard}>
        <Text style={detailStyles.sectionTitle}>📍 服务区域</Text>
        <View style={detailStyles.areaTags}>
          {skill.serviceArea.map((area, index) => (
            <Text key={index} style={detailStyles.areaTag}>{area}</Text>
          ))}
        </View>
      </View>

      <View style={detailStyles.sectionCard}>
        <Text style={detailStyles.sectionTitle}>🖼️ 作品展示</Text>
        <View style={detailStyles.galleryGrid}>
          {skill.images.map((img, index) => (
            <Image
              key={index}
              style={detailStyles.galleryImage}
              src={img}
              mode='aspectFill'
              onError={(e) => console.error('[SkillDetail] Gallery error:', e)}
            />
          ))}
        </View>
      </View>

      <View style={detailStyles.sectionCard}>
        <Text style={detailStyles.sectionTitle}>
          ⭐ 评价 ({skill.reviewCount})
          <Text style={{ fontSize: '26rpx', color: '#FF7A45', fontWeight: 'normal' }}>
            {skill.rating}分
          </Text>
        </Text>
        <View style={detailStyles.reviewList}>
          {skill.reviews.map((review: Review) => (
            <View key={review.id} style={detailStyles.reviewItem}>
              <View style={detailStyles.reviewHeader}>
                <Image
                  style={detailStyles.reviewAvatar}
                  src={review.userAvatar}
                  mode='aspectFill'
                />
                <View style={detailStyles.reviewInfo}>
                  <Text style={detailStyles.reviewName}>{review.userName}</Text>
                  <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
                    <StarRating rating={review.rating} />
                    <Text style={detailStyles.reviewDate}>{review.createdAt}</Text>
                  </View>
                </View>
              </View>
              <Text style={detailStyles.reviewContent}>{review.content}</Text>
              {review.reply && (
                <View style={detailStyles.reviewReply}>
                  <Text style={detailStyles.reviewReplyText}>
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

    <View style={detailStyles.bottomBar}>
      <Button
        style={detailStyles.btnSecondary}
        onClick={handleContact}
      >
        发起沟通
      </Button>
      <Button
        style={detailStyles.btnPrimary}
        onClick={handleBooking}
      >
        立即预约
      </Button>
    </View>
  )
}

export default SkillDetailPage
