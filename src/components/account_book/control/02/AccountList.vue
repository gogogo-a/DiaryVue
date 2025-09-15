<template>
  <view class="account-list" :class="themeStore.currentThemeClass">
    <!-- 账本卡片1 -->
    <view class="account-card" @tap="handleAccountClick('122')">
      <view class="card-header">
        <text class="account-number">122</text>
        <view class="edit-btn" @tap.stop="handleEdit('122')">
          <image class="edit-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
        </view>
      </view>

      <view class="card-content">
        <view class="participant-info">
          <view class="avatar-group">
            <image class="avatar" src="../../../../assets/images/test1.webp" mode="aspectFit" />
          </view>
          <text class="participant-count">1人参加</text>
        </view>

        <view class="action-buttons">
          <view class="action-btn delete-btn" @tap.stop="handleDelete('122')">
            <text class="btn-text">删除</text>
          </view>

          <view class="action-btn invite-btn" @tap.stop="handleInvite('122')">
            <text class="btn-text">邀请</text>
            <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>

          <view class="action-btn enter-btn" @tap.stop="handleEnter('122')">
            <text class="btn-text">进入账本</text>
            <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <!-- 账本卡片2 -->
    <view class="account-card" @tap="handleAccountClick('123')">
      <view class="card-header">
        <text class="account-number">123</text>
        <view class="edit-btn" @tap.stop="handleEdit('123')">
          <image class="edit-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
        </view>
      </view>

      <view class="card-content">
        <view class="participant-info">
          <view class="avatar-group">
            <image class="avatar" src="../../../../assets/images/test2.webp" mode="aspectFit" />
          </view>
          <text class="participant-count">1人参加</text>
        </view>

        <view class="action-buttons">
          <view class="action-btn delete-btn" @tap.stop="handleDelete('123')">
            <text class="btn-text">删除</text>
          </view>

          <view class="action-btn invite-btn" @tap.stop="handleInvite('123')">
            <text class="btn-text">邀请</text>
            <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>

          <view class="action-btn enter-btn" @tap.stop="handleEnter('123')">
            <text class="btn-text">进入账本</text>
            <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AccountList.scss'

defineOptions({
  name: 'AccountListComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理账本点击
const handleAccountClick = (accountId) => {
  console.log('账本点击:', accountId)
}

// 处理编辑
const handleEdit = (accountId) => {
  Taro.showToast({
    title: `编辑账本 ${accountId}`,
    icon: 'none'
  })
}

// 处理删除
const handleDelete = (accountId) => {
  Taro.showModal({
    title: '确认删除',
    content: `确定要删除账本 ${accountId} 吗？`,
    success: (res) => {
      if (res.confirm) {
        Taro.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}

// 处理邀请
const handleInvite = (accountId) => {
  Taro.showToast({
    title: `邀请功能即将上线`,
    icon: 'none'
  })
}

// 处理进入账本
const handleEnter = (accountId) => {
  Taro.navigateTo({
    url: '/pages/account_book/index/account_book'
  })
}
</script>
