<template>
  <view class="account-book-page" :class="themeStore.currentThemeClass">
    <!-- 账本头部信息组件 -->
    <view class="card margin">
      <AccountHeader />
    </view>

    <!-- 账本统计组件 -->
    <view class="card margin">
      <AccountStats />
    </view>

    <!-- 记账记录列表 -->
    <view class="card margin">
      <RecordList @startRecord="handleStartRecord" @recordClick="handleRecordClick" />
    </view>

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 记账本专用底部导航栏 -->
    <AccountBottomNav />
  </view>
</template>

<script setup>
import AccountHeader from '../../../components/account_book/index/01/AccountHeader.vue'
import AccountStats from '../../../components/account_book/index/02/AccountStats.vue'
import AccountBottomNav from '../../../components/account_book/index/03/AccountBottomNav.vue'
import RecordList from '../../../components/account_book/index/04/RecordList.vue'
import { defineOptions, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import { useAccountStore } from '../../../stores/account'
import Taro from '@tarojs/taro'
import './account_book.scss'

defineOptions({
  name: 'AccountBookPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用记账本状态
const accountStore = useAccountStore()

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 处理开始记账
const handleStartRecord = () => {
  Taro.navigateTo({
    url: '/pages/account_book/add/add_record'
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

// 页面加载时初始化数据
onMounted(() => {
  accountStore.initAccountData()
})
</script>
