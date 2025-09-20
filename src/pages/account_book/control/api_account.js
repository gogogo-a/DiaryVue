/**
 * 账本管理API接口
 *
 * 提供账本相关的所有API调用方法：
 * - 账本CRUD操作
 * - 账本成员管理
 * - 账本统计数据
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-18
 */

import http from '../../../utils/http'

/**
 * 账本API类
 */
class AccountAPI {

  // ================================
  // 账本基础操作
  // ================================

  /**
   * 获取用户的账本列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.page_size - 每页数量，默认10
   * @param {string} params.keyword - 搜索关键词
   * @returns {Promise<Object>} 账本列表数据
   */
  async getAccountList(params = {}) {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      ...params
    }

    return http.get('/account-books')
  }


  /**
   * 获取账本详情
   * @param {string} accountId - 账本ID
   * @returns {Promise<Object>} 账本详情数据
   */
  async getAccountDetail(accountId) {
    return http.get(`/account-books/${accountId}`)
  }

  /**
   * 创建新账本
   * @param {Object} accountData - 账本数据
   * @param {string} accountData.name - 账本名称
   * @param {string} accountData.description - 账本描述
   * @param {string} accountData.currency - 货币类型，默认CNY
   * @param {string} accountData.icon - 账本图标
   * @param {string} accountData.color - 账本颜色
   * @returns {Promise<Object>} 创建的账本数据
   */
  async createAccount(accountData) {
    const data = {
      name: accountData.name,
      description: accountData.description || '',
      currency: accountData.currency || 'CNY',
      icon: accountData.icon || '💰',
      color: accountData.color || '#4ECDC4',
      ...accountData
    }

    return http.post('/account-books', data)
  }

  /**
   * 更新账本信息
   * @param {string} accountId - 账本ID
   * @param {Object} updates - 更新数据
   * @returns {Promise<Object>} 更新后的账本数据
   */
  async updateAccount(accountId, updates) {
    return http.put(`/account-books/${accountId}`, updates)
  }

  /**
   * 删除账本
   * @param {string} accountId - 账本ID
   * @returns {Promise<boolean>} 删除结果
   */
  async deleteAccount(accountId) {
    console.log('🗑️ [API] 删除账本:', {
      accountId: accountId,
      url: `/account-books/${accountId}`,
      method: 'DELETE'
    })
    return http.delete(`/account-books/${accountId}`)
  }

  // ================================
  // 账本成员管理
  // ================================

  /**
   * 获取账本成员列表
   * @param {string} accountId - 账本ID
   * @returns {Promise<Array>} 成员列表
   */
  async getAccountMembers(accountId) {
    return http.get(`/account-book-users/book/${accountId}`)
  }

  /**
   * 邀请用户加入账本
   * @param {string} accountId - 账本ID
   * @param {Object} inviteData - 邀请数据
   * @param {string} inviteData.user_id - 被邀请用户ID
   * @param {string} inviteData.role - 角色，默认member
   * @returns {Promise<Object>} 邀请结果
   */
  async inviteMember(accountId, inviteData) {
    const data = {
      account_book_id: accountId,
      user_id: inviteData.user_id,
      role: inviteData.role || 'member',
      ...inviteData
    }

    return http.post('/account-book-users/grant', data)
  }

  /**
   * 更新成员角色
   * @param {string} accountId - 账本ID
   * @param {string} memberId - 成员ID
   * @param {Object} updates - 更新数据
   * @param {string} updates.role - 新角色
   * @returns {Promise<Object>} 更新结果
   */
  async updateMemberRole(accountId, memberId, updates) {
    return http.put(`/accounts/${accountId}/members/${memberId}`, updates)
  }

  /**
   * 移除账本成员
   * @param {string} accountId - 账本ID
   * @param {string} memberId - 成员ID
   * @returns {Promise<boolean>} 移除结果
   */
  async removeMember(accountId, memberId) {
    const data = {
      account_book_id: accountId,
      user_id: memberId
    }
    return http.delete('/account-book-users/revoke', { data })
  }

  /**
   * 退出账本
   * @param {string} accountId - 账本ID
   * @returns {Promise<boolean>} 退出结果
   */
  async leaveAccount(accountId) {
    return http.post(`/accounts/${accountId}/leave`)
  }

  // ================================
  // 账单管理 (Bills)
  // ================================

  /**
   * 获取账单列表
   * @param {Object} params - 查询参数
   * @param {string} params.account_book_id - 账本ID (必填)
   * @param {number} params.page - 页码，默认1
   * @param {number} params.page_size - 每页数量，默认10，最大100
   * @param {string} params.type - 账单类型 (income/expense)
   * @param {string} params.tag_ids - 标签ID数组，多个以逗号分隔
   * @param {string} params.start_time - 开始时间 (YYYY-MM-DD)
   * @param {string} params.end_time - 结束时间 (YYYY-MM-DD)
   * @param {number} params.min_amount - 最小金额
   * @param {number} params.max_amount - 最大金额
   * @param {string} params.keyword - 搜索关键词
   * @returns {Promise<Object>} 账单列表数据
   */
  async getBills(params = {}) {
    return http.get('/bills', params)
  }

  /**
   * 创建账单
   * @param {Object} billData - 账单数据
   * @param {string} billData.account_book_id - 账本UUID
   * @param {number} billData.amount - 金额
   * @param {string} billData.type - 类型 (income/expense)
   * @param {Array} billData.tag_ids - 标签UUID数组
   * @param {string} billData.bill_time - 账单时间
   * @param {string} billData.remark - 备注
   * @param {string} billData.image_url - 图片URL
   * @returns {Promise<Object>} 创建的账单数据
   */
  async createBill(billData) {
    return http.post('/bills', billData)
  }

  /**
   * 更新账单
   * @param {string} billId - 账单ID
   * @param {Object} updates - 更新数据
   * @returns {Promise<Object>} 更新后的账单数据
   */
  async updateBill(billId, updates) {
    return http.put(`/bills/${billId}`, updates)
  }

  /**
   * 删除账单
   * @param {string} billId - 账单ID
   * @returns {Promise<boolean>} 删除结果
   */
  async deleteBill(billId) {
    return http.delete(`/bills/${billId}`)
  }

  /**
   * 获取账单详情
   * @param {string} billId - 账单ID
   * @returns {Promise<Object>} 账单详情数据
   */
  async getBillDetail(billId) {
    return http.get(`/bills/${billId}`)
  }

  /**
   * 获取账单统计
   * @param {Object} params - 查询参数
   * @param {string} params.account_book_id - 账本ID (必填)
   * @param {string} params.start_time - 开始时间 (YYYY-MM-DD)
   * @param {string} params.end_time - 结束时间 (YYYY-MM-DD)
   * @param {string} params.group_by - 分组方式 (day/week/month/year)
   * @returns {Promise<Object>} 统计数据
   */
  async getBillStats(params = {}) {
    return http.get('/bills/stats', params)
  }

  // ================================
  // 账本记录管理 (已废弃，请使用Bills接口)
  // ================================

  // ================================
  // 账本统计数据
  // ================================

  /**
   * 获取账本统计数据
   * @param {string} accountId - 账本ID
   * @param {Object} params - 查询参数
   * @param {string} params.period - 统计周期：day|week|month|year
   * @param {string} params.start_date - 开始日期
   * @param {string} params.end_date - 结束日期
   * @returns {Promise<Object>} 统计数据
   */
  async getAccountStatistics(accountId, params = {}) {
    const queryParams = {
      period: params.period || 'month',
      ...params
    }

    return http.get(`/accounts/${accountId}/statistics`, queryParams)
  }

  /**
   * 获取账本分类统计
   * @param {string} accountId - 账本ID
   * @param {Object} params - 查询参数
   * @param {string} params.type - 记录类型：income|expense
   * @param {string} params.period - 统计周期
   * @returns {Promise<Array>} 分类统计数据
   */
  async getCategoryStatistics(accountId, params = {}) {
    return http.get(`/accounts/${accountId}/statistics/categories`, params)
  }

  /**
   * 获取账本趋势数据
   * @param {string} accountId - 账本ID
   * @param {Object} params - 查询参数
   * @param {string} params.period - 统计周期
   * @param {number} params.limit - 数据点数量
   * @returns {Promise<Array>} 趋势数据
   */
  async getAccountTrends(accountId, params = {}) {
    const queryParams = {
      period: params.period || 'day',
      limit: params.limit || 30,
      ...params
    }

    return http.get(`/accounts/${accountId}/trends`, queryParams)
  }


  // ================================
  // 账本分类管理
  // ================================

  /**
   * 获取账本分类列表
   * @param {string} accountId - 账本ID
   * @param {string} type - 分类类型：income|expense
   * @returns {Promise<Array>} 分类列表
   */
  async getAccountCategories(accountId, type) {
    return http.get(`/accounts/${accountId}/categories`, { type })
  }

  /**
   * 创建自定义分类
   * @param {string} accountId - 账本ID
   * @param {Object} categoryData - 分类数据
   * @param {string} categoryData.name - 分类名称
   * @param {string} categoryData.type - 分类类型：income|expense
   * @param {string} categoryData.icon - 分类图标
   * @param {string} categoryData.color - 分类颜色
   * @returns {Promise<Object>} 创建的分类数据
   */
  async createAccountCategory(accountId, categoryData) {
    return http.post(`/accounts/${accountId}/categories`, categoryData)
  }

  /**
   * 更新分类信息
   * @param {string} accountId - 账本ID
   * @param {string} categoryId - 分类ID
   * @param {Object} updates - 更新数据
   * @returns {Promise<Object>} 更新后的分类数据
   */
  async updateAccountCategory(accountId, categoryId, updates) {
    return http.put(`/accounts/${accountId}/categories/${categoryId}`, updates)
  }

  /**
   * 删除自定义分类
   * @param {string} accountId - 账本ID
   * @param {string} categoryId - 分类ID
   * @returns {Promise<boolean>} 删除结果
   */
  async deleteAccountCategory(accountId, categoryId) {
    return http.delete(`/accounts/${accountId}/categories/${categoryId}`)
  }

  // ================================
  // 账本数据导入导出
  // ================================

  /**
   * 导出账本数据
   * @param {string} accountId - 账本ID
   * @param {Object} params - 导出参数
   * @param {string} params.format - 导出格式：json|csv|excel
   * @param {string} params.start_date - 开始日期
   * @param {string} params.end_date - 结束日期
   * @returns {Promise<Object>} 导出数据或下载链接
   */
  async exportAccountData(accountId, params = {}) {
    const queryParams = {
      format: params.format || 'json',
      ...params
    }

    return http.get(`/accounts/${accountId}/export`, queryParams)
  }

  /**
   * 导入账本数据
   * @param {string} accountId - 账本ID
   * @param {Object} importData - 导入数据
   * @param {string} importData.format - 导入格式
   * @param {string} importData.data - 导入内容
   * @returns {Promise<Object>} 导入结果
   */
  async importAccountData(accountId, importData) {
    return http.post(`/accounts/${accountId}/import`, importData)
  }

  // ================================
  // 账本权限管理
  // ================================

  /**
   * 检查用户对账本的权限
   * @param {string} accountId - 账本ID
   * @param {string} action - 操作类型：read|write|admin
   * @returns {Promise<boolean>} 权限检查结果
   */
  async checkAccountPermission(accountId, action) {
    return http.get(`/accounts/${accountId}/permissions`, { action })
  }

  /**
   * 获取账本邀请链接
   * @param {string} accountId - 账本ID
   * @param {Object} options - 邀请选项
   * @param {number} options.expires_in - 过期时间（秒）
   * @param {string} options.role - 默认角色
   * @returns {Promise<Object>} 邀请链接信息
   */
  async generateInviteLink(accountId, options = {}) {
    const data = {
      expires_in: options.expires_in || 86400, // 默认24小时
      role: options.role || 'member',
      ...options
    }

    return http.post(`/accounts/${accountId}/invite-link`, data)
  }

  /**
   * 通过邀请链接加入账本
   * @param {string} inviteCode - 邀请码
   * @returns {Promise<Object>} 加入结果
   */
  async joinAccountByInvite(inviteCode) {
    return http.post(`/accounts/join/${inviteCode}`)
  }
}

// 创建API实例
const accountAPI = new AccountAPI()

// 导出API实例和类
export default accountAPI
export { AccountAPI }

// 为了兼容性，也导出常用的方法
export const {
  getAccountList,
  getAccountDetail,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountMembers,
  inviteMember,
  removeMember,
  getBills,
  createBill,
  updateBill,
  deleteBill,
  getBillDetail,
  getBillStats,
  getAccountStatistics,
  getCategoryStatistics,
  getAccountTrends
} = accountAPI
