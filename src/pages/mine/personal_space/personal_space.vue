<template>
  <view class="personal-space-page" :class="themeStore.currentThemeClass">
    <!-- 个人空间头部 -->
    <PersonalSpaceHeader />

    <!-- 日记列表区域 -->
    <view class="diary-section">
      <view class="section-title">
        <text class="title-text">公开日记</text>
        <text class="title-count">({{ publicDiaries.length }}篇)</text>
      </view>

      <!-- 日记列表 -->
      <view v-if="publicDiaries.length > 0" class="diary-list">
        <view
          v-for="diary in publicDiaries"
          :key="diary.id"
          class="diary-item"
          @tap="handleDiaryTap(diary)"
        >
          <view class="diary-date">{{ diary.date }}</view>
          <view class="diary-title">{{ diary.title }}</view>
          <view class="diary-preview">{{ diary.preview }}</view>
          <view class="diary-meta">
            <text class="meta-item">📖 {{ diary.wordCount }}字</text>
            <text class="meta-item">👁️ {{ diary.views }}次阅读</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <view class="empty-icon">📖</view>
        <view class="empty-text">还没有公开的日记</view>
        <view class="empty-desc">设置日记为公开状态，让更多人看到你的精彩内容</view>
        <view class="empty-action" @tap="handleWriteDiary">
          <text>开始写日记</text>
        </view>
      </view>
    </view>

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>
  </view>
</template>

<script setup>
import PersonalSpaceHeader from '../../../components/mine/01/PersonalSpaceHeader.vue'
import { defineOptions, reactive, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './personal_space.scss'

defineOptions({
  name: 'PersonalSpacePage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 公开日记数据（示例数据）
const publicDiaries = reactive([
  {
    id: 1,
    date: '2025-09-16',
    title: '美好的一天',
    preview: '今天天气很好，心情也特别棒。和朋友一起去了公园，看到了很多美丽的花朵...',
    wordCount: 256,
    views: 12
  },
  {
    id: 2,
    date: '2025-09-15',
    title: '读书笔记',
    preview: '今天读完了一本很有意思的书，书中的故事让我深受启发...',
    wordCount: 389,
    views: 8
  }
])

// 处理日记点击
const handleDiaryTap = (diary) => {
  Taro.showModal({
    title: diary.title,
    content: `${diary.preview}\n\n字数：${diary.wordCount}\n阅读：${diary.views}次`,
    showCancel: false
  })
}

// 处理写日记
const handleWriteDiary = () => {
  Taro.navigateTo({
    url: '/pages/diary/diary',
    success: () => {
      console.log('跳转到日记页面成功')
    },
    fail: (err) => {
      console.error('跳转到日记页面失败:', err)
      Taro.showToast({
        title: '跳转失败，请重试',
        icon: 'none'
      })
    }
  })
}
</script>








