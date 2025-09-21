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

// 响应式数据
const diaryList = ref([]);
const loading = ref(false);

// 获取日记列表
const fetchDiaryList = async () => {
  try {
    loading.value = true;
    console.log("🟢 开始获取日记列表...");

    const response = await diaryAPI.getDiaryList({
      page: 1,
      page_size: 10,
    });

    // 根据最新接口文档，diaryAPI.getDiaryList 已经返回 data 部分
    // response.list 包含日记数据
    if (response && Array.isArray(response.list)) {
      diaryList.value = response.list;
      console.log("✅ 获取日记列表成功，数据数量:", diaryList.value.length);

      if (diaryList.value.length > 0) {
        console.log("✅ 日记数据结构示例:", diaryList.value[0]);
      } else {
        console.log("📝 当前没有日记数据，显示空状态");
      }
    } else {
      console.warn("⚠️ 接口返回数据格式异常:", response);
      diaryList.value = [];
    }
  } catch (error) {
    console.error("❌ 获取日记列表失败:", error);
    diaryList.value = [];

    // 显示错误提示
    Taro.showToast({
      title: "获取日记失败",
      icon: "none",
      duration: 2000,
    });
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);

    // 月份
    const month = (date.getMonth() + 1).toString().padStart(2, "0") + "月";

    // 日期
    const day = date.getDate().toString();

    // 年份
    const year = date.getFullYear().toString();

    // 星期
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const weekday = weekdays[date.getDay()];

    // 时间
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // 农历日期（这里暂时用简单的替代）
    const lunarDate = "农历";

    return {
      month,
      date: day,
      year,
      weekday,
      time,
      lunarDate,
    };
  } catch (error) {
    console.error("日期格式化失败:", error);
    return {
      month: "--",
      date: "--",
      year: "--",
      weekday: "--",
      time: "--",
      lunarDate: "--",
    };
  }
};

// 处理卡片点击
const handleCardClick = (diaryId) => {
  console.log("🟢 点击卡片，准备跳转，日记ID:", diaryId);

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
