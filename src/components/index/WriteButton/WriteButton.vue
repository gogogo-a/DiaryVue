<template>
  <view class="write-button" @tap="handleClick">
    <view class="button-circle">
      <image class="button-icon" :src="penIcon" mode="aspectFit" />
      <text class="button-text">写日记</text>
    </view>
  </view>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './WriteButton.scss'

// 导入SVG图标
import penIcon from '../../../assets/svg/index/pen.svg'

defineOptions({
  name: 'WriteButtonComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 处理点击事件
const handleClick = () => {
  Taro.showToast({
    title: '写日记功能即将上线',
    icon: 'none',
    duration: 1500
  })
}
</script> 