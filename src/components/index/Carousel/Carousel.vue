<template>
  <view class="carousel-container">
    <swiper
      class="carousel"
      :indicator-dots="false"
      :autoplay="true"
      :interval="5000"
      :duration="500"
      :circular="true"
      @change="handleSwiperChange"
    >
      <swiper-item class="carousel-item">
        <DateBanner />
      </swiper-item>
      <swiper-item class="carousel-item">
        <QuoteBanner />
      </swiper-item>
    </swiper>

    <!-- 自定义指示点 -->
    <view class="custom-dots">
      <view
        v-for="(_, index) in bannerCount"
        :key="index"
        :class="['dot', currentIndex === index ? 'active' : '']"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import DateBanner from '../banner/01/DateBanner.vue'
import QuoteBanner from '../banner/02/QuoteBanner.vue'
import './Carousel.scss'

defineOptions({
  name: 'CarouselComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// Banner组件数量
const bannerCount = ref(2)

// 当前轮播图索引
const currentIndex = ref(0)

// 处理轮播图变化
const handleSwiperChange = (e) => {
  currentIndex.value = e.detail.current
  console.log('轮播图切换到:', currentIndex.value)
}
</script>

