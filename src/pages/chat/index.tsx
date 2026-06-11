import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, ScrollView, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { ChatMessage, ChatSession, Skill } from '@/types'
import { currentUser } from '@/data/user'

const ChatPage: React.FC = () => {
  const router = useRouter()
  const chatId = router.params.chatId as string
  const skillId = router.params.skillId as string
  const orderId = router.params.orderId as string
  const storeSkills = useAppStore(state => state.skills)
  const storeOrders = useAppStore(state => state.orders)
  const chatMessages = useAppStore(state => state.chatMessages)
  const getOrCreateChatSession = useAppStore(state => state.getOrCreateChatSession)
  const addMessage = useAppStore(state => state.addMessage)

  const [session, setSession] = useState<ChatSession | null>(null)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const scrollViewRef = useRef<any>(null)

  useEffect(() => {
    if (orderId) {
      const order = storeOrders.find(o => o.id === orderId)
      if (order) {
        const session = getOrCreateChatSession(
          order.skillId,
          { id: order.providerId, name: order.providerName, avatar: order.providerAvatar, isVerified: true },
          { id: order.skillId, title: order.skillTitle, image: order.skillImage }
        )
        setSession(session)
        const skillData = storeSkills.find(s => s.id === order.skillId)
        if (skillData) setSkill(skillData)
      }
    } else if (skillId) {
      const skillData = storeSkills.find(s => s.id === skillId)
      if (skillData) {
        setSkill(skillData)
        const session = getOrCreateChatSession(
          skillData.id,
          {
            id: skillData.provider.id,
            name: skillData.provider.name,
            avatar: skillData.provider.avatar,
            isVerified: skillData.provider.isVerified
          },
          { id: skillData.id, title: skillData.title, image: skillData.images[0] }
        )
        setSession(session)
      }
    } else if (chatId) {
      const session = useAppStore.getState().chatSessions.find(s => s.id === chatId)
      if (session) {
        setSession(session)
        const skillData = storeSkills.find(s => s.id === session.skillId)
        if (skillData) setSkill(skillData)
      }
    }
  }, [skillId, chatId, orderId, storeSkills, storeOrders, getOrCreateChatSession])

  useEffect(() => {
    if (session) {
      const msgs = useAppStore.getState().chatMessages[session.id] || []
      setMessages(msgs)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [session, chatMessages])

  useEffect(() => {
    const interval = setInterval(() => {
      if (session) {
        const msgs = useAppStore.getState().chatMessages[session.id] || []
        setMessages([...msgs])
      }
    }, 500)
    return () => clearInterval(interval)
  }, [session])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ top: 99999, duration: 300 })
      }
    }, 50)
  }, [])

  const handleSendText = () => {
    if (!inputText.trim() || !session) return
    const text = inputText.trim()
    addMessage(session.id, {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: 'text',
      content: text
    })
    setInputText('')
    scrollToBottom()
    setTimeout(() => {
      simulateReply(session.id, text)
    }, 1500)
  }

  const simulateReply = (chatId: string, userText: string) => {
    const replies = [
      '好的，我了解了~',
      '请问您什么时候方便呢？',
      '可以的，我这边没问题',
      '您能说一下具体需求吗？',
      '没问题，我会提前准备的',
      '好的，我们到时见！'
    ]
    const reply = replies[Math.floor(Math.random() * replies.length)]
    if (session) {
      addMessage(chatId, {
        senderId: session.otherUserId,
        senderName: session.otherUserName,
        senderAvatar: session.otherUserAvatar,
        type: 'text',
        content: reply
      })
    }
    scrollToBottom()
  }

  const handleSendImage = () => {
    if (!session) return
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const filePath = res.tempFilePaths[0]
        addMessage(session.id, {
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          type: 'image',
          content: filePath
        })
        scrollToBottom()
      }
    })
  }

  const handleGoBooking = () => {
    if (!skill) return
    Taro.navigateTo({
      url: `/pages/booking/index?skillId=${skill.id}&chatId=${session?.id}`
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const renderMessage = (msg: ChatMessage) => {
    const isMe = msg.senderId === currentUser.id
    return (
      <View
        key={msg.id}
        className={classnames(styles.messageItem, isMe ? styles.me : styles.other)}
      >
        <Image
          className={styles.avatar}
          src={isMe ? currentUser.avatar : msg.senderAvatar}
          mode='aspectFill'
        />
        <View className={styles.messageContent}>
          <Text className={styles.senderName}>{msg.senderName}</Text>
          {msg.type === 'image' ? (
            <Image
              className={styles.messageImage}
              src={msg.content}
              mode='widthFix'
              onClick={() => Taro.previewImage({ urls: [msg.content] })}
            />
          ) : msg.type === 'order' && msg.orderInfo ? (
            <View className={styles.orderCard} onClick={() => handleOrderClick(msg.orderInfo!.orderId)}>
              <View className={styles.orderCardHeader}>
                <Text className={styles.orderCardTitle}>📋 订单信息</Text>
                <Text className={styles.orderCardStatus}>{msg.orderInfo.status}</Text>
              </View>
              <View className={styles.orderCardBody}>
                <Image
                  className={styles.orderCardImage}
                  src={msg.orderInfo.skillImage}
                  mode='aspectFill'
                />
                <View className={styles.orderCardInfo}>
                  <Text className={styles.orderCardSkill}>{msg.orderInfo.skillTitle}</Text>
                  <Text className={styles.orderCardTime}>🕐 {msg.orderInfo.bookingTime}</Text>
                  <Text className={styles.orderCardPrice}>¥{msg.orderInfo.price}</Text>
                </View>
              </View>
              <View className={styles.orderCardFooter}>
                <Text className={styles.orderCardAction}>查看订单 ›</Text>
              </View>
            </View>
          ) : (
            <View className={styles.messageBubble}>
              <Text>{msg.content}</Text>
            </View>
          )}
          <Text className={styles.messageTime}>{formatTime(msg.createdAt)}</Text>
        </View>
      </View>
    )
  }

  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${orderId}`
    })
  }

  if (!session || !skill) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.skillBar} onClick={handleGoBooking}>
          <Image
            className={styles.skillImage}
            src={skill.images[0]}
            mode='aspectFill'
          />
          <View className={styles.skillInfo}>
            <Text className={styles.skillTitle}>{skill.title}</Text>
            <Text className={styles.skillPrice}>
              ¥{skill.priceMin}-{skill.priceMax}/{skill.priceUnit}
            </Text>
          </View>
          <View className={styles.goBooking}>
            <Text className={styles.goBookingText}>立即预约</Text>
            <Text style={{ color: '#FF7A45', fontSize: '28rpx' }}>›</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        scrollY
        className={styles.messageList}
        scrollWithAnimation
      >
        <View className={styles.userInfoCard}>
          <Image
            className={styles.userAvatar}
            src={session.otherUserAvatar}
            mode='aspectFill'
          />
          <View className={styles.userInfo}>
            <View className={styles.userNameRow}>
              <Text className={styles.userName}>{session.otherUserName}</Text>
              {session.otherUserVerified && (
                <Text className={styles.verifiedBadge}>✓ 已认证</Text>
              )}
            </View>
            <Text className={styles.skillSubTitle}>{skill.description}</Text>
          </View>
        </View>

        {messages.map(msg => renderMessage(msg))}
        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <View className={styles.inputBar}>
        <View className={styles.iconBtn} onClick={handleSendImage}>
          <Text>📷</Text>
        </View>
        <Input
          className={styles.inputField}
          placeholder='说点什么...'
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          onConfirm={handleSendText}
          confirmType='send'
        />
        <View
          className={classnames(styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled)}
          onClick={handleSendText}
        >
          <Text>发送</Text>
        </View>
      </View>
    </View>
  )
}

export default ChatPage
