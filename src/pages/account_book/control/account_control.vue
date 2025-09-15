<template>
  <view class="account-control-page" :class="themeStore.currentThemeClass">
    <!-- 账本头部信息卡片 -->
    <view class="card margin">
      <AccountHeaderCard />
    </view>

    <!-- 账本列表 -->
    <view class="card margin">
      <AccountList />
    </view>

    <!-- 底部空间预留，为导航栏预留空间 -->
    <view class="bottom-spacer"></view>


  </view>
</template>

<script setup>
import AccountHeaderCard from '../../../components/account_book/control/01/AccountHeaderCard.vue'
import AccountList from '../../../components/account_book/control/02/AccountList.vue'
import TabBar from '../../../components/public/TabBar/TabBar.vue'
import { defineOptions, ref, onMounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'
import './account_control.scss'

defineOptions({
  name: 'AccountControlPage'
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
    tabBar.value.setActiveTab('index')
  }
})
</script>
