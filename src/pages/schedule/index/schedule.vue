<template>
  <view class="schedule-page" :class="themeStore.currentThemeClass">
    <!-- 页面头部 -->
    <ScheduleHeader @addTask="handleShowAddTaskDialog" />

    <!-- 任务列表 -->
    <view class="tasks-container" v-if="scheduleStore.totalTasks > 0">
      <TaskCard
        v-for="task in scheduleStore.tasks"
        :key="task.id"
        :task="task"
        @taskClick="handleTaskClick"
        @moreOptions="handleMoreOptions"
        @addSubtask="handleAddSubtask"
      />
    </view>

    <!-- 空状态 -->
    <EmptyState
      v-else
      @createTask="handleShowAddTaskDialog"
    />

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 底部导航栏 -->
    <TabBar ref="tabBar" />

    <!-- 添加任务弹窗 -->
    <AddTaskModal
      :visible="showAddTaskModal"
      @close="handleCloseAddTaskModal"
      @confirm="handleCreateTask"
    />
  </view>
</template>

<script setup>
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import { useScheduleStore } from '../../../stores/schedule'
import ScheduleHeader from '../../../components/schedule/index/01/ScheduleHeader.vue'
import AddTaskModal from '../../../components/schedule/index/04/AddTaskModal.vue'
import TaskCard from '../../../components/schedule/index/02/TaskCard.vue'
import EmptyState from '../../../components/schedule/index/03/EmptyState.vue'
import TabBar from '../../../components/public/TabBar/TabBar.vue'
import Taro from '@tarojs/taro'
import './schedule.scss'

defineOptions({
  name: 'SchedulePage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用待办事项状态
const scheduleStore = useScheduleStore()

// 底部导航栏引用
const tabBar = ref(null)

// 添加任务弹窗状态
const showAddTaskModal = ref(false)

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 显示添加任务弹窗
const handleShowAddTaskDialog = () => {
  showAddTaskModal.value = true
}

// 关闭添加任务弹窗
const handleCloseAddTaskModal = () => {
  showAddTaskModal.value = false
}

// 创建任务
const handleCreateTask = (taskData) => {
  const createdTask = scheduleStore.createTask(taskData)

  if (createdTask) {
    Taro.showToast({
      title: '任务创建成功',
      icon: 'success',
      duration: 1500
    })
    handleCloseAddTaskModal()
  } else {
    Taro.showToast({
      title: '创建任务失败',
      icon: 'none',
      duration: 1500
    })
  }
}

// 处理任务点击
const handleTaskClick = (task) => {
  console.log('任务点击:', task)
  // 这里可以跳转到任务详情页面
  Taro.showToast({
    title: `查看任务: ${task.title}`,
    icon: 'none',
    duration: 1500
  })
}

// 处理更多选项
const handleMoreOptions = (task) => {
  console.log('更多选项:', task)

  Taro.showActionSheet({
    itemList: ['编辑任务', '删除任务', '标记完成', '设置提醒'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          handleEditTask(task)
          break
        case 1:
          handleDeleteTask(task)
          break
        case 2:
          handleToggleTaskCompletion(task)
          break
        case 3:
          handleSetReminder(task)
          break
      }
    }
  })
}

// 编辑任务
const handleEditTask = (task) => {
  console.log('编辑任务:', task)
  Taro.showToast({
    title: '编辑功能开发中',
    icon: 'none',
    duration: 1500
  })
}

// 删除任务
const handleDeleteTask = (task) => {
  Taro.showModal({
    title: '确认删除',
    content: `确定要删除任务"${task.title}"吗？此操作不可撤销。`,
    success: (res) => {
      if (res.confirm) {
        const success = scheduleStore.deleteTask(task.id)
        if (success) {
          Taro.showToast({
            title: '任务已删除',
            icon: 'success',
            duration: 1500
          })
        }
      }
    }
  })
}

// 切换任务完成状态
const handleToggleTaskCompletion = (task) => {
  const success = scheduleStore.toggleTaskCompletion(task.id)
  if (success) {
    const status = task.isCompleted ? '未完成' : '已完成'
    Taro.showToast({
      title: `任务标记为${status}`,
      icon: 'success',
      duration: 1500
    })
  }
}

// 设置提醒
const handleSetReminder = (task) => {
  console.log('设置提醒:', task)
  Taro.showToast({
    title: '提醒功能开发中',
    icon: 'none',
    duration: 1500
  })
}

// 添加子任务
const handleAddSubtask = (data) => {
  const { taskId, content } = data
  const subtask = scheduleStore.addSubtask(taskId, content)

  if (subtask) {
    Taro.showToast({
      title: '子任务添加成功',
      icon: 'success',
      duration: 1500
    })
  } else {
    Taro.showToast({
      title: '添加子任务失败',
      icon: 'none',
      duration: 1500
    })
  }
}

// 页面加载时初始化
onMounted(() => {
  // 初始化待办事项数据
  scheduleStore.initScheduleData()

  // 设置当前激活的标签
  if (tabBar.value) {
    tabBar.value.setActiveTab("schedule")
  }
})
</script>
