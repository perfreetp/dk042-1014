import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { View, Text, Image, ScrollView, Button, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { useRouter, chooseImage } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { Skill, Order, Coupon } from '@/types'

const timeSlots = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '19:00-20:00',
  '20:00-21:00'
]

const statusMap: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  inProgress: '进行中',
  toReview: '待评价',
  completed: '已完成',
  cancelled: '已取消'
}

const BookingPage: React.FC = () => {
  const router = useRouter()
  const storeSkills = useAppStore(state => state.skills)
  const storeCoupons = useAppStore(state => state.coupons)
  const addOrder = useAppStore(state => state.addOrder)
  const useCoupon = useAppStore(state => state.useCoupon)
  const calculateFinalPrice = useAppStore(state => state.calculateFinalPrice)
  const addMessage = useAppStore(state => state.addMessage)
  const getOrCreateChatSession = useAppStore(state => state.getOrCreateChatSession)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [serviceArea, setServiceArea] = useState('')
  const [requirement, setRequirement] = useState('')
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [selectedCouponId, setSelectedCouponId] = useState<string>('')
  const [showCouponPicker, setShowCouponPicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const chatId = router.params.chatId as string

  useEffect(() => {
    const skillId = router.params.skillId
    if (skillId) {
      const data = storeSkills.find(s => s.id === skillId)
      if (data) {
        setSkill(data)
        if (data.serviceArea.length > 0) {
          setServiceArea(data.serviceArea[0])
        }
      }
    }
  }, [router.params.skillId, storeSkills])

  const availableCoupons = useMemo(() => {
    if (!skill) return []
    return storeCoupons.filter(c => c.status === 'available' && skill.priceMin >= c.minAmount)
  }, [skill, storeCoupons])

  const selectedCoupon = useMemo(() => {
    return storeCoupons.find(c => c.id === selectedCouponId)
  }, [storeCoupons, selectedCouponId])

  const priceResult = useMemo(() => {
    if (!skill) return { originalPrice: 0, finalPrice: 0, discount: 0 }
    const result = calculateFinalPrice(skill.priceMin, selectedCouponId)
    return {
      originalPrice: skill.priceMin,
      finalPrice: result.finalPrice,
      discount: result.discount
    }
  }, [skill, selectedCouponId, calculateFinalPrice])

  const canSubmit = skill && selectedDate && selectedTime && serviceArea.trim()

  const handleDateChange = (e) => {
    setSelectedDate(e.detail.value)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleChooseImage = useCallback(async () => {
    try {
      const res = await chooseImage({
        count: 6 - referenceImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      setReferenceImages(prev => [...prev, ...res.tempFilePaths])
    } catch (e) {
      console.error('[Booking] Choose image error:', e)
    }
  }, [referenceImages.length])

  const handleDeleteImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleCouponSelect = (coupon: Coupon) => {
    if (selectedCouponId === coupon.id) {
      setSelectedCouponId('')
    } else {
      setSelectedCouponId(coupon.id)
    }
    setShowCouponPicker(false)
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    setIsSubmitting(true)
    Taro.showLoading({ title: '提交中...' })

    setTimeout(() => {
      const now = new Date()
      const pad = (n: number) => n.toString().padStart(2, '0')
      const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

      const { finalPrice: calcFinalPrice, discount } = calculateFinalPrice(skill!.priceMin, selectedCouponId)

      const newOrder: Order = {
        id: `o${Date.now()}`,
        skillId: skill!.id,
        skillTitle: skill!.title,
        skillImage: skill!.images[0] || '',
        providerId: skill!.provider.id,
        providerName: skill!.provider.name,
        providerAvatar: skill!.provider.avatar,
        customerId: 'me',
        customerName: '我',
        customerAvatar: 'https://picsum.photos/id/64/200/200',
        status: 'pending',
        price: calcFinalPrice,
        originalPrice: skill!.priceMin,
        couponId: selectedCouponId || undefined,
        couponName: selectedCoupon?.name,
        couponDiscount: discount,
        bookingTime: `${selectedDate} ${selectedTime}`,
        serviceArea,
        requirement: requirement || '暂无特殊需求',
        referenceImages,
        createdAt,
        updatedAt: createdAt
      }

      addOrder(newOrder)

      if (selectedCouponId) {
        useCoupon(selectedCouponId)
      }

      let targetChatId = chatId
      if (!targetChatId) {
        const session = getOrCreateChatSession(
          skill!.id,
          {
            id: skill!.provider.id,
            name: skill!.provider.name,
            avatar: skill!.provider.avatar,
            isVerified: skill!.provider.isVerified
          },
          {
            id: skill!.id,
            title: skill!.title,
            image: skill!.images[0]
          }
        )
        targetChatId = session.id
      }

      addMessage(targetChatId!, {
        senderId: 'me',
        senderName: '我',
        senderAvatar: 'https://picsum.photos/id/64/200/200',
        type: 'order',
        content: '我已下单，请查看',
        orderInfo: {
          orderId: newOrder.id,
          skillTitle: skill!.title,
          skillImage: skill!.images[0],
          price: calcFinalPrice,
          status: statusMap[newOrder.status],
          bookingTime: `${selectedDate} ${selectedTime}`
        }
      })

      setIsSubmitting(false)
      Taro.hideLoading()
      Taro.showToast({ title: '预约成功！', icon: 'success' })

      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/order-detail/index?id=${newOrder.id}`
        })
      }, 1500)
    }, 1000)
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
        <View className={styles.skillCard}>
          <Image
            className={styles.skillImage}
            src={skill.images[0]}
            mode='aspectFill'
          />
          <View className={styles.skillInfo}>
            <Text className={styles.skillTitle}>{skill.title}</Text>
            <Text className={styles.skillProvider}>
              👤 {skill.provider.name}
              {skill.provider.isVerified && <Text style={{ color: '#36B37E' }}> ✓</Text>}
            </Text>
            <Text className={styles.skillPrice}>
              ¥{skill.priceMin}-{skill.priceMax}/{skill.priceUnit}
            </Text>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={classnames(styles.formLabel, styles.required)}>选择日期</Text>
          <Picker
            mode='date'
            onChange={handleDateChange}
            value={selectedDate}
            start={new Date().toISOString().split('T')[0]}
          >
            <View className={styles.datePicker}>
              {selectedDate ? (
                <Text>{selectedDate}</Text>
              ) : (
                <Text className={styles.placeholder}>请选择预约日期</Text>
              )}
            </View>
          </Picker>
        </View>

        <View className={styles.formCard}>
          <Text className={classnames(styles.formLabel, styles.required)}>选择时段</Text>
          <View className={styles.timeSlots}>
            {timeSlots.map(time => (
              <View
                key={time}
                className={classnames(
                  styles.timeSlot,
                  selectedTime === time && styles.active
                )}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={classnames(styles.formLabel, styles.required)}>服务地点</Text>
          <Input
            className={styles.inputField}
            placeholder='请输入详细地址，如：阳光小区3号楼2单元'
            value={serviceArea}
            onInput={(e) => setServiceArea(e.detail.value)}
          />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>需求描述</Text>
          <Textarea
            className={styles.textareaField}
            placeholder='请详细描述您的需求，方便服务者提前做好准备'
            value={requirement}
            onInput={(e) => setRequirement(e.detail.value)}
            maxlength={500}
            autoHeight
          />
          <Text className={styles.charCount}>
            {requirement.length}/500
          </Text>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>上传参考图片（可选）</Text>
          <View className={styles.uploadGrid}>
            {referenceImages.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image
                  className={styles.uploadImage}
                  src={img}
                  mode='aspectFill'
                />
                <View className={styles.deleteBtn} onClick={() => handleDeleteImage(index)}>×</View>
              </View>
            ))}
            {referenceImages.length < 6 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>+</Text>
                <Text className={styles.uploadText}>添加图片</Text>
              </View>
            )}
          </View>
          <Text className={styles.uploadHint}>
            最多可上传6张参考图片，帮助服务者更好地理解您的需求
          </Text>
        </View>

        <View className={styles.formCard} onClick={() => setShowCouponPicker(!showCouponPicker)}>
          <View className={styles.couponRow}>
            <Text className={styles.formLabel}>优惠券</Text>
            <View className={styles.couponSelect}>
              {selectedCoupon ? (
                <Text className={styles.selectedCoupon}>
                  {selectedCoupon.type === 'cash' ? `减¥${selectedCoupon.value}` : `${selectedCoupon.value}折`}
                  <Text style={{ color: '#86909C' }}> ›</Text>
                </Text>
              ) : availableCoupons.length > 0 ? (
                <Text className={styles.couponHint}>
                  {availableCoupons.length}张可用 <Text style={{ color: '#86909C' }}>›</Text>
                </Text>
              ) : (
                <Text className={styles.placeholder}>暂无可用优惠券</Text>
              )}
            </View>
          </View>
        </View>

        {showCouponPicker && availableCoupons.length > 0 && (
          <View className={styles.couponPicker}>
            {availableCoupons.map(coupon => (
              <View
                key={coupon.id}
                className={classnames(
                  styles.couponOption,
                  selectedCouponId === coupon.id && styles.selected
                )}
                onClick={() => handleCouponSelect(coupon)}
              >
                <View className={classnames(
                  styles.couponOptionLeft,
                  coupon.type === 'discount' && styles.couponDiscount
                )}>
                  {coupon.type === 'cash' ? (
                    <Text className={styles.couponValue}>¥{coupon.value}</Text>
                  ) : (
                    <Text className={styles.couponValue}>{coupon.value}折</Text>
                  )}
                  <Text className={styles.couponCondition}>满{coupon.minAmount}可用</Text>
                </View>
                <View className={styles.couponOptionRight}>
                  <Text className={styles.couponName}>{coupon.name}</Text>
                  <Text className={styles.couponDesc}>{coupon.description}</Text>
                </View>
                {selectedCouponId === coupon.id && (
                  <Text className={styles.couponCheck}>✓</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <View className={styles.submitBar}>
        <View className={styles.totalPrice}>
          <Text className={styles.label}>预估价格</Text>
          <View className={styles.priceDisplay}>
            {selectedCouponId ? (
              <>
                <Text className={styles.originalPrice}>¥{priceResult.originalPrice}</Text>
                <Text className={styles.finalPrice}>¥{priceResult.finalPrice.toFixed(2)}</Text>
                <Text className={styles.discountTag}>已减¥{priceResult.discount.toFixed(2)}</Text>
              </>
            ) : (
              <Text className={styles.finalPrice}>¥{skill.priceMin}</Text>
            )}
          </View>
        </View>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={() => {
            if (canSubmit && !isSubmitting) handleSubmit()
          }}
        >
          <Text>{isSubmitting ? '提交中...' : '确认预约'}</Text>
        </View>
      </View>
    </View>
  )
}

export default BookingPage
