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
            <view class="uploading-overlay">
              <text class="uploading-text">上传中...</text>
              <view class="uploading-spinner">⏳</view>
            </view>
          </view>
        </view>
        <view class="avatar-hint">点击头像更换</view>
        <view
          class="btn-update-avatar"
          :class="{ 'btn-uploading': isUploadingAvatar }"
          @tap="handleChooseImage"
        >
          {{ isUploadingAvatar ? '正在上传头像...' : '更换头像' }}
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
import { useUserStore } from '../../../stores/user'
import Taro from '@tarojs/taro'
import { uploadFileToSupabase } from '../../../utils/supabaseClient'
import './profile_editor.scss'

defineOptions({
  name: 'ProfileEditor'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用用户状态
const userStore = useUserStore()

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/80x80/333/fff?text=头像'

// 用户信息
const userInfo = reactive({
  avatar: ''
})

// 头像云存储URL（用于最终保存）
const avatarUrl = ref('')

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
const handleChooseImage = async () => {
  if (isUploadingAvatar.value) return

  try {
    // 选择图片
    const chooseResult = await Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    })

    const filePath = chooseResult.tempFilePaths[0]
    console.log('选择的头像文件:', filePath)

    // 立即显示选择的图片
    tempAvatar.value = filePath
    userInfo.avatar = filePath
    avatarChanged.value = true

    // 开始上传
    isUploadingAvatar.value = true

    Taro.showLoading({
      title: '上传头像中...'
    })

    // 上传到Supabase
    const uploadResult = await uploadFileToSupabase({
      bucket: 'diary_image',
      filePath: filePath,
      folder: 'user-avatars', // 专门的头像文件夹
      onProgress: (progress) => {
        console.log('上传进度:', progress + '%')
      }
    })

    if (uploadResult.success) {
      // 上传成功，更新头像URL
      const newAvatarUrl = uploadResult.data.publicUrl
      userInfo.avatar = newAvatarUrl
      avatarUrl.value = newAvatarUrl // 保存云存储URL用于后续保存

      // 立即更新到用户store中，实现全局缓存
      userStore.updateUserInfo({
        avatar: newAvatarUrl
      })

      console.log('头像上传成功并已同步到store:', newAvatarUrl)

      Taro.hideLoading()
      Taro.showToast({
        title: '头像上传成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      // 上传失败，恢复原状态
      throw new Error(uploadResult.error || '上传失败')
    }

  } catch (error) {
    console.error('头像处理失败:', error)

    // 恢复原状态
    userInfo.avatar = ''
    tempAvatar.value = ''
    avatarChanged.value = false

    Taro.hideLoading()
    Taro.showToast({
      title: error.message || '头像上传失败',
      icon: 'none',
      duration: 3000
    })
  } finally {
    isUploadingAvatar.value = false
  }
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
const handleSave = async () => {
  if (saving.value) return

  // 检查是否还在上传头像
  if (isUploadingAvatar.value) {
    Taro.showToast({
      title: '头像还在上传中，请稍候',
      icon: 'none'
    })
    return
  }

  saving.value = true

  Taro.showLoading({
    title: '保存中...'
  })

  try {
    // 构建要保存的数据
    const profileData = {
      user_name: formData.username,
      gender: formData.gender,
      birthday: formData.birthday,
      remark: formData.signature, // 个性签名存储到remark字段
      avatar: avatarUrl.value || userInfo.avatar // 使用云存储URL
    }

    console.log('准备保存的个人资料:', profileData)

    // 立即更新到用户store中
    userStore.updateUserInfo(profileData)
    console.log('个人资料已同步到store缓存')

    // TODO: 这里应该调用真实的API保存到后端
    // await saveProfileToServer(profileData)

    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    Taro.hideLoading()
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

  } catch (error) {
    console.error('保存个人资料失败:', error)
    Taro.hideLoading()
    Taro.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    })
  } finally {
    saving.value = false
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  // 从store中获取用户数据
  const storeUserInfo = userStore.userInfo
  if (storeUserInfo && storeUserInfo.avatar) {
    userInfo.avatar = storeUserInfo.avatar
    avatarUrl.value = storeUserInfo.avatar
    console.log('从store中加载用户头像:', storeUserInfo.avatar)
  }

  // 同步其他用户信息到表单
  if (storeUserInfo) {
    formData.username = storeUserInfo.user_name || '山水图'
    formData.gender = storeUserInfo.gender || '未选择'
    formData.birthday = storeUserInfo.birthday || ''
    formData.signature = storeUserInfo.remark || ''
    console.log('用户信息已从store同步到表单')
  }
})
</script>
