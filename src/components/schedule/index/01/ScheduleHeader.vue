<template>
  <view class="schedule-header" :class="themeStore.currentThemeClass">
    <view class="header-content">
      <view class="title-section">
        <view class="main-title">我的待办事项</view>
        <view class="sub-title">轻松管理您的日常任务</view>
      </view>
      <view class="action-section">
        <view class="add-task-btn" @tap="handleAddTask">
          <text class="add-icon">+</text>
          <text class="add-text">任务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import './ScheduleHeader.scss'

defineOptions({
  name: 'ScheduleHeader'
})

// 使用主题状态
const themeStore = useThemeStore()

// 定义事件
const emit = defineEmits(['addTask'])

// 处理添加任务
const handleAddTask = () => {
  emit('addTask')
}
</script>
