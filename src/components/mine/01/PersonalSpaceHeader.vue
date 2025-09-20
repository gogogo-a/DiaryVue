<template>
  <view class="personal-space-header" :class="themeStore.currentThemeClass">
    <!-- 上层背景图 -->
    <view class="background-section">
      <image
        class="background-image"
        :src="backgroundImage"
        mode="aspectFill"
      />

      <!-- 背景上的信息 -->
      <view class="overlay-info">
        <view class="follow-stats">
          <view class="stat-item">
            <text class="stat-number">{{ userStats.visitors }}</text>
            <text class="stat-label">访客</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ userStats.fans }}</text>
            <text class="stat-label">粉丝</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <view class="action-btn" @tap="handleEditProfile">
            <text class="btn-icon">✏️</text>
            <text class="btn-text">编辑资料</text>
          </view>
          <view class="action-btn" @tap="handleChangeBackground">
            <text class="btn-icon">🖼️</text>
            <text class="btn-text">更换背景</text>
          </view>
          <view class="action-btn" @tap="handleShareSpace">
            <text class="btn-icon">📤</text>
            <text class="btn-text">分享空间</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 下层用户介绍 -->
    <view class="profile-section">
      <!-- 用户头像 -->
      <view class="avatar-container">
        <image
          class="user-avatar"
          :src="userInfo.avatar || defaultAvatar"
          mode="aspectFill"
          @tap="handleAvatarTap"
        />
      </view>

      <!-- 用户信息 -->
      <view class="user-info">
        <view class="join-date">{{ userInfo.joinDate }}</view>
        <view class="username">{{ userInfo.username }}</view>

        <!-- 个性签名按钮 -->
        <view class="signature-section" @tap="handleAddSignature">
          <view class="signature-btn">
            <text class="signature-text">添加个性签名</text>
            <text class="signature-arrow">〉</text>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="privacy-notice">
        <text class="notice-icon">ⓘ</text>
        <text class="notice-text">个人空间仅展示你的公开日记，所有人可见</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, reactive, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './PersonalSpaceHeader.scss'

defineOptions({
  name: 'PersonalSpaceHeader'
})

// 使用主题状态
const themeStore = useThemeStore()

// 默认头像和背景图
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'
const backgroundImage = ref('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&h=400&fit=crop')

// 用户信息
const userInfo = reactive({
  username: '山水图的空间',
  avatar: '',
  joinDate: '2025年9月 加入',
  signature: ''
})

// 用户统计数据
const userStats = reactive({
  visitors: 0,
  fans: 0
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

// 处理编辑资料
const handleEditProfile = () => {
  Taro.showToast({
    title: '编辑资料功能',
    icon: 'none'
  })
}

// 处理更换背景
const handleChangeBackground = () => {
  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      backgroundImage.value = res.tempFilePaths[0]
      Taro.showToast({
        title: '背景更换成功',
        icon: 'success'
      })
    }
  })
}

// 处理分享空间
const handleShareSpace = () => {
  Taro.showShareMenu({
    withShareTicket: true,
    success: () => {
      Taro.showToast({
        title: '分享成功',
        icon: 'success'
      })
    },
    fail: () => {
      Taro.showToast({
        title: '分享功能暂不可用',
        icon: 'none'
      })
    }
  })
}

// 处理添加个性签名
const handleAddSignature = () => {
  Taro.showModal({
    title: '个性签名',
    editable: true,
    placeholderText: '请输入个性签名...',
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.signature = res.content
        Taro.showToast({
          title: '签名设置成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>








