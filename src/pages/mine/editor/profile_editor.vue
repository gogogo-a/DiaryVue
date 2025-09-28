<template>
  <view class="editor-page" :class="themeStore.currentThemeClass">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @tap="handleBack">
        <text class="nav-icon">←</text>
      </view>
      <view class="nav-title">个人资料</view>
      <view class="nav-right">
        <text class="nav-icon">⋯</text>
      </view>
    </view>

    <!-- 个人资料表单 -->
    <view class="profile-section">
      <view class="section-title">个人资料</view>
      <view class="section-subtitle">完善你的个人资料，让大家更好地认识你</view>

      <!-- 头像编辑部分 -->
      <view class="form-item avatar-item">
        <view class="item-label">头像</view>
        <view class="avatar-container" @tap="handleChooseImage">
          <image
            class="avatar-preview"
            :src="userInfo.avatar || defaultAvatar"
            mode="aspectFill"
          />
          <view class="avatar-edit-icon">
            <text class="camera-icon">📷</text>
          </view>
          <view v-if="isUploadingAvatar" class="avatar-uploading">
            <text class="uploading-text">上传中...</text>
          </view>
        </view>
        <view class="avatar-hint">点击头像更换</view>
        <view class="btn-update-avatar" @tap="handleChooseImage">
          {{ isUploadingAvatar ? '上传中...' : '更换头像' }}
        </view>
      </view>

      <!-- 昵称编辑 -->
      <view class="form-item">
        <view class="item-label">昵称</view>
        <view class="item-input-container">
          <input
            type="text"
            class="item-input"
            v-model="formData.username"
            placeholder="输入昵称"
          />
          <view class="clear-input" v-if="formData.username" @tap="clearNickname">×</view>
        </view>
      </view>

      <!-- 性别选择 -->
      <view class="form-item" @tap="handleGenderSelect">
        <view class="item-label">性别</view>
        <view class="item-value-container">
          <text class="item-value">{{ formData.gender || '未选择' }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <!-- 生日选择 -->
      <view class="form-item" @tap="handleBirthdaySelect">
        <view class="item-label">生日</view>
        <view class="item-value-container">
          <text class="item-value">{{ formData.birthday || '点击选择日期' }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <!-- 个性签名 -->
      <view class="form-item signature-item">
        <view class="item-label">个性签名</view>
        <view class="signature-container">
          <textarea
            class="signature-input"
            v-model="formData.signature"
            placeholder="点击输入个性签名"
            maxlength="100"
          ></textarea>
        </view>
      </view>
    </view>

    <!-- 底部保存按钮 -->
    <view class="bottom-actions">
      <view class="save-button" @tap="handleSave">保存修改</view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, reactive, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './profile_editor.scss'

defineOptions({
  name: 'ProfileEditor'
})

// 使用主题状态
const themeStore = useThemeStore()

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'

// 用户信息
const userInfo = reactive({
  avatar: ''
})

// 表单数据
const formData = reactive({
  username: '山水图',
  gender: '未选择',
  birthday: '',
  signature: ''
})

// 保存状态
const saving = ref(false)

// 返回上一页
const handleBack = () => {
  Taro.navigateBack()
}

// 临时头像路径
const tempAvatar = ref('')
// 头像上传状态
const isUploadingAvatar = ref(false)
// 头像是否已更改
const avatarChanged = ref(false)

// 选择头像
const handleChooseImage = () => {
  if (isUploadingAvatar.value) return

  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      tempAvatar.value = res.tempFilePaths[0]
      userInfo.avatar = res.tempFilePaths[0]
      avatarChanged.value = true

      Taro.showToast({
        title: '头像已选择',
        icon: 'success',
        duration: 1500
      })
    },
    fail: () => {
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

// 重置头像
const resetAvatar = () => {
  userInfo.avatar = ''
  tempAvatar.value = ''
  avatarChanged.value = false
}

// 清除昵称输入
const clearNickname = () => {
  formData.username = ''
}

// 选择性别
const handleGenderSelect = () => {
  Taro.showActionSheet({
    itemList: ['男', '女', '不显示'],
    success: (res) => {
      const genders = ['男', '女', '不显示']
      formData.gender = genders[res.tapIndex]
    }
  })
}

// 选择生日
const handleBirthdaySelect = () => {
  Taro.datePicker({
    success: (res) => {
      formData.birthday = `${res.year}-${res.month}-${res.day}`
    }
  }).catch(() => {
    // 兼容性处理：部分平台可能不支持datePicker
    Taro.showToast({
      title: '此平台不支持日期选择器',
      icon: 'none'
    })
  })
}

// 保存个人资料
const handleSave = () => {
  if (saving.value) return

  saving.value = true

  Taro.showLoading({
    title: '保存中...'
  })

  // 模拟网络请求
  setTimeout(() => {
    Taro.hideLoading()
    saving.value = false

    Taro.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    })
  }, 1000)
}

// 页面加载时获取用户信息
onMounted(() => {
  // 模拟从服务器获取用户数据
  // 实际开发中应该调用API获取最新数据
})
</script>
