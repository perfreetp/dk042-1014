import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import SkillCard from '@/components/SkillCard'
import { getFavoriteSkills } from '@/data/skills'
import { Skill } from '@/types'

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Skill[]>([])

  useEffect(() => {
    const data = getFavoriteSkills()
    console.log('[Favorites] Favorite skills count:', data.length)
    setFavorites(data)
  }, [])

  const handleSkillClick = (skill: Skill) => {
    console.log('[Favorites] Skill clicked:', skill.id)
    Taro.navigateTo({
      url: `/pages/skill-detail/index?id=${skill.id}`
    })
  }

  const handleCancelFavorite = (skillId: string, e) => {
    e.stopPropagation()
    console.log('[Favorites] Cancel favorite:', skillId)
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消收藏这个技能吗？',
      success: (res) => {
        if (res.confirm) {
          setFavorites(prev => prev.filter(s => s.id !== skillId))
          Taro.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        {favorites.length > 0 ? (
          <View className={styles.skillList}>
            {favorites.map(skill => (
              <SkillCard key={skill.id} skill={skill} onClick={() => handleSkillClick(skill)} />
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
