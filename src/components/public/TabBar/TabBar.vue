<template>
  <view class="tab-bar" :class="themeStore.currentThemeClass">
    <view 
      class="tab-item" 
      :class="{ active: activeTab === 'index' }"
      @tap="switchTab('index')"
    >
      <view class="icon-wrapper">
        <image class="tab-icon" :src="indexIcon" mode="aspectFit" />
      </view>
      <text class="tab-text">首页</text>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: activeTab === 'find' }"
      @tap="switchTab('find')"
    >
      <view class="icon-wrapper">
        <image class="tab-icon" :src="findIcon" mode="aspectFit" />
      </view>
      <text class="tab-text">发现</text>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: activeTab === 'my' }"
      @tap="switchTab('my')"
    >
      <view class="icon-wrapper">
        <image class="tab-icon" :src="myIcon" mode="aspectFit" />
      </view>
      <text class="tab-text">我的</text>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import Taro from '@tarojs/taro'
import './TabBar.scss'

// 导入SVG图标
import indexIcon from '../../../assets/svg/bar/index.svg'
import findIcon from '../../../assets/svg/bar/find.svg'
import myIcon from '../../../assets/svg/bar/my.svg'

defineOptions({
  name: 'TabBarComponent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 当前激活的标签页
const activeTab = ref('index')

// 切换标签页
const switchTab = (tab) => {
  // 如果点击的是当前已激活的标签，不做任何操作
  if (activeTab.value === tab) {
    return
  }
  
  // 更新当前激活的标签
  activeTab.value = tab
  
  // 根据选中的标签页进行跳转
  switch(tab) {
    case 'index':
      Taro.switchTab({
        url: '/pages/index/index',
        fail: () => {
          Taro.navigateTo({
            url: '/pages/index/index'
          })
        }
      })
      break
    case 'find':
      Taro.showToast({
        title: '发现功能即将上线',
        icon: 'none'
      })
      break
    case 'my':
      Taro.showToast({
        title: '我的功能即将上线',
        icon: 'none'
      })
      break
  }
}

// 导出供父组件使用的方法
defineExpose({
  setActiveTab: (tab) => {
    activeTab.value = tab
  }
})
</script> 