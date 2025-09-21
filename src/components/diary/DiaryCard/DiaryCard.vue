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
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import "./DiaryCard.scss";

// 日记数据
const month = ref("");
const lunarDate = ref("");
const date = ref("");
const weekday = ref("");
const time = ref("");
const year = ref("");
const quoteText = ref("就算要出卖灵魂，也要找个付的起价钱的人。");
const quoteSource = ref("歌德《浮士德》");

// 农历转换函数
const getLunarDate = (date) => {
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  // 这里使用简化的农历计算，实际项目中建议使用专业的农历库
  // 真实项目中可考虑使用lunar.js等专业库
  const lunarMonth = date.getMonth();
  const lunarDay = date.getDate() - 1;

  return `${lunarMonths[lunarMonth]}${lunarDays[lunarDay]}`;
};

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date();

  // 年份
  year.value = now.getFullYear().toString();

  // 月份（补零）
  const monthNum = now.getMonth() + 1;
  month.value = `${monthNum.toString().padStart(2, '0')}月`;

  // 日期
  date.value = now.getDate().toString();

  // 星期
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  weekday.value = weekdays[now.getDay()];

  // 时间（时分，补零）
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  time.value = `${hours}:${minutes}`;

  // 农历日期
  lunarDate.value = getLunarDate(now);
};

// 页面挂载时获取当前时间，并每分钟更新一次
onMounted(() => {
  updateCurrentTime();
  // 每分钟更新一次时间
  const timer = setInterval(updateCurrentTime, 60000);

  // 组件卸载时清除定时器
  return () => clearInterval(timer);
});

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
