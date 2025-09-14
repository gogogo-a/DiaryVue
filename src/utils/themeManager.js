/**
 * 主题管理工具
 * 
 * 用于在不同主题之间切换，目前支持"默认"和"怀旧"两种主题。
 * 主题设置会保存在本地存储中，以便在用户下次访问时保持选择。
 * 
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-14
 */

import Taro from '@tarojs/taro'
import variables from '../styles/variables.scss'
import THEME_COLORS from '../styles/themes'

// 主题类型定义
export const THEMES = {
  DEFAULT: 'default',  // 默认主题 - 浅蓝色
  REMEMBER: 'remember' // 怀旧主题 - 暖黄色
}

// 主题存储的键名
const THEME_STORAGE_KEY = 'DIARY_THEME_KEY'

/**
 * 获取全局尺寸变量
 * @returns {Object} 全局尺寸变量对象
 */
export const getGlobalVariables = () => {
  return variables
}

/**
 * 获取当前主题
 * @returns {string} 当前主题名称
 */
export const getCurrentTheme = () => {
  try {
    const savedTheme = Taro.getStorageSync(THEME_STORAGE_KEY)
    console.log('获取当前主题:', savedTheme || THEMES.DEFAULT)
    return savedTheme || THEMES.DEFAULT // 默认使用默认主题
  } catch (e) {
    console.error('获取主题设置失败:', e)
    return THEMES.DEFAULT
  }
}

/**
 * 获取当前主题的颜色配置
 * @returns {Object} 当前主题的颜色配置
 */
export const getCurrentThemeColors = () => {
  const currentTheme = getCurrentTheme()
  return currentTheme === THEMES.DEFAULT ? THEME_COLORS.DEFAULT : THEME_COLORS.REMEMBER
}

/**
 * 更新导航栏颜色
 * @param {string} theme - 主题名称
 */
export const updateNavigationBarColor = (theme = getCurrentTheme()) => {
  const themeColors = theme === THEMES.DEFAULT ? THEME_COLORS.DEFAULT : THEME_COLORS.REMEMBER
  
  try {
    // 更新导航栏颜色
    Taro.setNavigationBarColor({
      frontColor: themeColors.navigationBarTextStyle === 'white' ? '#ffffff' : '#000000',
      backgroundColor: themeColors.primaryColor,
      animation: {
        duration: 300,
        timingFunc: 'easeIn'
      },
      success: () => {
        console.log('导航栏颜色更新成功')
      },
      fail: (error) => {
        console.error('导航栏颜色更新失败:', error)
      }
    })
  } catch (e) {
    console.error('更新导航栏颜色失败:', e)
  }
}

/**
 * 设置当前主题
 * @param {string} theme - 主题名称
 */
export const setTheme = (theme) => {
  try {
    // 检查主题是否有效
    if (!Object.values(THEMES).includes(theme)) {
      console.error('无效的主题名称:', theme)
      return false
    }
    
    console.log('设置主题为:', theme)
    
    // 保存主题到本地存储
    Taro.setStorageSync(THEME_STORAGE_KEY, theme)
    
    // 更新导航栏颜色
    updateNavigationBarColor(theme)
    
    // 返回成功状态
    return true
  } catch (e) {
    console.error('保存主题设置失败:', e)
    return false
  }
}

/**
 * 切换到下一个主题
 * 如果当前是默认主题，则切换到怀旧主题
 * 如果当前是怀旧主题，则切换到默认主题
 * @returns {string} 新的主题名称
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme()
  console.log('当前主题:', currentTheme)
  
  const nextTheme = currentTheme === THEMES.DEFAULT ? THEMES.REMEMBER : THEMES.DEFAULT
  console.log('切换到主题:', nextTheme)
  
  setTheme(nextTheme)
  return nextTheme
}

/**
 * 重置主题为默认主题
 * 用于调试和修复主题切换问题
 */
export const resetTheme = () => {
  console.log('重置主题为默认主题')
  Taro.removeStorageSync(THEME_STORAGE_KEY)
  updateNavigationBarColor(THEMES.DEFAULT)
  return THEMES.DEFAULT
}

/**
 * 获取主题对应的样式文件路径
 * @param {string} theme - 主题名称
 * @returns {string} 样式文件路径
 */
export const getThemeStylePath = (theme = getCurrentTheme()) => {
  switch (theme) {
    case THEMES.REMEMBER:
      return '../../styles/remember.scss'
    case THEMES.DEFAULT:
    default:
      return '../../styles/base.scss'
  }
}

export default {
  THEMES,
  getCurrentTheme,
  getCurrentThemeColors,
  setTheme,
  toggleTheme,
  resetTheme,
  getThemeStylePath,
  getGlobalVariables,
  updateNavigationBarColor
} 