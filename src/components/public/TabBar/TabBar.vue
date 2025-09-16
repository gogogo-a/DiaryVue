<template>
  <view class="tab-bar" :class="themeStore.currentThemeClass">
    <view
      class="tab-item"
      :class="{ active: activeTab === 'index' }"
      @tap="switchTab('index')"
    >
      <view class="icon-wrappe">
        <image class="tab-icon" :src="indexIcon" mode="aspectFit" />
      </view>
      <text class="tab-text">首页</text>
    </view>
    <view
      class="tab-item"
      :class="{ active: activeTab === 'find' }"
      @tap="switchTab('find')"
    >
      <view class="icon-wrappe">
        <image class="tab-icon" :src="findIcon" mode="aspectFit" />
      </view>
      <text class="tab-text">发现</text>
    </view>
    <view
      class="tab-item"
      :class="{ active: activeTab === 'my' }"
      @tap="switchTab('my')"
    >
      <view class="icon-wrappe">
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

  // 获取当前页面栈
  const pages = Taro.getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentRoute = currentPage ? currentPage.route : ''

  // 根据选中的标签页进行跳转
  switch(tab) {
    case 'index':
      // 如果当前不在首页，则跳转
      if (currentRoute !== 'pages/index/index') {
        Taro.navigateTo({
          url: '/pages/index/index',
          success: () => {
            console.log('跳转到首页成功')
          },
          fail: (err) => {
            console.error('跳转到首页失败:', err)
            Taro.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            })
          }
        })
      }
      break
    case 'find':
      // 如果当前不在发现页面，则跳转
      if (currentRoute !== 'pages/discover/index/discover') {
        Taro.navigateTo({
          url: '/pages/discover/index/discover',
          success: () => {
            console.log('跳转到发现页面成功')
          },
          fail: (err) => {
            console.error('跳转到发现页面失败:', err)
            Taro.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            })
          }
        })
      }
      break
    case 'my':
      // 如果当前不在个人页面，则跳转
      if (currentRoute !== 'pages/mine/index/mine') {
        Taro.navigateTo({
          url: '/pages/mine/index/mine',
          success: () => {
            console.log('跳转到个人页面成功')
          },
          fail: (err) => {
            console.error('跳转到个人页面失败:', err)
            Taro.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            })
          }
        })
      }
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
