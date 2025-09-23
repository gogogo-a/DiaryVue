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

  /**
   * 获取日记详情
   * @param {string} id - 日记ID
   * @returns {Promise<Object>} 日记详情数据
   */
  async getDiaryDetail(id) {
    try {
      console.log("🟢 开始获取日记详情，ID:", id);

      if (!id) {
        throw new Error("日记ID不能为空");
      }

      // 调用接口，token会自动添加到请求头中
      const response = await http.get(`/diary/${id}`);

      console.log("✅ 获取日记详情成功:", response);

      // 检查响应数据结构
      if (response && typeof response === "object") {
        console.log("✅ 日记详情数据:", response);
        return response; // 直接返回响应数据
      } else {
        console.warn("⚠️ 接口返回数据格式异常:", response);
        throw new Error(`接口返回异常: 数据格式不正确`);
      }
    } catch (error) {
      console.error("❌ 获取日记详情失败:", error);
      throw error;
    }
  }

  /**
   * 创建日记
   * @param {Object} diaryData - 日记数据
   * @param {string} diaryData.title - 日记标题
   * @param {string} diaryData.content - 日记内容
   * @param {string} diaryData.permission_id - 权限ID
   * @param {Array<string>} diaryData.tag_ids - 标签ID数组
   * @param {string} diaryData.address - 地点信息（可选）
   * @param {Array<string>} diaryData.image_urls - 图片URL数组（可选）
   * @param {Array<string>} diaryData.video_urls - 视频URL数组（可选）
   * @returns {Promise<Object>} 创建结果
   */
  async createDiary(diaryData) {
    try {
      console.log("🟢 开始创建日记:", diaryData);

      // 验证必填参数
      const requiredFields = ["title", "content", "permission_id", "tag_ids"];
      for (const field of requiredFields) {
        if (!diaryData[field]) {
          throw new Error(`缺少必填参数: ${field}`);
        }
      }

      // 验证tag_ids是数组
      if (!Array.isArray(diaryData.tag_ids)) {
        throw new Error("tag_ids必须是数组");
      }

      // 调用接口
      const response = await http.post("/diary", diaryData);

      console.log("✅ 创建日记成功:", response);
      return response;
    } catch (error) {
      console.error("❌ 创建日记失败:", error);
      throw error;
    }
  }

  /**
   * 获取标签列表
   * @returns {Promise<Array>} 标签列表
   */
  async getTags() {
    try {
      console.log("🟢 开始获取标签列表");

      const response = await http.get("/tags");

      console.log("✅ 获取标签列表成功:", response);
      return response;
    } catch (error) {
      console.error("❌ 获取标签列表失败:", error);
      throw error;
    }
  }

  /**
   * 获取权限列表
   * @returns {Promise<Array>} 权限列表
   */
  async getPermissions() {
    try {
      console.log("🟢 开始获取权限列表");

      const response = await http.get("/permissions");

      console.log("✅ 获取权限列表成功:", response);
      return response;
    } catch (error) {
      console.error("❌ 获取权限列表失败:", error);
      throw error;
    }
  }

  /**
   * 删除日记
   * @param {string} id - 日记ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteDiary(id) {
    try {
      console.log("🟢 开始删除日记，ID:", id);

      if (!id) {
        throw new Error("日记ID不能为空");
      }

      // 调用接口删除日记
      const response = await http.delete(`/diary/${id}`);

      console.log("✅ 删除日记成功:", response);
      return response;
    } catch (error) {
      console.error("❌ 删除日记失败:", error);
      throw error;
    }
  }

  /**
   * 更新日记
   * @param {string} id - 日记ID
   * @param {Object} diaryData - 更新的日记数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateDiary(id, diaryData) {
    try {
      console.log("🟢 开始更新日记，ID:", id, "数据:", diaryData);

      if (!id) {
        throw new Error("日记ID不能为空");
      }

      // 验证必填参数
      const requiredFields = ["title", "content", "permission_id", "tag_ids"];
      for (const field of requiredFields) {
        if (!diaryData[field]) {
          throw new Error(`缺少必填参数: ${field}`);
        }
      }

      // 验证tag_ids是数组
      if (!Array.isArray(diaryData.tag_ids)) {
        throw new Error("tag_ids必须是数组");
      }

      // 调用接口更新日记
      const response = await http.put(`/diary/${id}`, diaryData);

      console.log("✅ 更新日记成功:", response);
      return response;
    } catch (error) {
      console.error("❌ 更新日记失败:", error);
      throw error;
    }
  }
}

// 创建日记API实例
const diaryAPI = new DiaryAPI();

// 导出API实例和类
export default diaryAPI;
export { DiaryAPI };
