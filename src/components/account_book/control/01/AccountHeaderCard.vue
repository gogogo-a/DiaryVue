<template>
  <view class="account-header-card" :class="themeStore.currentThemeClass">
    <view class="header-section">
      <text class="page-title">我的账本</text>
      <text class="page-subtitle">轻松管理您的财务记录</text>
      <view class="title-underline"></view>
    </view>

    <view class="action-section">
      <view class="add-account-btn" @tap="handleAddAccount">
        <text class="add-btn-text">+ 账本</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AccountHeaderCard.scss'

defineOptions({
  name: 'AccountHeaderCardComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理添加账本
const handleAddAccount = () => {
  Taro.showToast({
    title: '添加账本功能即将上线',
    icon: 'none'
  })
}
</script>
