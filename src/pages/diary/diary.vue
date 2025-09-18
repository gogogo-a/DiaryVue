<template>
  <view class="diary-page" :class="themeStore.currentThemeClass">
    <!-- 顶部筛选组件 -->
    <DiaryFilter
      @categoryChange="handleCategoryChange"
      @labelChange="handleLabelChange"
      @dateChange="handleDateChange"
      @search="handleSearch"
    />
    <DiaryCard />
    <!-- <view class="content margin">
      <view class="card diary-item" @tap="viewDiary">
        <view class="subtitle-text">今天的日记</view>
        <view class="tip-text">2025-09-13</view>
        <view class="body-text">这是一个使用Taro和Vue 3的日记应用示例...</view>
      </view>

      <view class="card diary-item" @tap="viewDiary">
        <view class="subtitle-text">昨天的回忆</view>
        <view class="tip-text">2025-09-12</view>
        <view class="body-text">今天学习了如何使用Taro框架开发小程序...</view>
      </view>
    </view> -->

    <view class="action-bar">
      <view class="button" @tap="addNewDiary">添加日记</view>
      <view class="button-outline" @tap="goBack">返回首页</view>
    </view>

    <!-- 底部导航栏 -->
    <TabBar ref="tabBar" />
  </view>
</template>

<script setup>
import { defineOptions, ref, onMounted } from "vue";
import { useThemeStore } from "../../stores/theme";
import DiaryFilter from "../../components/diary/DiaryFilter/DiaryFilter.vue";
import TabBar from "../../components/public/TabBar/TabBar.vue";
import DiaryCard from "../../components/diary/DiaryCard/DiaryCard.vue";
import Taro from "@tarojs/taro";

import "./diary.scss";

defineOptions({
  name: "DiaryPage",
});
console.log("📄 diary.vue 页面加载");
// 使用主题状态
const themeStore = useThemeStore();

// 底部导航栏引用
const tabBar = ref(null);

// 页面加载时设置当前激活的标签
onMounted(() => {
  if (tabBar.value) {
    tabBar.value.setActiveTab("index");
  }
});

const goBack = () => {
  Taro.navigateBack();
};

const viewDiary = () => {
  Taro.showToast({
    title: "查看日记详情",
    icon: "none",
  });
};

const addNewDiary = () => {
  console.log('尝试跳转到:', "/pages/diary/adddiary/adddiary");
  Taro.navigateTo({
    url: "/pages/diary/adddiary/adddiary",
  }).catch(err => {
    console.error('跳转失败详情:', err);
  });
};

// 处理筛选事件
const handleCategoryChange = (category) => {
  console.log("分类变更:", category);
  Taro.showToast({
    title: `已选择: ${category}`,
    icon: "none",
  });
};

const handleLabelChange = (label) => {
  console.log("标签变更:", label);
  Taro.showToast({
    title: `已选择标签: ${label}`,
    icon: "none",
  });
};

const handleDateChange = (date) => {
  console.log("日期变更:", date);
  Taro.showToast({
    title: `已选择日期: ${date}`,
    icon: "none",
  });
};

const handleSearch = (text) => {
  console.log("搜索:", text);
  Taro.showToast({
    title: `正在搜索: ${text}`,
    icon: "none",
  });
};
</script>
