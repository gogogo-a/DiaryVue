/**
 * 用户信息和登录相关的API工具函数
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-16
 */

import Taro from '@tarojs/taro'

// 后端API基础地址
const API_BASE_URL = 'https://connivently-fitted-grayce.ngrok-free.app/api/v1'

/**
 * 微信登录API (包含完整UI交互)
 * 获取微信登录code并发送到后端，自动处理加载、成功、失败提示和状态保存
 * @returns {Promise<Object>} 返回登录结果
 */
export const wxLogin = async () => {
  try {
    // 显示加载中
    Taro.showLoading({
      title: '登录中...'
    })

    // 调用微信登录接口获取code
    const loginRes = await Taro.login()

    // 准备发送到后端的数据
    const loginData = {
      code: loginRes.code
    }

    console.log('发送登录请求:', loginData)

    // 发送到后端API
    const response = await Taro.request({
      url: `${API_BASE_URL}/auth/wx-login`,
      method: 'POST',
      data: loginData,
      header: {
        'Content-Type': 'application/json'
      }
    })

    // 隐藏加载中
    Taro.hideLoading()

    console.log('后端响应:', response.data)

    // 处理后端响应
    if (response.data.code === 200) {
      // 登录成功
      const result = {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
        message: response.data.message
      }


      // 显示成功提示
      Taro.showToast({
        title: result.message || '登录成功',
        icon: 'success',
        duration: 2000
      })

      console.log('登录成功，用户信息:', result.user)
      console.log('获得Token:', result.token)

      return result

    } else {
      // 登录失败
      const errorMessage = response.data.message || '登录失败'

      Taro.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 3000
      })

      console.error('登录失败:', response.data)

      return {
        success: false,
        error: errorMessage,
        code: response.data.code
      }
    }

  } catch (error) {
    // 隐藏加载中
    Taro.hideLoading()

    console.error('登录请求失败:', error)

    // 处理网络错误或其他异常
    let errorMessage = '网络错误，请重试'

    if (error.errMsg) {
      if (error.errMsg.includes('cancel')) {
        errorMessage = '用户取消登录'
      } else if (error.errMsg.includes('fail')) {
        errorMessage = '网络请求失败'
      }
    }

    // 显示错误提示
    Taro.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 2000
    })

    return {
      success: false,
      error: errorMessage,
      originalError: error
    }
  }
}

/**
 * 获取用户信息（可选）
 * @returns {Promise<Object>} 返回用户信息
 */
export const getUserInfo = async () => {
  try {
    const userInfoRes = await Taro.getUserProfile({
      desc: '用于完善用户资料'
    })

    return {
      success: true,
      userInfo: userInfoRes.userInfo
    }

  } catch (error) {
    return {
      success: false,
      error: error.errMsg || '获取用户信息失败'
    }
  }
}

/**
 * 带Token的API请求
 * @param {string} url 请求地址
 * @param {string} method 请求方法
 * @param {Object} data 请求数据
 * @returns {Promise<Object>} 返回响应结果
 */
export const apiRequest = async (url, method = 'GET', data = null) => {
  try {
    const token = getToken()

    const requestConfig = {
      url: `${API_BASE_URL}${url}`,
      method: method.toUpperCase(),
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }

    if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
      requestConfig.data = data
    }

    const response = await Taro.request(requestConfig)

    return {
      success: response.data.code === 200,
      data: response.data.data,
      message: response.data.message,
      code: response.data.code
    }

  } catch (error) {
    console.error('API请求失败:', error)
    return {
      success: false,
      error: '网络请求失败'
    }
  }
}



/**
 * 获取存储的Token
 * @returns {string|null} Token
 */
export const getToken = () => {
  try {
    return Taro.getStorageSync('DIARY_TOKEN')
  } catch (error) {
    return null
  }
}

