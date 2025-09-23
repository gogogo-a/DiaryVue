<template>
  <view class="diary-card-container">
    <view class="card-container" v-for="diary in diaryList" :key="diary.id">
      <view class="diary-card">
        <!-- 操作菜单按钮 -->
        <view class="diary-actions" @tap.stop="handleShowActions(diary)">
          <text class="action-icon">⋮</text>
        </view>

        <!-- 日记内容区域 -->
        <view class="diary-content-area" @tap="handleCardClick(diary.id)">
          <view class="diary-header">
            <view class="date-top">
              <text class="month">{{
                formatDate(diary.created_at).month
              }}</text>
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
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-if="!loading && diaryList.length === 0" class="empty-container">
      <text class="empty-text">暂无日记记录</text>
    </view>

    <!-- 操作菜单弹出层 -->
    <view
      v-if="showActionMenu"
      class="action-menu-overlay"
      @tap="hideActionMenu"
    >
      <view class="action-menu" @tap.stop>
        <view class="action-menu-header">
          <text class="menu-title">日记操作</text>
          <view class="menu-close" @tap="hideActionMenu">
            <text class="close-icon">✕</text>
          </view>
        </view>

        <view class="action-menu-content">
          <view class="action-item" @tap="handleViewComments">
            <text class="action-icon">💬</text>
            <text class="action-text">查看评论</text>
          </view>

          <view class="action-item" @tap="handleTogglePin">
            <text class="action-icon">📌</text>
            <text class="action-text">{{
              currentDiary?.is_pinned ? "取消置顶" : "置顶日记"
            }}</text>
          </view>

          <view class="action-item" @tap="handleEditDiary">
            <text class="action-icon">✏️</text>
            <text class="action-text">编辑日记</text>
          </view>

          <view class="action-item" @tap="handleShareDiary">
            <text class="action-icon">📤</text>
            <text class="action-text">分享日记</text>
          </view>

          <!-- 删除日记选项 -->
          <view class="action-item danger" @tap="handleDeleteDiary">
            <text class="action-icon">🗑️</text>
            <text class="action-text">删除日记</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
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

    if (response && response.list) {
      diaryList.value = response.list;
      console.log("✅ 获取日记列表成功:", response.list.length, "条记录");
    } else {
      console.warn("⚠️ 接口返回数据格式异常:", response);
      diaryList.value = [];
    }
  } catch (error) {
    console.error("❌ 获取日记列表失败:", error);
    // 发生错误时也显示空状态，不报错
    diaryList.value = [];
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = `${(date.getMonth() + 1).toString().padStart(2, "0")}月`;
  const dateNum = date.getDate().toString();
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[date.getDay()];

  // 简化的农历计算（实际项目中建议使用专业库）
  const lunarMonths = [
    "正月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  const lunarDays = [
    "初一",
    "初二",
    "初三",
    "初四",
    "初五",
    "初六",
    "初七",
    "初八",
    "初九",
    "初十",
    "十一",
    "十二",
    "十三",
    "十四",
    "十五",
    "十六",
    "十七",
    "十八",
    "十九",
    "二十",
    "廿一",
    "廿二",
    "廿三",
    "廿四",
    "廿五",
    "廿六",
    "廿七",
    "廿八",
    "廿九",
    "三十",
  ];

  const lunarMonth = date.getMonth();
  const lunarDay = date.getDate() - 1;
  const lunarDate = `${lunarMonths[lunarMonth]}${lunarDays[lunarDay]}`;

  return {
    month,
    date: dateNum,
    year,
    time,
    weekday,
    lunarDate,
  };
};

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

// 处理添加日记
const handleAddDiary = () => {
  console.log("🟢 点击添加日记按钮");

  Taro.navigateTo({
    url: "/pages/diary/adddiary/adddiary",
  })
    .then(() => {
      console.log("✅ 跳转到添加日记页面成功");
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

  // 监听刷新事件
  Taro.eventCenter.on("refreshDiaryList", refreshDiaryList);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  Taro.eventCenter.off("refreshDiaryList", refreshDiaryList);
});

// 对外暴露刷新方法
defineExpose({
  refresh: fetchDiaryList,
});
</script>
