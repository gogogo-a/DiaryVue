<template>
  <view class="account-header" :class="themeStore.currentThemeClass">
    <view class="header-content">
      <!-- 用户信息 -->
      <view class="user-info" @tap="handleUserClick">
        <view class="avatar">
          <image class="avatar-img" :src="userAvatar" mode="aspectFit" />
        </view>
        <view class="user-text">
          <text class="participant-count">{{ participantCount }}人参加</text>
          <image class="arrow-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
        </view>
      </view>

      <!-- 导出按钮 -->
      <view class="export-btn" @tap="handleExport">
        <text class="export-text">导出账本</text>
        <image class="export-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, computed } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useUserStore } from '../../../../stores/user'
import Taro from '@tarojs/taro'
import './AccountHeader.scss'

defineOptions({
  name: 'AccountHeaderComponent'
})

// Props
const props = defineProps({
  account: {
    type: Object,
    default: () => null
  }
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用用户状态
const userStore = useUserStore()

// 参与人数
const participantCount = computed(() => {
  return props.account?.member_count || 1
})

// 用户头像
const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || '../../../../assets/images/test1.webp'
})

// 处理导出账本
const handleExport = () => {
  if (!props.account) {
    Taro.showToast({
      title: '账本信息不存在',
      icon: 'none'
    })
    return
  }

  Taro.showToast({
    title: '导出功能开发中',
    icon: 'none'
  })
}

// 处理用户信息点击
const handleUserClick = () => {
  if (!props.account) {
    Taro.showToast({
      title: '账本信息不存在',
      icon: 'none'
    })
    return
  }

  Taro.showToast({
    title: '用户管理功能开发中',
    icon: 'none'
  })
}
</script>
