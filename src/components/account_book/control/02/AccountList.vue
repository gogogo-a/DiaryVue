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
            <text class="account-icon">{{ account.icon || '💰' }}</text>
            <text class="account-name">{{ account.name }}</text>
          </view>
          <view class="edit-btn" @tap.stop="handleEdit(account)">
            <image class="edit-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
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
            <text class="stats-text">本月支出: ¥{{ formatAmount(getAccountStats(account.id)?.expense || 0) }}</text>
            <text class="stats-text">本月收入: ¥{{ formatAmount(getAccountStats(account.id)?.income || 0) }}</text>
          </view>

          <view class="action-buttons">
            <view class="action-btn delete-btn" @tap.stop="handleDelete(account)">
              <text class="btn-text">删除</text>
            </view>

            <view class="action-btn invite-btn" @tap.stop="handleInvite(account)">
              <text class="btn-text">邀请</text>
              <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
            </view>

            <view class="action-btn enter-btn" @tap.stop="handleEnter(account)">
              <text class="btn-text">进入账本</text>
              <image class="btn-icon" src="../../../../assets/svg/diary/search.svg" mode="aspectFit" />
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { defineOptions, computed, onMounted, ref } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useAccountManagementStore } from '../../../../stores/account/accountManagement'
import accountAPI from '../../../../pages/account_book/control/api_account'
import billsAPI from '../../../../pages/account_book/index/api_bills'
import Taro from '@tarojs/taro'
import './AccountList.scss'

defineOptions({
  name: 'AccountListComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用账本管理状态
const accountManagementStore = useAccountManagementStore()

// 账本统计数据
const accountStats = ref(new Map())

// 计算属性
const accountList = computed(() => accountManagementStore.accountList)
const isLoading = computed(() => accountManagementStore.isLoading)

// 格式化金额显示
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(2)
}

// 获取账本统计数据
const getAccountStats = (accountId) => {
  return accountStats.value.get(accountId)
}

// 获取本月日期范围
const getCurrentMonthRange = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const startTime = new Date(year, month, 1).toISOString().split('T')[0]
  const endTime = new Date(year, month + 1, 0).toISOString().split('T')[0]

  return { startTime, endTime }
}

// 加载单个账本的统计数据
const loadAccountStats = async (accountId) => {
  try {
    const { startTime, endTime } = getCurrentMonthRange()
    const stats = await billsAPI.getBillStats({
      account_book_id: accountId,
      start_time: startTime,
      end_time: endTime
    })

    // 存储统计数据
    accountStats.value.set(accountId, {
      income: stats.total_income || 0,
      expense: stats.total_expense || 0,
      balance: stats.net_amount || 0
    })
  } catch (error) {
    console.error(`获取账本${accountId}统计数据失败:`, error)
    // 设置默认值
    accountStats.value.set(accountId, {
      income: 0,
      expense: 0,
      balance: 0
    })
  }
}

// 批量加载所有账本的统计数据
const loadAllAccountStats = async () => {
  const accounts = accountManagementStore.accountList
  if (accounts.length === 0) return

  console.log('🔄 开始加载账本统计数据...')

  // 并行加载所有账本的统计数据
  const promises = accounts.map(account => loadAccountStats(account.id))
  await Promise.allSettled(promises)

  console.log('✅ 账本统计数据加载完成')
}

// 加载账本列表
const loadAccountList = async () => {
  try {
    await accountManagementStore.fetchAccounts()
    // 账本列表加载完成后，加载统计数据
    await loadAllAccountStats()
  } catch (error) {
    console.error('加载账本列表失败:', error)
    Taro.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  }
}

// 刷新列表
const refreshList = async () => {
  try {
    await accountManagementStore.fetchAccounts()
    // 刷新统计数据
    await loadAllAccountStats()
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

// 组件挂载时加载数据
onMounted(() => {
  loadAccountList()
})

// 暴露方法供父组件调用
defineExpose({
  refreshList,
  loadAccountList
})
</script>
