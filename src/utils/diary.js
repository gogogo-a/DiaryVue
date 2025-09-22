/**
 * 日记相关API接口
 *
 * 提供日记相关的所有接口方法，包括：
 * - 获取日记列表
 * - 创建日记
 * - 更新日记
 * - 删除日记
 * - 日记搜索等
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-21
 */

import http from "./http";

/**
 * 日记API类
 */
class DiaryAPI {
  /**
   * 获取日记列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，最小值为1（默认为1）
   * @param {number} params.page_size - 每页数量，范围1-100（默认为10）
   * @param {string} params.keyword - 搜索关键词（标题/内容模糊匹配）
   * @param {Array<string>} params.tag_ids - 标签ID数组（多标签筛选）
   * @param {string} params.permission_id - 权限ID筛选
   * @returns {Promise<Object>} 日记列表数据
   */
  async getDiaryList(params = {}) {
    try {
      console.log("🟢 开始获取日记列表，参数:", params);

      // 设置默认参数
      const queryParams = {
        page: 1,
        page_size: 10,
        ...params,
      };

      // 验证参数
      if (queryParams.page < 1) {
        queryParams.page = 1;
      }

      if (queryParams.page_size < 1 || queryParams.page_size > 100) {
        queryParams.page_size = 10;
      }

      // 调用接口，token会自动添加到请求头中
      const response = await http.get("/diary", queryParams);

      console.log("✅ 获取日记列表成功，返回数据结构:", response);

      // 检查响应数据结构 - http客户端已经处理了code和data的解析
      // 这里的response就是实际的数据内容：{list: [], total: 0, page: 1, page_size: 10}
      if (response && typeof response === "object") {
        console.log("✅ 接口返回成功，数据:", response);
        console.log(
          "✅ 日记列表数量:",
          response.list ? response.list.length : 0
        );
        return response; // 直接返回响应数据
      } else {
        console.warn("⚠️ 接口返回数据格式异常:", response);
        throw new Error(`接口返回异常: 数据格式不正确`);
      }
    } catch (error) {
      console.error("❌ 获取日记列表失败:", error);
      throw error;
    }
  }
}

// 创建日记API实例
const diaryAPI = new DiaryAPI();

// 导出API实例和类
export default diaryAPI;
export { DiaryAPI };
