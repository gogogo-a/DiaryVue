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
import { useAccountStore } from '../../../../stores/account'
import { useUserStore } from '../../../../stores/user'
import Taro from '@tarojs/taro'
import './AccountHeader.scss'

defineOptions({
  name: 'AccountHeaderComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用记账本状态
const accountStore = useAccountStore()

// 使用用户状态
const userStore = useUserStore()

// 参与人数（暂时固定为1）
const participantCount = computed(() => 1)

// 用户头像
const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || '../../../../assets/images/test1.webp'
})

// 处理导出账本
const handleExport = () => {
  if (accountStore.totalRecords === 0) {
    Taro.showToast({
      title: '暂无数据可导出',
      icon: 'none'
    })
    return
  }

  try {
    const exportData = accountStore.exportData()
    console.log('导出数据:', exportData)

    Taro.showToast({
      title: `已导出${exportData.records.length}条记录`,
      icon: 'success'
    })
  } catch (error) {
    console.error('导出失败:', error)
    Taro.showToast({
      title: '导出失败',
      icon: 'none'
    })
  }
}

// 处理用户信息点击
const handleUserClick = () => {
  Taro.showToast({
    title: '用户管理功能开发中',
    icon: 'none'
  })
}
</script>
