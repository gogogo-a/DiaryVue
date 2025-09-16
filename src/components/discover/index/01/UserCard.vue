<template>
  <view class="user-card" :class="themeStore.currentThemeClass">
    <view class="user-info">
      <image
        class="user-avatar"
        :src="userInfo.avatar"
        mode="aspectFill"
        @tap="handleUserClick"
      />
      <view class="user-details">
        <view class="user-name" @tap="handleUserClick">{{ userInfo.name }}</view>
        <view class="post-time">{{ formatTime(userInfo.postTime) }}</view>
      </view>
      <view class="post-date">{{ formatDate(userInfo.postTime) }}</view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, defineProps } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './UserCard.scss'

defineOptions({
  name: 'UserCard'
})

// 接收props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      avatar: '',
      postTime: new Date()
    })
  }
})

// 使用主题状态
const themeStore = useThemeStore()

// 格式化时间
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 格式化日期
const formatDate = (date) => {
  const today = new Date()
  const postDate = new Date(date)

  // 判断是否是今天
  if (postDate.toDateString() === today.toDateString()) {
    return '今天'
  }

  // 判断是否是昨天
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (postDate.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }

  // 其他日期显示月日
  const month = postDate.getMonth() + 1
  const day = postDate.getDate()
  return `${month}月${day}日`
}

// 处理用户点击
const handleUserClick = () => {
  console.log('点击用户:', props.userInfo.name)
  // 这里可以跳转到用户详情页
  Taro.showToast({
    title: `查看${props.userInfo.name}的主页`,
    icon: 'none'
  })
}
</script>
