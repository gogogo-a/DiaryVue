<template>
  <view class="add-diary-page" :class="themeStore.currentThemeClass">
    <!-- 顶部导航栏 -->
    <view class="navigation-bar">
      <view class="nav-back" @tap="goBack">
        <text class="iconfont icon-arrow-left"></text>
      </view>
      <view class="nav-title">添加新日记</view>
      <view class="nav-action" @tap="saveDraft">保存草稿</view>
    </view>

    <!-- 日记表单 -->
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-container">
        <!-- 标题输入 -->
        <view class="form-group">
          <text class="form-label">日记标题</text>
          <input
            class="form-input"
            v-model="diaryData.title"
            placeholder="输入日记标题"
            placeholder-class="placeholder"
          />
        </view>

        <!-- 分类选择 -->
        <view class="form-group">
          <text class="form-label">分类</text>
          <picker
            class="form-picker"
            :range="categories"
            @change="onCategoryChange"
          >
            <view class="picker-value">
              {{ diaryData.category || '选择日记分类' }}
              <text class="iconfont icon-arrow-down"></text>
            </view>
          </picker>
        </view>

        <!-- 情绪选择 -->
        <view class="form-group">
          <text class="form-label">今日情绪</text>
          <view class="emotion-container">
            <view
              v-for="emotion in emotionOptions"
              :key="emotion.value"
              class="emotion-item"
              :class="{ active: diaryData.emotion === emotion.value }"
              @tap="selectEmotion(emotion.value)"
            >
              <text class="emotion-emoji">{{ emotion.emoji }}</text>
              <text class="emotion-text">{{ emotion.text }}</text>
            </view>
          </view>
        </view>

        <!-- 天气选择 -->
        <view class="form-group">
          <text class="form-label">今日天气</text>
          <view class="weather-container">
            <view
              v-for="weather in weatherOptions"
              :key="weather.value"
              class="weather-item"
              :class="{ active: diaryData.weather === weather.value }"
              @tap="selectWeather(weather.value)"
            >
              <text class="weather-icon">{{ weather.icon }}</text>
              <text class="weather-text">{{ weather.text }}</text>
            </view>
          </view>
        </view>

        <!-- 标签选择 -->
        <view class="form-group">
          <text class="form-label">标签</text>
          <view class="tag-container">
            <view
              v-for="tag in tags"
              :key="tag"
              class="tag-item"
              :class="{ active: diaryData.tags.includes(tag) }"
              @tap="toggleTag(tag)"
            >
              {{ tag }}
            </view>
          </view>
        </view>

        <!-- 日期选择 -->
        <view class="form-group">
          <text class="form-label">日期</text>
          <picker
            class="form-picker"
            mode="date"
            :value="diaryData.date"
            @change="onDateChange"
          >
            <view class="picker-value">
              {{ diaryData.date || '选择日期' }}
              <text class="iconfont icon-calendar"></text>
            </view>
          </picker>
        </view>

        <!-- 内容输入 -->
        <view class="form-group">
          <text class="form-label">日记内容</text>
          <textarea
            class="form-textarea"
            v-model="diaryData.content"
            placeholder="写下今天的点点滴滴..."
            placeholder-class="placeholder"
            maxlength="-1"
            auto-height
          />
          <view class="word-count" v-if="diaryData.content">
            {{ diaryData.content.length }}字
          </view>
        </view>

        <!-- 图片上传 -->
        <view class="form-group">
          <text class="form-label">添加图片</text>
          <view class="image-uploader">
            <view
              v-for="(image, index) in diaryData.images"
              :key="index"
              class="image-preview"
            >
              <image :src="image" class="preview-image" mode="aspectFill" />
              <view class="remove-image" @tap="removeImage(index)">
                <text class="iconfont icon-close"></text>
              </view>
            </view>
            <view class="upload-button" @tap="chooseImage" v-if="diaryData.images.length < 3">
              <text class="iconfont icon-plus"></text>
              <text>添加图片</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="button button-outline" @tap="resetForm">重置</view>
      <view class="button" @tap="saveDiary">保存日记</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useThemeStore } from "../../../stores/theme";
import Taro from "@tarojs/taro";
import "./adddiary.scss";

// 使用主题状态
const themeStore = useThemeStore();

// 日记数据
const diaryData = reactive({
  title: "",
  category: "",
  emotion: "",
  weather: "",
  tags: [],
  date: "",
  content: "",
  images: []
});

// 分类选项
const categories = ref(["生活", "工作", "学习", "情感", "旅行", "其他"]);

// 情绪选项
const emotionOptions = ref([
  { value: "happy", emoji: "😊", text: "开心" },
  { value: "excited", emoji: "😄", text: "兴奋" },
  { value: "calm", emoji: "😌", text: "平静" },
  { value: "sad", emoji: "😔", text: "难过" },
  { value: "angry", emoji: "😠", text: "生气" },
  { value: "tired", emoji: "😴", text: "疲惫" }
]);

// 天气选项
const weatherOptions = ref([
  { value: "sunny", icon: "☀️", text: "晴天" },
  { value: "cloudy", icon: "☁️", text: "多云" },
  { value: "rainy", icon: "🌧️", text: "雨天" },
  { value: "snowy", icon: "❄️", text: "雪天" },
  { value: "windy", icon: "💨", text: "大风" }
]);

// 标签选项
const tags = ref(["重要", "开心", "难过", "思考", "计划", "纪念"]);

// 返回上一页
const goBack = () => {
  Taro.navigateBack();
};

// 分类选择变化
const onCategoryChange = (e) => {
  const index = e.detail.value;
  diaryData.category = categories.value[index];
};

// 选择情绪
const selectEmotion = (emotion) => {
  diaryData.emotion = emotion;
};

// 选择天气
const selectWeather = (weather) => {
  diaryData.weather = weather;
};

// 日期选择变化
const onDateChange = (e) => {
  diaryData.date = e.detail.value;
};

// 切换标签选择
const toggleTag = (tag) => {
  const index = diaryData.tags.indexOf(tag);
  if (index > -1) {
    diaryData.tags.splice(index, 1);
  } else {
    diaryData.tags.push(tag);
  }
};

// 选择图片
const chooseImage = () => {
  Taro.chooseImage({
    count: 3 - diaryData.images.length,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      diaryData.images = [...diaryData.images, ...res.tempFilePaths];
    },
    fail: (error) => {
      // 用户取消选择时不显示错误提示
      if (error.errMsg !== "chooseImage:fail cancel") {
        Taro.showToast({
          title: "选择图片失败",
          icon: "none"
        });
      }
    }
  });
};

// 移除图片
const removeImage = (index) => {
  diaryData.images.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  Taro.showModal({
    title: "确认重置",
    content: "确定要清空所有已填写的内容吗？",
    success: (res) => {
      if (res.confirm) {
        Object.assign(diaryData, {
          title: "",
          category: "",
          emotion: "",
          weather: "",
          tags: [],
          date: "",
          content: "",
          images: []
        });
        Taro.showToast({
          title: "已重置",
          icon: "success"
        });
      }
    }
  });
};

// 保存草稿
const saveDraft = () => {
  // 这里实现保存草稿逻辑
  Taro.showToast({
    title: "已保存为草稿",
    icon: "success"
  });
};

// 保存日记
const saveDiary = () => {
  if (!diaryData.title.trim()) {
    Taro.showToast({
      title: "请输入日记标题",
      icon: "none"
    });
    return;
  }

  if (!diaryData.content.trim()) {
    Taro.showToast({
      title: "请输入日记内容",
      icon: "none"
    });
    return;
  }

  // 这里实现保存日记逻辑
  console.log("保存日记:", diaryData);

  Taro.showLoading({
    title: "保存中..."
  });

  // 模拟保存过程
  setTimeout(() => {
    Taro.hideLoading();
    Taro.showToast({
      title: "保存成功",
      icon: "success",
      success: () => {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    });
  }, 1000);
};

// 页面加载时设置当前日期为默认值
onMounted(() => {
  const now = new Date();
  diaryData.date = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
});
</script>
