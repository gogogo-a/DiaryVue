/**
 * 账单管理API
 *
 * 提供账单相关的所有接口调用方法：
 * - 账单CRUD操作
 * - 账单统计查询
 *
 * 基于接口文档实现，使用全局HTTP客户端
 */

import http from '../../../utils/http'

class BillsAPI {
  /**
   * 获取账单列表
   * @param {Object} params - 查询参数
   * @param {string} params.account_book_id - 账本ID (必填)
   * @param {number} params.page - 页码，默认为1
   * @param {number} params.page_size - 每页数量，默认为10，最大100
   * @param {string} params.type - 账单类型 (income/expense)
   * @param {string} params.tag_ids - 标签ID数组，多个以逗号分隔
   * @param {string} params.start_time - 开始时间 (YYYY-MM-DD)
   * @param {string} params.end_time - 结束时间 (YYYY-MM-DD)
   * @param {number} params.min_amount - 最小金额
   * @param {number} params.max_amount - 最大金额
   * @param {string} params.keyword - 搜索关键词
   * @returns {Promise<Object>} 响应数据: { list: [...], total: 100, page: 1, page_size: 10 }
   */
  async getBills(params = {}) {
    // 转换参数名称以匹配后端期望
    const queryParams = {}
    if (params.account_book_id) queryParams.accountBookID = params.account_book_id
    if (params.page) queryParams.page = params.page
    if (params.page_size) queryParams.page_size = params.page_size
    if (params.type) queryParams.type = params.type
    if (params.tag_ids) queryParams.tag_ids = params.tag_ids
    if (params.start_time) queryParams.start_time = params.start_time
    if (params.end_time) queryParams.end_time = params.end_time
    if (params.min_amount) queryParams.min_amount = params.min_amount
    if (params.max_amount) queryParams.max_amount = params.max_amount
    if (params.keyword) queryParams.keyword = params.keyword

    return http.get('/bills', queryParams)
  }

  /**
   * 创建账单
   * @param {Object} billData - 账单数据
   * @param {string} billData.account_book_id - 账本UUID
   * @param {number} billData.amount - 金额
   * @param {string} billData.type - 账单类型 (income/expense)
   * @param {Array<string>} billData.tag_ids - 标签UUID数组
   * @param {string} billData.bill_time - 账单时间 (2023-01-01T00:00:00Z)
   * @param {string} billData.remark - 备注
   * @param {string} billData.image_url - 图片URL
   * @returns {Promise<Object>} 创建的账单对象
   */
  async createBill(billData) {
    return http.post('/bills', billData)
  }

  /**
   * 更新账单
   * @param {string} billId - 账单ID
   * @param {Object} updates - 更新数据
   * @param {string} updates.account_book_id - 账本UUID
   * @param {number} updates.amount - 金额
   * @param {string} updates.type - 账单类型 (income/expense)
   * @param {Array<string>} updates.tag_ids - 标签UUID数组
   * @param {string} updates.bill_time - 账单时间
   * @param {string} updates.remark - 备注
   * @param {string} updates.image_url - 图片URL
   * @returns {Promise<Object>} 更新后的账单对象
   */
  async updateBill(billId, updates) {
    return http.put(`/bills/${billId}`, updates)
  }

  /**
   * 删除账单
   * @param {string} billId - 账单ID
   * @returns {Promise<null>} 删除成功返回null
   */
  async deleteBill(billId) {
    return http.delete(`/bills/${billId}`)
  }

  /**
   * 获取账单详情
   * @param {string} billId - 账单ID
   * @returns {Promise<Object>} 账单详细信息
   */
  async getBillDetail(billId) {
    return http.get(`/bills/${billId}`)
  }

  /**
   * 获取账单统计
   * @param {Object} params - 统计参数
   * @param {string} params.account_book_id - 账本ID (必填)
   * @param {string} params.start_time - 开始时间 (YYYY-MM-DD)
   * @param {string} params.end_time - 结束时间 (YYYY-MM-DD)
   * @param {string} params.group_by - 分组方式 (day/week/month/year)
   * @returns {Promise<Object>} 统计数据
   */
  async getBillStats(params = {}) {
    // 转换参数名称以匹配后端期望
    const queryParams = {}
    if (params.account_book_id) queryParams.AccountBookID = params.account_book_id
    if (params.start_time) queryParams.start_time = params.start_time
    if (params.end_time) queryParams.end_time = params.end_time
    if (params.group_by) queryParams.group_by = params.group_by

    return http.get('/bills/stats', queryParams)
  }

  /**
   * 获取标签列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 标签分类 (bill/diary)
   * @returns {Promise<Array>} 标签列表
   */
  async getTags(params = {}) {
    const queryParams = {}
    if (params.category) queryParams.category = params.category

    return http.get('/tags', queryParams)
  }
}

// 创建API实例
const billsAPI = new BillsAPI()

// 导出API方法
export const {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  getBillDetail,
  getBillStats,
  getTags
} = billsAPI

// 默认导出API实例
export default billsAPI
