<template>
  <view class="record-list" :class="themeStore.currentThemeClass">
    <!-- 记录列表 -->
    <view v-if="accountStore.totalRecords > 0" class="records-container">
      <view
        v-for="dateGroup in accountStore.recordsByDate"
        :key="dateGroup.date"
        class="date-group"
      >
        <!-- 日期分组头部 -->
        <view class="date-header">
          <view class="date-info">
            <text class="date-text">{{ formatDateHeader(dateGroup.date) }}</text>
            <text class="weekday-text">{{ getWeekday(dateGroup.date) }}</text>
          </view>
          <view class="date-summary">
            <text class="expense-summary" v-if="dateGroup.totalExpense > 0">
              支出 ¥{{ formatAmount(dateGroup.totalExpense) }}
            </text>
            <text class="income-summary" v-if="dateGroup.totalIncome > 0">
              收入 ¥{{ formatAmount(dateGroup.totalIncome) }}
            </text>
          </view>
        </view>

        <!-- 记录列表 -->
        <view class="records-list">
          <view
            v-for="record in dateGroup.records"
            :key="record.id"
            class="record-item"
            @tap="handleRecordClick(record)"
            @longpress="handleRecordLongPress(record)"
          >
            <view class="record-icon">
              <text class="category-icon">{{ record.categoryIcon }}</text>
            </view>

            <view class="record-content">
              <view class="record-main">
                <text class="category-name">{{ record.categoryName }}</text>
                <text class="record-amount" :class="record.type">
                  {{ record.type === 'expense' ? '-' : '+' }}¥{{ formatAmount(record.amount) }}
                </text>
              </view>

              <view class="record-meta" v-if="record.note">
                <text class="record-note">{{ record.note }}</text>
              </view>
            </view>

            <view class="record-actions">
              <text class="record-time">{{ formatTime(record.date) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <view class="empty-content">
        <view class="empty-icon">💰</view>
        <view class="empty-title">还没有记账记录</view>
        <view class="empty-description">点击下方"记一笔"开始记账吧</view>
        <view class="empty-action">
          <view class="start-record-btn" @tap="handleStartRecord">
            <text class="start-text">开始记账</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useAccountStore } from '../../../../stores/account'
import Taro from '@tarojs/taro'
import './RecordList.scss'

defineOptions({
  name: 'RecordList'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用记账本状态
const accountStore = useAccountStore()

// 定义事件
const emit = defineEmits(['recordClick', 'startRecord'])

// 格式化日期头部
const formatDateHeader = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}月${day}日`
  }
}

// 获取星期
const getWeekday = (dateString) => {
  const date = new Date(dateString)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}

// 格式化时间
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 格式化金额
const formatAmount = (amount) => {
  return Math.abs(amount).toFixed(2)
}

// 处理记录点击
const handleRecordClick = (record) => {
  console.log('点击记录:', record)
  emit('recordClick', record)
}

// 处理记录长按
const handleRecordLongPress = (record) => {
  console.log('长按记录:', record)

  Taro.showActionSheet({
    itemList: ['编辑', '删除'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          handleEditRecord(record)
          break
        case 1:
          handleDeleteRecord(record)
          break
      }
    }
  })
}

// 编辑记录
const handleEditRecord = (record) => {
  Taro.showToast({
    title: '编辑功能开发中',
    icon: 'none'
  })
}

// 删除记录
const handleDeleteRecord = (record) => {
  Taro.showModal({
    title: '确认删除',
    content: `确定要删除这条${record.type === 'expense' ? '支出' : '收入'}记录吗？`,
    success: (res) => {
      if (res.confirm) {
        const success = accountStore.deleteRecord(record.id)
        if (success) {
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
        } else {
          Taro.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 开始记账
const handleStartRecord = () => {
  emit('startRecord')
}
</script>
