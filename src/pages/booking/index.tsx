import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, ScrollView, Button, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { useRouter, chooseImage } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { getSkillById } from '@/data/skills'
import { Skill } from '@/types'

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

const BookingPage: React.FC = () => {
  const router = useRouter()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [serviceArea, setServiceArea] = useState('')
  const [requirement, setRequirement] = useState('')
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const skillId = router.params.skillId
    console.log('[Booking] Skill ID:', skillId)
    if (skillId) {
      const data = getSkillById(skillId as string)
      if (data) {
        setSkill(data)
        if (data.serviceArea.length > 0) {
          setServiceArea(data.serviceArea[0])
        }
      }
    }
  }, [router.params.skillId])

  const canSubmit = skill && selectedDate && selectedTime && serviceArea.trim()

  const handleDateChange = (e) => {
    console.log('[Booking] Date selected:', e.detail.value)
    setSelectedDate(e.detail.value)
  }

  const handleTimeSelect = (time: string) => {
    console.log('[Booking] Time selected:', time)
    setSelectedTime(time)
  }

  const handleChooseImage = useCallback(async () => {
    console.log('[Booking] Choosing reference image')
    try {
      const res = await chooseImage({
        count: 6 - referenceImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      console.log('[Booking] Images selected:', res.tempFilePaths.length)
      setReferenceImages(prev => [...prev, ...res.tempFilePaths])
    } catch (e) {
      console.error('[Booking] Choose image error:', e)
    }
  }, [referenceImages.length])

  const handleDeleteImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    console.log('[Booking] Submitting booking:', {
      skillId: skill?.id,
      date: selectedDate,
      time: selectedTime,
      area: serviceArea,
      requirement,
      images: referenceImages
    })

    setIsSubmitting(true)
    Taro.showLoading({ title: '提交中...' })

    setTimeout(() => {
      setIsSubmitting(false)
      Taro.hideLoading()
      Taro.showToast({ title: '预约成功！', icon: 'success' })

      setTimeout(() => {
        Taro.switchTab({ url: '/pages/orders/index' })
      }, 1500)
    }, 1500)
  }

  if (!skill) {
    return (
      <ScrollView scrollY className={styles.page}>
        <View style={{ textAlign: 'center', padding: '80rpx 0' }}>
          <Text style={{ fontSize: '80rpx' }}>⏳</Text>
          <Text style={{ display: 'block', marginTop: '16rpx', color: '#86909C' }}>加载中...</Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.skillCard}>
        <Image
          className={styles.skillImage}
          src={skill.images[0]}
          mode='aspectFill'
          onError={(e) => console.error('[Booking] Skill image error:', e)}
        />
        <View className={styles.skillInfo}>
          <Text className={styles.skillTitle}>{skill.title}</Text>
          <Text className={styles.skillProvider}>
            <Text>👤</Text> {skill.provider.name}
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
        <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: '8rpx', textAlign: 'right' }}>
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
                onError={(e) => console.error('[Booking] Reference image error:', e)}
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
        <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: '16rpx' }}>
          最多可上传6张参考图片，帮助服务者更好地理解您的需求
        </Text>
      </View>

      <View style={{ height: '40rpx' }} />
    </ScrollView>

    <View className={styles.submitBar}>
      <View className={styles.totalPrice}>
        <Text className={styles.label}>预估价格</Text>
        <View>
          <Text className={styles.value}>¥{skill.priceMin}</Text>
          {skill.priceMax > skill.priceMin && (
            <Text style={{ fontSize: '26rpx', color: '#86909C' }}>-{skill.priceMax}</Text>
          )}
        </View>
      </View>
      <Button
        className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
        disabled={!canSubmit || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? '提交中...' : '确认预约'}
      </Button>
    </View>
  )
}

export default BookingPage
