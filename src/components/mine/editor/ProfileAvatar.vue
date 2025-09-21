<template>
  <view class="profile-avatar" :class="themeStore.currentThemeClass">
    <view class="avatar-title">头像</view>
    <view class="avatar-content">
      <image
        class="avatar-image"
        :src="modelValue || defaultAvatar"
        mode="aspectFill"
        @tap="handleChooseImage"
      />
      <view class="avatar-hint">点击头像或按钮修改</view>
      <view class="update-avatar-btn" @tap="handleChooseImage">更换头像</view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './ProfileAvatar.scss'

defineOptions({
  name: 'ProfileAvatar'
})

// 定义props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 使用主题状态
const themeStore = useThemeStore()

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'

// 处理选择图片
const handleChooseImage = () => {
  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      emit('update:modelValue', res.tempFilePaths[0])
      Taro.showToast({
        title: '头像已更新',
        icon: 'success',
        duration: 2000
      })
    }
  })
}
</script>
