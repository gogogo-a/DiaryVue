<template>
  <view class="index" :class="themeStore.currentThemeClass">
    <view class="card margin">
      <Carousel />
    </view>

    <view class="card margin">
      <FeatureCards />
    </view>

    <!-- 写日记按钮 -->
    <WriteButton />

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 底部导航栏 -->
    <TabBar ref="tabBar" />
  </view>
</template>

<script setup>
import Carousel from "../../components/index/Carousel/Carousel.vue";
import FeatureCards from "../../components/index/FeatureCards/FeatureCards.vue";
import WriteButton from "../../components/index/WriteButton/WriteButton.vue";
import TabBar from "../../components/public/TabBar/TabBar.vue";
import { defineOptions, ref, onMounted } from "vue";
import { useThemeStore } from "../../stores/theme";
import "./index.scss";

defineOptions({
  name: "IndexPage",
});

// 使用主题状态
const themeStore = useThemeStore();

// 底部导航栏引用
const tabBar = ref(null);

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor();

// 页面加载时设置当前激活的标签
onMounted(() => {
  if (tabBar.value) {
    tabBar.value.setActiveTab("index");
  }
});
</script>
