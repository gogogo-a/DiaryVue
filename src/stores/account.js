/**
 * 记账本状态管理
 *
 * 使用Pinia管理记账本的全局状态，包括账单记录、分类管理、统计数据等
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-17
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

// 记账本存储的键名
const ACCOUNT_STORAGE_KEY = 'DIARY_ACCOUNT_DATA'

// 默认分类数据
const DEFAULT_CATEGORIES = {
  expense: [
    { id: 1, name: '餐饮', icon: '🍽️', color: '#FF6B6B', isDefault: true },
    { id: 2, name: '交通', icon: '🚗', color: '#4ECDC4', isDefault: true },
    { id: 3, name: '购物', icon: '🛍️', color: '#45B7D1', isDefault: true },
    { id: 4, name: '娱乐', icon: '🎮', color: '#96CEB4', isDefault: true },
    { id: 5, name: '医疗', icon: '🏥', color: '#FFEAA7', isDefault: true },
    { id: 6, name: '教育', icon: '📚', color: '#DDA0DD', isDefault: true },
    { id: 7, name: '住房', icon: '🏠', color: '#98D8C8', isDefault: true },
    { id: 8, name: '通讯', icon: '📱', color: '#F7DC6F', isDefault: true }
  ],
  income: [
    { id: 9, name: '工资', icon: '💰', color: '#58D68D', isDefault: true },
    { id: 10, name: '奖金', icon: '🏆', color: '#F4D03F', isDefault: true },
    { id: 11, name: '投资', icon: '📈', color: '#85C1E9', isDefault: true },
    { id: 12, name: '兼职', icon: '💼', color: '#F8C471', isDefault: true },
    { id: 13, name: '礼金', icon: '🧧', color: '#EC7063', isDefault: true },
    { id: 14, name: '其他', icon: '💵', color: '#A569BD', isDefault: true }
  ]
}

// 定义记账本store
export const useAccountStore = defineStore('account', () => {
  // 账单记录列表
  const records = ref([])
  
  // 分类数据
  const categories = ref(DEFAULT_CATEGORIES)
  
  // 下一个记录ID
  const nextRecordId = ref(1)
  
  // 下一个分类ID
  const nextCategoryId = ref(15)

  // 计算属性：总记录数
  const totalRecords = computed(() => records.value.length)

  // 计算属性：本月支出
  const monthlyExpense = computed(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return records.value
      .filter(record => {
        const recordDate = new Date(record.date)
        return record.type === 'expense' && 
               recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear
      })
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  })

  // 计算属性：本月收入
  const monthlyIncome = computed(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return records.value
      .filter(record => {
        const recordDate = new Date(record.date)
        return record.type === 'income' && 
               recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear
      })
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  })

  // 计算属性：本月结余
  const monthlyBalance = computed(() => {
    return monthlyIncome.value - monthlyExpense.value
  })

  // 计算属性：今日支出
  const todayExpense = computed(() => {
    const today = new Date().toDateString()
    
    return records.value
      .filter(record => {
        const recordDate = new Date(record.date).toDateString()
        return record.type === 'expense' && recordDate === today
      })
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  })

  // 计算属性：今日收入
  const todayIncome = computed(() => {
    const today = new Date().toDateString()
    
    return records.value
      .filter(record => {
        const recordDate = new Date(record.date).toDateString()
        return record.type === 'income' && recordDate === today
      })
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  })

  // 计算属性：按日期分组的记录
  const recordsByDate = computed(() => {
    const grouped = {}
    
    records.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(record => {
        const dateKey = new Date(record.date).toDateString()
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            date: record.date,
            records: [],
            totalExpense: 0,
            totalIncome: 0
          }
        }
        
        grouped[dateKey].records.push(record)
        
        if (record.type === 'expense') {
          grouped[dateKey].totalExpense += parseFloat(record.amount)
        } else {
          grouped[dateKey].totalIncome += parseFloat(record.amount)
        }
      })
    
    return Object.values(grouped)
  })

  // 初始化记账本数据
  function initAccountData() {
    try {
      const storedData = Taro.getStorageSync(ACCOUNT_STORAGE_KEY)
      if (storedData) {
        const { recordList, categoryData, nextRecordIdValue, nextCategoryIdValue } = JSON.parse(storedData)
        
        records.value = recordList || []
        categories.value = categoryData || DEFAULT_CATEGORIES
        nextRecordId.value = nextRecordIdValue || 1
        nextCategoryId.value = nextCategoryIdValue || 15
        
        console.log('记账本数据已恢复:', {
          totalRecords: totalRecords.value,
          monthlyExpense: monthlyExpense.value,
          monthlyIncome: monthlyIncome.value
        })
      } else {
        // 首次使用，初始化默认数据
        categories.value = DEFAULT_CATEGORIES
        records.value = []
        nextRecordId.value = 1
        nextCategoryId.value = 15
        saveToStorage()
      }
    } catch (error) {
      console.error('初始化记账本数据失败:', error)
      // 初始化默认数据
      categories.value = DEFAULT_CATEGORIES
      records.value = []
      nextRecordId.value = 1
      nextCategoryId.value = 15
    }
  }

  // 保存数据到本地存储
  function saveToStorage() {
    try {
      const dataToSave = {
        recordList: records.value,
        categoryData: categories.value,
        nextRecordIdValue: nextRecordId.value,
        nextCategoryIdValue: nextCategoryId.value,
        lastUpdated: Date.now()
      }
      Taro.setStorageSync(ACCOUNT_STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('保存记账本数据失败:', error)
    }
  }

  // 添加记账记录
  function addRecord(recordData) {
    try {
      const newRecord = {
        id: nextRecordId.value++,
        type: recordData.type, // 'expense' | 'income'
        amount: parseFloat(recordData.amount),
        categoryId: recordData.categoryId,
        categoryName: recordData.categoryName,
        categoryIcon: recordData.categoryIcon,
        date: recordData.date || new Date().toISOString(),
        note: recordData.note || '',
        images: recordData.images || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      records.value.unshift(newRecord) // 添加到列表顶部
      saveToStorage()

      console.log('新记录已添加:', newRecord)
      return newRecord
    } catch (error) {
      console.error('添加记录失败:', error)
      return null
    }
  }

  // 更新记账记录
  function updateRecord(recordId, updates) {
    try {
      const recordIndex = records.value.findIndex(record => record.id === recordId)
      if (recordIndex === -1) {
        console.warn('记录不存在:', recordId)
        return false
      }

      const updatedRecord = {
        ...records.value[recordIndex],
        ...updates,
        updatedAt: Date.now()
      }

      records.value[recordIndex] = updatedRecord
      saveToStorage()

      console.log('记录已更新:', updatedRecord)
      return true
    } catch (error) {
      console.error('更新记录失败:', error)
      return false
    }
  }

  // 删除记账记录
  function deleteRecord(recordId) {
    try {
      const recordIndex = records.value.findIndex(record => record.id === recordId)
      if (recordIndex === -1) {
        console.warn('记录不存在:', recordId)
        return false
      }

      const deletedRecord = records.value.splice(recordIndex, 1)[0]
      saveToStorage()

      console.log('记录已删除:', deletedRecord)
      return true
    } catch (error) {
      console.error('删除记录失败:', error)
      return false
    }
  }

  // 获取指定类型的分类
  function getCategoriesByType(type) {
    return categories.value[type] || []
  }

  // 添加自定义分类
  function addCategory(type, categoryData) {
    try {
      const newCategory = {
        id: nextCategoryId.value++,
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color || '#999999',
        isDefault: false,
        createdAt: Date.now()
      }

      if (!categories.value[type]) {
        categories.value[type] = []
      }

      categories.value[type].push(newCategory)
      saveToStorage()

      console.log('新分类已添加:', newCategory)
      return newCategory
    } catch (error) {
      console.error('添加分类失败:', error)
      return null
    }
  }

  // 删除自定义分类
  function deleteCategory(type, categoryId) {
    try {
      if (!categories.value[type]) return false

      const categoryIndex = categories.value[type].findIndex(cat => cat.id === categoryId)
      if (categoryIndex === -1) return false

      const category = categories.value[type][categoryIndex]
      
      // 不能删除默认分类
      if (category.isDefault) {
        console.warn('不能删除默认分类:', category)
        return false
      }

      categories.value[type].splice(categoryIndex, 1)
      saveToStorage()

      console.log('分类已删除:', category)
      return true
    } catch (error) {
      console.error('删除分类失败:', error)
      return false
    }
  }

  // 获取统计数据
  function getStatistics(period = 'month') {
    const now = new Date()
    let startDate, endDate

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        break
    }

    const filteredRecords = records.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= startDate && recordDate < endDate
    })

    const expense = filteredRecords
      .filter(record => record.type === 'expense')
      .reduce((total, record) => total + record.amount, 0)

    const income = filteredRecords
      .filter(record => record.type === 'income')
      .reduce((total, record) => total + record.amount, 0)

    return {
      period,
      expense,
      income,
      balance: income - expense,
      recordCount: filteredRecords.length
    }
  }

  // 清空所有数据
  function clearAllData() {
    try {
      records.value = []
      categories.value = DEFAULT_CATEGORIES
      nextRecordId.value = 1
      nextCategoryId.value = 15
      saveToStorage()
      console.log('所有数据已清空')
      return true
    } catch (error) {
      console.error('清空数据失败:', error)
      return false
    }
  }

  // 导出数据
  function exportData() {
    return {
      records: records.value,
      categories: categories.value,
      statistics: {
        totalRecords: totalRecords.value,
        monthlyExpense: monthlyExpense.value,
        monthlyIncome: monthlyIncome.value,
        monthlyBalance: monthlyBalance.value
      },
      exportTime: Date.now()
    }
  }

  // 导入数据
  function importData(data) {
    try {
      if (data.records && Array.isArray(data.records)) {
        records.value = data.records
      }
      if (data.categories) {
        categories.value = data.categories
      }
      saveToStorage()
      console.log('数据导入成功:', data)
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }

  // 返回store的状态和方法
  return {
    // 状态
    records,
    categories,
    nextRecordId,
    nextCategoryId,
    
    // 计算属性
    totalRecords,
    monthlyExpense,
    monthlyIncome,
    monthlyBalance,
    todayExpense,
    todayIncome,
    recordsByDate,

    // 方法
    initAccountData,
    addRecord,
    updateRecord,
    deleteRecord,
    getCategoriesByType,
    addCategory,
    deleteCategory,
    getStatistics,
    clearAllData,
    exportData,
    importData
  }
})
