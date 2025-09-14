<template>
  <view class="carousel-container">
    <swiper
      class="carousel"
      indicator-dots
      :indicator-color="themeStore.themeColors.navigationBarTextStyle === 'white' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'"
      :indicator-active-color="themeStore.themeColors.primaryButtonBackground"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      @change="handleSwiperChange"
      @animationfinish="handleAnimationFinish"
    >
      <swiper-item v-for="(item, index) in images" :key="index" class="carousel-item">
        <image :src="item" class="carousel-image" mode="aspectFill" />
      </swiper-item>
    </swiper>
    
    <!-- 自定义指示点 -->
    <view class="custom-dots">
      <view 
        v-for="(_, index) in images" 
        :key="index" 
        :class="['dot', currentIndex === index ? 'active' : '']"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import './Carousel.scss'

defineOptions({
  name: 'CarouselComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 导入本地测试图片
import test1 from '../../../assets/images/test1.webp'
import test2 from '../../../assets/images/test2.webp'
import test3 from '../../../assets/images/test3.webp'

// 轮播图图片路径
const images = ref([
  test1,
  test2,
  test3
])

// 当前轮播图索引
const currentIndex = ref(0)

// 处理轮播图变化
const handleSwiperChange = (e) => {
  currentIndex.value = e.detail.current
  console.log('轮播图切换到:', currentIndex.value)
}

</script>

