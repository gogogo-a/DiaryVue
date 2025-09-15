<template>
  <view class="quote-banner" :class="themeStore.currentThemeClass">
    <!-- 外层背景容器 -->
    <view class="outer-container">
      <!-- 装饰文字 -->
      <view class="decoration-text">{{ decorationText }}</view>

      <!-- 内层名言卡片 - 占中间区域 -->
      <view class="inner-card">
        <!-- 引言文字 -->
        <view class="quote-text">
          {{ quoteContent }}
        </view>

        <!-- 作者信息 -->
        <view class="author-info">
          —— {{ authorName }}《{{ workTitle }}》
        </view>

        <!-- 底部操作按钮 -->
        <view class="action-buttons">
          <view class="settings-btn" @tap="handleSettingsClick">
            <text class="settings-text">更换名言</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import './QuoteBanner.scss'

defineOptions({
  name: 'QuoteBanner'
})

// 使用主题状态
const themeStore = useThemeStore()

// 装饰文字
const decorationText = ref('思维的火花')

// 引言内容
const quoteContent = ref('我们乘着疲惫的想象力，心灰意冷地盘旋在这块我们也已厌倦的大地上空，苍然四顾，无处栖身。')
const authorName = ref('周国平')
const workTitle = ref('守望的距离')

// 名言库
const quotes = ref([
  {
    content: '我们乘着疲惫的想象力，心灰意冷地盘旋在这块我们也已厌倦的大地上空，苍然四顾，无处栖身。',
    author: '周国平',
    work: '守望的距离'
  },
  {
    content: '生活的最高境界是宽容，相处的最高境界是尊重。',
    author: '佚名',
    work: '人生感悟'
  },
  {
    content: '读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了思考和权衡。',
    author: '培根',
    work: '随笔集'
  }
])

let currentQuoteIndex = 0

// 处理更换名言点击
const handleSettingsClick = () => {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.value.length
  const newQuote = quotes.value[currentQuoteIndex]
  quoteContent.value = newQuote.content
  authorName.value = newQuote.author
  workTitle.value = newQuote.work
  console.log('更换名言')
}
</script>
