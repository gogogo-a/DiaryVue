<template>
  <view class="index" :class="themeStore.currentThemeClass">
    <!-- 登录状态显示（仅在自动登录失败后显示） -->
    <view class="login-status" v-if="showLoginUI">
      <view class="login-card">
        <view class="login-title">登录已过期</view>
        <view class="login-desc">请重新登录以继续使用</view>
        <button class="login-btn" @tap="handleLogin">
          <text class="login-text">重新登录</text>
        </button>
        <!-- 原生测试按钮 -->
        <button class="test-btn" @tap="testLogin">
          <text class="test-text">原生API测试</text>
        </button>
      </view>
    </view>

    <!-- 主要内容（默认显示） -->
    <view class="main-content" :class="{ 'dimmed': showLoginUI }">
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

// 是否显示登录界面（只有自动登录失败后才显示）
const showLoginUI = ref(false);

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor();

// 微信登录处理
const handleLogin = async () => {
  const success = await userStore.login();
  if (success) {
    // 登录成功，隐藏登录界面
    showLoginUI.value = false;
  }
};

// 测试登录API 原生测试，不依赖任何文件  仅用于开发阶段测试连接情况
const testLogin = async () => {
  try {
    console.log('开始原生测试登录API...');

    // 显示加载提示
    Taro.showLoading({
      title: '原生测试中...',
      mask: true
    });

    // 测试数据
    const testData = {
      code: "0b3v9FGa1kldfD0ozaJa1sBcGZ3v9FGF"
    };

    console.log('发送原生测试请求:', testData);
    console.log('请求URL:', 'https://connivently-fitted-grayce.ngrok-free.app/api/v1/auth/wx-login');

    // 使用Taro原生请求，完全不依赖任何封装
    const response = await Taro.request({
      url: 'https://connivently-fitted-grayce.ngrok-free.app/api/v1/auth/wx-login',
      method: 'POST',
      data: testData,
      header: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('原生请求完整响应:', response);
    console.log('HTTP状态码:', response.statusCode);
    console.log('响应头:', response.header);
    console.log('响应数据:', response.data);

    Taro.hideLoading();

    if (response.statusCode === 200) {
      Taro.showToast({
        title: '原生测试成功',
        icon: 'success',
        duration: 2000
      });
    } else {
      Taro.showToast({
        title: `HTTP状态码: ${response.statusCode}`,
        icon: 'none',
        duration: 3000
      });
    }

  } catch (error) {
    console.error('原生测试失败:', error);

    Taro.hideLoading();

    Taro.showToast({
      title: `原生测试失败: ${error.errMsg || error.message}`,
      icon: 'none',
      duration: 3000
    });
  }
};

// 检查并自动登录（统一入口）
const checkAndAutoLogin = async () => {
  try {
    console.log('页面加载，开始检查并确保登录状态...');

    // 调用用户store的统一入口方法
    const loginSuccess = await userStore.checkAndEnsureLogin();

    if (loginSuccess) {
      console.log('登录状态确认成功');
      showLoginUI.value = false;
    } else {
      console.log('登录状态确认失败，显示手动登录界面');
      showLoginUI.value = true;
    }
  } catch (error) {
    console.error('检查登录状态异常:', error);
    // 出现异常时也显示登录界面
    showLoginUI.value = true;
  }
};

// 页面加载时检查登录状态
/* onMounted(async () => {
  // 检查token并自动登录
  await checkAndAutoLogin();

  // 设置当前激活的标签
  if (tabBar.value) {
    tabBar.value.setActiveTab("index");
  }
}); */
</script>
