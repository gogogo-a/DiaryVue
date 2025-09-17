<template>
  <view class="account-stats" :class="themeStore.currentThemeClass">
    <!-- 时间筛选区域 -->
    <view class="filter-section">
      <view class="filter-item" @tap="handleDateFilter">
        <text class="filter-text">{{ currentPeriodText }}</text>
        <image class="filter-arrow" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
      </view>

      <view class="filter-item" @tap="handleCategoryFilter">
        <text class="filter-text">全部类型</text>
        <image class="filter-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
      </view>

      <view class="filter-item" @tap="handleSummaryFilter">
        <text class="filter-text">{{ currentPeriod === 'today' ? '今日' : currentPeriod === 'week' ? '本周' : '本月' }}</text>
        <image class="filter-icon" src="../../../../assets/svg/diary/calendar.svg" mode="aspectFit" />
      </view>
    </view>

    <!-- 统计数据区域 -->
    <view class="stats-section">
      <view class="stat-item expense">
        <text class="stat-amount expense-amount">¥{{ formatAmount(currentStats.expense) }}</text>
        <text class="stat-label">支出</text>
        <view class="stat-trend" v-if="showTrend">
          <text class="trend-text" :class="expenseTrend.type">{{ expenseTrend.text }}</text>
        </view>
      </view>

      <view class="stat-item income">
        <text class="stat-amount income-amount">¥{{ formatAmount(currentStats.income) }}</text>
        <text class="stat-label">收入</text>
        <view class="stat-trend" v-if="showTrend">
          <text class="trend-text" :class="incomeTrend.type">{{ incomeTrend.text }}</text>
        </view>
      </view>

      <view class="stat-item balance">
        <text class="stat-amount balance-amount" :class="balanceClass">¥{{ formatAmount(currentStats.balance) }}</text>
        <text class="stat-label">结余</text>
        <view class="stat-progress" v-if="currentStats.income > 0">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progressWidth + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速统计卡片 -->
    <view class="quick-stats" v-if="accountStore.totalRecords > 0">
      <view class="quick-stat-item">
        <text class="quick-stat-number">{{ accountStore.totalRecords }}</text>
        <text class="quick-stat-label">总记录</text>
      </view>
      <view class="quick-stat-item">
        <text class="quick-stat-number">{{ todayRecordCount }}</text>
        <text class="quick-stat-label">今日记录</text>
      </view>
      <view class="quick-stat-item">
        <text class="quick-stat-number">{{ avgDailyExpense }}</text>
        <text class="quick-stat-label">日均支出</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useAccountStore } from '../../../../stores/account'
import Taro from '@tarojs/taro'
import './AccountStats.scss'

defineOptions({
  name: 'AccountStatsComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用记账本状态
const accountStore = useAccountStore()

// 当前统计周期
const currentPeriod = ref('month') // 'today' | 'week' | 'month'

// 是否显示趋势
const showTrend = ref(true)

// 当前周期文本
const currentPeriodText = computed(() => {
  const now = new Date()
  switch (currentPeriod.value) {
    case 'today':
      return `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`
    case 'week':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      return `${weekStart.getFullYear()}年第${Math.ceil(now.getDate() / 7)}周`
    case 'month':
    default:
      return `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月`
  }
})

// 当前统计数据
const currentStats = computed(() => {
  return accountStore.getStatistics(currentPeriod.value)
})

// 今日记录数
const todayRecordCount = computed(() => {
  const today = new Date().toDateString()
  return accountStore.records.filter(record =>
    new Date(record.date).toDateString() === today
  ).length
})

// 日均支出
const avgDailyExpense = computed(() => {
  if (accountStore.totalRecords === 0) return '0'
  const days = Math.max(1, Math.ceil(
    (Date.now() - new Date(accountStore.records[accountStore.records.length - 1]?.date).getTime())
    / (1000 * 60 * 60 * 24)
  ))
  const totalExpense = accountStore.records
    .filter(record => record.type === 'expense')
    .reduce((total, record) => total + record.amount, 0)
  return Math.round(totalExpense / days).toString()
})

// 支出趋势
const expenseTrend = computed(() => {
  // 简化的趋势计算
  const thisWeekExpense = accountStore.getStatistics('week').expense
  const avgWeeklyExpense = currentStats.value.expense * 7 / 30 // 粗略估算

  if (thisWeekExpense > avgWeeklyExpense * 1.1) {
    return { type: 'up', text: '↗ 较高' }
  } else if (thisWeekExpense < avgWeeklyExpense * 0.9) {
    return { type: 'down', text: '↘ 较低' }
  } else {
    return { type: 'stable', text: '→ 平稳' }
  }
})

// 收入趋势
const incomeTrend = computed(() => {
  const thisWeekIncome = accountStore.getStatistics('week').income
  const avgWeeklyIncome = currentStats.value.income * 7 / 30

  if (thisWeekIncome > avgWeeklyIncome * 1.1) {
    return { type: 'up', text: '↗ 较高' }
  } else if (thisWeekIncome < avgWeeklyIncome * 0.9) {
    return { type: 'down', text: '↘ 较低' }
  } else {
    return { type: 'stable', text: '→ 平稳' }
  }
})

// 结余样式类
const balanceClass = computed(() => {
  if (currentStats.value.balance > 0) return 'positive'
  if (currentStats.value.balance < 0) return 'negative'
  return 'neutral'
})

// 进度条宽度
const progressWidth = computed(() => {
  if (currentStats.value.income === 0) return 0
  return Math.min(100, (currentStats.value.expense / currentStats.value.income) * 100)
})

// 格式化金额
const formatAmount = (amount) => {
  return Math.abs(amount).toFixed(2)
}

// 处理日期筛选
const handleDateFilter = () => {
  Taro.showActionSheet({
    itemList: ['今日', '本周', '本月'],
    success: (res) => {
      const periods = ['today', 'week', 'month']
      currentPeriod.value = periods[res.tapIndex]

      Taro.showToast({
        title: `已切换到${['今日', '本周', '本月'][res.tapIndex]}统计`,
        icon: 'none',
        duration: 1500
      })
    }
  })
}

// 处理类型筛选
const handleCategoryFilter = () => {
  Taro.showToast({
    title: '类型筛选功能开发中',
    icon: 'none'
  })
}

// 处理汇总筛选
const handleSummaryFilter = () => {
  const periods = { today: 'week', week: 'month', month: 'today' }
  currentPeriod.value = periods[currentPeriod.value]

  const periodNames = { today: '今日', week: '本周', month: '本月' }
  Taro.showToast({
    title: `已切换到${periodNames[currentPeriod.value]}`,
    icon: 'none',
    duration: 1500
  })
}

// 页面加载时初始化数据
onMounted(() => {
  accountStore.initAccountData()
})
</script>
