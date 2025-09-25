/**
 * 开发页面列表管理
 * 在此文件中添加正在开发的页面，会自动显示在开发页面列表中
 */

// 开发中的页面列表
const devPages = [
  {
    id: 'supabase-upload',
    title: 'Supabase上传测试',
    description: '测试Supabase存储功能的上传组件',
    path: '/pages/dev_page/SupabaseUpload/SupabaseUpload',
    icon: 'cloud-upload' // 可以根据实际情况使用图标
  }
  // 在这里添加更多开发中的页面
  // {
  //   id: 'new-feature',
  //   title: '新功能名称',
  //   description: '新功能描述',
  //   path: '/pages/dev_page/NewFeature/new_feature',
  //   icon: 'feature-icon'
  // }
]

/**
 * 获取所有开发页面列表
 * @returns {Array} 开发页面列表
 */
export const getDevPages = () => {
  return devPages
}

/**
 * 根据ID获取开发页面
 * @param {string} id 页面ID
 * @returns {Object|null} 页面信息或null
 */
export const getDevPageById = (id) => {
  return devPages.find(page => page.id === id) || null
}

/**
 * 检查是否为有效的开发页面路径
 * @param {string} path 页面路径
 * @returns {boolean} 是否为有效的开发页面
 */
export const isValidDevPage = (path) => {
  return devPages.some(page => page.path === path)
}

export default {
  getDevPages,
  getDevPageById,
  isValidDevPage
} 