<template>
  <view class="account-book-page" :class="themeStore.currentThemeClass">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text>加载中...</text>
    </view>

    <!-- 内容区域 -->
    <template v-else>
      <!-- 账本头部信息组件 -->
      <view class="card margin">
        <AccountHeader :account="accountData" />
      </view>

      <!-- 账本统计组件 -->
      <view class="card margin">
        <AccountStats :stats="statsData" />
      </view>

      <!-- 记账记录列表 -->
      <view class="card margin">
        <RecordList
          :bills="billsList"
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
import AccountHeader from '../../../components/account_book/index/01/AccountHeader.vue'
import AccountStats from '../../../components/account_book/index/02/AccountStats.vue'
import AccountBottomNav from '../../../components/account_book/index/03/AccountBottomNav.vue'
import RecordList from '../../../components/account_book/index/04/RecordList.vue'
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import accountAPI from '../control/api_account'
import billsAPI from './api_bills'
import Taro from '@tarojs/taro'
import './account_book.scss'

defineOptions({
  name: 'AccountBookPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 页面状态
const loading = ref(true)
const accountData = ref(null)
const billsList = ref([])
const statsData = ref(null)
const accountId = ref('')

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 简单获取账本ID
const getAccountId = () => {
  const pages = Taro.getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage?.options || {}

  console.log('📝 页面参数:', options)

  if (options.accountId) {
    accountId.value = options.accountId
    console.log('✅ 获取到账本ID:', options.accountId)
    return options.accountId
  }

  console.error('❌ 没有找到账本ID')
  Taro.showToast({
    title: '账本ID缺失',
    icon: 'error'
  })
  setTimeout(() => Taro.navigateBack(), 2000)
  return null
}

// 加载账本数据
const loadAccountData = async (id) => {
  try {
    const account = await accountAPI.getAccountDetail(id)
    accountData.value = account
  } catch (error) {
    console.error('获取账本信息失败:', error)
  }
}

// 加载账单列表
const loadBillsList = async (id) => {
  try {
    const result = await billsAPI.getBills({
      account_book_id: id,
      page: 1,
      page_size: 50 // 暂时加载更多数据
    })
    billsList.value = result.list || []
  } catch (error) {
    console.error('获取账单列表失败:', error)
  }
}

// 加载统计数据
const loadStatsData = async (id) => {
  try {
    const stats = await billsAPI.getBillStats({
      account_book_id: id
    })
    statsData.value = stats
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 初始化数据
const initPageData = async () => {
  const id = getAccountId()
  if (!id) return

  loading.value = true
  console.log('🚀 开始加载账本数据:', id)

  try {
    // 并行加载所有数据
    await Promise.all([
      loadAccountData(id),
      loadBillsList(id),
      loadStatsData(id)
    ])
    console.log('✅ 页面数据加载完成')
  } catch (error) {
    console.error('❌ 页面数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

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
  console.log('查看记录详情:', record)
  Taro.showToast({
    title: '记录详情功能开发中',
    icon: 'none'
  })
}

// 处理记录删除
const handleRecordDeleted = async (recordId) => {
  console.log('记录已删除:', recordId)

  // 从本地列表中移除
  billsList.value = billsList.value.filter(bill => bill.id !== recordId)

  // 重新加载统计数据
  if (accountId.value) {
    try {
      await loadStatsData(accountId.value)
    } catch (error) {
      console.error('刷新统计数据失败:', error)
    }
  }
}

// 页面初始化
onMounted(() => {
  console.log('📱 页面挂载，开始初始化')
  initPageData()
})
</script>
