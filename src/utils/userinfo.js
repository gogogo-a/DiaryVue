/**
 * 用户信息和登录相关的API工具函数
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-16
 */

import Taro from '@tarojs/taro'
import http from './http'

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

    // 发送到后端API（使用http实例，但不带token）
    const response = await http.sendRequest({
      url: '/auth/wx-login',
      method: 'POST',
      data: loginData,
      skipAuth: true // 标记此请求不需要token
    })

    // 隐藏加载中
    Taro.hideLoading()

    console.log('后端响应:', response)

    // http.sendRequest 已处理响应，直接使用返回的数据
    const result = {
      success: true,
      user: response.user,
      token: response.token,
      message: '登录成功'
    }

    // 显示成功提示
    Taro.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000
    })

    console.log('登录成功，用户信息:', result.user)
    console.log('获得Token:', result.token)

    return result

  } catch (error) {
    // 隐藏加载中
    Taro.hideLoading()

    console.error('登录请求失败:', error)

    // http.sendRequest 已处理错误提示，这里只需要返回失败结果
    return {
      success: false,
      error: error.message || '登录失败',
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
 * 静默登录API (不显示任何UI)
 * 获取微信登录code并发送到后端，静默处理，不显示loading和toast
 * @returns {Promise<Object>} 返回登录结果
 */
export const silentWxLogin = async () => {
  try {
    console.log('开始静默登录...')

    // 调用微信登录接口获取code
    const loginRes = await Taro.login()

    // 准备发送到后端的数据
    const loginData = {
      code: loginRes.code
    }

    console.log('静默发送登录请求:', loginData)
    console.log('请求URL: /auth/wx-login')

    // 发送到后端API（使用http实例，但不带token）
    const response = await http.sendRequest({
      url: '/auth/wx-login',
      method: 'POST',
      data: loginData,
      skipAuth: true // 标记此请求不需要token
    })

    console.log('静默登录后端响应:', response)

    // http.sendRequest 成功返回数据
    if (response && response.user && response.token) {
      const result = {
        success: true,
        user: response.user,
        token: response.token,
        message: '静默登录成功'
      }

      console.log('静默登录成功，用户信息:', result.user)
      console.log('静默获得Token:', result.token.substring(0, 20) + '...')

      return result
    } else {
      console.warn('静默登录响应数据格式异常:', response)
      return {
        success: false,
        error: '响应数据格式异常',
        originalError: null
      }
    }

  } catch (error) {
    console.error('静默登录请求失败:', error)
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    // 静默失败，不显示错误提示，返回详细错误信息
    return {
      success: false,
      error: error.message || '静默登录失败',
      errorCode: error.code || 'UNKNOWN',
      originalError: error
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
    const requestConfig = {
      url,
      method: method.toUpperCase()
    }

    if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
      requestConfig.data = data
    }

    const response = await http.sendRequest(requestConfig)

    return {
      success: true,
      data: response,
      message: '请求成功'
    }

  } catch (error) {
    console.error('API请求失败:', error)
    return {
      success: false,
      error: error.message || '网络请求失败'
    }
  }
}




