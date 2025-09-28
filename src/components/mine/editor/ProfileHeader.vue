<template>
  <view class="profile-header" :class="themeStore.currentThemeClass">
    <view class="back-btn" @tap="handleBack">
      <text>返回</text>
    </view>
    <view class="header-title">个人资料</view>
    <view class="header-right">
      <text class="header-icon">⋯</text>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './ProfileHeader.scss'

defineOptions({
  name: 'ProfileHeader'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理返回按钮点击
const handleBack = () => {
  Taro.navigateBack()
}
</script>



