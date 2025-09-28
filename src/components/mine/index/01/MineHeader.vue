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
        <view class="username">{{ userInfo.username }}</view>
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
import { defineOptions, ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useUserStore } from '../../../../stores/user'
import Taro from '@tarojs/taro'
import './MineHeader.scss'

defineOptions({
  name: 'MineHeader'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用用户状态
const userStore = useUserStore()

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'

// 从store中获取用户信息
const userInfo = computed(() => ({
  username: userStore.userInfo.user_name || '山水图',
  avatar: userStore.userInfo.avatar || '',
  following: 0, // TODO: 实际关注数据
  followers: 0, // TODO: 实际粉丝数据
  birthday: userStore.userInfo.birthday || ''
}))

// 处理头像点击 - 跳转到编辑页面
const handleAvatarTap = () => {
  Taro.navigateTo({
    url: '/pages/mine/editor/profile_editor'
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
  Taro.navigateTo({
    url: '/pages/mine/editor/profile_editor'
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

// 页面加载时初始化用户状态
onMounted(() => {
  // 确保用户状态已加载
  if (!userStore.isLoggedIn) {
    userStore.checkAndEnsureLogin()
  }
  console.log('MineHeader: 当前用户信息', userStore.userInfo)
})
</script>

