<template>
  <view class="carousel-container">
    <swiper
      class="carousel"
      indicator-dots
      indicator-active-color="#4CAF50"
      autoplay
      interval="3000"
      circular
    >
      <swiper-item v-for="(item, index) in images" :key="index">
        <image :src="item" class="carousel-image" mode="aspectFill" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import './Carousel.css'
defineOptions({
  name: 'CarouselComponent'
})

// 导入本地测试图片
import test1 from '../../assets/images/test1.jpg'
import test2 from '../../assets/images/test2.jpg'
import test3 from '../../assets/images/test3.jpg'

// 轮播图图片路径
const images = ref([
  test1,
  test2,
  test3
])
</script>

