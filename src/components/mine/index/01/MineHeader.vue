<template>
  <view class="mine-header" :class="themeStore.currentThemeClass">
    <!-- 用户头像和基本信息 -->
    <view class="user-info">
      <view class="avatar-section">
        <image
          class="avatar"
          :src="userInfo.avatar || defaultAvatar"
          mode="aspectFill"
          @tap="handleAvatarTap"
        />
      </view>

      <view class="user-details">
        <view class="username">{{ userInfo.username || '山水图' }}</view>
        <view class="follow-info">
          <text class="follow-count">{{ userInfo.following || 0 }}</text>
          <text class="follow-label">关注</text>
          <text class="follow-count">{{ userInfo.followers || 0 }}</text>
          <text class="follow-label">粉丝</text>
        </view>
      </view>

      <view class="action-buttons">
        <view class="btn-primary" @tap="handleShowCard">
          展示名片
        </view>
        <view class="btn-secondary" @tap="handleEditProfile">
          编辑资料
        </view>
      </view>
    </view>

    <!-- 生日信息设置 -->
    <view class="birthday-section" @tap="handleSetBirthday">
      <view class="birthday-icon">📅</view>
      <text class="birthday-text">点击设置生日信息</text>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, reactive } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './MineHeader.scss'

defineOptions({
  name: 'MineHeader'
})

// 使用主题状态
const themeStore = useThemeStore()

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'

// 用户信息
const userInfo = reactive({
  username: '山水图',
  avatar: '',
  following: 0,
  followers: 0,
  birthday: ''
})

// 处理头像点击
const handleAvatarTap = () => {
  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.avatar = res.tempFilePaths[0]
      Taro.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

// 处理展示名片
const handleShowCard = () => {
  Taro.showToast({
    title: '展示名片功能',
    icon: 'none'
  })
}

// 处理编辑资料
const handleEditProfile = () => {
  Taro.showToast({
    title: '编辑资料功能',
    icon: 'none'
  })
}

// 处理设置生日
const handleSetBirthday = () => {
  Taro.showActionSheet({
    itemList: ['设置生日', '取消'],
    success: (res) => {
      if (res.tapIndex === 0) {
        Taro.showToast({
          title: '设置生日功能',
          icon: 'none'
        })
      }
    }
  })
}
</script>
