/**
 * Token管理器
 *
 * 负责token的生命周期管理，包括：
 * - token的存储和读取
 * - token过期检查
 * - 自动刷新定时器
 * - token状态事件通知
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-17
 */

import Taro from '@tarojs/taro'

// 存储键名常量
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'DIARY_ACCESS_TOKEN',
  REFRESH_TOKEN: 'DIARY_REFRESH_TOKEN',
  TOKEN_EXPIRY: 'DIARY_TOKEN_EXPIRY',
  TOKEN_TYPE: 'DIARY_TOKEN_TYPE'
}

// 配置常量
const CONFIG = {
  // 在token过期前多长时间进行刷新（毫秒）
  REFRESH_BEFORE_EXPIRY: 300 * 1000, // 5分钟
  // token类型
  TOKEN_TYPE: 'Bearer',
  // 最大重试次数
  MAX_RETRY_COUNT: 3
}

class TokenManager {
  constructor() {
    // 自动刷新定时器
    this.refreshTimer = null
    // 刷新回调函数
    this.refreshCallback = null
    // 过期回调函数
    this.expiredCallback = null
    // 重试计数
    this.retryCount = 0
  }

  // ================================
  // Token 存储操作
  // ================================

  /**
   * 通用存储获取方法
   * @param {string} key - 存储键名
   * @param {string} errorMsg - 错误消息
   * @returns {any|null} 存储值
   */
  _getStorageValue(key, errorMsg) {
    try {
      return Taro.getStorageSync(key) || null
    } catch (error) {
      console.error(errorMsg, error)
      return null
    }
  }

  /**
   * 获取访问token
   * @returns {string|null} 访问token
   */
  getAccessToken() {
    return this._getStorageValue(STORAGE_KEYS.ACCESS_TOKEN, '获取访问token失败:')
  }

  /**
   * 获取刷新token
   * @returns {string|null} 刷新token
   */
  getRefreshToken() {
    return this._getStorageValue(STORAGE_KEYS.REFRESH_TOKEN, '获取刷新token失败:')
  }

  /**
   * 获取token过期时间
   * @returns {number|null} 过期时间戳
   */
  getTokenExpiry() {
    const expiry = this._getStorageValue(STORAGE_KEYS.TOKEN_EXPIRY, '获取token过期时间失败:')
    return expiry ? parseInt(expiry) : null
  }

  /**
   * 设置token信息
   * @param {Object} tokenData - token数据
   * @param {string} tokenData.accessToken - 访问token
   * @param {string} tokenData.refreshToken - 刷新token
   * @param {number} tokenData.expiresIn - 有效期（秒）
   */
  setTokens(tokenData) {
    try {
      const { accessToken, refreshToken, expiresIn } = tokenData
      const now = Date.now()
      const expiryTime = now + (expiresIn * 1000)

      // 存储token信息
      Taro.setStorageSync(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      Taro.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      Taro.setStorageSync(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString())
      Taro.setStorageSync(STORAGE_KEYS.TOKEN_TYPE, CONFIG.TOKEN_TYPE)

      console.log('Token已保存，过期时间:', new Date(expiryTime).toLocaleString())

      // 设置自动刷新定时器
      this.setupAutoRefresh()

      return true
    } catch (error) {
      console.error('保存token失败:', error)
      return false
    }
  }

  /**
   * 清除所有token信息
   */
  clearTokens() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        Taro.removeStorageSync(key)
      })

      // 清除定时器
      this.clearRefreshTimer()

      console.log('Token已清除')
      return true
    } catch (error) {
      console.error('清除token失败:', error)
      return false
    }
  }

  // ================================
  // Token 状态检查
  // ================================

  /**
   * 计算token时间信息（统一方法）
   * @returns {Object} token时间状态
   */
  _calculateTokenTimes() {
    const expiry = this.getTokenExpiry()
    const now = Date.now()
    const hasToken = !!this.getAccessToken()

    if (!expiry || !hasToken) {
      return {
        hasToken: false,
        expiry: null,
        remainingTime: 0,
        remainingMinutes: 0,
        isExpired: true,
        isNearExpiry: true
      }
    }

    const remainingTime = Math.max(0, expiry - now)
    const remainingMinutes = Math.round(remainingTime / (1000 * 60))
    const isExpired = remainingTime <= 0
    const isNearExpiry = remainingTime <= CONFIG.REFRESH_BEFORE_EXPIRY

    return {
      hasToken: true,
      expiry,
      remainingTime,
      remainingMinutes,
      isExpired,
      isNearExpiry
    }
  }

  /**
   * 检查token是否存在
   * @returns {boolean} 是否存在token
   */
  hasToken() {
    return this._calculateTokenTimes().hasToken
  }

  /**
   * 检查token是否已过期
   * @returns {boolean} 是否已过期
   */
  isTokenExpired() {
    return this._calculateTokenTimes().isExpired
  }

  /**
   * 检查token是否即将过期
   * @returns {boolean} 是否即将过期
   */
  isTokenNearExpiry() {
    return this._calculateTokenTimes().isNearExpiry
  }

  /**
   * 获取token状态信息
   * @returns {Object} token状态
   */
  getTokenStatus() {
    const times = this._calculateTokenTimes()

    return {
      hasToken: times.hasToken,
      isValid: times.hasToken && !times.isExpired,
      isExpired: times.isExpired,
      isNearExpiry: times.isNearExpiry,
      expiryTime: times.expiry,
      timeUntilExpiry: times.remainingTime
    }
  }

  // ================================
  // 自动刷新机制
  // ================================

  /**
   * 设置自动刷新定时器
   */
  setupAutoRefresh() {
    // 清除现有定时器
    this.clearRefreshTimer()

    const expiry = this.getTokenExpiry()
    if (!expiry) return

    // 计算刷新时间点：过期前1分钟
    const refreshTime = expiry - CONFIG.REFRESH_BEFORE_EXPIRY
    const delay = refreshTime - Date.now()

    // 如果已经到了刷新时间，立即刷新
    if (delay <= 0) {
      this.handleTokenNearExpiry()
      return
    }

    // 设置定时器
    this.refreshTimer = setTimeout(() => {
      this.handleTokenNearExpiry()
    }, delay)

    console.log(`自动刷新定时器已设置，将在 ${Math.round(delay / 1000)} 秒后触发`)
  }

  /**
   * 清除刷新定时器
   */
  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
      console.log('自动刷新定时器已清除')
    }
  }

  /**
   * 处理token即将过期
   */
  async handleTokenNearExpiry() {
    console.log('Token即将过期，开始刷新...')

    if (this.refreshCallback) {
      try {
        const success = await this.refreshCallback()

        if (success) {
          this.retryCount = 0
          console.log('Token刷新成功')
        } else {
          this.handleRefreshFailure()
        }
      } catch (error) {
        console.error('Token刷新过程中出错:', error)
        this.handleRefreshFailure()
      }
    } else {
      console.warn('未设置刷新回调函数')
      this.handleRefreshFailure()
    }
  }

  /**
   * 处理刷新失败
   */
  handleRefreshFailure() {
    this.retryCount++

    if (this.retryCount < CONFIG.MAX_RETRY_COUNT) {
      console.log(`Token刷新失败，将在5秒后重试 (${this.retryCount}/${CONFIG.MAX_RETRY_COUNT})`)

      // 5秒后重试
      setTimeout(() => {
        this.handleTokenNearExpiry()
      }, 5000)
    } else {
      console.error('Token刷新多次失败，标记为过期')
      this.retryCount = 0

      // 触发过期回调
      if (this.expiredCallback) {
        this.expiredCallback()
      }
    }
  }

  // ================================
  // 回调函数管理
  // ================================

  /**
   * 设置刷新回调函数
   * @param {Function} callback - 刷新函数，应返回Promise<boolean>
   */
  setRefreshCallback(callback) {
    this.refreshCallback = callback
  }

  /**
   * 设置过期回调函数
   * @param {Function} callback - 过期处理函数
   */
  setExpiredCallback(callback) {
    this.expiredCallback = callback
  }

  // ================================
  // 核心功能方法
  // ================================

  /**
   * 检查token剩余时间（用户进入首页后如果token存在）
   * @returns {Object} 剩余时间信息
   */
  checkTokenRemainingTime() {
    const times = this._calculateTokenTimes()

    console.log(`Token剩余时间: ${times.remainingMinutes}分钟 (${times.remainingTime}ms)`)

    return {
      hasToken: times.hasToken,
      remainingTime: times.remainingTime,
      remainingMinutes: times.remainingMinutes,
      needsRefresh: times.isNearExpiry,
      status: !times.hasToken ? 'no-token' : times.isNearExpiry ? 'needs-refresh' : 'valid'
    }
  }

  /**
   * 启动token计时（获取新的token后调用这个函数）
   * @param {Object} tokenData - 新的token数据
   */
  startTokenTimer(tokenData) {
    console.log('启动token计时器...')

    // 设置tokens（会自动调用setupAutoRefresh）
    const success = this.setTokens(tokenData)

    if (success) {
      const remainingInfo = this.checkTokenRemainingTime()
      console.log('Token计时器已启动:', remainingInfo)
      return remainingInfo
    } else {
      console.error('启动token计时器失败')
      return null
    }
  }

  // ================================
  // 工具方法
  // ================================

  /**
   * 获取完整的Authorization头
   * @returns {string|null} Authorization头字符串
   */
  getAuthorizationHeader() {
    const token = this.getAccessToken()
    if (!token) return null

    const tokenType = Taro.getStorageSync(STORAGE_KEYS.TOKEN_TYPE) || CONFIG.TOKEN_TYPE
    return `${tokenType} ${token}`
  }

  /**
   * 初始化token管理器
   * @param {Object} callbacks - 回调函数对象
   * @param {Function} callbacks.onRefresh - 刷新回调
   * @param {Function} callbacks.onExpired - 过期回调
   */
  init(callbacks = {}) {
    console.log('初始化TokenManager...')

    // 设置回调函数
    if (callbacks.onRefresh) {
      this.setRefreshCallback(callbacks.onRefresh)
    }
    if (callbacks.onExpired) {
      this.setExpiredCallback(callbacks.onExpired)
    }

    // 检查当前token状态
    const status = this.getTokenStatus()
    console.log('当前token状态:', status)

    if (status.isExpired) {
      console.log('Token已过期')
      if (this.expiredCallback) {
        this.expiredCallback()
      }
    } else if (status.isNearExpiry) {
      console.log('Token即将过期，立即刷新')
      this.handleTokenNearExpiry()
    } else if (status.hasToken) {
      console.log('Token有效，设置自动刷新')
      this.setupAutoRefresh()
    } else {
      console.log('没有token')
    }
  }

  /**
   * 销毁token管理器
   */
  destroy() {
    this.clearRefreshTimer()
    this.refreshCallback = null
    this.expiredCallback = null
    this.retryCount = 0
    console.log('TokenManager已销毁')
  }
}

// 创建单例实例
const tokenManager = new TokenManager()

export default tokenManager





