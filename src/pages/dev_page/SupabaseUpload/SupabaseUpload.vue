<template>
  <view class="supabase-upload">
    <view class="supabase-upload__header">
      <view class="supabase-upload__title">Supabase 存储测试</view>
      <view class="supabase-upload__subtitle">测试文件上传到Supabase存储</view>
    </view>
    
    <view class="supabase-upload__content">
      <!-- 文件上传组件 -->
      <FileUploader />
      
      <!-- 说明文档 -->
      <view class="supabase-upload__docs">
        <view class="supabase-upload__docs-title">使用说明</view>
        <view class="supabase-upload__docs-content">
          <text class="supabase-upload__docs-text">
            1. 点击上传区域选择文件\n
            2. 点击"开始上传"按钮上传文件\n
            3. 上传成功后可以查看文件URL\n
            4. 点击URL可复制到剪贴板
          </text>
        </view>
      </view>
    </view>
    
    <!-- 技术信息 -->
    <view class="supabase-upload__info">
      <view class="supabase-upload__info-title">技术信息</view>
      <view class="supabase-upload__info-item">
        <text class="supabase-upload__info-label">存储服务:</text>
        <text class="supabase-upload__info-value">Supabase Storage</text>
      </view>
      <view class="supabase-upload__info-item">
        <text class="supabase-upload__info-label">存储桶:</text>
        <text class="supabase-upload__info-value">diary_image</text>
      </view>
      <view class="supabase-upload__info-item">
        <text class="supabase-upload__info-label">文件夹:</text>
        <text class="supabase-upload__info-value">user-test</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, onMounted } from 'vue'
import FileUploader from '../../../components/dev_page/SupabaseUpload/FileUploader.vue'
import './SupabaseUpload.scss'

defineOptions({
  name: 'SupabaseUploadPage'
})

// 页面加载完成后执行
onMounted(() => {
  console.log('SupabaseUpload页面已加载')
})
</script>
