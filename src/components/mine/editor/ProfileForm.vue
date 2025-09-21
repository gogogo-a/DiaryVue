<template>
  <view class="profile-form" :class="themeStore.currentThemeClass">
    <!-- 昵称输入 -->
    <view class="form-row">
      <view class="form-label">昵称</view>
      <view class="input-container">
        <input
          type="text"
          class="form-input"
          :value="username"
          @input="onUsernameInput"
          placeholder="输入昵称"
        />
        <view
          class="clear-btn"
          v-if="username"
          @tap="clearUsername"
        >×</view>
      </view>
    </view>

    <!-- 性别选择 -->
    <view class="form-row" @tap="handleGenderSelect">
      <view class="form-label">性别</view>
      <view class="selector-container">
        <text class="selector-value">{{ gender || '未选择' }}</text>
        <text class="selector-arrow">></text>
      </view>
    </view>

    <!-- 生日选择 -->
    <view class="form-row" @tap="handleBirthdaySelect">
      <view class="form-label">生日</view>
      <view class="selector-container">
        <text class="selector-value">{{ birthday || '点击选择日期' }}</text>
        <text class="selector-arrow">></text>
      </view>
    </view>

    <!-- 个性签名 -->
    <view class="form-row signature-row">
      <view class="form-label">个性签名</view>
      <view class="textarea-container">
        <textarea
          class="form-textarea"
          :value="signature"
          @input="onSignatureInput"
          placeholder="点击输入个性签名"
          maxlength="100"
        ></textarea>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, defineProps, defineEmits, computed } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './ProfileForm.scss'

defineOptions({
  name: 'ProfileForm'
})

// 定义props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      username: '',
      gender: '',
      birthday: '',
      signature: ''
    })
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 获取单独的表单值，并设置计算属性
const username = computed({
  get: () => props.modelValue.username,
  set: (val) => updateField('username', val)
})

const gender = computed({
  get: () => props.modelValue.gender,
  set: (val) => updateField('gender', val)
})

const birthday = computed({
  get: () => props.modelValue.birthday,
  set: (val) => updateField('birthday', val)
})

const signature = computed({
  get: () => props.modelValue.signature,
  set: (val) => updateField('signature', val)
})

// 使用主题状态
const themeStore = useThemeStore()

// 更新表单字段
const updateField = (field, value) => {
  const updatedValue = {
    ...props.modelValue,
    [field]: value
  }
  emit('update:modelValue', updatedValue)
}

// 处理输入事件
const onUsernameInput = (e) => {
  updateField('username', e.detail.value)
}

const onSignatureInput = (e) => {
  updateField('signature', e.detail.value)
}

// 清除昵称
const clearUsername = () => {
  updateField('username', '')
}

// 选择性别
const handleGenderSelect = () => {
  Taro.showActionSheet({
    itemList: ['男', '女', '不显示'],
    success: (res) => {
      const genders = ['男', '女', '不显示']
      updateField('gender', genders[res.tapIndex])
    }
  })
}

// 选择生日
const handleBirthdaySelect = () => {
  Taro.datePicker({
    success: (res) => {
      updateField('birthday', `${res.year}-${res.month}-${res.day}`)
    }
  }).catch(() => {
    // 兼容性处理：部分平台可能不支持datePicker
    Taro.showToast({
      title: '此平台不支持日期选择器',
      icon: 'none'
    })
  })
}
</script>
