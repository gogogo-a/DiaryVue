<template>
  <!-- 使用ThemeProvider作为最外层容器，提供主题上下文 -->
  <ThemeProvider>
    <view class="index">
      <view class="theme-switch-container">
        <ThemeSwitch />
      </view>
      
      <view class="card margin">
        <view class="title-text text-center">我的日记本</view>
        <Carousel />
      </view>
      
      <view class="card margin">
        <view class="subtitle-text">计数器示例</view>
        <Counter />
      </view>
      
      <view class="navigation">
        <view class="nav-button" @tap="goDiary">查看日记</view>
      </view>
    </view>
  </ThemeProvider>
</template>

<script setup>
import Counter from '../../components/Counter.vue'
import Carousel from '../../components/Carousel/Carousel.vue'
import ThemeSwitch from '../../components/ThemeSwitch/ThemeSwitch.vue'
import ThemeProvider from '../../components/ThemeProvider/ThemeProvider.vue'
import { defineOptions, inject } from 'vue'
import Taro from '@tarojs/taro'
import './index.scss'

defineOptions({
  name: 'IndexPage'
})

// 从ThemeProvider获取主题信息
const theme = inject('theme')

const goDiary = () => {
  Taro.navigateTo({
    url: '/pages/diary/diary'
  })
}
</script>




