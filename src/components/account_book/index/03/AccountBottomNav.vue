<template>
  <view class="account-bottom-nav" :class="themeStore.currentThemeClass">
    <view class="nav-container">
      <!-- 管理账本 -->
      <view class="nav-item" @tap="handleManage">
        <view class="nav-icon">
          <image class="icon-img" src="../../../../assets/svg/diary/label.svg" mode="aspectFit" />
        </view>
        <text class="nav-text">管理账本</text>
      </view>

      <!-- 记一笔 -->
      <view class="nav-item center-item" @tap="handleAddRecord">
        <view class="add-button">
          <text class="add-icon">+</text>
        </view>
        <text class="nav-text">记一笔</text>
      </view>

      <!-- 邀请 -->
      <view class="nav-item" @tap="handleInvite">
        <view class="nav-icon">
          <image class="icon-img" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
        </view>
        <text class="nav-text">邀请</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AccountBottomNav.scss'

defineOptions({
  name: 'AccountBottomNavComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理管理账本
const handleManage = () => {
  console.log('点击管理账本按钮')
  Taro.navigateTo({
    url: '/pages/account_book/control/account_control',
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      Taro.showToast({
        title: '跳转失败，请重试',
        icon: 'none'
      })
    }
  })
}

// 处理添加记录
const handleAddRecord = () => {
  Taro.showToast({
    title: '记一笔功能即将上线',
    icon: 'none'
  })
}

// 处理邀请
const handleInvite = () => {
  Taro.showToast({
    title: '邀请功能即将上线',
    icon: 'none'
  })
}
</script>
