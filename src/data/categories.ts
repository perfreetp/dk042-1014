import { Category } from '@/types'

export const categories: Category[] = [
  { id: '1', name: '维修', icon: '🔧', color: '#FF7A45' },
  { id: '2', name: '家教', icon: '📚', color: '#36B37E' },
  { id: '3', name: '宠物照看', icon: '🐕', color: '#FFAB00' },
  { id: '4', name: '摄影', icon: '📷', color: '#165DFF' },
  { id: '5', name: '电脑设置', icon: '💻', color: '#722ED1' },
  { id: '6', name: '手工制作', icon: '🎨', color: '#F53F3F' },
  { id: '7', name: '家政清洁', icon: '🧹', color: '#13C2C2' },
  { id: '8', name: '更多', icon: '➕', color: '#86909C' }
]

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id)
}
