/**
 * 用户状态管理
 *
 * 使用Pinia管理全局用户状态，专注于用户信息和登录状态
 * Token相关逻辑已移至tokenManager.js
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-17
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import tokenManager from '../utils/tokenmanager'

// 用户信息存储的键名
const USER_STORAGE_KEY = 'DIARY_USER_INFO'
const LOGIN_STATUS_KEY = 'DIARY_LOGIN_STATUS'

// 定义用户store
export const useUserStore = defineStore('user', () => {
  // 登录状态：默认false
  const isLoggedIn = ref(true)


  // 用户信息（根据接口文档结构）
  const userInfo = ref({
    id: '',
    plant_id: '', // 微信openid
    plant_form: '', // 平台形式，如"wechat"
    user_name: '',
    password: '',
    avatar: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
    remark: '',
    created_at: '',
    updated_at: ''
  })


  // 用户统计信息
  const userStats = ref({
    diaryCount: 0,
    totalWords: 0,
    daysCount: 0
  })

  // 初始化用户状态（从本地存储恢复）
  function initUserState() {
    try {
      const storedLoginStatus = Taro.getStorageSync(LOGIN_STATUS_KEY)
      const storedUserInfo = Taro.getStorageSync(USER_STORAGE_KEY)

      // 检查token状态来确定登录状态
      const hasValidToken = tokenManager.hasToken() && !tokenManager.isTokenExpired()

      if (storedLoginStatus && hasValidToken) {
        isLoggedIn.value = true
        userInfo.value = storedUserInfo || null

        console.log('用户状态已恢复:', {
          isLoggedIn: isLoggedIn.value,
          userInfo: userInfo.value,
          hasToken: hasValidToken
        })

        // 加载用户统计信息
        loadUserStats()
      } else {
        // 状态不一致，清除登录状态
        clearLoginState()
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
    }
  }

  // 设置登录状态
  function setLoginState(loginData) {
    try {
      isLoggedIn.value = true

      // 根据接口文档结构更新用户信息
      if (loginData.user) {
        userInfo.value = {
          id: loginData.user.id || '',
          plant_id: loginData.user.plant_id || '',
          plant_form: loginData.user.plant_form || 'wechat',
          user_name: loginData.user.user_name || '',
          password: loginData.user.password || '',
          avatar: loginData.user.avatar || '',
          email: loginData.user.email || '',
          phone: loginData.user.phone || '',
          gender: loginData.user.gender || '',
          birthday: loginData.user.birthday || '',
          address: loginData.user.address || '',
          remark: loginData.user.remark || '',
          created_at: loginData.user.created_at || '',
          updated_at: loginData.user.updated_at || ''
        }

        console.log('用户信息已更新到store:', userInfo.value)

        // 保存到本地存储
        Taro.setStorageSync(USER_STORAGE_KEY, userInfo.value)
      }

      // 保存登录状态
      Taro.setStorageSync(LOGIN_STATUS_KEY, true)

      // Token相关由tokenManager处理，启动token计时器
      if (loginData.token) {
        // 根据接口文档，token是字符串，需要设置默认过期时间
        const tokenInfo = tokenManager.startTokenTimer({
          accessToken: loginData.token,
          refreshToken: loginData.token, // 暂时使用同一个token
          expiresIn: 7200 // 默认2小时过期，单位秒
        })
        console.log('Token计时器启动结果:', tokenInfo)
        console.log('Token已存储:', loginData.token.substring(0, 20) + '...')
      }

      console.log('用户登录状态设置完成')

      // 加载用户统计信息
      loadUserStats()
    } catch (error) {
      console.error('设置登录状态失败:', error)
    }
  }

  // 执行UI登录流程（调用userinfo.js的wxLogin）
  async function login() {
    try {
      // 动态导入userinfo.js的wxLogin函数，避免循环依赖
      const { wxLogin } = await import('../utils/userinfo')

      // 调用API进行登录（userinfo.js中已包含所有UI交互）
      const loginResult = await wxLogin()

      if (loginResult.success) {
        // 登录成功，设置状态并启动token计时器
        setLoginState(loginResult)
        return true
      } else {
        // 登录失败（错误提示已在userinfo.js中处理）
        return false
      }
    } catch (error) {
      console.error('UI登录流程失败:', error)
      return false
    }
  }

  // 执行静默登录流程（调用userinfo.js的silentWxLogin）
  async function silentLogin() {
    try {
      // 动态导入userinfo.js的silentWxLogin函数，避免循环依赖
      const { silentWxLogin } = await import('../utils/userinfo')

      // 调用静默登录API
      const loginResult = await silentWxLogin()

      if (loginResult.success) {
        // 静默登录成功，设置状态并启动token计时器
        setLoginState(loginResult)
        return true
      } else {
        // 静默登录失败
        console.log('静默登录失败:', loginResult.error)
        return false
      }
    } catch (error) {
      console.error('静默登录流程失败:', error)
      return false
    }
  }

  // 检查并确保用户已登录（统一入口）
  async function checkAndEnsureLogin() {
    try {
      console.log('开始检查并确保用户登录状态...')

      // 先初始化用户状态
      initUserState()

      // 检查token剩余时间
      const tokenStatus = tokenManager.checkTokenRemainingTime()
      console.log('Token状态检查结果:', tokenStatus)

      if (!tokenStatus.hasToken) {
        // 没有token，需要静默登录
        console.log('没有token，开始静默登录...')
        return await silentLogin()
      } else if (tokenStatus.needsRefresh) {
        // token即将过期，需要刷新（静默登录）
        console.log('Token即将过期，开始刷新token...')
        return await silentLogin()
      } else {
        // token有效，启动计时器确保过期前刷新
        console.log('Token有效，启动自动计时器')
        tokenManager.setupAutoRefresh()
        return true
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return false
    }
  }


  // 清除登录状态
  function clearLoginState() {
    try {
      isLoggedIn.value = false

      // 重置用户信息为默认值
      userInfo.value = {
        id: '',
        plant_id: '',
        plant_form: '',
        user_name: '',
        password: '',
        avatar: '',
        email: '',
        phone: '',
        gender: '',
        birthday: '',
        address: '',
        remark: '',
        created_at: '',
        updated_at: ''
      }

      // 重置用户统计
      userStats.value = {
        diaryCount: 0,
        totalWords: 0,
        daysCount: 0
      }

      // 清除本地存储
      Taro.removeStorageSync(LOGIN_STATUS_KEY)
      Taro.removeStorageSync(USER_STORAGE_KEY)

      // Token相关由tokenManager处理
      tokenManager.clearTokens()

      console.log('用户登录状态已清除，用户信息已重置')
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

      console.log('用户信息已更新:', userInfo.value)
    } catch (error) {
      console.error('更新用户信息失败:', error)
    }
  }

  // 获取用户基本信息的便捷方法
  function getUserBasicInfo() {
    return {
      id: userInfo.value.id,
      userName: userInfo.value.user_name,
      avatar: userInfo.value.avatar,
      platform: userInfo.value.plant_form,
      openid: userInfo.value.plant_id
    }
  }

  // 检查用户信息是否完整
  function isUserInfoComplete() {
    const required = ['id', 'plant_id', 'user_name']
    return required.every(field => userInfo.value[field])
  }

  // 加载用户统计信息
  async function loadUserStats() {
    try {
      // 这里可以调用API获取用户统计信息
      // const stats = await api.getUserStats()
      // userStats.value = stats

      // 暂时使用模拟数据
      userStats.value = {
        diaryCount: 0,
        totalWords: 0,
        daysCount: 0
      }

      console.log('用户统计信息已加载')
    } catch (error) {
      console.error('加载用户统计信息失败:', error)
    }
  }

  // 更新用户统计信息
  function updateUserStats(newStats) {
    userStats.value = { ...userStats.value, ...newStats }
  }

  // 退出登录
  async function logout() {
    try {
      // 可以调用退出登录API
      // await api.logout()

      // 清除登录状态
      clearLoginState()

      // 显示提示
      Taro.showToast({
        title: '已退出登录',
        icon: 'success',
        duration: 1500
      })

      return true
    } catch (error) {
      console.error('退出登录失败:', error)

      // 即使API调用失败，也要清除本地状态
      clearLoginState()

      return false
    }
  }

  // 检查登录状态
  function checkLoginStatus() {
    const hasValidToken = tokenManager.hasToken() && !tokenManager.isTokenExpired()

    if (isLoggedIn.value !== hasValidToken) {
      // 状态不一致，以token状态为准
      if (hasValidToken) {
        isLoggedIn.value = true
      } else {
        clearLoginState()
      }
    }

    return isLoggedIn.value && hasValidToken
  }

  // 返回store的状态和方法
  return {
    // 状态
    isLoggedIn,
    userInfo,
    userStats,

    // 方法
    initUserState,
    setLoginState,
    clearLoginState,
    updateUserInfo,
    getUserBasicInfo,
    isUserInfoComplete,
    loadUserStats,
    updateUserStats,
    login,
    silentLogin,
    logout,
    checkAndEnsureLogin,
    checkLoginStatus
  }
})
