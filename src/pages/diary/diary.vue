<template>
  <view class="diary-page" :class="themeStore.currentThemeClass">
    <view class="title-text text-center margin">我的日记</view>
    <view class="content margin">
      <view class="card diary-item" @tap="viewDiary">
        <view class="subtitle-text">今天的日记</view>
        <view class="tip-text">2025-09-13</view>
        <view class="body-text">这是一个使用Taro和Vue 3的日记应用示例...</view>
      </view>
      
      <view class="card diary-item" @tap="viewDiary">
        <view class="subtitle-text">昨天的回忆</view>
        <view class="tip-text">2025-09-12</view>
        <view class="body-text">今天学习了如何使用Taro框架开发小程序...</view>
      </view>
    </view>
    
    <view class="action-bar">
      <view class="button" @tap="addNewDiary">添加日记</view>
      <view class="button-outline" @tap="goBack">返回首页</view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../stores/theme'
import Taro from '@tarojs/taro'
import './diary.scss'

defineOptions({
  name: 'DiaryPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

const goBack = () => {
  Taro.navigateBack()
}

const viewDiary = () => {
  Taro.showToast({
    title: '查看日记详情',
    icon: 'none'
  })
}

const addNewDiary = () => {
  Taro.showToast({
    title: '添加新日记',
    icon: 'success'
  })
}
</script>

