<template>
  <view class="account-bottom-nav" :class="themeStore.currentThemeClass">
    <view class="nav-container">
      <!-- 管理账本 -->
      <view class="nav-item" @tap="handleManage">
        <view class="nav-content">
          <view class="nav-icon">
            <image class="icon-img" src="../../../../assets/svg/diary/label.svg" mode="aspectFit" />
          </view>
          <text class="nav-text">管理账本</text>
        </view>
      </view>

      <!-- 记一笔 - 中间按钮 -->
      <view class="nav-item center-item" @tap="handleAddRecord">
        <view class="nav-content">
          <view class="add-button">
            <text class="add-icon">+</text>
          </view>
          <text class="nav-text">记一笔</text>
        </view>
      </view>

      <!-- 邀请 -->
      <view class="nav-item" @tap="handleInvite">
        <view class="nav-content">
          <view class="nav-icon">
            <image class="icon-img" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>
          <text class="nav-text">邀请</text>
        </view>
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

// Props
const props = defineProps({
  accountId: {
    type: String,
    default: ''
  }
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理管理账本
const handleManage = () => {
  Taro.navigateTo({
    url: '/pages/account_book/control/account_control',
    fail: (err) => {
      Taro.showToast({
        title: '跳转失败，请重试',
        icon: 'none'
      })
    }
  })
}

// 处理添加记录
const handleAddRecord = () => {
  if (!props.accountId) {
    Taro.showToast({
      title: '账本ID不存在',
      icon: 'error'
    })
    return
  }

  Taro.navigateTo({
    url: `/pages/account_book/add/add_record?accountId=${props.accountId}`,
    fail: (err) => {
      Taro.showToast({
        title: `跳转失败: ${err.errMsg}`,
        icon: 'none',
        duration: 3000
      })
    }
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
