<template>
  <!-- 添加任务弹窗 -->
  <view class="add-task-modal" v-if="visible" @tap="handleClose">
    <view class="modal-content" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">添加新任务</text>
        <view class="close-btn" @tap="handleClose">✕</view>
      </view>

      <view class="modal-body">
        <view class="input-group">
          <text class="input-label">任务标题</text>
          <input
            class="task-input"
            placeholder="请输入任务标题"
            v-model="taskData.title"
            maxlength="50"
          />
        </view>

        <view class="input-group">
          <text class="input-label">任务描述（可选）</text>
          <textarea
            class="task-textarea"
            placeholder="请输入任务描述"
            v-model="taskData.description"
            maxlength="200"
          />
        </view>

        <view class="input-group">
          <text class="input-label">优先级</text>
          <view class="priority-options">
            <view
              class="priority-option"
              :class="{ active: taskData.priority === 'high' }"
              @tap="taskData.priority = 'high'"
            >
              <text class="priority-text">高</text>
            </view>
            <view
              class="priority-option"
              :class="{ active: taskData.priority === 'normal' }"
              @tap="taskData.priority = 'normal'"
            >
              <text class="priority-text">中</text>
            </view>
            <view
              class="priority-option"
              :class="{ active: taskData.priority === 'low' }"
              @tap="taskData.priority = 'low'"
            >
              <text class="priority-text">低</text>
            </view>
          </view>
        </view>

        <view class="input-group">
          <view class="checkbox-group">
            <view class="checkbox-item" @tap="taskData.isRepeating = !taskData.isRepeating">
              <view class="checkbox" :class="{ checked: taskData.isRepeating }">
                <text class="check-icon" v-if="taskData.isRepeating">✓</text>
              </view>
              <text class="checkbox-label">重复任务</text>
            </view>
          </view>
        </view>
      </view>

      <view class="modal-footer">
        <view class="cancel-btn" @tap="handleClose">
          <text class="btn-text">取消</text>
        </view>
        <view class="confirm-btn" @tap="handleConfirm">
          <text class="btn-text">创建</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, watch } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './AddTaskModal.scss'

defineOptions({
  name: 'AddTaskModal'
})

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 使用主题状态
const themeStore = useThemeStore()

// 定义事件
const emit = defineEmits(['close', 'confirm'])

// 任务数据
const taskData = ref({
  title: '',
  description: '',
  priority: 'normal',
  isRepeating: false
})

// 重置表单数据
const resetForm = () => {
  taskData.value = {
    title: '',
    description: '',
    priority: 'normal',
    isRepeating: false
  }
}

// 监听弹窗显示状态，显示时重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 确认创建任务
const handleConfirm = () => {
  if (!taskData.value.title.trim()) {
    Taro.showToast({
      title: '请输入任务标题',
      icon: 'none',
      duration: 1500
    })
    return
  }

  // 发送任务数据给父组件
  emit('confirm', { ...taskData.value })
}
</script>





