<template>
  <view class="add-record-overlay" @tap="handleOverlayClick">
    <view class="add-record-modal" @tap.stop>
      <!-- 标题栏 -->
      <view class="modal-header">
        <view class="header-title">记一笔{{ recordType === 'expense' ? '支出' : '收入' }}</view>
        <view class="close-btn" @tap="handleClose">
          <text class="close-icon">×</text>
        </view>
      </view>

      <!-- 支出/收入切换 -->
      <view class="type-switcher">
        <view
          :class="['type-btn', recordType === 'expense' ? 'active' : '']"
          @tap="switchType('expense')"
        >
          支出
        </view>
        <view
          :class="['type-btn', recordType === 'income' ? 'active' : '']"
          @tap="switchType('income')"
        >
          收入
        </view>
        <view class="date-picker" @tap="showDatePicker">
          {{ formatDate(selectedDate) }}
          <text class="dropdown-icon">▼</text>
        </view>
      </view>

      <!-- 金额显示 -->
      <view class="amount-display">
        <text class="currency">¥</text>
        <text class="amount">{{ displayAmount }}</text>
      </view>

      <!-- 分类选择 -->
      <view class="category-section">
        <view class="category-grid">
          <view
            v-for="category in currentCategories"
            :key="category.id"
            :class="['category-item', selectedCategory?.id === category.id ? 'selected' : '']"
            @tap="selectCategory(category)"
          >
            <view class="category-icon">{{ category.icon }}</view>
            <text class="category-name">{{ category.name }}</text>
          </view>
        </view>
      </view>

      <!-- 功能按钮 -->
      <view class="function-buttons">
        <view class="function-btn" @tap="addNote">
          <text class="function-text">添加备注</text>
        </view>
        <view class="function-btn" @tap="manageCategory">
          <text class="function-text">分类管理</text>
        </view>
        <view class="function-btn" @tap="addImage">
          <text class="function-text">添加图片</text>
        </view>
      </view>

      <!-- 数字键盘 -->
      <view class="keyboard">
        <view class="keyboard-row">
          <view class="key" @tap="inputNumber('1')">1</view>
          <view class="key" @tap="inputNumber('2')">2</view>
          <view class="key" @tap="inputNumber('3')">3</view>
        </view>
        <view class="keyboard-row">
          <view class="key" @tap="inputNumber('4')">4</view>
          <view class="key" @tap="inputNumber('5')">5</view>
          <view class="key" @tap="inputNumber('6')">6</view>
        </view>
        <view class="keyboard-row">
          <view class="key" @tap="inputNumber('7')">7</view>
          <view class="key" @tap="inputNumber('8')">8</view>
          <view class="key" @tap="inputNumber('9')">9</view>
        </view>
        <view class="keyboard-row">
          <view class="key" @tap="inputDecimal">.</view>
          <view class="key" @tap="inputNumber('0')">0</view>
          <view class="key delete-key" @tap="deleteNumber">
            <text class="delete-icon">⌫</text>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <view class="cancel-btn" @tap="handleClose">
          <text class="cancel-icon">×</text>
        </view>
        <view class="save-btn" @tap="saveRecord">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, computed } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './add_record.scss'

defineOptions({
  name: 'AddRecordPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 记账类型
const recordType = ref('expense') // 'expense' | 'income'

// 金额相关
const amountInput = ref('0')
const displayAmount = computed(() => {
  return amountInput.value === '0' ? '0' : amountInput.value
})

// 日期
const selectedDate = ref(new Date())

// 选中的分类
const selectedCategory = ref(null)

// 支出分类
const expenseCategories = ref([
  { id: 1, name: '购物', icon: '🛍️' },
  { id: 2, name: '餐饮', icon: '🍽️' },
  { id: 3, name: '娱乐', icon: '🎮' },
  { id: 4, name: '礼物', icon: '🎁' },
  { id: 5, name: '交通', icon: '🚗' },
  { id: 6, name: '服务', icon: '🔧' }
])

// 收入分类
const incomeCategories = ref([
  { id: 7, name: '工资', icon: '💰' },
  { id: 8, name: '奖金', icon: '🏆' },
  { id: 9, name: '投资', icon: '📈' },
  { id: 10, name: '兼职', icon: '💼' },
  { id: 11, name: '礼金', icon: '🧧' },
  { id: 12, name: '其他', icon: '💵' }
])

// 当前显示的分类
const currentCategories = computed(() => {
  return recordType.value === 'expense' ? expenseCategories.value : incomeCategories.value
})

// 切换记账类型
const switchType = (type) => {
  recordType.value = type
  selectedCategory.value = null // 清除已选分类
}

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category
}

// 数字输入
const inputNumber = (num) => {
  if (amountInput.value === '0') {
    amountInput.value = num
  } else {
    amountInput.value += num
  }
}

// 输入小数点
const inputDecimal = () => {
  if (!amountInput.value.includes('.')) {
    amountInput.value += '.'
  }
}

// 删除数字
const deleteNumber = () => {
  if (amountInput.value.length > 1) {
    amountInput.value = amountInput.value.slice(0, -1)
  } else {
    amountInput.value = '0'
  }
}

// 格式化日期
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 显示日期选择器
const showDatePicker = () => {
  Taro.showActionSheet({
    itemList: ['今天', '昨天', '选择日期'],
    success: (res) => {
      const today = new Date()
      switch (res.tapIndex) {
        case 0: // 今天
          selectedDate.value = today
          break
        case 1: // 昨天
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          selectedDate.value = yesterday
          break
        case 2: // 选择日期
          // 这里可以集成日期选择器
          console.log('选择日期')
          break
      }
    }
  })
}

// 添加备注
const addNote = () => {
  console.log('添加备注')
  // 这里可以打开备注输入框
}

// 分类管理
const manageCategory = () => {
  console.log('分类管理')
  // 这里可以跳转到分类管理页面
}

// 添加图片
const addImage = () => {
  console.log('添加图片')
  // 这里可以打开图片选择器
}

// 保存记录
const saveRecord = () => {
  if (!selectedCategory.value) {
    Taro.showToast({
      title: '请选择分类',
      icon: 'none'
    })
    return
  }

  if (amountInput.value === '0' || amountInput.value === '') {
    Taro.showToast({
      title: '请输入金额',
      icon: 'none'
    })
    return
  }

  // 这里保存记账记录
  console.log('保存记账记录:', {
    type: recordType.value,
    amount: amountInput.value,
    category: selectedCategory.value,
    date: selectedDate.value
  })

  Taro.showToast({
    title: '保存成功',
    icon: 'success'
  })

  // 关闭页面
  setTimeout(() => {
    handleClose()
  }, 1500)
}

// 关闭页面
const handleClose = () => {
  Taro.navigateBack()
}

// 点击遮罩层关闭
const handleOverlayClick = () => {
  handleClose()
}

// 页面加载时的初始化
const init = () => {
  console.log('记账页面初始化完成')
  // 设置默认选中第一个分类
  if (currentCategories.value.length > 0) {
    selectedCategory.value = currentCategories.value[0]
  }
}

// 页面加载完成后初始化
Taro.useReady(() => {
  init()
})
</script>
