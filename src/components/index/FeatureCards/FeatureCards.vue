<template>
  <view class="feature-cards">
    <view class="feature-grid">
      <!-- 日记本 -->
      <view class="feature-card" @tap="handleFeatureClick('diary')">
        <view class="icon-wrapper">
          <image class="feature-icon" :src="diaryIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">日记本</text>
      </view>
      
      <!-- 共享日记 -->
      <view class="feature-card" @tap="handleFeatureClick('shareDiary')">
        <view class="icon-wrapper">
          <image class="feature-icon" :src="shareDiaryIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">共享日记</text>
      </view>
      
      <!-- 记账本 -->
      <view class="feature-card" @tap="handleFeatureClick('money')">
        <view class="icon-wrapper">
          <image class="feature-icon" :src="moneyIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">记账本</text>
      </view>
      
      <!-- 切换主题 -->
      <view class="feature-card" @tap="handleFeatureClick('theme')">
        <view class="icon-wrapper">
          <image class="feature-icon" :src="themeIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">切换主题</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './FeatureCards.scss'

// 导入SVG图标
import diaryIcon from '../../../assets/svg/index/diary.svg'
import shareDiaryIcon from '../../../assets/svg/index/share_diary.svg'
import moneyIcon from '../../../assets/svg/index/money.svg'
import themeIcon from '../../../assets/svg/index/theme.svg'

defineOptions({
  name: 'FeatureCardsComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理功能卡片点击
const handleFeatureClick = (feature) => {
  switch(feature) {
    case 'diary':
      Taro.navigateTo({
        url: '/pages/diary/diary'
      })
      break
    case 'shareDiary':
      Taro.showToast({
        title: '共享日记功能即将上线',
        icon: 'none'
      })
      break
    case 'money':
      Taro.showToast({
        title: '记账本功能即将上线',
        icon: 'none'
      })
      break
    case 'theme':
      themeStore.toggleTheme()
      Taro.showToast({
        title: themeStore.currentTheme === 'default' ? '已切换到默认主题' : '已切换到怀旧主题',
        icon: 'none'
      })
      break
  }
}
</script> 