<template>
  <view class="dev-page">
    <view class="dev-page__header">
      <view class="dev-page__title">开发者页面</view>
      <view class="dev-page__subtitle">当前版本: {{ appVersion }}</view>
    </view>

    <view class="dev-page__content">
      <block v-if="devPagesList.length > 0">
        <view 
          v-for="page in devPagesList" 
          :key="page.id" 
          class="dev-page__item"
          @tap="handleNavigate(page.path)"
        >
          <view class="dev-page__item-content">
            <view class="dev-page__item-title">{{ page.title }}</view>
            <view class="dev-page__item-desc">{{ page.description }}</view>
          </view>
          <view class="dev-page__item-arrow">
            <text class="iconfont icon-arrow-right">›</text>
          </view>
        </view>
      </block>

      <view v-else class="dev-page__empty">
        <view class="dev-page__empty-text">暂无开发中的页面</view>
      </view>
    </view>

    <view class="dev-page__footer">
      <view class="dev-page__footer-text">仅用于开发调试</view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import './dev_page.scss'
import { getDevPages } from '../../../utils/devPages'

defineOptions({
  name: 'DevPage'
})

// 状态定义
const appVersion = ref('1.0.0')
const devPagesList = ref([])

// 获取应用版本信息
const getAppVersion = () => {
  try {
    const accountInfo = Taro.getAccountInfoSync()
    if (accountInfo && accountInfo.miniProgram) {
      appVersion.value = accountInfo.miniProgram.version || '1.0.0'
    }
  } catch (error) {
    console.error('获取版本信息失败:', error)
  }
}

// 获取开发页面列表
const fetchDevPages = () => {
  devPagesList.value = getDevPages()
}

// 页面跳转处理
const handleNavigate = (path) => {
  Taro.navigateTo({
    url: path,
    success: () => {
      console.log('跳转成功:', path)
    },
    fail: (error) => {
      console.error('跳转失败:', error)
      Taro.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

// 生命周期钩子
onMounted(() => {
  getAppVersion()
  fetchDevPages()
})
</script>
