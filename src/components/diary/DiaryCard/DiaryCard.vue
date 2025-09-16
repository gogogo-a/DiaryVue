<template>
  <view class="diary-card-container">
    <view class="card-container">
      <view class="diary-card" @tap="handleCardClick">
        <view class="diary-header">
          <view class="date-top">
            <text class="month">{{ month }}</text>
            <text class="lunar-date">{{ lunarDate }}</text>
          </view>
          <text class="date-number">{{ date }}</text>
          <view class="date-bottom">
            <text class="weekday">{{ weekday }}</text>
            <text class="time">{{ time }}</text>
            <text class="year">{{ year }}</text>
          </view>
        </view>

        <view class="diary-quote">
          <text class="quote-icon">"</text>
          <text class="quote-content">{{ quoteText }}</text>
          <text class="quote-source">—— {{ quoteSource }}</text>
        </view>

        <!-- 作者信息 -->
        <view class="diary-author">
          <text class="author-name">作者：小明</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import Taro from "@tarojs/taro";
import "./DiaryCard.scss";

// 日记数据
const month = ref("09月");
const lunarDate = ref("七月廿四");
const date = ref("15");
const weekday = ref("周一");
const time = ref("14:47");
const year = ref("2025");
const quoteText = ref("就算要出卖灵魂，也要找个付的起价钱的人。");
const quoteSource = ref("歌德《浮士德》");

const handleCardClick = () => {
  console.log('🟢 点击卡片，准备跳转...');

  Taro.navigateTo({
    url: "/pages/diary/detail/index?id=1",
  }).then(() => {
    console.log('✅ 跳转成功');
  }).catch((err) => {
    console.error('❌ 跳转失败:', err);
    Taro.showModal({
      title: '跳转失败',
      content: `错误信息: ${err.errMsg}`,
      showCancel: false
    });
  });
};
</script>
