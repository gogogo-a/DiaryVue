<template>
  <view class="diary-detail-page" :class="themeStore.currentThemeClass">
    <!-- 头部导航 -->
    <view class="detail-header">
      <view class="back-btn" @tap="handleBack">
        <!-- <text class="icon">←</text> -->
        <text>返回</text>
      </view>
      <text class="detail-title">日记详情</text>
      <view class="header-actions">
        <text class="icon">⋮</text>
      </view>
    </view>

    <!-- 日记内容区域 -->
    <scroll-view class="detail-content" scroll-y>
      <!-- 作者信息 - 只显示名字 -->
      <view class="author-section">
        <view class="author-info">
          <text class="author-name-large">小明</text>
          <text class="publish-time">发布于 {{ publishTime }}</text>
        </view>
      </view>

      <!-- 日记内容 -->
      <view class="diary-content">
        <text class="content-text">{{ diaryContent }}</text>
      </view>

      <!-- 互动按钮 -->
      <view class="interaction-buttons">
        <view class="interaction-btn" @tap="handleLike">
          <text class="icon">{{ isLiked ? "❤️" : "🤍" }}</text>
          <text class="btn-text">{{ likeCount }}</text>
        </view>
        <view class="interaction-btn" @tap="handleComment">
          <text class="icon">💬</text>
          <text class="btn-text">{{ commentCount }}</text>
        </view>
        <view class="interaction-btn" @tap="handleShare">
          <text class="icon">↗️</text>
          <text class="btn-text">分享</text>
        </view>
      </view>

      <!-- 评论列表 -->
      <view class="comments-section">
        <text class="section-title">评论 ({{ comments.length }})</text>

        <view class="comment-list">
          <view
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-author">{{ comment.author }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="action-btn" @tap="handleReply(comment)">回复</text>
                <text class="action-btn" @tap="handleLikeComment(comment)">
                  {{ comment.liked ? "❤️" : "🤍" }} {{ comment.likes }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部评论输入框 -->
    <view class="comment-input-container">
      <input
        class="comment-input"
        placeholder="写下你的评论..."
        :value="commentText"
        @input="onCommentInput"
        @confirm="handleSendComment"
      />
      <view class="send-btn" @tap="handleSendComment">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue"; // 修改这里：使用 onMounted 替代 onLoad
import Taro from "@tarojs/taro";
import { useThemeStore } from "../../../stores/theme";

const themeStore = useThemeStore();

// 日记数据
const diaryId = ref("");
const diaryContent = ref(
  "就算要出卖灵魂，也要找个付的起价钱的人。今天在图书馆读到了这句话，深有感触。我们常常为了各种原因妥协，但最重要的是要知道自己的价值。"
);
const publishTime = ref("2025-09-15 14:47");
const isLiked = ref(false);
const likeCount = ref(24);
const commentCount = ref(8);

// 评论数据
const comments = ref([
  {
    id: 1,
    author: "小红",
    content: "这句话真的很有道理，值得深思！",
    time: "2小时前",
    likes: 3,
    liked: false,
  },
  {
    id: 2,
    author: "小刚",
    content: "歌德的智慧总是能给人启发",
    time: "1小时前",
    likes: 1,
    liked: true,
  },
]);

const commentText = ref("");

// 使用 onMounted 替代 onLoad
onMounted(() => {
  // 在 Taro 中，可以通过 getCurrentInstance 获取路由参数
  const currentInstance = Taro.getCurrentInstance();
  const options = currentInstance.router?.params || {};

  console.log("详情页加载，参数:", options);
  console.log("日记ID:", options.id);

  diaryId.value = options.id;
  loadDiaryDetail(options.id);
});

const loadDiaryDetail = (id) => {
  console.log("加载日记详情数据，ID:", id);
  // 实际项目中这里应该调用API
};

const handleBack = () => {
  Taro.navigateBack();
};

const handleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const handleComment = () => {
  // 聚焦到输入框
};

const handleShare = () => {
  Taro.showShareMenu({
    withShareTicket: true,
  });
};

const handleReply = (comment) => {
  commentText.value = `@${comment.author} `;
};

const handleLikeComment = (comment) => {
  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;
};

const onCommentInput = (e) => {
  commentText.value = e.detail.value;
};

const handleSendComment = () => {
  if (!commentText.value.trim()) return;

  const newComment = {
    id: Date.now(),
    author: "当前用户",
    content: commentText.value,
    time: "刚刚",
    likes: 0,
    liked: false,
  };

  comments.value.unshift(newComment);
  commentCount.value += 1;
  commentText.value = "";
  Taro.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  });
};
</script>

<style>
@import "./index.scss";
</style>
