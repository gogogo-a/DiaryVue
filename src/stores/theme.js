/**
 * 主题状态管理
 * 
 * 使用Pinia管理全局主题状态，任何组件都可以访问和修改主题
 * 
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-14
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import Taro from '@tarojs/taro'
import themeManager, { THEMES } from '../utils/themeManager'
import THEME_COLORS from '../styles/themes'

// 主题存储的键名
const THEME_STORAGE_KEY = 'DIARY_THEME_KEY'

// 定义主题store
export const useThemeStore = defineStore('theme', () => {
  // 当前主题状态
  const currentTheme = ref(themeManager.getCurrentTheme())
  
  // 当前主题的class名称
  const currentThemeClass = ref(`theme-${currentTheme.value}`)
  
  // 当前主题的颜色配置
  const themeColors = ref(themeManager.getCurrentThemeColors())
  
  // 监听主题变化，更新导航栏颜色
  watch(currentTheme, (newTheme) => {
    // 更新主题class
    currentThemeClass.value = `theme-${newTheme}`
    
    // 更新主题颜色配置
    themeColors.value = newTheme === THEMES.DEFAULT ? THEME_COLORS.DEFAULT : THEME_COLORS.REMEMBER
    
    // 更新导航栏颜色
    updateNavigationBarColor(newTheme)
  })
  
  // 切换主题
  function toggleTheme() {
    const newTheme = themeManager.toggleTheme()
    currentTheme.value = newTheme
    
    // 触发全局事件，通知其他组件主题已更改
    Taro.eventCenter.trigger('themeChanged', { theme: newTheme })
    
    return newTheme
  }
  
  // 设置主题
  function setTheme(theme) {
    if (themeManager.setTheme(theme)) {
      currentTheme.value = theme
      return true
    }
    return false
  }
  
  // 更新导航栏颜色
  function updateNavigationBarColor(theme = currentTheme.value) {
    const colors = theme === THEMES.DEFAULT ? THEME_COLORS.DEFAULT : THEME_COLORS.REMEMBER
    
    try {
      // 更新导航栏颜色
      Taro.setNavigationBarColor({
        frontColor: colors.navigationBarTextStyle === 'white' ? '#ffffff' : '#000000',
        backgroundColor: colors.primaryColor,
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
      })
    } catch (e) {
      console.error('更新导航栏颜色失败:', e)
    }
  }
  
  // 初始化主题
  function initTheme() {
    // 获取当前主题
    const theme = themeManager.getCurrentTheme()
    currentTheme.value = theme
    currentThemeClass.value = `theme-${theme}`
    
    // 更新导航栏颜色
    updateNavigationBarColor(theme)
    
    // 监听主题变更事件
    listenForThemeChanges()
  }
  
  // 监听主题变更事件
  function listenForThemeChanges() {
    Taro.eventCenter.on('themeChanged', (data) => {
      if (data && data.theme) {
        currentTheme.value = data.theme
      }
    })
  }
  
  // 返回store的状态和方法
  return {
    currentTheme,
    currentThemeClass,
    themeColors,
    toggleTheme,
    setTheme,
    updateNavigationBarColor,
    initTheme
  }
}) 