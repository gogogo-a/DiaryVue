<template>
  <view class="account-header-card" :class="themeStore.currentThemeClass">
    <view class="header-section">
      <text class="page-title">我的账本</text>
      <text class="page-subtitle">轻松管理您的财务记录</text>
      <view class="title-underline"></view>
    </view>

    <view class="action-section">
      <view class="add-account-btn" @tap="handleAddAccount">
        <text class="add-btn-text">+ 账本</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useAccountManagementStore } from '../../../../stores/account/accountManagement'
import accountAPI from '../../../../pages/account_book/control/api_account'
import Taro from '@tarojs/taro'
import './AccountHeaderCard.scss'

defineOptions({
  name: 'AccountHeaderCardComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用账本管理状态
const accountManagementStore = useAccountManagementStore()

// 加载状态
const isLoading = ref(false)

// 处理添加账本
const handleAddAccount = async () => {
  try {
    // 显示输入框让用户输入账本名称
    const result = await Taro.showModal({
      title: '创建账本',
      content: '请输入账本名称',
      editable: true,
      placeholderText: '如：家庭账本、旅游账本等'
    })

    if (result.confirm && result.content) {
      isLoading.value = true

      // 直接调用API创建账本
      const accountData = {
        name: result.content.trim(),
        description: `${result.content.trim()}的记账本`,
        currency: 'CNY',
        icon: '💰',
        color: '#4ECDC4'
      }

      const newAccount = await accountAPI.createAccount(accountData)

      // 更新store中的数据
      accountManagementStore.addAccount(newAccount)

      Taro.showToast({
        title: '账本创建成功',
        icon: 'success'
      })

      console.log('新账本创建成功:', newAccount)

      // 可以跳转到新创建的账本页面
      setTimeout(() => {
        Taro.navigateTo({
          url: `/pages/account_book/index/account_book?id=${newAccount.id}`
        })
      }, 1000)

    }
  } catch (error) {
    console.error('创建账本失败:', error)
    Taro.showToast({
      title: error.message || '创建失败，请重试',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
