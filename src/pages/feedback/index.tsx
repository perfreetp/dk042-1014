import React, { useState, useCallback } from 'react'
import { View, Text, Input, Textarea, Image, ScrollView, Button } from '@tarojs/components'
import Taro, { chooseImage } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { feedbackRecords } from '@/data/user'
import { FeedbackRecord } from '@/types'

const feedbackTypes = [
  { key: 'service', label: '服务质量' },
  { key: 'price', label: '价格纠纷' },
  { key: 'time', label: '预约时间' },
  { key: 'attitude', label: '服务态度' },
  { key: 'safety', label: '安全问题' },
  { key: 'other', label: '其他问题' }
]

const FeedbackPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('')
  const [orderId, setOrderId] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const canSubmit = selectedType && description.trim().length >= 10

  const handleChooseImage = useCallback(async () => {
    if (images.length >= 6) {
      Taro.showToast({ title: '最多上传6张图片', icon: 'none' })
      return
    }

    console.log('[Feedback] Choosing images')
    try {
      const res = await chooseImage({
        count: 6 - images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      setImages(prev => [...prev, ...res.tempFilePaths])
    } catch (e) {
      console.error('[Feedback] Choose image error:', e)
    }
  }, [images.length])

  const handleDeleteImage = (index: number, e) => {
    e.stopPropagation()
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    console.log('[Feedback] Submitting:', {
      type: selectedType,
      orderId,
      description,
      contact,
      images
    })

    setIsSubmitting(true)
    Taro.showLoading({ title: '提交中...' })

    setTimeout(() => {
      setIsSubmitting(false)
      Taro.hideLoading()
      Taro.showModal({
        title: '提交成功',
        content: '我们会在1-2个工作日内处理您的反馈，请保持联系畅通',
        showCancel: false,
        success: () => {
          setSelectedType('')
          setOrderId('')
          setDescription('')
          setContact('')
          setImages([])
        }
      })
    }, 1200)
  }

  const handleRecordClick = (record: FeedbackRecord) => {
    console.log('[Feedback] Record clicked:', record.id)
    Taro.showToast({ title: `状态：${record.status}`, icon: 'none' })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理'
      case 'processing': return '处理中'
      case 'resolved': return '已解决'
      default: return status
    }
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.notice}>
        <Text className={styles.noticeTitle}>
          ⚠️ 温馨提示
        </Text>
        <Text className={styles.noticeContent}>
          提交反馈后，平台客服将在1-2个工作日内介入处理。请保持手机畅通，以便我们联系您核实情况。
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={classnames(styles.sectionTitle, styles.required)}>问题类型</Text>
        <View className={styles.typeGrid}>
          {feedbackTypes.map(type => (
            <View
              key={type.key}
              className={classnames(styles.typeItem, selectedType === type.key && styles.active)}
              onClick={() => setSelectedType(type.key)}
            >
              <Text>{type.label}</Text>
            </View>
          ))}
        </View>

        <Text className={styles.sectionTitle}>关联订单号（选填）</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入订单号，方便我们快速定位问题'
          value={orderId}
          onInput={(e) => setOrderId(e.detail.value)}
        />

        <Text className={classnames(styles.sectionTitle, styles.required)}>问题描述</Text>
        <Textarea
          className={styles.textareaField}
          placeholder='请详细描述您遇到的问题，以便我们更好地帮助您...'
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
          maxlength={500}
          autoHeight
        />
        <Text className={styles.charCount}>{description.length}/500</Text>

        <Text className={styles.sectionTitle}>上传凭证（选填）</Text>
        <View className={styles.uploadSection}>
          <View className={styles.uploadList}>
            {images.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image
                  className={styles.uploadImage}
                  src={img}
                  mode='aspectFill'
                  onError={(e) => console.error('[Feedback] Image error:', e)}
                />
                <View className={styles.deleteBtn} onClick={(e) => handleDeleteImage(index, e)}>
                  ×
                </View>
              </View>
            ))}
            {images.length < 6 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>+</Text>
                <Text className={styles.uploadText}>上传图片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.contactSection}>
        <Text className={classnames(styles.sectionTitle, styles.required)}>联系方式</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入手机号码，方便我们联系您'
          value={contact}
          onInput={(e) => setContact(e.detail.value)}
          maxlength={11}
          type='number'
        />
      </View>

      <View className={styles.historySection}>
        <Text
          className={styles.sectionTitle}
          onClick={() => setShowHistory(!showHistory)}
          style={{ cursor: 'pointer' }}
        >
          历史记录 {showHistory ? '▲' : '▼'}
        </Text>
        {showHistory && (
          feedbackRecords.length > 0 ? (
            feedbackRecords.map(record => (
              <View
                key={record.id}
                className={styles.historyItem}
                onClick={() => handleRecordClick(record)}
              >
                <View className={styles.historyHeader}>
                  <Text className={styles.historyType}>{record.type}</Text>
                  <Text className={classnames(styles.historyStatus, styles[record.status])}>
                    {getStatusText(record.status)}
                  </Text>
                </View>
                <Text className={styles.historyContent}>{record.description}</Text>
                <Text className={styles.historyDate}>{record.createdAt}</Text>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无反馈记录</Text>
            </View>
          )
        )}
      </View>

      <View className={styles.submitBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '提交中...' : '提交反馈'}
        </Button>
      </View>
    </ScrollView>
  )
}

export default FeedbackPage
