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
      <view class="empty-icon">📝</view>
      <text class="empty-title">还没有日记</text>
      <text class="empty-subtitle">记录生活的美好瞬间</text>
      <view class="empty-action" @tap="handleAddDiary">
        <text class="action-text">添加一篇吧</text>
      </view>
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

// 操作菜单相关状态
const showActionMenu = ref(false);
const currentDiary = ref(null);
const deletingDiaryId = ref("");

// 获取日记列表
const fetchDiaryList = async (forceRefresh = false) => {
  try {
    loading.value = true;
    console.log("🟢 开始获取日记列表...", forceRefresh ? "(强制刷新)" : "");

    // 添加时间戳参数防止缓存
    const params = {
      page: 1,
      page_size: 10,
    };

    if (forceRefresh) {
      params._t = Date.now();
    }

    const response = await diaryAPI.getDiaryList(params);

    if (response && response.list) {
      const oldCount = diaryList.value.length;
      diaryList.value = response.list;
      const newCount = response.list.length;
      console.log("✅ 获取日记列表成功:", `${oldCount} → ${newCount} 条记录`);
      console.log(
        "✅ 日记ID列表:",
        response.list.map((d) => d.id)
      );
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

// 刷新日记列表
const refreshDiaryList = () => {
  console.log("🔄 收到刷新日记列表事件");
  fetchDiaryList();
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

const handleCardClick = (diaryId) => {
  console.log("🟢 点击卡片，准备跳转...", diaryId);

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

// ================================
// 操作菜单相关方法
// ================================

// 显示操作菜单
const handleShowActions = (diary) => {
  console.log("🟢 显示操作菜单:", diary.id);
  console.log("🟢 当前日记数据:", diary);
  console.log("🟢 日记标题:", diary.title);
  console.log("🟢 日记内容预览:", diary.content?.substring(0, 20) + "...");

  // 确保日记对象完整性
  if (!diary || !diary.id) {
    console.error("❌ 日记对象无效:", diary);
    Taro.showToast({
      title: "日记数据异常",
      icon: "none",
    });
    return;
  }

  currentDiary.value = diary;
  showActionMenu.value = true;
  console.log("🟢 菜单显示状态:", showActionMenu.value);
  console.log("🟢 已设置currentDiary:", currentDiary.value);
};

// 隐藏操作菜单
const hideActionMenu = () => {
  console.log("🟢 隐藏操作菜单");
  showActionMenu.value = false;
  currentDiary.value = null;
};

// 查看评论
const handleViewComments = () => {
  console.log("🟢 查看评论:", currentDiary.value?.id);
  hideActionMenu();

  // 跳转到日记详情页面的评论区域
  Taro.navigateTo({
    url: `/pages/diary/detail/index?id=${currentDiary.value?.id}&scrollTo=comments`,
  }).catch((err) => {
    console.error("❌ 跳转评论页面失败:", err);
    Taro.showToast({
      title: "跳转失败",
      icon: "none",
    });
  });
};

// 切换置顶状态
const handleTogglePin = () => {
  console.log("🟢 切换置顶状态:", currentDiary.value?.id);
  hideActionMenu();

  // 暂时显示提示，后续可以实现置顶API
  const action = currentDiary.value?.is_pinned ? "取消置顶" : "置顶";
  Taro.showToast({
    title: `${action}功能开发中`,
    icon: "none",
  });
};

// 编辑日记
const handleEditDiary = () => {
  console.log("🟢 编辑日记:", currentDiary.value?.id);
  hideActionMenu();

  // 跳转到编辑页面（可以复用添加日记页面）
  Taro.navigateTo({
    url: `/pages/diary/adddiary/adddiary?id=${currentDiary.value?.id}&mode=edit`,
  }).catch((err) => {
    console.error("❌ 跳转编辑页面失败:", err);
    Taro.showToast({
      title: "跳转失败",
      icon: "none",
    });
  });
};

// 分享日记
const handleShareDiary = () => {
  console.log("🟢 分享日记:", currentDiary.value?.id);
  hideActionMenu();

  // 使用微信分享功能
  Taro.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
  })
    .then(() => {
      console.log("✅ 分享菜单显示成功");
    })
    .catch((err) => {
      console.error("❌ 显示分享菜单失败:", err);
      Taro.showToast({
        title: "分享功能暂不可用",
        icon: "none",
      });
    });
};

// 删除日记
const handleDeleteDiary = () => {
  console.log("🟢 删除日记被点击!");
  console.log("🟢 当前日记对象:", currentDiary.value);
  console.log("🟢 currentDiary 类型:", typeof currentDiary.value);
  console.log("🟢 currentDiary 是否为null:", currentDiary.value === null);
  console.log(
    "🟢 currentDiary 是否为undefined:",
    currentDiary.value === undefined
  );

  // 检查currentDiary是否有效
  if (!currentDiary.value || !currentDiary.value.id) {
    console.error("❌ 当前日记对象无效:", currentDiary.value);
    Taro.showToast({
      title: "日记数据异常，无法删除",
      icon: "none",
    });
    hideActionMenu();
    return;
  }

  console.log("🟢 当前日记ID:", currentDiary.value.id);
  console.log("🟢 当前日记标题:", currentDiary.value.title);
  console.log("🟢 当前日记内容:", currentDiary.value.content);

  // ⚠️ 重要：在隐藏菜单之前先保存日记信息，因为hideActionMenu会把currentDiary.value设为null
  const diary = currentDiary.value;
  const diaryId = diary.id;

  // 获取安全的标题显示 - 使用更防御性的代码
  let diaryTitle = "此日记"; // 默认值

  try {
    if (diary && diary.title) {
      diaryTitle = diary.title;
    } else if (diary && diary.content) {
      diaryTitle = diary.content.substring(0, 20);
    }
  } catch (error) {
    console.error("❌ 获取日记标题时出错:", error);
    diaryTitle = "此日记";
  }

  // 现在可以安全地隐藏菜单了
  hideActionMenu();

  console.log("🟢 准备删除的日记:", { id: diaryId, title: diaryTitle });

  // 显示确认对话框
  Taro.showModal({
    title: "确认删除",
    content: `确定要删除日记《${diaryTitle}》吗？删除后无法恢复。`,
    confirmText: "删除",
    confirmColor: "#ff4757",
    cancelText: "取消",
    success: async (res) => {
      if (res.confirm) {
        console.log("🟢 用户确认删除，开始执行删除操作");
        await performDeleteDiary(diaryId);
      } else {
        console.log("🟢 用户取消删除操作");
      }
    },
  });
};

// 执行删除操作
const performDeleteDiary = async (diaryId) => {
  if (!diaryId || deletingDiaryId.value) return;

  try {
    deletingDiaryId.value = diaryId;

    Taro.showLoading({
      title: "删除中...",
      mask: true,
    });

    console.log("🟢 开始删除日记:", diaryId);

    // 调用删除API
    const deleteResult = await diaryAPI.deleteDiary(diaryId);

    console.log("✅ 删除日记API响应:", deleteResult);
    console.log("✅ 删除日记成功:", diaryId);

    // 先从本地列表中移除该日记（乐观更新）
    diaryList.value = diaryList.value.filter((diary) => diary.id !== diaryId);
    console.log("✅ 已从本地列表移除日记:", diaryId);

    Taro.hideLoading();

    // 显示成功提示
    Taro.showToast({
      title: "删除成功",
      icon: "success",
      duration: 1500,
    });

    // 延迟刷新日记列表以确保后端数据同步
    setTimeout(async () => {
      console.log("🔄 延迟强制刷新日记列表...");
      await fetchDiaryList(true); // 强制刷新，防止缓存

      // 再次检查删除的日记是否还在列表中
      const stillExists = diaryList.value.some((diary) => diary.id === diaryId);
      if (stillExists) {
        console.warn("⚠️ 日记仍在列表中，进行二次删除...");
        // 强制从列表中移除
        diaryList.value = diaryList.value.filter(
          (diary) => diary.id !== diaryId
        );
      }
    }, 500);

    // 额外的保险刷新（1.5秒后）
    setTimeout(async () => {
      console.log("🔄 保险刷新日记列表...");
      await fetchDiaryList(true);
    }, 1500);
  } catch (error) {
    console.error("❌ 删除日记失败:", error);

    Taro.hideLoading();

    const errorMessage = error.message || "删除失败，请重试";
    Taro.showModal({
      title: "删除失败",
      content: errorMessage,
      showCancel: false,
      confirmText: "确定",
    });
  } finally {
    deletingDiaryId.value = "";
  }
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
