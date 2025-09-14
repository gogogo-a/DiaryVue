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
import { inject, onMounted, ref, computed } from 'vue'
import { defineOptions } from 'vue'
import { THEMES } from '../../utils/themeManager'
import Taro from '@tarojs/taro'
import './ThemeSwitch.scss'

defineOptions({
  name: 'ThemeSwitchComponent'
})

// 从ThemeProvider获取主题状态
const theme = inject('theme')

// 创建一个计算属性来获取当前主题
const currentTheme = computed(() => theme.currentTheme.value)

// 处理主题切换
const handleThemeToggle = () => {
  // 使用ThemeProvider提供的toggleTheme方法
  const newTheme = theme.toggleTheme()
  
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

