import React, { useState, useCallback } from 'react'
import { View, Text, Input, Image, ScrollView, Button } from '@tarojs/components'
import Taro, { chooseImage } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { currentUser } from '@/data/user'

const benefits = [
  { icon: '✓', name: '增加信任', desc: '获得"已认证"标识，邻居更愿意选择你的服务' },
  { icon: '✓', name: '提升曝光', desc: '认证用户的技能排名更靠前，获得更多曝光' },
  { icon: '✓', name: '接单更多', desc: '数据显示，认证用户接单量平均提升30%' },
  { icon: '✓', name: '专属标识', desc: '实名认证标识在个人主页和技能主页展示' }
]

const VerificationPage: React.FC = () => {
  const [isVerified, setIsVerified] = useState(currentUser.isVerified)
  const [realName, setRealName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [frontImage, setFrontImage] = useState('')
  const [backImage, setBackImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = realName.trim() && idCard.trim().length === 18 && frontImage && backImage

  const handleChooseImage = useCallback(async (type: 'front' | 'back') => {
    console.log('[Verification] Choosing', type, 'image')
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      const img = res.tempFilePaths[0]
      if (type === 'front') {
        setFrontImage(img)
      } else {
        setBackImage(img)
      }
    } catch (e) {
      console.error('[Verification] Choose image error:', e)
    }
  }, [])

  const handleDeleteImage = (type: 'front' | 'back', e) => {
    e.stopPropagation()
    if (type === 'front') {
      setFrontImage('')
    } else {
      setBackImage('')
    }
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    console.log('[Verification] Submitting:', { realName, idCard, frontImage, backImage })
    setIsSubmitting(true)
    Taro.showLoading({ title: '提交中...' })

    setTimeout(() => {
      setIsSubmitting(false)
      Taro.hideLoading()
      setIsVerified(true)
      Taro.showToast({ title: '提交成功，等待审核', icon: 'success' })
    }, 1500)
  }

  if (isVerified) {
    return (
      <ScrollView scrollY className={styles.page}>
        <View className={styles.statusCard}>
          <Text className={styles.statusTitle}>
            ✅ 已完成实名认证
          </Text>
          <Text className={styles.statusDesc}>
            您的实名认证已通过，享受认证用户专属权益
          </Text>
        </View>

        <View className={styles.benefits}>
          <Text className={styles.benefitsTitle}>认证权益</Text>
          <View className={styles.benefitList}>
            {benefits.map((benefit, index) => (
              <View key={index} className={styles.benefitItem}>
                <View className={styles.benefitIcon} style={{ color: '#36B37E', background: 'rgba(54, 179, 126, 0.15)' }}>
                  {benefit.icon}
                </View>
                <View className={styles.benefitText}>
                  <Text className={styles.benefitName}>{benefit.name}</Text>
                  <Text className={styles.benefitDesc}>{benefit.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.alreadyVerified}>
          <Text className={styles.verifiedText}>✓ 您的实名信息已通过平台审核</Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.statusCard}>
        <Text className={styles.statusTitle}>
          📝 完成实名认证
        </Text>
        <Text className={styles.statusDesc}>
          完成实名认证后，您将获得更多权益，提升接单成功率
        </Text>
      </View>

      <View className={styles.benefits}>
        <Text className={styles.benefitsTitle}>认证权益</Text>
        <View className={styles.benefitList}>
          {benefits.map((benefit, index) => (
            <View key={index} className={styles.benefitItem}>
              <View className={styles.benefitIcon}>
                {benefit.icon}
              </View>
              <View className={styles.benefitText}>
                <Text className={styles.benefitName}>{benefit.name}</Text>
                <Text className={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={classnames(styles.formLabel, styles.required)}>真实姓名</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入您的真实姓名'
          value={realName}
          onInput={(e) => setRealName(e.detail.value)}
          maxlength={20}
        />

        <Text className={classnames(styles.formLabel, styles.required)}>身份证号</Text>
        <Input
          className={styles.inputField}
          placeholder='请输入18位身份证号码'
          value={idCard}
          onInput={(e) => setIdCard(e.detail.value)}
          maxlength={18}
        />

        <Text className={classnames(styles.formLabel, styles.required)}>上传身份证照片</Text>
        <View className={styles.uploadSection}>
          <View className={styles.uploadItem}>
            {frontImage ? (
              <>
                <Image
                  className={styles.uploadImage}
                  src={frontImage}
                  mode='aspectFill'
                  onError={(e) => console.error('[Verification] Front image error:', e)}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: '8rpx',
                    right: '8rpx',
                    width: '40rpx',
                    height: '40rpx',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    borderRadius: '999rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24rpx'
                  }}
                  onClick={(e) => handleDeleteImage('front', e)}
                >
                  ×
                </View>
              </>
            ) : (
              <View className={styles.uploadBtn} onClick={() => handleChooseImage('front')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>
                  身份证{'\n'}
                  正面照
                </Text>
              </View>
            )}
          </View>
          <View className={styles.uploadItem}>
            {backImage ? (
              <>
                <Image
                  className={styles.uploadImage}
                  src={backImage}
                  mode='aspectFill'
                  onError={(e) => console.error('[Verification] Back image error:', e)}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: '8rpx',
                    right: '8rpx',
                    width: '40rpx',
                    height: '40rpx',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    borderRadius: '999rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24rpx'
                  }}
                  onClick={(e) => handleDeleteImage('back', e)}
                >
                  ×
                </View>
              </>
            ) : (
              <View className={styles.uploadBtn} onClick={() => handleChooseImage('back')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>
                  身份证{'\n'}
                  反面照
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text className={styles.uploadHint}>
          请确保照片清晰，身份证信息完整可见
        </Text>
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipsTitle}>温馨提示</Text>
        <Text className={styles.tipsContent}>
          1. 我们将严格保护您的个人信息，仅用于身份验证{'\n'}
          2. 审核通常在1-2个工作日内完成{'\n'}
          3. 审核结果将通过站内通知告知您
        </Text>
      </View>

      <View className={styles.submitBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '提交中...' : '提交认证'}
        </Button>
      </View>
    </ScrollView>
  )
}

export default VerificationPage
