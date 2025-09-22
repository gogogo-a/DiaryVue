<template>
  <view class="diary-card-container">
    <view class="card-container" v-for="diary in diaryList" :key="diary.id">
      <view class="diary-card" @tap="handleCardClick(diary.id)">
        <view class="diary-header">
          <view class="date-top">
            <text class="month">{{ formatDate(diary.created_at).month }}</text>
            <text class="lunar-date">{{
              formatDate(diary.created_at).lunarDate
            }}</text>
          </view>
          <text class="date-number">{{
            formatDate(diary.created_at).date
          }}</text>
          <view class="date-bottom">
            <text class="weekday">{{
              formatDate(diary.created_at).weekday
            }}</text>
            <text class="time">{{ formatDate(diary.created_at).time }}</text>
            <text class="year">{{ formatDate(diary.created_at).year }}</text>
          </view>
        </view>

        <view class="diary-quote">
          <text class="quote-icon">"</text>
          <text class="quote-content">{{ diary.title }}</text>
          <text class="quote-source">{{
            diary.content.substring(0, 50) +
            (diary.content.length > 50 ? "..." : "")
          }}</text>
        </view>

        <!-- 统计信息 -->
        <view class="diary-stats">
          <view class="stat-item">
            <text class="stat-label">阅读</text>
            <text class="stat-value">{{ diary.pageview }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">点赞</text>
            <text class="stat-value">{{ diary.like }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-if="!loading && diaryList.length === 0" class="empty-container">
      <text class="empty-text">暂无日记记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import diaryAPI from "../../../utils/diary";
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
    url: `/pages/diary/detail/index?id=${diaryId}`,
  })
    .then(() => {
      console.log("✅ 跳转成功");
    })
    .catch((err) => {
      console.error("❌ 跳转失败:", err);
      Taro.showModal({
        title: "跳转失败",
        content: `错误信息: ${err.errMsg}`,
        showCancel: false,
      });
    });
};

// 组件挂载后获取数据
onMounted(() => {
  fetchDiaryList();
});

// 对外暴露刷新方法
defineExpose({
  refresh: fetchDiaryList,
});
</script>
