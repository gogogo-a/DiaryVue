<template>
  <view class="discover-bottom-nav" :class="themeStore.currentThemeClass">
    <view class="nav-container">
      <!-- 精选公开 -->
      <view class="nav-item" @tap="handleNavClick('featured')">
        <view class="nav-content">
          <view class="nav-icon">
            <image class="icon-img" src="../../../../assets/svg/bar/find.svg" mode="aspectFit" />
          </view>
          <text class="nav-text">精选公开</text>
        </view>
      </view>

      <!-- 发布 - 中间按钮 -->
      <view class="nav-item center-item" @tap="handlePublish">
        <view class="nav-content">
          <view class="publish-button">
            <text class="publish-icon">发布</text>
          </view>
        </view>
      </view>

      <!-- 关注的人 -->
      <view class="nav-item" @tap="handleNavClick('following')">
        <view class="nav-content">
          <view class="nav-icon">
            <image class="icon-img" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
          </view>
          <text class="nav-text">关注的人</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './DiscoverBottomNav.scss'

defineOptions({
  name: 'DiscoverBottomNav'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理导航点击
const handleNavClick = (type) => {
  console.log('点击导航:', type)

  switch(type) {
    case 'featured':
      Taro.showToast({
        title: '精选公开',
        icon: 'none'
      })
      break
    case 'following':
      Taro.showToast({
        title: '关注的人',
        icon: 'none'
      })
      break
  }
}

// 处理发布点击
const handlePublish = () => {
  console.log('点击发布')
  Taro.showToast({
    title: '发布功能即将上线',
    icon: 'none'
  })

  // 这里可以跳转到发布页面或打开发布弹窗
  // Taro.navigateTo({
  //   url: '/pages/publish/publish'
  // })
}
</script>

