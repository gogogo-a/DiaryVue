<template>
  <view class="mine-stats" :class="themeStore.currentThemeClass">
    <view class="stats-grid">
      <view class="stat-item" @tap="handleStatTap('diary')">
        <view class="stat-number">{{ stats.diaryDays }}</view>
        <view class="stat-label">记录天数</view>
      </view>

      <view class="stat-item" @tap="handleStatTap('entries')">
        <view class="stat-number">{{ stats.diaryEntries }}</view>
        <view class="stat-label">日记数</view>
      </view>

      <view class="stat-item" @tap="handleStatTap('words')">
        <view class="stat-number">{{ stats.totalWords }}</view>
        <view class="stat-label">总字数</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, reactive } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './MineStats.scss'

defineOptions({
  name: 'MineStats'
})

// 使用主题状态
const themeStore = useThemeStore()

// 统计数据
const stats = reactive({
  diaryDays: 1,      // 记录天数
  diaryEntries: 1,   // 日记数
  totalWords: 3      // 总字数 (这里显示为3是对应图片中的数字)
})

// 处理统计项点击
const handleStatTap = (type) => {
  let message = ''
  switch(type) {
    case 'diary':
      message = `已记录 ${stats.diaryDays} 天日记`
      break
    case 'entries':
      message = `共写了 ${stats.diaryEntries} 篇日记`
      break
    case 'words':
      message = `累计写了 ${stats.totalWords} 个字`
      break
  }

  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}
</script>

