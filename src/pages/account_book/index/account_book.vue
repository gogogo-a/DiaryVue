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

    <!-- 账本列表区域 -->
    <!-- <view class="card margin">
      <view class="empty-state">
        <text class="empty-text">暂无记账记录</text>
        <text class="empty-tip">点击底部"记一笔"开始记账</text>
      </view>
    </view> -->

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
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './account_book.scss'

defineOptions({
  name: 'AccountBookPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 页面功能已集成到底部导航组件中
</script>
