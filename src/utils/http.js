/**
 * HTTP请求封装
 *
 * 基于Taro.request封装，提供：
 * - 请求拦截器（自动添加token等）
 * - 响应拦截器（统一错误处理）
 * - token自动刷新机制
 * - 请求重试机制
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-17
 */

import Taro from "@tarojs/taro";
import tokenManager from "./tokenmanager";

// 配置常量
const CONFIG = {
  // 基础URL（可根据环境变量配置）
  BASE_URL:
    process.env.NODE_ENV === "development"
      ? "http://8.140.245.242:8020/api/v1"
      : "http://8.140.245.242:8020/api/v1",

  // 请求超时时间（毫秒）
  TIMEOUT: 10000,

  // 最大重试次数
  MAX_RETRY_COUNT: 3,

  // 不需要token的接口（只有登录接口）
  NO_AUTH_URLS: ["/auth/wx-login"],

  // 不需要错误提示的接口
  SILENT_ERROR_URLS: ["/auth/wx-login"],
};

// 错误码映射
const ERROR_CODE_MAP = {
  // 网络错误
  fail: "网络异常，请检查网络连接",
  timeout: "请求超时，请重试",

  // HTTP状态码
  400: "请求参数有误",
  401: "身份认证失败",
  403: "没有权限访问",
  404: "请求的资源不存在",
  405: "请求方法不允许",
  408: "请求超时",
  429: "请求过于频繁，请稍后重试",
  500: "服务器内部错误",
  502: "网关错误",
  503: "服务暂不可用",
  504: "网关超时",

  // 业务错误码（示例）
  10001: "用户不存在",
  10002: "密码错误",
  10003: "用户已被禁用",
  20001: "日记不存在",
  20002: "没有权限操作此日记",
  30001: "账本不存在",
  30002: "余额不足",
};

class HttpClient {
  constructor() {
    // 正在刷新token的Promise
    this.refreshingPromise = null;
    // 等待重新发送的请求队列
    this.retryQueue = [];
  }

  // ================================
  // 请求拦截器
  // ================================

  /**
   * 处理请求配置
   * @param {Object} config - 请求配置
   * @returns {Object} 处理后的配置
   */
  processRequestConfig(config) {
    // 处理URL
    if (!config.url.startsWith("http")) {
      config.url = CONFIG.BASE_URL + config.url;
    }

    // 设置默认值
    config.timeout = config.timeout || CONFIG.TIMEOUT;
    config.method = (config.method || "GET").toUpperCase();

    // 设置默认headers
    config.header = {
      "Content-Type": "application/json",
      ...config.header,
    };

    // 添加通用信息
    this.addCommonHeaders(config);

    // 添加token
    this.addAuthToken(config);

    return config;
  }

  /**
   * 添加通用请求头
   * @param {Object} config - 请求配置
   */
  addCommonHeaders(config) {
    try {
      // 获取系统信息
      const systemInfo = Taro.getSystemInfoSync();

      // 添加设备信息
      config.header["X-Device-Type"] = systemInfo.platform || "unknown";
      config.header["X-Device-Model"] = systemInfo.model || "unknown";
      config.header["X-App-Version"] = "1.0.0"; // 可从配置文件读取
      config.header["X-Client-Type"] = "miniprogram";

      // 添加时间戳（用于防缓存）
      config.header["X-Timestamp"] = Date.now().toString();
    } catch (error) {
      console.warn("添加通用请求头失败:", error);
    }
  }

  /**
   * 添加认证token
   * @param {Object} config - 请求配置
   */
  addAuthToken(config) {
    // 检查是否跳过认证
    if (config.skipAuth) {
      console.log("跳过token认证:", config.url);
      return;
    }

    // 检查是否需要token
    const needsAuth = this.isAuthRequired(config.url);
    if (!needsAuth) return;

    // 获取token
    const authHeader = tokenManager.getAuthorizationHeader();
    if (authHeader) {
      config.header["Authorization"] = authHeader;
      console.log("已添加Authorization头");
    } else {
      console.warn("接口需要认证但没有token:", config.url);
    }
  }

  /**
   * 检查接口是否需要认证
   * @param {string} url - 请求URL
   * @returns {boolean} 是否需要认证
   */
  isAuthRequired(url) {
    // 默认所有接口都需要token，除了明确标记不需要的
    return !CONFIG.NO_AUTH_URLS.some((noAuthUrl) => url.includes(noAuthUrl));
  }

  // ================================
  // 响应拦截器
  // ================================

  /**
   * 处理响应数据
   * @param {Object} response - 响应对象
   * @param {Object} originalConfig - 原始请求配置
   * @returns {Promise} 处理后的响应
   */
  async processResponse(response, originalConfig) {
    const { statusCode, data } = response;

    // HTTP状态码检查
    if (statusCode >= 200 && statusCode < 300) {
      // 业务逻辑检查
      return this.handleBusinessLogic(data, originalConfig);
    } else {
      // HTTP错误处理
      return this.handleHttpError(statusCode, response, originalConfig);
    }
  }

  /**
   * 处理业务逻辑响应
   * @param {Object} data - 响应数据
   * @param {Object} originalConfig - 原始请求配置
   * @returns {Promise} 处理结果
   */
  async handleBusinessLogic(data, originalConfig) {
    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    const { code, message } = data;

    if (code === 200) {
      // 成功：直接返回data字段
      return Promise.resolve(data.data);
    } else if (code === 401) {
      // token失效，尝试刷新
      return this.handleTokenExpired(originalConfig);
    } else {
      // 其他业务错误
      return this.handleBusinessError(code, message, originalConfig);
    }
  }

  /**
   * 处理HTTP错误
   * @param {number} statusCode - HTTP状态码
   * @param {Object} response - 完整响应对象
   * @param {Object} originalConfig - 原始请求配置
   * @returns {Promise} 处理结果
   */
  async handleHttpError(statusCode, response, originalConfig) {
    console.error(`HTTP错误 ${statusCode}:`, response);

    if (statusCode === 401) {
      // 401: 尝试token刷新
      return this.handleTokenExpired(originalConfig);
    } else if (statusCode === 403) {
      // 403: 权限不足
      this.handlePermissionError();
      return Promise.reject(new Error(ERROR_CODE_MAP[403]));
    } else {
      // 其他HTTP错误
      const errorMessage =
        ERROR_CODE_MAP[statusCode] || `HTTP错误 ${statusCode}`;
      this.showErrorToast(errorMessage, originalConfig.url);
      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * 处理业务错误
   * @param {number} code - 业务错误码
   * @param {string} message - 错误消息
   * @param {Object} originalConfig - 原始请求配置
   * @returns {Promise} 处理结果
   */
  handleBusinessError(code, message, originalConfig) {
    const errorMessage = ERROR_CODE_MAP[code] || message || "操作失败";

    // 检查是否为静默请求，如果是则不显示错误提示
    const isSilent =
      originalConfig.skipAuth ||
      CONFIG.SILENT_ERROR_URLS.some((silentUrl) =>
        originalConfig.url.includes(silentUrl)
      );

    if (!isSilent) {
      // 显示错误提示
      this.showErrorToast(errorMessage, originalConfig.url);
    }

    // 特殊业务错误处理
    switch (code) {
      case 10003: // 用户被禁用
        this.handleUserDisabled();
        break;
      default:
        break;
    }

    // 对于静默请求，返回错误信息而不是抛出异常
    if (isSilent) {
      console.warn(`静默请求业务错误 [${code}]: ${errorMessage}`);
      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(new Error(errorMessage));
  }

  // ================================
  // Token刷新机制
  // ================================

  /**
   * 处理token过期
   * @param {Object} originalConfig - 原始请求配置
   * @returns {Promise} 处理结果
   */
  async handleTokenExpired(originalConfig) {
    console.log("Token已过期，尝试刷新...");

    // 如果已经在刷新中，将请求加入队列
    if (this.refreshingPromise) {
      return new Promise((resolve, reject) => {
        this.retryQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    // 开始刷新token
    this.refreshingPromise = this.refreshToken();

    try {
      await this.refreshingPromise;

      // token刷新成功后，userStore已经更新了tokenManager
      // 直接重新发送原请求
      const newConfig = { ...originalConfig };
      this.addAuthToken(newConfig); // 添加新token

      // 处理队列中的请求
      this.processRetryQueue(true);

      // 重新发送原请求
      return this.sendRequest(newConfig);
    } catch (error) {
      console.error("Token刷新失败:", error);

      // 处理队列中的请求
      this.processRetryQueue(false, error);

      // 跳转到登录页
      this.redirectToLogin();

      return Promise.reject(error);
    } finally {
      this.refreshingPromise = null;
    }
  }

  /**
   * 刷新token（委托给用户状态管理）
   * @returns {Promise} 刷新结果
   */
  async refreshToken() {
    try {
      console.log("委托用户状态管理处理token刷新...");

      // 动态导入user store，避免循环依赖
      const { useUserStore } = await import("../stores/user");
      const userStore = useUserStore();

      // 委托给userStore处理刷新逻辑
      const success = await userStore.silentLogin();

      if (success) {
        // 获取新的token信息
        const token = tokenManager.getAccessToken();
        if (token) {
          return {
            accessToken: token,
            refreshToken: token,
            expiresIn: 7200,
          };
        }
      }

      throw new Error("Token刷新失败");
    } catch (error) {
      console.error("Token刷新失败:", error);
      throw error;
    }
  }

  /**
   * 处理重试队列
   * @param {boolean} success - 刷新是否成功
   * @param {Error} error - 错误对象（如果失败）
   */
  processRetryQueue(success, error = null) {
    const queue = this.retryQueue.splice(0); // 清空队列

    queue.forEach(({ resolve, reject, config }) => {
      if (success) {
        // 重新发送请求
        this.addAuthToken(config);
        this.sendRequest(config).then(resolve).catch(reject);
      } else {
        // 拒绝请求
        reject(error || new Error("Token刷新失败"));
      }
    });
  }

  // ================================
  // 错误处理方法
  // ================================

  /**
   * 显示错误提示
   * @param {string} message - 错误消息
   * @param {string} url - 请求URL
   */
  showErrorToast(message, url) {
    // 检查是否为静默错误URL
    const isSilent = CONFIG.SILENT_ERROR_URLS.some((silentUrl) =>
      url.includes(silentUrl)
    );
    if (isSilent) return;

    Taro.showToast({
      title: message,
      icon: "none",
      duration: 2000,
    });
  }

  /**
   * 处理权限错误
   */
  handlePermissionError() {
    Taro.showModal({
      title: "提示",
      content: "您没有权限进行此操作，请联系管理员",
      showCancel: false,
      confirmText: "确定",
    });
  }

  /**
   * 处理用户被禁用
   */
  handleUserDisabled() {
    // 清除本地状态
    tokenManager.clearTokens();

    Taro.showModal({
      title: "账号异常",
      content: "您的账号已被禁用，请联系客服",
      showCancel: false,
      confirmText: "确定",
      success: () => {
        this.redirectToLogin();
      },
    });
  }

  /**
   * 跳转到登录页
   */
  redirectToLogin() {
    // 清除token
    tokenManager.clearTokens();

    // 获取当前页面
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentRoute = currentPage ? currentPage.route : "";

    // 如果当前不在登录相关页面，则跳转
    if (!currentRoute.includes("login") && !currentRoute.includes("index")) {
      Taro.reLaunch({
        url: "/pages/index/index",
      });
    }
  }

  // ================================
  // 网络错误处理
  // ================================

  /**
   * 处理网络错误
   * @param {Error} error - 错误对象
   * @param {Object} config - 请求配置
   * @returns {Promise} 处理结果
   */
  handleNetworkError(error, config) {
    console.error("网络请求失败:", error);

    let errorMessage = ERROR_CODE_MAP.fail;

    // 根据错误类型给出具体提示
    if (error.errMsg) {
      if (error.errMsg.includes("timeout")) {
        errorMessage = ERROR_CODE_MAP.timeout;
      } else if (error.errMsg.includes("fail")) {
        errorMessage = ERROR_CODE_MAP.fail;
      }
    }

    this.showErrorToast(errorMessage, config.url);
    return Promise.reject(new Error(errorMessage));
  }

  // ================================
  // 主要请求方法
  // ================================

  /**
   * 发送HTTP请求
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  async sendRequest(config) {
    try {
      // 处理请求配置
      const processedConfig = this.processRequestConfig(config);

      console.log("发送请求:", processedConfig.method, processedConfig.url);

      // 发送请求
      const response = await Taro.request(processedConfig);

      // 处理响应
      return this.processResponse(response, config);
    } catch (error) {
      // 处理网络错误
      return this.handleNetworkError(error, config);
    }
  }

  // ================================
  // 便捷方法
  // ================================

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 查询参数
   * @param {Object} config - 额外配置
   * @returns {Promise} 请求结果
   */
  get(url, params = {}, config = {}) {
    // 处理查询参数
    if (Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");
      url += (url.includes("?") ? "&" : "?") + queryString;
    }

    return this.sendRequest({
      url,
      method: "GET",
      ...config,
    });
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 额外配置
   * @returns {Promise} 请求结果
   */
  post(url, data = {}, config = {}) {
    return this.sendRequest({
      url,
      method: "POST",
      data,
      ...config,
    });
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 额外配置
   * @returns {Promise} 请求结果
   */
  put(url, data = {}, config = {}) {
    return this.sendRequest({
      url,
      method: "PUT",
      data,
      ...config,
    });
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} config - 额外配置
   * @returns {Promise} 请求结果
   */
  delete(url, config = {}) {
    return this.sendRequest({
      url,
      method: "DELETE",
      ...config,
    });
  }
}

// 创建HTTP客户端实例
const http = new HttpClient();

// 初始化token管理器与HTTP客户端的关联
tokenManager.init({
  onRefresh: async () => {
    try {
      await http.refreshToken();
      return true;
    } catch (error) {
      console.error("自动刷新token失败:", error);
      return false;
    }
  },
  onExpired: () => {
    console.log("Token已过期，需要重新登录");
    http.redirectToLogin();
  },
});

export default http;
