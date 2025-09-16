<template>
  <view class="index" :class="themeStore.currentThemeClass">
    <!-- 登录状态显示 -->
    <view class="login-status" v-if="!userStore.isLoggedIn">
      <view class="login-card">
        <view class="login-title">欢迎使用日记本</view>
        <view class="login-desc">请先登录以享受完整功能</view>
        <button class="login-btn" @tap="handleLogin">
          <text class="login-text">微信登录</text>
        </button>
      </view>
    </view>

    <!-- 主要内容 -->
    <view class="main-content" :class="{ 'logged-in': userStore.isLoggedIn }">
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
    </view>

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
import { useUserStore } from "../../stores/user";
import Taro from "@tarojs/taro";
import "./index.scss";

defineOptions({
  name: "IndexPage",
});

// 使用主题状态
const themeStore = useThemeStore();

// 使用用户状态
const userStore = useUserStore();

// 底部导航栏引用
const tabBar = ref(null);

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor();

// 微信登录处理
const handleLogin = async () => {
  await userStore.login();
};

// 页面加载时检查登录状态
/* onMounted(async () => {
  // 初始化用户状态（从本地存储恢复）
  userStore.initUserState();

  // 如果没有登录，自动尝试登录
  if (!userStore.isLoggedIn) {
    await userStore.ensureLogin();
  }

  // 设置当前激活的标签
  if (tabBar.value) {
    tabBar.value.setActiveTab("index");
  }
}); */
</script>
