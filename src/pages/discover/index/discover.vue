<template>
  <view class="discover-page" :class="themeStore.currentThemeClass">
    <!-- 帖子内容区域 -->
    <PostContent />

    <!-- 发布页面专用底部导航栏 -->
    <DiscoverBottomNav />
  </view>
</template>

<script setup>
import PostContent from '../../../components/discover/index/01/PostContent.vue'
import DiscoverBottomNav from '../../../components/discover/index/02/DiscoverBottomNav.vue'
import { defineOptions } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import './discover.scss'

defineOptions({
  name: 'DiscoverPage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()
</script>


