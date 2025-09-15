<template>
  <view class="account-header" :class="themeStore.currentThemeClass">
    <view class="header-content">
      <!-- 用户信息 -->
      <view class="user-info">
        <view class="avatar">
          <image class="avatar-img" src="../../../../assets/images/test1.webp" mode="aspectFit" />
        </view>
        <view class="user-text">
          <text class="participant-count">1人参加</text>
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
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AccountHeader.scss'

defineOptions({
  name: 'AccountHeaderComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理导出账本
const handleExport = () => {
  Taro.showToast({
    title: '导出功能即将上线',
    icon: 'none'
  })
}
</script>
