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

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 日记表单 -->
    <scroll-view v-else class="form-scroll" scroll-y>
      <view class="form-container">
        <!-- 标题输入 -->
        <view class="form-group">
          <text class="form-label">日记标题 *</text>
          <input
            class="form-input"
            v-model="diaryData.title"
            placeholder="输入日记标题"
            placeholder-class="placeholder"
            maxlength="100"
          />
        </view>

        <!-- 内容输入 -->
        <view class="form-group">
          <text class="form-label">日记内容 *</text>
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

        <!-- 权限选择 -->
        <view class="form-group">
          <text class="form-label">日记权限 *</text>
          <view class="permission-container">
            <view
              v-for="permission in permissions"
              :key="permission.id"
              class="permission-item"
              :class="{ active: selectedPermission?.id === permission.id }"
              @tap="selectPermission(permission)"
            >
              <text class="permission-icon">
                {{
                  permission.permission_name === "public"
                    ? "🌍"
                    : permission.permission_name === "private"
                    ? "🔒"
                    : permission.permission_name === "friends"
                    ? "👥"
                    : "🔐"
                }}
              </text>
              <text class="permission-text">
                {{
                  permission.permission_name === "public"
                    ? "公开"
                    : permission.permission_name === "private"
                    ? "私密"
                    : permission.permission_name === "friends"
                    ? "好友可见"
                    : "密码保护"
                }}
              </text>
            </view>
          </view>
        </view>

        <!-- 标签选择 -->
        <view class="form-group">
          <text class="form-label"
            >选择标签 * (已选择 {{ selectedTags.length }} 个)</text
          >
          <view v-if="tags.length > 0" class="tag-container">
            <view
              v-for="tag in tags"
              :key="tag.id"
              class="tag-item"
              :class="{ active: selectedTags.some((t) => t.id === tag.id) }"
              @tap="toggleTag(tag)"
            >
              <text class="tag-name">#{{ tag.tag_name }}</text>
              <text class="tag-type">{{ tag.type }}</text>
            </view>
          </view>
          <view v-else class="empty-tags">
            <text>暂无可选标签</text>
          </view>
        </view>

        <!-- 地址输入（可选） -->
        <view class="form-group">
          <text class="form-label">地址（可选）</text>
          <input
            class="form-input"
            v-model="diaryData.address"
            placeholder="记录地点信息"
            placeholder-class="placeholder"
            maxlength="200"
          />
        </view>

        <!-- 图片上传（暂时禁用） -->
        <view class="form-group">
          <text class="form-label">添加图片（开发中）</text>
          <view class="image-uploader">
            <view class="upload-button disabled" @tap="chooseImage">
              <text class="icon">📷</text>
              <text>图片上传功能开发中</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="button button-outline" @tap="resetForm">重置</view>
      <view class="button" :class="{ disabled: saving }" @tap="saveDiary">
        {{ saving ? "保存中..." : "保存日记" }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useThemeStore } from "../../../stores/theme";
import Taro from "@tarojs/taro";
import diaryAPI from "../../../utils/diary";
import "./adddiary.scss";

// 使用主题状态
const themeStore = useThemeStore();

// 页面状态
const loading = ref(false);
const saving = ref(false);

// 日记数据（与后端API保持一致）
const diaryData = reactive({
  title: "",
  content: "",
  permission_id: "",
  tag_ids: [],
  address: "",
  image_urls: [],
  video_urls: [],
});

// 从后端获取的数据
const tags = ref([]);
const permissions = ref([]);

// 选中的标签和权限（用于UI显示）
const selectedTags = ref([]);
const selectedPermission = ref(null);

// 返回上一页
const goBack = () => {
  if (hasUnsavedChanges()) {
    Taro.showModal({
      title: "提示",
      content: "您有未保存的内容，确定要离开吗？",
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      },
    });
  } else {
    Taro.navigateBack();
  }
};

// 检查是否有未保存的更改
const hasUnsavedChanges = () => {
  return (
    diaryData.title.trim() ||
    diaryData.content.trim() ||
    diaryData.tag_ids.length > 0
  );
};

// 加载页面数据
const loadPageData = async () => {
  try {
    loading.value = true;

    // 并行获取标签和权限数据
    const [tagsResponse, permissionsResponse] = await Promise.all([
      diaryAPI.getTags(),
      diaryAPI.getPermissions(),
    ]);

    tags.value = Array.isArray(tagsResponse) ? tagsResponse : [];
    permissions.value = Array.isArray(permissionsResponse)
      ? permissionsResponse
      : [];

    console.log("✅ 加载页面数据成功:", {
      tags: tags.value,
      permissions: permissions.value,
    });

    // 设置默认权限（如果有公开权限，默认选择它）
    const publicPermission = permissions.value.find(
      (p) => p.permission_name === "public"
    );
    if (publicPermission) {
      selectedPermission.value = publicPermission;
      diaryData.permission_id = publicPermission.id;
    } else if (permissions.value.length > 0) {
      // 如果没有公开权限，选择第一个
      selectedPermission.value = permissions.value[0];
      diaryData.permission_id = permissions.value[0].id;
    }
  } catch (error) {
    console.error("❌ 加载页面数据失败:", error);
    Taro.showModal({
      title: "加载失败",
      content: "获取标签和权限数据失败，请重试",
      showCancel: true,
      cancelText: "返回",
      confirmText: "重试",
      success: (res) => {
        if (res.confirm) {
          loadPageData();
        } else {
          Taro.navigateBack();
        }
      },
    });
  } finally {
    loading.value = false;
  }
};

// 切换标签选择
const toggleTag = (tag) => {
  const index = selectedTags.value.findIndex((t) => t.id === tag.id);
  if (index > -1) {
    // 移除标签
    selectedTags.value.splice(index, 1);
    const tagIdIndex = diaryData.tag_ids.indexOf(tag.id);
    if (tagIdIndex > -1) {
      diaryData.tag_ids.splice(tagIdIndex, 1);
    }
  } else {
    // 添加标签
    selectedTags.value.push(tag);
    diaryData.tag_ids.push(tag.id);
  }
};

// 选择权限
const selectPermission = (permission) => {
  selectedPermission.value = permission;
  diaryData.permission_id = permission.id;
};

// 选择图片（暂时保留，后续可扩展上传功能）
const chooseImage = () => {
  Taro.showToast({
    title: "图片上传功能开发中",
    icon: "none",
  });
};

// 移除图片（暂时保留）
const removeImage = (index) => {
  // 暂时不实现
};

// 重置表单
const resetForm = () => {
  Taro.showModal({
    title: "确认重置",
    content: "确定要清空所有已填写的内容吗？",
    success: (res) => {
      if (res.confirm) {
        // 重置数据
        diaryData.title = "";
        diaryData.content = "";
        diaryData.address = "";
        diaryData.tag_ids = [];
        diaryData.image_urls = [];
        diaryData.video_urls = [];

        // 重置选中状态
        selectedTags.value = [];

        // 重置权限为默认值
        const publicPermission = permissions.value.find(
          (p) => p.permission_name === "public"
        );
        if (publicPermission) {
          selectedPermission.value = publicPermission;
          diaryData.permission_id = publicPermission.id;
        } else if (permissions.value.length > 0) {
          selectedPermission.value = permissions.value[0];
          diaryData.permission_id = permissions.value[0].id;
        }

        Taro.showToast({
          title: "已重置",
          icon: "success",
        });
      }
    },
  });
};

// 保存草稿（暂时简单实现）
const saveDraft = () => {
  if (!diaryData.title.trim() && !diaryData.content.trim()) {
    Taro.showToast({
      title: "没有可保存的内容",
      icon: "none",
    });
    return;
  }

  // 暂时保存到本地存储
  try {
    Taro.setStorageSync("diary_draft", JSON.stringify(diaryData));
    Taro.showToast({
      title: "已保存为草稿",
      icon: "success",
    });
  } catch (error) {
    console.error("保存草稿失败:", error);
    Taro.showToast({
      title: "保存草稿失败",
      icon: "none",
    });
  }
};

// 验证表单数据
const validateForm = () => {
  if (!diaryData.title.trim()) {
    Taro.showToast({
      title: "请输入日记标题",
      icon: "none",
    });
    return false;
  }

  if (!diaryData.content.trim()) {
    Taro.showToast({
      title: "请输入日记内容",
      icon: "none",
    });
    return false;
  }

  if (!diaryData.permission_id) {
    Taro.showToast({
      title: "请选择日记权限",
      icon: "none",
    });
    return false;
  }

  if (!diaryData.tag_ids || diaryData.tag_ids.length === 0) {
    Taro.showToast({
      title: "请至少选择一个标签",
      icon: "none",
    });
    return false;
  }

  return true;
};

// 保存日记
const saveDiary = async () => {
  if (saving.value) return;

  if (!validateForm()) {
    return;
  }

  try {
    saving.value = true;

    Taro.showLoading({
      title: "保存中...",
      mask: true,
    });

    console.log("🟢 开始保存日记:", diaryData);

    // 调用API创建日记
    const result = await diaryAPI.createDiary(diaryData);

    console.log("✅ 日记创建成功:", result);

    Taro.hideLoading();

    // 清除草稿
    try {
      Taro.removeStorageSync("diary_draft");
    } catch (error) {
      console.warn("清除草稿失败:", error);
    }

    Taro.showToast({
      title: "保存成功",
      icon: "success",
      duration: 2000,
      success: () => {
        setTimeout(() => {
          // 返回上一页，并刷新日记列表
          Taro.navigateBack({
            success: () => {
              // 发送刷新事件
              Taro.eventCenter.trigger("refreshDiaryList");
            },
          });
        }, 1500);
      },
    });
  } catch (error) {
    console.error("❌ 保存日记失败:", error);

    Taro.hideLoading();

    const errorMessage = error.message || "保存失败，请重试";
    Taro.showModal({
      title: "保存失败",
      content: errorMessage,
      showCancel: false,
      confirmText: "确定",
    });
  } finally {
    saving.value = false;
  }
};

// 加载草稿
const loadDraft = () => {
  try {
    const draft = Taro.getStorageSync("diary_draft");
    if (draft) {
      const draftData = JSON.parse(draft);

      // 只加载基本数据，不覆盖权限和标签选择状态
      diaryData.title = draftData.title || "";
      diaryData.content = draftData.content || "";
      diaryData.address = draftData.address || "";

      console.log("✅ 加载草稿成功:", draftData);

      Taro.showToast({
        title: "已加载草稿",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("加载草稿失败:", error);
  }
};

// 页面加载
onMounted(() => {
  loadPageData();
  loadDraft();
});
</script>
