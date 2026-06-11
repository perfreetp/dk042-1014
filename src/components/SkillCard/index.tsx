import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
  onClick?: () => void
  className?: string
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, className }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/skill-detail/index?id=${skill.id}`
      })
    }
  }

  return (
    <View className={classnames(styles.skillCard, className)} onClick={handleClick}>
      <View className={styles.cardContent}>
        <View className={styles.imageContainer}>
          <Image
            src={skill.images[0]}
            mode='aspectFill'
            onError={(e) => console.error('[SkillCard] Image load error:', e)}
          />
        </View>
        <View className={styles.infoContainer}>
          <View>
            <View className={styles.header}>
              <Text className={styles.categoryTag}>{skill.categoryName}</Text>
              {skill.isVerified && (
                <Text className={styles.verifiedBadge}>✓ 已认证</Text>
              )}
            </View>
            <Text className={styles.title}>{skill.title}</Text>
            <Text className={styles.desc}>{skill.description}</Text>
            <View className={styles.meta}>
              <Image
                className={styles.providerAvatar}
                src={skill.provider.avatar}
                mode='aspectFill'
              />
              <Text className={styles.providerName}>{skill.provider.name}</Text>
              <View className={styles.rating}>
                <Text>★</Text>
                <Text className={styles.ratingText}>{skill.rating}</Text>
                <Text className={styles.ratingText}>· {skill.reviewCount}条评价</Text>
              </View>
            </View>
          </View>
          <View className={styles.footer}>
            <View className={styles.price}>
              <Text className={styles.priceSymbol}>¥</Text>
              <Text className={styles.priceValue}>{skill.priceMin}</Text>
              {skill.priceMax > skill.priceMin && (
                <Text className={styles.priceSymbol}>-{skill.priceMax}</Text>
              )}
              <Text className={styles.priceUnit}>/{skill.priceUnit}</Text>
            </View>
            <View className={styles.location}>
              <Text>📍</Text>
              <Text>{skill.provider.neighborhood}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SkillCard
