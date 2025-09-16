<template>
  <view class="mine-page" :class="themeStore.currentThemeClass">
    <!-- 用户头像和基本信息 -->
    <view class="card margin">
      <MineHeader />
    </view>

    <!-- 统计数据 -->
    <view class="card margin">
      <MineStats />
    </view>

    <!-- 菜单列表 -->
    <view class="card margin">
      <MineMenuList />
    </view>

    <!-- 底部操作区域，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>

    <!-- 底部导航栏 -->
    <TabBar ref="tabBar" />
  </view>
</template>

<script setup>
import TabBar from '../../../components/public/TabBar/TabBar.vue'
import MineHeader from '../../../components/mine/index/01/MineHeader.vue'
import MineStats from '../../../components/mine/index/02/MineStats.vue'
import MineMenuList from '../../../components/mine/index/03/MineMenuList.vue'
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import './mine.scss'

defineOptions({
  name: 'MinePage'
})

// 使用主题状态
const themeStore = useThemeStore()

// 底部导航栏引用
const tabBar = ref(null)

// 确保导航栏颜色与当前主题一致
themeStore.updateNavigationBarColor()

// 页面加载时设置当前激活的标签
onMounted(() => {
  if (tabBar.value) {
    tabBar.value.setActiveTab('my')
  }
})
</script>
