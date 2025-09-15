<template>
  <view class="date-banner" :class="themeStore.currentThemeClass">
    <!-- 外层背景容器 -->
    <view class="outer-container">
      <!-- 装饰文字 -->
      <view class="decoration-text">每一天都是新的开始</view>

      <!-- 内层内容卡片 - 占中间区域 -->
      <view class="inner-card">
        <!-- 问候语 -->
        <view class="greeting">{{ getGreeting() }}</view>

        <!-- 日期信息 -->
        <view class="date-info">
          <text class="year-month">{{ currentDate.yearMonth }}</text>
          <view class="day-week">
            <text class="day">{{ currentDate.day }}</text>
            <text class="month">{{ currentDate.monthText }}</text>
            <text class="week">{{ currentDate.week }}</text>
          </view>
        </view>

        <!-- 设置纪念日按钮 -->
        <view class="memorial-btn" @tap="handleMemorialClick">
          <text class="memorial-text">设置纪念日 ></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import './DateBanner.scss'

defineOptions({
  name: 'DateBanner'
})

// 使用主题状态
const themeStore = useThemeStore()

// 当前日期信息
const currentDate = ref({
  yearMonth: '',
  day: '',
  monthText: '',
  week: ''
})

// 获取当前日期信息
const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekDay = now.getDay()

  const weekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  currentDate.value = {
    yearMonth: `乙巳年 七月廿四`,  // 农历示例，可以接入农历API
    day: day.toString(),
    monthText: monthNames[month - 1],
    week: weekNames[weekDay]
  }
}

// 根据时间获取问候语
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
}

// 处理纪念日设置点击
const handleMemorialClick = () => {
  console.log('设置纪念日')
  // 这里可以添加跳转到纪念日设置页面的逻辑
}

onMounted(() => {
  getCurrentDate()
})
</script>
