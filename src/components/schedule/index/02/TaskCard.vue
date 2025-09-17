<template>
  <view class="task-card" :class="themeStore.currentThemeClass">
    <view class="card-header">
      <view class="task-number">{{ String(task.id).padStart(3, '0') }}</view>
      <view class="task-options">
        <view class="repeat-option" v-if="task.isRepeating">
          <view class="repeat-icon">🔄</view>
          <text class="repeat-text">{{ task.isRepeating ? '重复' : '不重复' }}</text>
        </view>
        <view class="more-btn" @tap="handleMoreOptions">
          <text class="more-icon">⋯</text>
          <text class="more-text">操作</text>
        </view>
      </view>
    </view>

    <view class="card-content">
      <view class="task-title" @tap="handleTaskClick">{{ task.title }}</view>
      <view class="task-description" v-if="task.description">{{ task.description }}</view>

      <view class="progress-section">
        <text class="progress-label">完成进度:</text>
        <text class="progress-value">{{ task.completedCount }}/{{ task.totalCount }}</text>
      </view>
    </view>

    <view class="card-footer">
      <view class="add-subtask-input">
        <input
          class="subtask-input"
          placeholder="添加新的待办事项"
          v-model="newSubtask"
          @confirm="handleAddSubtask"
        />
        <view class="add-subtask-btn" @tap="handleAddSubtask">
          <text class="add-btn-text">添加</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './TaskCard.scss'

defineOptions({
  name: 'TaskCard'
})

// Props
const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: '默认任务',
      description: '',
      isRepeating: false,
      completedCount: 0,
      totalCount: 0,
      subtasks: []
    })
  }
})

// 使用主题状态
const themeStore = useThemeStore()

// 定义事件
const emit = defineEmits(['taskClick', 'moreOptions', 'addSubtask'])

// 响应式数据
const newSubtask = ref('')

// 处理任务点击
const handleTaskClick = () => {
  emit('taskClick', props.task)
}

// 处理更多选项
const handleMoreOptions = () => {
  emit('moreOptions', props.task)
}

// 处理添加子任务
const handleAddSubtask = () => {
  if (!newSubtask.value.trim()) {
    Taro.showToast({
      title: '请输入待办事项内容',
      icon: 'none',
      duration: 1500
    })
    return
  }

  emit('addSubtask', {
    taskId: props.task.id,
    content: newSubtask.value.trim()
  })

  // 清空输入框
  newSubtask.value = ''
}
</script>
