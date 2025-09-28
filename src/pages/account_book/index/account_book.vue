<template>
  <view class="account-book-page" :class="themeStore.currentThemeClass">
    <!-- 加载状态 -->
    <view v-if="billsStore.isLoading" class="loading-container">
      <text>加载中...</text>
    </view>

    <!-- 内容区域 -->
    <template v-else>
      <!-- 账本统计 -->
      <view class="stats-card">
        <view class="stats-header">
          <text class="stats-title">本月统计</text>
          <text class="stats-period">{{ getCurrentMonth() }}</text>
        </view>

        <view class="stats-content" v-if="statsInfo">
          <view class="stats-row">
            <view class="stat-item income">
              <view class="stat-icon">💰</view>
              <view class="stat-info">
                <text class="stat-label">收入</text>
                <text class="stat-amount">¥{{ formatAmount(statsInfo.total_income) }}</text>
              </view>
            </view>

            <view class="stat-item expense">
              <view class="stat-icon">💸</view>
              <view class="stat-info">
                <text class="stat-label">支出</text>
                <text class="stat-amount">¥{{ formatAmount(statsInfo.total_expense) }}</text>
              </view>
            </view>
          </view>

          <view class="stats-balance">
            <text class="balance-label">结余</text>
            <text class="balance-amount" :class="balanceClass">
              ¥{{ formatAmount(statsInfo.net_amount) }}
            </text>
          </view>

          <!-- 分类统计 -->
          <view class="tag-stats" v-if="tagStatsArray.length > 0">
            <text class="tag-stats-title">分类统计</text>
            <view class="tag-stats-list">
              <view
                v-for="(tagStat, index) in tagStatsArray"
                :key="index"
                class="tag-stat-item"
              >
                <text class="tag-name">{{ tagStat.name }}</text>
                <text class="tag-amount">¥{{ formatAmount(tagStat.amount) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="stats-loading" v-else>
          <text>统计数据加载中...</text>
        </view>
      </view>

      <!-- 记账记录列表 -->
      <view class="records-card">
        <view class="records-header">
          <text class="records-title">记账明细</text>
          <text class="records-count">共{{ billsStore.billsList.length }}条记录</text>
        </view>

        <RecordList
          :bills="billsStore.billsList"
          @startRecord="handleStartRecord"
          @recordClick="handleRecordClick"
          @recordDeleted="handleRecordDeleted"
        />
      </view>
    </template>

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 记账本专用底部导航栏 -->
    <AccountBottomNav :accountId="accountId" />
  </view>
</template>

<script setup>
import AccountBottomNav from '../../../components/account_book/index/03/AccountBottomNav.vue'
import RecordList from '../../../components/account_book/index/04/RecordList.vue'
import { defineOptions, ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import { useBillsManagementStore } from '../../../stores/account/billsManagement'
import Taro from '@tarojs/taro'
import './account_book.scss'

defineOptions({
  name: 'AccountBookPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用账单管理状态
const billsStore = useBillsManagementStore()

// 当前账本ID
const accountId = ref('')

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 获取账本ID
const getAccountId = () => {
  const pages = Taro.getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage?.options || {}

  if (options.accountId) {
    accountId.value = options.accountId
    return options.accountId
  }

  Taro.showToast({
    title: '账本ID缺失',
    icon: 'error'
  })
  setTimeout(() => Taro.navigateBack(), 2000)
  return null
}

// 初始化数据
const initPageData = async () => {
  const id = getAccountId()
  if (!id) return

  try {
    // 1. 先获取标签字典
    await billsStore.fetchTagsDict()

    // 2. 获取账单列表
    await billsStore.fetchBills({ account_book_id: id })

    // 3. 获取统计数据 (自动缓存)
    await billsStore.loadStats(id)
  } catch (error) {
    Taro.showToast({
      title: '加载数据失败',
      icon: 'error'
    })
  }
}

// 获取当前月份
const getCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}年${month}月`
}

// 格式化金额
const formatAmount = (amount) => {
  return Math.abs(Number(amount) || 0).toFixed(2)
}

// 统计数据 - 直接访问ref
const statsInfo = computed(() => {
  if (!accountId.value) return null
  return billsStore.statsDataMap.get(accountId.value)
})

// 分类统计数组
const tagStatsArray = computed(() => {
  if (!statsInfo.value?.tag_stats) return []

  return Object.entries(statsInfo.value.tag_stats).map(([name, amount]) => ({
    name,
    amount: Math.abs(amount)
  })).sort((a, b) => b.amount - a.amount) // 按金额降序排列
})

// 结余样式类
const balanceClass = computed(() => {
  if (!statsInfo.value) return ''
  const balance = statsInfo.value.net_amount || 0
  if (balance > 0) return 'positive'
  if (balance < 0) return 'negative'
  return 'neutral'
})

// 处理开始记账
const handleStartRecord = () => {
  if (!accountId.value) {
    Taro.showToast({
      title: '账本ID不存在',
      icon: 'error'
    })
    return
  }

  Taro.navigateTo({
    url: `/pages/account_book/add/add_record?accountId=${accountId.value}`
  })
}

// 处理记录点击
const handleRecordClick = (record) => {
  Taro.showToast({
    title: '记录详情功能开发中',
    icon: 'none'
  })
}

// 处理记录删除
const handleRecordDeleted = async (recordId) => {
  try {
    Taro.showLoading({
      title: '删除中...'
    })

    await billsStore.deleteBill(recordId)

    Taro.hideLoading()

    Taro.showToast({
      title: '删除成功',
      icon: 'success'
    })
  } catch (error) {
    Taro.hideLoading()

    Taro.showToast({
      title: '删除失败，请重试',
      icon: 'none'
    })
  }
}

// 页面初始化
onMounted(() => {
  initPageData()
})

// 页面卸载时清除store中的数据
onUnmounted(() => {
  billsStore.clearAllData()
})
</script>
