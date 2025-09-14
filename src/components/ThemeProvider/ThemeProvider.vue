<template>
  <view class="theme-provider" :class="currentThemeClass">
    <slot></slot>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, provide, onUnmounted, watch } from 'vue'
import { defineOptions } from 'vue'
import themeManager, { THEMES } from '../../utils/themeManager'
import Taro from '@tarojs/taro'
import '../../styles/themes.scss'

defineOptions({
  name: 'ThemeProviderComponent'
})

// 当前主题状态
const currentTheme = ref(THEMES.DEFAULT)

// 计算当前主题的class名称
const currentThemeClass = computed(() => {
  return `theme-${currentTheme.value}`
})

// 监听主题变化
watch(currentTheme, (newTheme) => {
}, { immediate: true })

// 在Vue应用中共享当前主题状态
provide('theme', {
  currentTheme,
  currentThemeClass,
  toggleTheme: () => {
    const newTheme = themeManager.toggleTheme()
    currentTheme.value = newTheme
    
    // 触发全局事件，通知其他组件主题已更改
    Taro.eventCenter.trigger('themeChanged', { theme: newTheme })
    
    return newTheme
  }
})

// 监听主题变更事件
const listenForThemeChanges = () => {
  Taro.eventCenter.on('themeChanged', (data) => {
    if (data && data.theme) {
      currentTheme.value = data.theme
    }
  })
}

// 取消监听，防止内存泄漏
onUnmounted(() => {
  Taro.eventCenter.off('themeChanged')
})

// 组件挂载时的操作
onMounted(() => {
  // 获取当前主题
  currentTheme.value = themeManager.getCurrentTheme()
  
  // 监听主题变更事件
  listenForThemeChanges()
})
</script>


