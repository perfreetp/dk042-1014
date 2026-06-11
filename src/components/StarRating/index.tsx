import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface StarRatingProps {
  rating: number
  max?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <View className={styles.starRating}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Text key={`full-${i}`} className={classnames(styles.star, styles.active)}>★</Text>
      ))}
      {hasHalfStar && <Text className={classnames(styles.star, styles.half)}>★</Text>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Text key={`empty-${i}`} className={styles.star}>★</Text>
      ))}
    </View>
  )
}

export default StarRating
