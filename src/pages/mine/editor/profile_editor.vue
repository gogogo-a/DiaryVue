<template>
  <view class="profile-editor-page" :class="themeStore.currentThemeClass">
    <!-- 页面描述 -->
    <view class="page-description card margin">
      <text>完善你的个人资料，让大家更好地认识你</text>
    </view>

    <!-- 头像编辑部分 -->
    <view class="card margin">
      <ProfileAvatar v-model="userInfo.avatar" />
    </view>

    <!-- 表单部分 -->
    <view class="card margin">
      <ProfileForm v-model="formData" />
    </view>

    <!-- 底部操作区域，为保存按钮预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 保存按钮 -->
    <SaveButton :loading="saving" @save="handleSave" />
  </view>
</template>

<script setup>
import { defineOptions, ref, reactive, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import ProfileAvatar from '../../../components/mine/editor/ProfileAvatar.vue'
import ProfileForm from '../../../components/mine/editor/ProfileForm.vue'
import SaveButton from '../../../components/mine/editor/SaveButton.vue'
import './profile_editor.scss'

defineOptions({
  name: 'ProfileEditor'
})

// 使用主题状态
const themeStore = useThemeStore()

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

// 保存个人资料
const handleSave = () => {
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
