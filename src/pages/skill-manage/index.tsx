import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { Skill } from '@/types'

interface PublishedSkill extends Skill {
  publishStatus: 'online' | 'offline'
}

const SkillManagePage: React.FC = () => {
  const storeSkills = useAppStore(state => state.skills)
  const [mySkills, setMySkills] = useState<PublishedSkill[]>(() => {
    return storeSkills
      .filter(s => s.provider.id === 'me')
      .map(skill => ({
        ...skill,
        publishStatus: 'online' as const
      }))
  })

  const refreshMySkills = () => {
    const updated = storeSkills
      .filter(s => s.provider.id === 'me')
      .map(skill => {
        const existing = mySkills.find(m => m.id === skill.id)
        return {
          ...skill,
          publishStatus: existing?.publishStatus || 'online' as const
        }
      })
    setMySkills(updated)
  }

  React.useEffect(() => {
    refreshMySkills()
  }, [storeSkills])

  const handlePublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  const handleEdit = (skill: PublishedSkill) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
  }

  const handleToggleStatus = (skill: PublishedSkill) => {
    const newStatus = skill.publishStatus === 'online' ? 'offline' : 'online'
    setMySkills(prev => prev.map(s =>
      s.id === skill.id ? { ...s, publishStatus: newStatus } : s
    ))
    Taro.showToast({
      title: newStatus === 'online' ? '已上架' : '已下架',
      icon: 'success'
    })
  }

  const handleDelete = (skill: PublishedSkill, e) => {
    e.stopPropagation()
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个技能吗？删除后无法恢复。',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          setMySkills(prev => prev.filter(s => s.id !== skill.id))
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.skillList}>
        {mySkills.length > 0 ? (
          mySkills.map(skill => (
            <View key={skill.id} className={styles.skillCard}>
              <View className={styles.skillHeader}>
                <Image
                  className={styles.skillImage}
                  src={skill.images[0]}
                  mode='aspectFill'
                />
                <View className={styles.skillInfo}>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Text className={styles.skillTitle}>{skill.title}</Text>
                    <Text className={classnames(
                      styles.statusTag,
                      skill.publishStatus === 'online' ? styles.online : styles.offline
                    )}>
                      {skill.publishStatus === 'online' ? '已上架' : '已下架'}
                    </Text>
                  </View>
                  <Text className={styles.skillCategory}>{skill.categoryName}</Text>
                  <Text className={styles.skillPrice}>
                    ¥{skill.priceMin}-{skill.priceMax}/{skill.priceUnit}
                  </Text>
                  <View className={styles.skillMeta}>
                    <Text>⭐ {skill.rating || '暂无'}</Text>
                    <Text>💬 {skill.reviewCount}条评价</Text>
                    <Text>📦 {skill.provider.completedOrders}单</Text>
                  </View>
                </View>
              </View>
              <View className={styles.skillActions}>
                <Button
                  className={styles.actionBtn}
                  onClick={() => handleEdit(skill)}
                >
                  编辑
                </Button>
                <Button
                  className={classnames(styles.actionBtn, styles.primary)}
                  onClick={() => handleToggleStatus(skill)}
                >
                  {skill.publishStatus === 'online' ? '下架' : '上架'}
                </Button>
                <Button
                  className={classnames(styles.actionBtn, styles.danger)}
                  onClick={(e) => handleDelete(skill, e)}
                >
                  删除
                </Button>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyTitle}>暂无发布的技能</Text>
            <Text className={styles.emptyDesc}>分享你的技能，帮助邻里的同时还能赚取收入~</Text>
            <Button className={styles.publishBtn} onClick={handlePublish}>
              立即发布
            </Button>
          </View>
        )}
      </View>

      {mySkills.length > 0 && (
        <View className={styles.fab} onClick={handlePublish}>
          +
        </View>
      )}
    </ScrollView>
  )
}

export default SkillManagePage
