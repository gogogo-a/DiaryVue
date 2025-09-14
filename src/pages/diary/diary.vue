<template>
  <view class="diary-page bg-default">
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
import Taro from '@tarojs/taro'
import './diary.css'

defineOptions({
  name: 'DiaryPage'
})

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

<style scoped>
.diary-page {
  min-height: 100vh;
  padding-bottom: 80px;
}
.diary-item {
  margin-bottom: 15px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);
}
.action-bar .button,
.action-bar .button-outline {
  flex: 1;
  margin: 0 10px;
}
</style>

