<template>
  <view class="theme-switch" @tap="handleThemeToggle">
    <view class="switch-icon">
      <view v-if="currentTheme === THEMES.DEFAULT" class="icon default-icon">🌞</view>
      <view v-else class="icon remember-icon">🌙</view>
    </view>
    <view class="switch-text">
      <text>{{ currentTheme === THEMES.DEFAULT ? '默认主题' : '怀旧主题' }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineOptions } from 'vue'
import { THEMES } from '../../../utils/themeManager'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'

defineOptions({
  name: 'ThemeSwitchComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 创建一个计算属性来获取当前主题
const currentTheme = computed(() => themeStore.currentTheme)

// 处理主题切换
const handleThemeToggle = () => {
  // 使用ThemeStore提供的toggleTheme方法
  const newTheme = themeStore.toggleTheme()
  
  // 提示用户
  Taro.showToast({
    title: newTheme === THEMES.DEFAULT ? '已切换到默认主题' : '已切换到怀旧主题',
    icon: 'none',
    duration: 1500
  })
}

// 导出供父组件使用的方法
defineExpose({
  switchTheme: handleThemeToggle
})
</script>

