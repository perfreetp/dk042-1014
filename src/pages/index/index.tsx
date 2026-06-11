import React, { useState, useEffect } from 'react'
import { View, Text, Input, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import SkillCard from '@/components/SkillCard'
import { skills, getSkillsByCategory } from '@/data/skills'
import { categories } from '@/data/categories'
import { Skill, Category } from '@/types'

const bannerData = [
  { id: '1', title: '春节服务不打烊', image: 'https://picsum.photos/id/1036/750/400' },
  { id: '2', title: '新用户立减50元', image: 'https://picsum.photos/id/1039/750/400' },
  { id: '3', title: '邻里互助温暖社区', image: 'https://picsum.photos/id/1044/750/400' }
]

const IndexPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [displaySkills, setDisplaySkills] = useState<Skill[]>(skills)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    console.log('[Home] Page loaded, skills count:', skills.length)
  }, [])

  const handleCategoryClick = (category: Category) => {
    console.log('[Home] Category clicked:', category.name)
    if (category.id === '8') {
      Taro.showToast({ title: '更多分类开发中', icon: 'none' })
      return
    }
    setSelectedCategory(selectedCategory === category.id ? null : category.id)
    const filtered = selectedCategory === category.id
      ? skills
      : getSkillsByCategory(category.id)
    setDisplaySkills(filtered)
  }

  const handleSearch = () => {
    console.log('[Home] Search:', searchText)
    if (!searchText.trim()) {
      setDisplaySkills(skills)
      return
    }
    const filtered = skills.filter(s =>
      s.title.includes(searchText) ||
      s.description.includes(searchText) ||
      s.categoryName.includes(searchText)
    )
    setDisplaySkills(filtered)
  }

  const handlePullDownRefresh = () => {
    console.log('[Home] Pull down refresh')
    setIsRefreshing(true)
    setTimeout(() => {
      setDisplaySkills([...skills])
      setIsRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  useEffect(() => {
    Taro.eventCenter.on('__taroPullDownRefresh', handlePullDownRefresh)
    return () => {
      Taro.eventCenter.off('__taroPullDownRefresh', handlePullDownRefresh)
    }
  }, [])

  return (
    <ScrollView
      scrollY
      className={styles.page}
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder='搜索技能服务...'
          placeholderClass={styles.searchPlaceholder}
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
          onConfirm={handleSearch}
        />
      </View>

      <View className={styles.bannerSection}>
        <Swiper
          className={styles.bannerSwiper}
          autoplay
          circular
          indicatorDots
          indicatorColor='rgba(255,255,255,0.5)'
          indicatorActiveColor='#fff'
          interval={3000}
        >
          {bannerData.map(banner => (
            <SwiperItem key={banner.id}>
              <View className={styles.bannerItem}>
                <Image
                  className={styles.bannerImage}
                  src={banner.image}
                  mode='aspectFill'
                  onError={(e) => console.error('[Home] Banner image error:', e)}
                />
                <View className={styles.bannerOverlay}>
                  <Text className={styles.bannerTitle}>{banner.title}</Text>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      <View className={styles.categorySection}>
        <View className={styles.categoryGrid}>
          {categories.map(category => (
            <View
              key={category.id}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(category)}
            >
              <View
                className={styles.categoryIcon}
                style={{ backgroundColor: `${category.color}15`, color: category.color }}
              >
                {category.icon}
              </View>
              <Text className={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : '推荐技能'}
        </Text>
        <Text className={styles.sectionMore}>
          查看更多 ›
        </Text>
      </View>

      <View className={styles.skillList}>
        {displaySkills.length > 0 ? (
          displaySkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))
        ) : (
          <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '80rpx' }}>🔍</Text>
            <Text style={{ display: 'block', marginTop: '16rpx', color: '#86909C' }}>暂无相关技能</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default IndexPage
