<template>
  <view class="account-list" :class="themeStore.currentThemeClass">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!accountList.length" class="empty-container">
      <text class="empty-text">暂无账本，点击上方按钮创建第一个账本吧</text>
    </view>

    <!-- 账本列表 -->
    <view v-else>
      <view
        v-for="account in accountList"
        :key="account.id"
        class="account-card"
        @tap="handleAccountClick(account)"
      >
        <view class="card-header">
          <view class="account-info">
            <view class="account-icon">{{ account.icon || '💰' }}</view>
            <text class="account-name">{{ account.name }}</text>
          </view>
          <view class="edit-btn" @tap.stop="handleEdit(account)">
            <text class="edit-icon-text">✏️</text>
          </view>
        </view>

        <view class="card-content">
          <view class="participant-info">
            <view class="avatar-group">
              <image
                v-for="(member, index) in account.members?.slice(0, 3)"
                :key="member.id"
                class="avatar"
                :src="member.avatar || '../../../../assets/images/test1.webp'"
                mode="aspectFit"
                :style="{ zIndex: 3 - index, marginLeft: index > 0 ? '-8px' : '0' }"
              />
            </view>
            <text class="participant-count">{{ account.member_count || 0 }}人参加</text>
          </view>

          <view class="account-stats">
            <view class="stats-text" data-value="¥{{ formatAmount(getAccountStats(account.id)?.total_expense || 0) }}">本月支出</view>
            <view class="stats-text" data-value="¥{{ formatAmount(getAccountStats(account.id)?.total_income || 0) }}">本月收入</view>
          </view>

          <view class="action-buttons">
            <view class="action-btn delete-btn" @tap.stop="handleDelete(account)">
              <text class="btn-text">删除</text>
            </view>

            <view class="action-btn invite-btn" @tap.stop="handleInvite(account)">
              <text class="btn-text">邀请</text>
              <text class="btn-icon-text">👥</text>
            </view>

            <view class="action-btn enter-btn" @tap.stop="handleEnter(account)">
              <text class="btn-text">进入账本</text>
              <text class="btn-icon-text">➡️</text>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { defineOptions, computed } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useAccountManagementStore } from '../../../../stores/account/accountManagement'
import { useBillsManagementStore } from '../../../../stores/account/billsManagement'
import accountAPI from '../../../../pages/account_book/control/api_account'
import Taro from '@tarojs/taro'
import './AccountList.scss'

defineOptions({
  name: 'AccountListComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用账本管理状态
const accountManagementStore = useAccountManagementStore()

// 使用账单管理状态
const billsStore = useBillsManagementStore()

// 计算属性
const accountList = computed(() => accountManagementStore.accountList)
const isLoading = computed(() => accountManagementStore.isLoading)

// 格式化金额显示
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(2)
}

// 获取账本统计数据 - 直接访问ref
const getAccountStats = (accountId) => {
  const data = billsStore.statsDataMap.get(accountId)
  if (!data) {
    return { income: 0, expense: 0, balance: 0 }
  }

  return {
    income: data.total_income || 0,
    expense: data.total_expense || 0,
    balance: data.net_amount || 0
  }
}

// 注意：统计数据现在由父组件 account_control.vue 负责加载

// 刷新列表
const refreshList = async () => {
  try {
    await accountManagementStore.fetchAccounts()
    // 刷新统计数据（通过父组件的 billsStore）
    if (accountManagementStore.accountList.length > 0) {
      const accountIds = accountManagementStore.accountList.map(account => account.id)
      await billsStore.loadStats(accountIds)
    }
  } catch (error) {
    console.error('刷新列表失败:', error)
    Taro.showToast({
      title: error.message || '刷新失败',
      icon: 'none'
    })
  }
}

// 处理账本点击
const handleAccountClick = (account) => {
  console.log('账本点击:', account)
  // 可以跳转到账本详情页或直接进入账本
  handleEnter(account)
}

// 处理编辑
const handleEdit = async (account) => {
  try {
    const result = await Taro.showModal({
      title: '编辑账本',
      content: '请输入新的账本名称',
      editable: true,
      placeholderText: account.name
    })

    if (result.confirm && result.content && result.content.trim() !== account.name) {
      const updates = {
        name: result.content.trim()
      }

      // 直接调用API
      const updatedAccount = await accountAPI.updateAccount(account.id, updates)

      // 更新store中的数据
      accountManagementStore.updateAccount(account.id, updatedAccount)

      Taro.showToast({
        title: '更新成功',
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('编辑账本失败:', error)
    Taro.showToast({
      title: error.message || '编辑失败',
      icon: 'none'
    })
  }
}

// 处理删除
const handleDelete = async (account) => {
  try {
    const result = await Taro.showModal({
      title: '确认删除',
      content: `确定要删除账本"${account.name}"吗？删除后无法恢复。`,
      confirmColor: '#FF6B6B'
    })

    if (result.confirm) {
      // 直接调用API
      await accountAPI.deleteAccount(account.id)

      // 更新store中的数据
      accountManagementStore.removeAccount(account.id)

      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('删除账本失败:', error)
    Taro.showToast({
      title: error.message || '删除失败',
      icon: 'none'
    })
  }
}

// 处理邀请
const handleInvite = async (account) => {
  try {
    // 直接调用API生成邀请链接
    const inviteResult = await accountAPI.generateInviteLink(account.id, {
      expires_in: 86400, // 24小时
      role: 'member'
    })

    // 显示邀请链接或二维码
    await Taro.showModal({
      title: '邀请链接已生成',
      content: `邀请码: ${inviteResult.invite_code}\n\n请将此邀请码分享给朋友`,
      showCancel: true,
      cancelText: '复制',
      confirmText: '确定',
      success: (res) => {
        if (res.cancel) {
          // 复制邀请码到剪贴板
          Taro.setClipboardData({
            data: inviteResult.invite_code,
            success: () => {
              Taro.showToast({
                title: '邀请码已复制',
                icon: 'success'
              })
            }
          })
        }
      }
    })

  } catch (error) {
    console.error('生成邀请链接失败:', error)
    Taro.showToast({
      title: error.message || '邀请功能暂时不可用',
      icon: 'none'
    })
  }
}

// 处理进入账本
const handleEnter = (account) => {
  Taro.navigateTo({
    url: `/pages/account_book/index/account_book?accountId=${account.id}&name=${encodeURIComponent(account.name)}`
  })
}

// 数据加载由父组件 account_control.vue 负责

// 暴露方法供父组件调用
defineExpose({
  refreshList
})
</script>
