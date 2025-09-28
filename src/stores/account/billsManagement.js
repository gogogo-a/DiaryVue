/**
 * 账单管理状态管理 - 简化版
 *
 * 核心功能：
 * 1. 标签字典管理
 * 2. 响应式账单数据管理
 * 3. API封装与数据更新
 *
 * 作者: DiaryVue团队
 * 版本: 2.0.0 (简化版)
 * 最后更新: 2025-09-28
 */

import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import billsAPI from '../../pages/account_book/index/api_bills'

export const useBillsManagementStore = defineStore('billsManagement', () => {
  // ================================
  // 核心响应式状态
  // ================================

  // 标签字典 - key为标签id，value为标签对象
  const tagsDict = ref(new Map())

  // 账单列表 - 已处理的账单数据
  const billsList = ref([])

  // 账单统计数据 - 按账本ID存储 { accountId: statsData }
  const statsDataMap = ref(new Map())

  // 加载状态
  const isLoading = ref(false)

  // ================================
  // 1. 标签字典管理
  // ================================

  /**
   * 获取并构建标签字典
   */
  async function fetchTagsDict() {
    try {
      const tags = await billsAPI.getTags({ category: 'bill' })

      // 构建标签字典
      const dict = new Map()
      tags.forEach(tag => {
        dict.set(tag.id, tag)
      })
      tagsDict.value = dict


      return dict
    } catch (error) {
      console.error('获取标签字典失败:', error)
      throw error
    }
  }

  // ================================
  // 2. 账单数据管理与API封装
  // ================================

  /**
   * 获取账单列表 - 根据API参数
   */
  async function fetchBills(params = {}) {
    isLoading.value = true

    try {
      const result = await billsAPI.getBills(params)

      // 直接使用API返回的数据结构 (已包含bill和tags)
      const processedBills = result.list || []

      // 更新响应式数据
      billsList.value = processedBills


      return processedBills
    } catch (error) {
      console.error('获取账单列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 添加账单
   */
  async function addBill(billData) {
    try {
      const newBill = await billsAPI.createBill(billData)

      // 添加到列表头部
      billsList.value.unshift(newBill)


      return newBill
    } catch (error) {
      console.error('添加账单失败:', error)
      throw error
    }
  }

  /**
   * 删除账单
   */
  async function deleteBill(billId) {
    try {
      await billsAPI.deleteBill(billId)

      // 从列表中移除
      const originalLength = billsList.value.length
      billsList.value = billsList.value.filter(item => {
        const bill = item.bill || item
        return bill.id !== billId
      })


      return true
    } catch (error) {
      console.error('删除账单失败:', error)
      throw error
    }
  }

  /**
   * 更新账单
   */
  async function updateBill(billId, updates) {
    try {
      const updatedBill = await billsAPI.updateBill(billId, updates)

      // 更新列表中的账单
      const index = billsList.value.findIndex(item => {
        const bill = item.bill || item
        return bill.id === billId
      })

      if (index !== -1) {
        billsList.value[index] = updatedBill

      }

      return updatedBill
    } catch (error) {
      console.error('更新账单失败:', error)
      throw error
    }
  }

  /**
   * 加载账本统计数据到缓存 (支持单个或批量)
   */
  async function loadStats(accountIds) {
    const ids = Array.isArray(accountIds) ? accountIds : [accountIds]

    const promises = ids.map(async (accountId) => {
      // 检查缓存，避免重复请求
      if (statsDataMap.value.has(accountId)) {
        return
      }

      try {
        const stats = await billsAPI.getBillStats({ account_book_id: accountId })
        // 直接存储实际统计数据到缓存
        statsDataMap.value.set(accountId, stats?.data?.data || null)
      } catch (error) {
        console.error('获取统计数据失败:', error)
        statsDataMap.value.set(accountId, null)
      }
    })

    await Promise.allSettled(promises)
  }

  // ================================
  // 3. 工具方法
  // ================================

  /**
   * 清除所有数据
   */
  function clearAllData() {
    tagsDict.value = new Map()
    billsList.value = []
    statsDataMap.value = new Map()

  }

  /**
   * 格式化金额
   */
  function formatAmount(amount) {
    if (!amount && amount !== 0) return '0.00'
    return parseFloat(amount).toFixed(2)
  }

  // ================================
  // 返回接口
  // ================================

  return {
    // 响应式状态 (只读)
    tagsDict: readonly(tagsDict),
    billsList: readonly(billsList),
    statsDataMap: readonly(statsDataMap),
    isLoading: readonly(isLoading),

    // API方法
    fetchTagsDict,
    fetchBills,
    addBill,
    deleteBill,
    updateBill,
    loadStats,

    // 工具方法
    clearAllData,
    formatAmount
  }
})
