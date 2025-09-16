/**
 * 用户状态管理
 *
 * 使用Pinia管理全局用户状态，包括登录状态、用户信息、Token等
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-16
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// 用户信息存储的键名
const USER_STORAGE_KEY = 'DIARY_USER_INFO'
const TOKEN_STORAGE_KEY = 'DIARY_TOKEN'
const LOGIN_STATUS_KEY = 'DIARY_LOGIN_STATUS'

// 定义用户store
export const useUserStore = defineStore('user', () => {
  // 登录状态：默认false，开发者模式，默认ture
  const isLoggedIn = ref(true)

  // 用户信息
  const userInfo = ref(null)

  // Token
  const token = ref(null)

  // 初始化用户状态（从本地存储恢复）
  function initUserState() {
    try {
      const storedLoginStatus = Taro.getStorageSync(LOGIN_STATUS_KEY)
      const storedUserInfo = Taro.getStorageSync(USER_STORAGE_KEY)
      const storedToken = Taro.getStorageSync(TOKEN_STORAGE_KEY)

      if (storedLoginStatus && storedToken) {
        isLoggedIn.value = true
        userInfo.value = storedUserInfo || null
        token.value = storedToken

        console.log('用户状态已恢复:', {
          isLoggedIn: isLoggedIn.value,
          userInfo: userInfo.value
        })
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
    }
  }

  // 设置登录状态
  function setLoginState(loginData) {
    try {
      isLoggedIn.value = true
      userInfo.value = loginData.user || null
      token.value = loginData.token || null

      // 保存到本地存储
      Taro.setStorageSync(LOGIN_STATUS_KEY, true)
      if (loginData.user) {
        Taro.setStorageSync(USER_STORAGE_KEY, loginData.user)
      }
      if (loginData.token) {
        Taro.setStorageSync(TOKEN_STORAGE_KEY, loginData.token)
      }

      console.log('用户登录状态已设置')
    } catch (error) {
      console.error('设置登录状态失败:', error)
    }
  }

  // 执行登录流程（调用API并处理结果）
  async function login() {
    try {
      // 动态导入userinfo.js的wxLogin函数，避免循环依赖
      const { wxLogin } = await import('../utils/userinfo')

      // 调用API进行登录
      const loginResult = await wxLogin()

      if (loginResult.success) {
        // 登录成功，设置状态
        setLoginState(loginResult)
        return true
      } else {
        // 登录失败
        return false
      }
    } catch (error) {
      console.error('登录流程失败:', error)
      return false
    }
  }

  // 检查并确保用户已登录
  async function ensureLogin() {
    // 如果已经登录，直接返回
    if (isLoggedIn.value && token.value) {
      return true
    }

    // 尝试执行登录
    return await login()
  }

  // 清除登录状态
  function clearLoginState() {
    try {
      isLoggedIn.value = false
      userInfo.value = null
      token.value = null

      // 清除本地存储
      Taro.removeStorageSync(LOGIN_STATUS_KEY)
      Taro.removeStorageSync(USER_STORAGE_KEY)
      Taro.removeStorageSync(TOKEN_STORAGE_KEY)

      console.log('用户登录状态已清除')
    } catch (error) {
      console.error('清除登录状态失败:', error)
    }
  }

  // 更新用户信息
  function updateUserInfo(newUserInfo) {
    try {
      userInfo.value = { ...userInfo.value, ...newUserInfo }

      // 更新本地存储
      Taro.setStorageSync(USER_STORAGE_KEY, userInfo.value)
    } catch (error) {
      console.error('更新用户信息失败:', error)
    }
  }

  // 返回store的状态和方法
  return {
    // 状态
    isLoggedIn,
    userInfo,
    token,

    // 方法
    initUserState,
    setLoginState,
    clearLoginState,
    updateUserInfo,
    login,
    ensureLogin
  }
})
