/**
 * 账本管理状态管理 (极简版)
 *
 * 1.初始化账本列表（可以自动动态更新），获取账本api接口
 * 2.主要功能：用户增删改后，账本列表更新，避免重复api请求，减小后端压力。
 *
 * 作者: DiaryVue团队
 * 版本: 2.0.0 (重构版)
 * 最后更新: 2025-09-20
 */

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import accountAPI from '../../pages/account_book/control/api_account'

export const useAccountManagementStore = defineStore('accountManagement', () => {
  // ================================
  // 核心状态 (只保留必要的)
  // ================================

  const accountList = ref([])
  const isLoading = ref(false)

  // ================================
  // 计算属性
  // ================================

  const totalAccounts = computed(() => accountList.value.length)
  const hasAccounts = computed(() => accountList.value.length > 0)

  // ================================
  // 基本方法
  // ================================

  /**
   * 获取账本列表 (简化版)
   */
  async function fetchAccounts() {
    isLoading.value = true
    try {
      accountList.value = await accountAPI.getAccountList()
      console.log('账本列表获取成功:', accountList.value.length)
    } catch (error) {
      console.error('获取账本列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 添加账本到列表 (用于创建后的UI更新)
   */
  function addAccount(account) {
    accountList.value.unshift(account)
  }

  /**
   * 从列表移除账本 (用于删除后的UI更新)
   */
  function removeAccount(accountId) {
    const index = accountList.value.findIndex(account => account.id === accountId)
    if (index !== -1) {
      accountList.value.splice(index, 1)
    }
  }

  /**
   * 更新列表中的账本 (用于编辑后的UI更新)
   */
  function updateAccount(accountId, updates) {
    const index = accountList.value.findIndex(account => account.id === accountId)
    if (index !== -1) {
      accountList.value[index] = { ...accountList.value[index], ...updates }
    }
  }

  /**
   * 清空所有数据
   */
  function clearData() {
    accountList.value = []
    isLoading.value = false
  }

  // ================================
  // 返回 (只暴露必要的)
  // ================================

  return {
    // 只读状态
    accountList: readonly(accountList),
    isLoading: readonly(isLoading),

    // 计算属性
    totalAccounts,
    hasAccounts,

    // 基本方法
    fetchAccounts,
    addAccount,
    removeAccount,
    updateAccount,
    clearData
  }
})
