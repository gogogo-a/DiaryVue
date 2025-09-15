<template>
  <view class="account-stats" :class="themeStore.currentThemeClass">
    <!-- 时间筛选区域 -->
    <view class="filter-section">
      <view class="filter-item" @tap="handleDateFilter">
        <text class="filter-text">2025年09月</text>
        <image class="filter-arrow" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
      </view>

      <view class="filter-item" @tap="handleCategoryFilter">
        <text class="filter-text">全部类型</text>
        <image class="filter-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
      </view>

      <view class="filter-item" @tap="handleSummaryFilter">
        <text class="filter-text">汇总</text>
        <image class="filter-icon" src="../../../../assets/svg/diary/calendar.svg" mode="aspectFit" />
      </view>
    </view>

    <!-- 统计数据区域 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-amount">¥0.00</text>
        <text class="stat-label">支出</text>
      </view>

      <view class="stat-item">
        <text class="stat-amount">¥0.00</text>
        <text class="stat-label">收入</text>
      </view>

      <view class="stat-item">
        <text class="stat-amount">¥0.00</text>
        <text class="stat-label">结余</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AccountStats.scss'

defineOptions({
  name: 'AccountStatsComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理日期筛选
const handleDateFilter = () => {
  Taro.showToast({
    title: '日期筛选功能即将上线',
    icon: 'none'
  })
}

// 处理类型筛选
const handleCategoryFilter = () => {
  Taro.showToast({
    title: '类型筛选功能即将上线',
    icon: 'none'
  })
}

// 处理汇总筛选
const handleSummaryFilter = () => {
  Taro.showToast({
    title: '汇总功能即将上线',
    icon: 'none'
  })
}
</script>
