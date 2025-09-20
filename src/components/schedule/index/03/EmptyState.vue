<template>
  <view class="empty-state" :class="themeStore.currentThemeClass">
    <view class="empty-content">
      <view class="empty-icon">📝</view>
      <view class="empty-title">暂无待办事项，请添加</view>
      <view class="empty-description">开始管理您的日常任务，提高工作效率</view>
      <view class="empty-action">
        <view class="create-task-btn" @tap="handleCreateTask">
          <text class="create-text">创建第一个任务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import './EmptyState.scss'

defineOptions({
  name: 'EmptyState'
})

// 使用主题状态
const themeStore = useThemeStore()

// 定义事件
const emit = defineEmits(['createTask'])

// 处理创建任务
const handleCreateTask = () => {
  emit('createTask')
}
</script>





