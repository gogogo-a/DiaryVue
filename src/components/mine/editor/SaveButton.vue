<template>
  <view class="save-button-container" :class="themeStore.currentThemeClass">
    <view class="save-button" @tap="handleSave">
      {{ text }}
    </view>
  </view>
</template>

<script setup>
import { defineOptions, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import './SaveButton.scss'

defineOptions({
  name: 'SaveButton'
})

// 定义props
const props = defineProps({
  text: {
    type: String,
    default: '保存修改'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['save'])

// 使用主题状态
const themeStore = useThemeStore()

// 处理保存
const handleSave = () => {
  if (props.loading) return
  emit('save')
}
</script>
