import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import SkillCard from '@/components/SkillCard'
import { useAppStore } from '@/store'

const FavoritesPage: React.FC = () => {
  const skills = useAppStore(state => state.skills)
  const favorites = skills.filter(s => s.isFavorite)

  const handleSkillClick = (skillId: string) => {
    Taro.navigateTo({
      url: `/pages/skill-detail/index?id=${skillId}`
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        {favorites.length > 0 ? (
          <View className={styles.skillList}>
            {favorites.map(skill => (
              <SkillCard key={skill.id} skill={skill} onClick={() => handleSkillClick(skill.id)} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>⭐</Text>
            <Text className={styles.emptyTitle}>暂无收藏</Text>
            <Text className={styles.emptyDesc}>快去首页发现感兴趣的技能吧~</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default FavoritesPage
