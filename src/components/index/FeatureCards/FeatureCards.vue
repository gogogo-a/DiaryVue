<template>
  <view class="feature-cards">
    <view class="feature-grid">
      <!-- 日记本 -->
      <view class="feature-card diary-card" @tap="handleFeatureClick('diary')">
        <view class="icon-wrapper diary-icon">
          <image class="feature-icon" :src="diaryIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">日记本</text>
      </view>

      <!-- 共享日记 -->
      <view class="feature-card share-card" @tap="handleFeatureClick('shareDiary')">
        <view class="icon-wrapper share-icon">
          <image class="feature-icon" :src="shareDiaryIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">共享日记</text>
      </view>

      <!-- 记账本 -->
      <view class="feature-card money-card" @tap="handleFeatureClick('money')">
        <view class="icon-wrapper money-icon">
          <image class="feature-icon" :src="moneyIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">记账本</text>
      </view>

      <!-- 打卡 -->
      <view class="feature-card checkin-card" @tap="handleFeatureClick('checkin')">
        <view class="icon-wrapper checkin-icon">
          <image class="feature-icon" :src="checkinIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">打卡</text>
      </view>

      <!-- 待办 -->
      <view class="feature-card todo-card" @tap="handleFeatureClick('todo')">
        <view class="icon-wrapper todo-icon">
          <image class="feature-icon" :src="todoIcon" mode="aspectFit" />
        </view>
        <text class="feature-title">待办</text>
      </view>

      <!-- 切换主题 -->
      <view class="feature-card theme-card" @tap="handleFeatureClick('theme')">
        <view class="icon-wrapper theme-icon">
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
import checkinIcon from '../../../assets/svg/diary/calendar.svg' // 使用日历图标代表打卡
import todoIcon from '../../../assets/svg/index/pen.svg' // 使用笔图标代表待办
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
      Taro.navigateTo({
        url: '/pages/account_book/index/account_book'
      })
      break
    case 'checkin':
      Taro.showToast({
        title: '打卡功能即将上线',
        icon: 'none'
      })
      break
    case 'todo':
      Taro.showToast({
        title: '待办功能即将上线',
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
