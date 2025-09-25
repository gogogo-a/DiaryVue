/**
 * 日记详情页面工具函数
 *
 * 提供日记详情相关的工具方法，包括：
 * - 格式化日期时间
 * - 处理标签显示
 * - 处理权限显示
 * - 数据转换等
 *
 * 作者: DiaryVue团队
 * 版本: 1.0.0
 * 最后更新: 2025-09-23
 */

/**
 * 格式化发布时间
 * @param {string} dateString - ISO日期字符串
 * @returns {string} 格式化后的时间字符串
 */
export const formatPublishTime = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // 小于1分钟
    if (diff < 60 * 1000) {
      return "刚刚";
    }

    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}分钟前`;
    }

    // 小于24小时
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }

    // 小于7天
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }

    // 超过7天，显示具体日期
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // 如果是当年，不显示年份
    if (year === now.getFullYear()) {
      return `${month}-${day} ${hours}:${minutes}`;
    } else {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error("格式化时间失败:", error);
    return dateString;
  }
};

/**
 * 获取权限显示文本
 * @param {Object} permission - 权限对象
 * @returns {string} 权限显示文本
 */
export const getPermissionText = (permission) => {
  if (!permission) return "未知";

  const permissionMap = {
    public: "公开",
    private: "私密",
    friends: "好友可见",
    password: "密码保护",
  };

  return (
    permissionMap[permission.permission_name] ||
    permission.permission_name ||
    "未知"
  );
};

/**
 * 获取权限图标
 * @param {Object} permission - 权限对象
 * @returns {string} 权限图标
 */
export const getPermissionIcon = (permission) => {
  if (!permission) return "🔒";

  const iconMap = {
    public: "🌍",
    private: "🔒",
    friends: "👥",
    password: "🔐",
  };

  return iconMap[permission.permission_name] || "🔒";
};

/**
 * 格式化标签显示
 * @param {Array} tags - 标签数组
 * @returns {Array} 格式化后的标签数组
 */
export const formatTags = (tags) => {
  if (!Array.isArray(tags)) return [];

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.tag_name,
    type: tag.type,
    category: tag.category,
    displayText: `#${tag.tag_name}`,
  }));
};

/**
 * 格式化阅读量显示
 * @param {number} pageview - 阅读量
 * @returns {string} 格式化后的阅读量
 */
export const formatPageview = (pageview) => {
  if (!pageview || pageview < 0) return "0";

  if (pageview >= 10000) {
    return `${(pageview / 10000).toFixed(1)}万`;
  } else if (pageview >= 1000) {
    return `${(pageview / 1000).toFixed(1)}k`;
  } else {
    return pageview.toString();
  }
};

/**
 * 格式化点赞数显示
 * @param {number} like - 点赞数
 * @returns {string} 格式化后的点赞数
 */
export const formatLikeCount = (like) => {
  if (!like || like < 0) return "0";

  if (like >= 10000) {
    return `${(like / 10000).toFixed(1)}万`;
  } else if (like >= 1000) {
    return `${(like / 1000).toFixed(1)}k`;
  } else {
    return like.toString();
  }
};

/**
 * 处理内容显示（处理换行、链接等）
 * @param {string} content - 原始内容
 * @returns {string} 处理后的内容
 */
export const processContent = (content) => {
  if (!content) return "";

  // 处理换行符
  return content.replace(/\n/g, "\n");
};

/**
 * 获取默认作者名称
 * @returns {string} 默认作者名称
 */
export const getDefaultAuthorName = () => {
  return "匿名用户";
};

/**
 * 验证日记详情数据结构
 * @param {Object} data - 日记详情数据
 * @returns {boolean} 数据是否有效
 */
export const validateDiaryDetail = (data) => {
  if (!data || typeof data !== "object") {
    return false;
  }

  // 检查必要字段
  const requiredFields = ["diary"];
  for (const field of requiredFields) {
    if (!data[field]) {
      console.warn(`日记详情数据缺少必要字段: ${field}`);
      return false;
    }
  }

  // 检查日记对象的必要字段
  const diaryRequiredFields = ["id", "title", "content"];
  for (const field of diaryRequiredFields) {
    if (data.diary[field] === undefined || data.diary[field] === null) {
      console.warn(`日记对象缺少必要字段: ${field}`);
      return false;
    }
  }

  return true;
};
