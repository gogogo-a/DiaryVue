<template>
  <view class="account-control-page" :class="themeStore.currentThemeClass">
    <!-- 账本头部信息卡片 -->
    <view class="card margin">
      <AccountHeaderCard />
    </view>

    <!-- 账本列表 -->
    <view class="card margin">
      <AccountList />
    </view>

    <!-- 底部空间预留，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>


  </view>
</template>

<script setup>
import AccountHeaderCard from '../../../components/account_book/control/01/AccountHeaderCard.vue'
import AccountList from '../../../components/account_book/control/02/AccountList.vue'
import TabBar from '../../../components/public/TabBar/TabBar.vue'
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import { useAccountManagementStore } from '../../../stores/account/accountManagement'
import { useBillsManagementStore } from '../../../stores/account/billsManagement'
import './account_control.scss'

defineOptions({
  name: 'AccountControlPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用账本管理状态
const accountStore = useAccountManagementStore()

// 使用账单管理状态
const billsStore = useBillsManagementStore()

// 底部导航栏引用
const tabBar = ref(null)

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 初始化页面数据
const initPageData = async () => {
  try {
    // 1. 获取账本列表
    await accountStore.fetchAccounts()

    // 2. 获取所有账本的统计数据
    if (accountStore.accountList.length > 0) {
      const accountIds = accountStore.accountList.map(account => account.id)
      await billsStore.loadStats(accountIds)
    }

    console.log('✅ 账本控制页面数据加载完成')
  } catch (error) {
    console.error('❌ 账本控制页面数据加载失败:', error)
  }
}

// 页面加载时设置当前激活的标签
onMounted(() => {
  if (tabBar.value) {
    tabBar.value.setActiveTab('index')
  }

  // 初始化页面数据
  initPageData()
})
</script>
