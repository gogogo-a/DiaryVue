/**
 * 小程序环境下的文件上传工具
 * 使用微信小程序API实现上传功能
 */
import Taro from '@tarojs/taro'

// Supabase配置
export const SUPABASE_URL = 'https://zkfrpguscpvnbyklfrmi.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5dA8r0l2vh5G9Bl4iC5V8A_j8XIdhA-'

/**
 * 上传文件到Supabase Storage
 * 使用小程序的上传API，不依赖Supabase SDK
 * @param {Object} options 上传选项
 * @param {string} options.bucket 存储桶名称
 * @param {string} options.filePath 本地文件路径
 * @param {string} options.fileName 文件名称（可选，默认使用原文件名）
 * @param {string} options.folder 存储文件夹路径（可选）
 * @param {Function} options.onProgress 上传进度回调（可选）
 * @returns {Promise<Object>} 上传结果
 */
export const uploadFileToSupabase = async (options) => {
  const { bucket, filePath, fileName, folder = '', onProgress } = options
  
  if (!bucket || !filePath) {
    throw new Error('缺少必要参数：bucket和filePath')
  }
  
  try {
    // 获取文件信息
    const fileInfo = await Taro.getFileInfo({ filePath })
    
    // 获取文件扩展名
    const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1)
    
    // 生成唯一文件名
    const uniqueFileName = fileName || `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`
    
    // 构建完整的存储路径
    const storagePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName
    
    // 构建上传URL - 使用新的URL格式
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`
    
    // 确定Content-Type
    let contentType
    switch (fileExt.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'mp4':
        contentType = 'video/mp4'
        break
      default:
        contentType = 'application/octet-stream'
    }
    
    console.log('上传URL:', uploadUrl)
    console.log('文件路径:', filePath)
    console.log('Content-Type:', contentType)
    console.log('使用apikey:', SUPABASE_PUBLISHABLE_KEY)
    
    // 使用Taro的上传API
    const uploadTask = Taro.uploadFile({
      url: uploadUrl,
      filePath: filePath,
      name: 'file', // 必须是'file'
      header: {
        'apikey': SUPABASE_PUBLISHABLE_KEY, // 使用apikey进行身份验证
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      success: (res) => {
        console.log('上传响应:', res)
      },
      fail: (error) => {
        console.error('上传失败:', error)
      }
    })
    
    // 监听上传进度
    if (onProgress) {
      uploadTask.progress((res) => {
        onProgress(res.progress)
      })
    }
    
    // 等待上传完成
    return new Promise((resolve, reject) => {
      uploadTask.then(res => {
        if (res.statusCode === 200) {
          // 构建公共URL
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`
          
          resolve({
            success: true,
            data: {
              publicUrl,
              fileName: uniqueFileName,
              size: fileInfo.size,
              storagePath
            }
          })
        } else {
          reject({
            success: false,
            error: `上传失败，状态码: ${res.statusCode}，错误信息: ${res.data}`,
            response: res
          })
        }
      }).catch(error => {
        reject({
          success: false,
          error: error.message || '上传失败'
        })
      })
    })
  } catch (error) {
    console.error('上传文件到Supabase失败:', error)
    return {
      success: false,
      error: error.message || '上传失败'
    }
  }
}

/**
 * 获取存储桶中的文件列表
 * @param {Object} options 选项
 * @param {string} options.bucket 存储桶名称
 * @param {string} options.folder 文件夹路径（可选）
 * @returns {Promise<Object>} 文件列表
 */
export const listFilesFromSupabase = async (options) => {
  const { bucket, folder = '' } = options
  
  if (!bucket) {
    throw new Error('缺少必要参数：bucket')
  }
  
  try {
    // 构建API URL
    const listUrl = `${SUPABASE_URL}/storage/v1/object/list/${bucket}${folder ? '/' + folder : ''}`
    
    // 发起请求
    const res = await Taro.request({
      url: listUrl,
      method: 'GET',
      header: {
        'apikey': SUPABASE_PUBLISHABLE_KEY // 使用apikey进行身份验证
      }
    })
    
    if (res.statusCode === 200) {
      return {
        success: true,
        data: res.data
      }
    } else {
      return {
        success: false,
        error: '获取文件列表失败',
        response: res
      }
    }
  } catch (error) {
    console.error('获取Supabase文件列表失败:', error)
    return {
      success: false,
      error: error.message || '获取列表失败'
    }
  }
}

// 导出所有配置和函数
export default {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  uploadFileToSupabase,
  listFilesFromSupabase
} 