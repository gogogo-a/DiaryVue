/**
 * 待办事项状态管理
 *
 * 使用Pinia管理待办事项的全局状态
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-17
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

// 待办事项存储的键名
const SCHEDULE_STORAGE_KEY = 'DIARY_SCHEDULE_DATA'

// 定义待办事项store
export const useScheduleStore = defineStore('schedule', () => {
  // 待办事项列表
  const tasks = ref([])

  // 下一个任务ID
  const nextTaskId = ref(1)

  // 计算属性：总任务数
  const totalTasks = computed(() => tasks.value.length)

  // 计算属性：已完成任务数
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.isCompleted).length
  )

  // 计算属性：进行中任务数
  const activeTasks = computed(() => 
    tasks.value.filter(task => !task.isCompleted).length
  )

  // 计算属性：完成率
  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  // 初始化待办事项数据
  function initScheduleData() {
    try {
      const storedData = Taro.getStorageSync(SCHEDULE_STORAGE_KEY)
      if (storedData) {
        const { taskList, nextId } = JSON.parse(storedData)
        tasks.value = taskList || []
        nextTaskId.value = nextId || 1
        
        console.log('待办事项数据已恢复:', {
          totalTasks: totalTasks.value,
          nextId: nextTaskId.value
        })
      }
    } catch (error) {
      console.error('初始化待办事项数据失败:', error)
      // 初始化默认数据
      tasks.value = []
      nextTaskId.value = 1
    }
  }

  // 保存数据到本地存储
  function saveToStorage() {
    try {
      const dataToSave = {
        taskList: tasks.value,
        nextId: nextTaskId.value,
        lastUpdated: Date.now()
      }
      Taro.setStorageSync(SCHEDULE_STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('保存待办事项数据失败:', error)
    }
  }

  // 创建新任务
  function createTask(taskData) {
    try {
      const newTask = {
        id: nextTaskId.value++,
        title: taskData.title || '新任务',
        description: taskData.description || '',
        isCompleted: false,
        isRepeating: taskData.isRepeating || false,
        priority: taskData.priority || 'normal', // low, normal, high
        dueDate: taskData.dueDate || null,
        subtasks: [],
        completedCount: 0,
        totalCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      tasks.value.unshift(newTask) // 添加到列表顶部
      saveToStorage()

      console.log('新任务已创建:', newTask)
      return newTask
    } catch (error) {
      console.error('创建任务失败:', error)
      return null
    }
  }

  // 更新任务
  function updateTask(taskId, updates) {
    try {
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex === -1) {
        console.warn('任务不存在:', taskId)
        return false
      }

      const updatedTask = {
        ...tasks.value[taskIndex],
        ...updates,
        updatedAt: Date.now()
      }

      tasks.value[taskIndex] = updatedTask
      saveToStorage()

      console.log('任务已更新:', updatedTask)
      return true
    } catch (error) {
      console.error('更新任务失败:', error)
      return false
    }
  }

  // 删除任务
  function deleteTask(taskId) {
    try {
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex === -1) {
        console.warn('任务不存在:', taskId)
        return false
      }

      const deletedTask = tasks.value.splice(taskIndex, 1)[0]
      saveToStorage()

      console.log('任务已删除:', deletedTask)
      return true
    } catch (error) {
      console.error('删除任务失败:', error)
      return false
    }
  }

  // 切换任务完成状态
  function toggleTaskCompletion(taskId) {
    try {
      const task = tasks.value.find(t => t.id === taskId)
      if (!task) {
        console.warn('任务不存在:', taskId)
        return false
      }

      task.isCompleted = !task.isCompleted
      task.updatedAt = Date.now()
      
      // 如果任务完成，更新完成时间
      if (task.isCompleted) {
        task.completedAt = Date.now()
      } else {
        delete task.completedAt
      }

      saveToStorage()
      console.log('任务状态已切换:', task)
      return true
    } catch (error) {
      console.error('切换任务状态失败:', error)
      return false
    }
  }

  // 添加子任务
  function addSubtask(taskId, subtaskContent) {
    try {
      const task = tasks.value.find(t => t.id === taskId)
      if (!task) {
        console.warn('任务不存在:', taskId)
        return false
      }

      const newSubtask = {
        id: Date.now(), // 简单的ID生成
        content: subtaskContent,
        isCompleted: false,
        createdAt: Date.now()
      }

      task.subtasks.push(newSubtask)
      task.totalCount = task.subtasks.length
      task.completedCount = task.subtasks.filter(st => st.isCompleted).length
      task.updatedAt = Date.now()

      saveToStorage()
      console.log('子任务已添加:', newSubtask)
      return newSubtask
    } catch (error) {
      console.error('添加子任务失败:', error)
      return null
    }
  }

  // 切换子任务完成状态
  function toggleSubtaskCompletion(taskId, subtaskId) {
    try {
      const task = tasks.value.find(t => t.id === taskId)
      if (!task) {
        console.warn('任务不存在:', taskId)
        return false
      }

      const subtask = task.subtasks.find(st => st.id === subtaskId)
      if (!subtask) {
        console.warn('子任务不存在:', subtaskId)
        return false
      }

      subtask.isCompleted = !subtask.isCompleted
      
      // 更新任务的完成统计
      task.completedCount = task.subtasks.filter(st => st.isCompleted).length
      task.updatedAt = Date.now()

      saveToStorage()
      console.log('子任务状态已切换:', subtask)
      return true
    } catch (error) {
      console.error('切换子任务状态失败:', error)
      return false
    }
  }

  // 获取任务详情
  function getTaskById(taskId) {
    return tasks.value.find(task => task.id === taskId) || null
  }

  // 获取按优先级排序的任务
  function getTasksByPriority() {
    const priorityOrder = { high: 3, normal: 2, low: 1 }
    return [...tasks.value].sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // 获取今日任务
  function getTodayTasks() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return tasks.value.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  }

  // 清空所有任务
  function clearAllTasks() {
    try {
      tasks.value = []
      nextTaskId.value = 1
      saveToStorage()
      console.log('所有任务已清空')
      return true
    } catch (error) {
      console.error('清空任务失败:', error)
      return false
    }
  }

  // 导出数据
  function exportData() {
    return {
      tasks: tasks.value,
      nextTaskId: nextTaskId.value,
      exportTime: Date.now()
    }
  }

  // 导入数据
  function importData(data) {
    try {
      if (data.tasks && Array.isArray(data.tasks)) {
        tasks.value = data.tasks
        nextTaskId.value = data.nextTaskId || 1
        saveToStorage()
        console.log('数据导入成功:', data)
        return true
      }
      return false
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }

  // 返回store的状态和方法
  return {
    // 状态
    tasks,
    nextTaskId,
    
    // 计算属性
    totalTasks,
    completedTasks,
    activeTasks,
    completionRate,

    // 方法
    initScheduleData,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addSubtask,
    toggleSubtaskCompletion,
    getTaskById,
    getTasksByPriority,
    getTodayTasks,
    clearAllTasks,
    exportData,
    importData
  }
})





