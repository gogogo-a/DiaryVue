<template>
  <view class="diary-filter" :class="themeStore.currentThemeClass">
    <!-- 顶部筛选栏 -->
    <view class="filter-bar">
      <!-- 分类选择 -->
      <view class="category-selector" @tap="toggleCategoryDialog">
        <text class="category-text">{{ currentCategory }}</text>
        <text class="dropdown-icon">▼</text>
      </view>
      
      <!-- 功能图标区 -->
      <view class="filter-icons">
        <!-- 日历图标 -->
        <view class="filter-icon" @tap="toggleCalendar">
          <image class="icon-image" :src="calendarIcon" mode="aspectFit" />
        </view>
        
        <!-- 标签图标 -->
        <view class="filter-icon" @tap="toggleLabelDialog">
          <image class="icon-image" :src="labelIcon" mode="aspectFit" />
        </view>
        
        <!-- 搜索图标 -->
        <view class="filter-icon" @tap="toggleSearchInput">
          <image class="icon-image" :src="searchIcon" mode="aspectFit" />
        </view>
      </view>
    </view>
    
    <!-- 日历面板 (条件渲染) -->
    <view v-if="showCalendar" class="calendar-panel">
      <view class="panel-header">
        <text class="panel-title">选择日期</text>
        <text class="close-btn" @tap="toggleCalendar">×</text>
      </view>
      <view class="calendar-content">
        <!-- 这里可以集成日历组件 -->
        <text>日历组件将在此处显示</text>
      </view>
    </view>
    
    <!-- 搜索面板 (条件渲染) -->
    <view v-if="showSearchInput" class="search-panel">
      <view class="search-input-container">
        <input class="search-input" v-model="searchText" placeholder="搜索日记..." />
        <view class="search-btn" @tap="handleSearch">搜索</view>
      </view>
    </view>
    
    <!-- 分类对话框 (现代化设计) -->
    <view v-if="showCategoryDialog" class="dialog-overlay" @tap="toggleCategoryDialog">
      <view class="dialog-content" @tap.stop>
        <view class="dialog-header">
          <view class="dialog-title">选择日记分类</view>
          <view class="close-btn" @tap="toggleCategoryDialog">×</view>
        </view>
        <view class="dialog-body">
          <view class="grid-container">
            <view 
              v-for="(category, index) in categories" 
              :key="index"
              class="category-item"
              :class="{ active: currentCategory === category }"
              @tap="selectCategory(category)"
            >
              <text>{{ category }}</text>
            </view>
          </view>
        </view>
        <view class="dialog-footer">
          <button class="cancel-btn" @tap="toggleCategoryDialog">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 标签对话框 (现代化设计) -->
    <view v-if="showLabelDialog" class="dialog-overlay" @tap="toggleLabelDialog">
      <view class="dialog-content" @tap.stop>
        <view class="dialog-header">
          <view class="dialog-title">选择标签分类</view>
          <view class="close-btn" @tap="toggleLabelDialog">×</view>
        </view>
        <view class="dialog-body">
          <view class="grid-container">
            <view 
              v-for="(label, index) in labels" 
              :key="index"
              class="label-item"
              :class="{ active: currentLabel === label }"
              @tap="selectLabel(label)"
            >
              <text>{{ label }}</text>
            </view>
          </view>
        </view>
        <view class="dialog-footer">
          <button class="cancel-btn" @tap="toggleLabelDialog">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './DiaryFilter.scss'

// 导入SVG图标
import calendarIcon from '../../../assets/svg/diary/calendar.svg'
import labelIcon from '../../../assets/svg/diary/label.svg'
import searchIcon from '../../../assets/svg/diary/search.svg'

defineOptions({
  name: 'DiaryFilterComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 分类数据
const categories = ref(['全部日记', '私有日记', '共享日记', '公开日记'])
const currentCategory = ref('全部日记')
const showCategoryDialog = ref(false)

// 标签数据
const labels = ref(['全部', '未分类', '工作', '生活', '旅行', '学习'])
const currentLabel = ref('全部')
const showLabelDialog = ref(false)

// 日历控制
const showCalendar = ref(false)

// 搜索控制
const showSearchInput = ref(false)
const searchText = ref('')

// 切换分类对话框
const toggleCategoryDialog = () => {
  showCategoryDialog.value = !showCategoryDialog.value
  // 关闭其他面板
  if (showCategoryDialog.value) {
    showLabelDialog.value = false
    showCalendar.value = false
    showSearchInput.value = false
  }
}

// 选择分类
const selectCategory = (category) => {
  currentCategory.value = category
  showCategoryDialog.value = false
  // 通知父组件分类已更改
  emit('categoryChange', category)
}

// 切换标签对话框
const toggleLabelDialog = () => {
  showLabelDialog.value = !showLabelDialog.value
  // 关闭其他面板
  if (showLabelDialog.value) {
    showCategoryDialog.value = false
    showCalendar.value = false
    showSearchInput.value = false
  }
}

// 选择标签
const selectLabel = (label) => {
  currentLabel.value = label
  showLabelDialog.value = false
  // 通知父组件标签已更改
  emit('labelChange', label)
}

// 切换日历面板
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
  // 关闭其他面板
  if (showCalendar.value) {
    showCategoryDialog.value = false
    showLabelDialog.value = false
    showSearchInput.value = false
  }
}

// 切换搜索输入
const toggleSearchInput = () => {
  showSearchInput.value = !showSearchInput.value
  // 关闭其他面板
  if (showSearchInput.value) {
    showCategoryDialog.value = false
    showLabelDialog.value = false
    showCalendar.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  if (searchText.value.trim()) {
    // 通知父组件搜索内容
    emit('search', searchText.value)
    Taro.showToast({
      title: `搜索: ${searchText.value}`,
      icon: 'none'
    })
  }
}

// 定义事件
const emit = defineEmits(['categoryChange', 'labelChange', 'dateChange', 'search'])
</script> 