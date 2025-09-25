<template>
  <view class="file-uploader">
    <view class="file-uploader__header">
      <view class="file-uploader__title">文件上传</view>
      <view class="file-uploader__subtitle">使用Supabase存储</view>
    </view>
    
    <view class="file-uploader__content">
      <!-- 上传区域 -->
      <view 
        class="file-uploader__area" 
        :class="{'file-uploader__area--active': isDragging}"
        @tap="chooseFile"
      >
        <view class="file-uploader__icon">
          <text class="icon-upload">📤</text>
        </view>
        <view class="file-uploader__text">
          <text>点击选择文件</text>
          <text class="file-uploader__hint">支持图片、视频等格式</text>
        </view>
      </view>
      
      <!-- 上传进度 -->
      <view v-if="isUploading" class="file-uploader__progress">
        <view class="file-uploader__progress-bar">
          <view 
            class="file-uploader__progress-inner" 
            :style="{width: `${uploadProgress}%`}"
          ></view>
        </view>
        <view class="file-uploader__progress-text">
          上传中 {{ uploadProgress }}%
        </view>
      </view>
      
      <!-- 上传文件列表 -->
      <view v-if="fileList.length > 0" class="file-uploader__list">
        <view 
          v-for="(file, index) in fileList" 
          :key="index"
          class="file-uploader__file"
        >
          <view class="file-uploader__file-info">
            <view class="file-uploader__file-name">{{ file.name }}</view>
            <view class="file-uploader__file-size">{{ formatFileSize(file.size) }}</view>
          </view>
          
          <view class="file-uploader__file-status">
            <text v-if="file.status === 'success'" class="file-uploader__file-success">✓</text>
            <text v-else-if="file.status === 'error'" class="file-uploader__file-error">✗</text>
            <text v-else class="file-uploader__file-loading">...</text>
          </view>
          
          <view class="file-uploader__file-actions">
            <text 
              class="file-uploader__file-delete" 
              @tap.stop="removeFile(index)"
            >删除</text>
          </view>
        </view>
      </view>
      
      <!-- 上传按钮 -->
      <view class="file-uploader__actions">
        <button 
          class="file-uploader__button" 
          :disabled="fileList.length === 0 || isUploading"
          @tap="uploadFiles"
        >
          {{ isUploading ? '上传中...' : '开始上传' }}
        </button>
      </view>
    </view>
    
    <!-- 上传结果 -->
    <view v-if="uploadedFiles.length > 0" class="file-uploader__result">
      <view class="file-uploader__result-title">上传成功</view>
      <view 
        v-for="(file, index) in uploadedFiles" 
        :key="index"
        class="file-uploader__result-item"
      >
        <view class="file-uploader__result-name">{{ file.fileName }}</view>
        <view class="file-uploader__result-url">
          <text class="file-uploader__result-link" @tap="copyUrl(file.publicUrl)">
            {{ file.publicUrl }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import Taro from '@tarojs/taro'
import { uploadFileToSupabase } from '../../../utils/supabaseClient'
import './FileUploader.scss'

defineOptions({
  name: 'FileUploader'
})

// 状态定义
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileList = ref([])
const uploadedFiles = ref([])

// 选择文件
const chooseFile = async () => {
  try {
    const res = await Taro.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    })
    
    // 添加到文件列表
    const newFiles = res.tempFiles.map(file => ({
      path: file.path,
      name: file.path.split('/').pop(),
      size: file.size,
      status: 'pending'
    }))
    
    fileList.value = [...fileList.value, ...newFiles]
  } catch (error) {
    console.error('选择文件失败:', error)
    Taro.showToast({
      title: '选择文件失败',
      icon: 'none'
    })
  }
}

// 移除文件
const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

// 上传文件
const uploadFiles = async () => {
  if (fileList.value.length === 0 || isUploading.value) {
    return
  }
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    // 计算每个文件的进度比例
    const progressStep = 100 / fileList.value.length
    
    // 逐个上传文件
    for (let i = 0; i < fileList.value.length; i++) {
      const file = fileList.value[i]
      
      // 跳过已上传成功的文件
      if (file.status === 'success') {
        uploadProgress.value += progressStep
        continue
      }
      
      try {
        // 上传到Supabase
        const result = await uploadFileToSupabase({
          bucket: 'diary_image', // 存储桶名称
          filePath: file.path,
          folder: 'user-test', // 可选的文件夹路径
          onProgress: (progress) => {
            // 更新当前文件的进度
            const currentProgress = i * progressStep + (progress * progressStep / 100)
            uploadProgress.value = Math.floor(currentProgress)
          }
        })
        
        if (result.success) {
          // 更新文件状态
          fileList.value[i].status = 'success'
          fileList.value[i].url = result.data.publicUrl
          
          // 添加到已上传文件列表
          uploadedFiles.value.push({
            fileName: result.data.fileName,
            publicUrl: result.data.publicUrl,
            storagePath: result.data.storagePath,
            size: file.size
          })
        } else {
          fileList.value[i].status = 'error'
          fileList.value[i].error = result.error
        }
      } catch (error) {
        fileList.value[i].status = 'error'
        fileList.value[i].error = error.message || '上传失败'
      }
      
      // 更新总进度
      uploadProgress.value = Math.floor((i + 1) * progressStep)
    }
  } catch (error) {
    console.error('上传过程中发生错误:', error)
    Taro.showToast({
      title: '上传失败',
      icon: 'none'
    })
  } finally {
    isUploading.value = false
    uploadProgress.value = 100
  }
}

// 复制URL
const copyUrl = (url) => {
  Taro.setClipboardData({
    data: url,
    success: () => {
      Taro.showToast({
        title: 'URL已复制',
        icon: 'success'
      })
    }
  })
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}
</script> 