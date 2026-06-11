import React, { useState, useCallback } from 'react'
import { View, Text, Input, Textarea, ScrollView, Button, Image, Picker } from '@tarojs/components'
import Taro, { chooseImage } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { categories } from '@/data/categories'
import { Category, Skill } from '@/types'
import { currentUser } from '@/data/user'

const unitOptions = ['次', '小时', '天', '件', '个']

const defaultTimeSlots = [
  '周一至周五 9:00-18:00',
  '周末 9:00-18:00',
  '工作日 18:00-22:00',
  '节假日全天',
  '提前预约'
]

const PublishPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [priceUnit, setPriceUnit] = useState('次')
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [customTimeSlot, setCustomTimeSlot] = useState('')
  const [serviceArea, setServiceArea] = useState('')
  const [uploadImages, setUploadImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addSkill = useAppStore(state => state.addSkill)

  const canSubmit = selectedCategory && title.trim() && description.trim() && priceMin

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(selectedCategory === category.id ? null : category.id)
  }

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    )
  }

  const handleAddCustomTimeSlot = () => {
    if (customTimeSlot.trim() && !selectedTimeSlots.includes(customTimeSlot.trim())) {
      setSelectedTimeSlots(prev => [...prev, customTimeSlot.trim()])
      setCustomTimeSlot('')
    }
  }

  const handleChooseImage = useCallback(async () => {
    try {
      const res = await chooseImage({
        count: 8 - uploadImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      setUploadImages(prev => [...prev, ...res.tempFilePaths])
    } catch (e) {
      Taro.showToast({ title: '取消选择', icon: 'none' })
    }
  }, [uploadImages.length])

  const handleDeleteImage = (index: number) => {
    setUploadImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    const category = categories.find(c => c.id === selectedCategory)
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

    const newSkill: Skill = {
      id: `s${Date.now()}`,
      title: title.trim(),
      categoryId: selectedCategory!,
      categoryName: category?.name || '',
      description: description.trim(),
      priceMin: parseFloat(priceMin) || 0,
      priceMax: parseFloat(priceMax) || parseFloat(priceMin) || 0,
      priceUnit,
      provider: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        rating: 5.0,
        completedOrders: 0,
        neighborhood: currentUser.neighborhood
      },
      availableTime: selectedTimeSlots.length > 0 ? selectedTimeSlots : ['提前预约'],
      serviceArea: serviceArea ? serviceArea.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [currentUser.neighborhood],
      images: uploadImages.length > 0 ? uploadImages : ['https://picsum.photos/id/64/750/500'],
      reviews: [],
      rating: 0,
      reviewCount: 0,
      isFavorite: false,
      isVerified: currentUser.isVerified,
      createdAt
    }

    setIsSubmitting(true)
    Taro.showLoading({ title: '发布中...' })

    setTimeout(() => {
      addSkill(newSkill)

      setIsSubmitting(false)
      Taro.hideLoading()
      Taro.showToast({ title: '发布成功！', icon: 'success' })

      setTimeout(() => {
        setSelectedCategory(null)
        setTitle('')
        setDescription('')
        setPriceMin('')
        setPriceMax('')
        setPriceUnit('次')
        setSelectedTimeSlots([])
        setServiceArea('')
        setUploadImages([])
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 1000)
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.formCard}>
        <Text className={classnames(styles.formLabel, styles.required)}>选择分类</Text>
        <ScrollView scrollX className={styles.categoryScroll}>
          {categories.filter(c => c.id !== '8').map(category => (
            <View
              key={category.id}
              className={classnames(styles.categoryItem, selectedCategory === category.id && styles.categoryActive)}
              onClick={() => handleCategorySelect(category)}
            >
              <View
                className={styles.categoryCircle}
                style={{ color: category.color }}
              >
                {category.icon}
              </View>
              <Text className={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.formCard}>
        <Text className={classnames(styles.formLabel, styles.required)}>技能标题</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入技能名称，如：专业家电维修'
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
          maxlength={30}
        />
      </View>

      <View className={styles.formCard}>
        <Text className={classnames(styles.formLabel, styles.required)}>技能描述</Text>
        <Textarea
          className={styles.textareaField}
          placeholder='请详细描述您能提供的服务内容、经验、擅长领域等'
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
          maxlength={500}
          autoHeight
        />
        <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: '8rpx', textAlign: 'right' }}>
          {description.length}/500
        </Text>
      </View>

      <View className={styles.formCard}>
        <Text className={classnames(styles.formLabel, styles.required)}>价格范围</Text>
        <View className={styles.priceRow}>
          <View className={styles.priceInput}>
            <Text>¥</Text>
            <Input
              type='digit'
              placeholder='最低'
              value={priceMin}
              onInput={(e) => setPriceMin(e.detail.value)}
            />
          </View>
          <Text className={styles.priceSeparator}>-</Text>
          <View className={styles.priceInput}>
            <Text>¥</Text>
            <Input
              type='digit'
              placeholder='最高'
              value={priceMax}
              onInput={(e) => setPriceMax(e.detail.value)}
            />
          </View>
          <Picker
            mode='selector'
            range={unitOptions}
            onChange={(e) => setPriceUnit(unitOptions[e.detail.value])}
          >
            <View className={styles.unitSelect}>
              {priceUnit}
            </View>
          </Picker>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>可约时间</Text>
        <View className={styles.tagsContainer}>
          {defaultTimeSlots.map(slot => (
            <View
              key={slot}
              className={classnames(styles.tagItem, selectedTimeSlots.includes(slot) && styles.active)}
              onClick={() => handleTimeSlotToggle(slot)}
            >
              {slot}
            </View>
          ))}
          {selectedTimeSlots.filter(s => !defaultTimeSlots.includes(s)).map(slot => (
            <View
              key={slot}
              className={classnames(styles.tagItem, styles.active)}
              onClick={() => handleTimeSlotToggle(slot)}
            >
              {slot}
            </View>
          ))}
          <Input
            className={styles.customTagInput}
            placeholder='+ 自定义时间'
            value={customTimeSlot}
            onInput={(e) => setCustomTimeSlot(e.detail.value)}
            onConfirm={handleAddCustomTimeSlot}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>服务区域</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入可服务的小区或区域，多个用逗号分隔'
          value={serviceArea}
          onInput={(e) => setServiceArea(e.detail.value)}
        />
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>作品照片</Text>
        <View className={styles.uploadGrid}>
          {uploadImages.map((img, index) => (
            <View key={index} className={styles.uploadItem}>
              <Image
                className={styles.uploadImage}
                src={img}
                mode='aspectFill'
              />
              <View className={styles.deleteBtn} onClick={() => handleDeleteImage(index)}>×</View>
            </View>
          ))}
          {uploadImages.length < 8 && (
            <View className={styles.uploadBtn} onClick={handleChooseImage}>
              <Text className={styles.uploadIcon}>+</Text>
              <Text className={styles.uploadText}>添加图片</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: '16rpx' }}>
          最多可上传8张作品照片，能更好地展示您的技能
        </Text>
      </View>

      <View className={styles.submitBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '发布中...' : '立即发布'}
        </Button>
      </View>
    </ScrollView>
  )
}

export default PublishPage
