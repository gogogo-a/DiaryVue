<template>
  <view class="mine-menu-list" :class="themeStore.currentThemeClass">
    <view
      v-for="item in menuItems"
      :key="item.id"
      class="menu-item"
      @tap="handleMenuTap(item)"
    >
      <view class="menu-icon" :style="{ backgroundColor: item.iconBg }">
        <text class="icon-text">{{ item.icon }}</text>
      </view>
      <text class="menu-title">{{ item.title }}</text>

      <!-- 特殊的开关组件，用于日记本密码 -->
      <view v-if="item.id === 'password'" class="menu-switch">
        <switch
          :checked="passwordEnabled"
          @change="handlePasswordToggle"
          color="var(--primary-color)"
        />
      </view>

      <!-- 版本号显示 -->
      <view v-else-if="item.id === 'version'" class="menu-extra">
        <text class="version-text">{{ appVersion }}</text>
      </view>

      <!-- 退出账号特殊样式 -->
      <view v-else-if="item.id === 'logout'" class="menu-extra">
        <text class="logout-text">退出</text>
      </view>

      <!-- 普通箭头 -->
      <view v-else class="menu-arrow">
        <text class="arrow-text">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref, reactive } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import { useUserStore } from '../../../../stores/user'
import Taro from '@tarojs/taro'
import './MineMenuList.scss'

defineOptions({
  name: 'MineMenuList'
})

// 使用主题状态
const themeStore = useThemeStore()

// 使用用户状态
const userStore = useUserStore()

// 密码开关状态
const passwordEnabled = ref(false)

// 应用版本号
const appVersion = ref('v25.0912')

// 菜单项配置
const menuItems = reactive([
  {
    id: 'space',
    title: '个人空间',
    icon: '👤',
    iconBg: '#4CAF50'
  },
  {
    id: 'password',
    title: '日记本密码',
    icon: '🔒',
    iconBg: '#F44336'
  },
  {
    id: 'wechat',
    title: '公众号',
    icon: '📢',
    iconBg: '#2196F3'
  },
  {
    id: 'recycle',
    title: '回收站',
    icon: '🗑️',
    iconBg: '#FF5722'
  },
  {
    id: 'browse',
    title: '浏览记录',
    icon: '📊',
    iconBg: '#00BCD4'
  },
  {
    id: 'recommend',
    title: '推荐好友',
    icon: '👥',
    iconBg: '#4CAF50'
  },
  {
    id: 'help',
    title: '使用帮助',
    icon: '❓',
    iconBg: '#FF9800'
  },
  {
    id: 'contact',
    title: '联系客服',
    icon: '🎧',
    iconBg: '#3F51B5'
  },
  {
    id: 'version',
    title: '软件版本',
    icon: 'ℹ️',
    iconBg: '#9E9E9E'
  },
  {
    id: 'logout',
    title: '退出账号',
    icon: '🚪',
    iconBg: '#F44336'
  }
])

// 处理菜单项点击
const handleMenuTap = (item) => {
  switch(item.id) {
    case 'space':
      Taro.navigateTo({
        url: '/pages/mine/personal_space/personal_space',
        success: () => {
          console.log('跳转到个人空间成功')
        },
        fail: (err) => {
          console.error('跳转到个人空间失败:', err)
          Taro.showToast({
            title: '跳转失败，请重试',
            icon: 'none'
          })
        }
      })
      break
    case 'wechat':
      Taro.showToast({
        title: '公众号功能',
        icon: 'none'
      })
      break
    case 'recycle':
      Taro.showToast({
        title: '回收站功能',
        icon: 'none'
      })
      break
    case 'browse':
      Taro.showToast({
        title: '浏览记录功能',
        icon: 'none'
      })
      break
    case 'recommend':
      Taro.showToast({
        title: '推荐好友功能',
        icon: 'none'
      })
      break
    case 'help':
      Taro.showToast({
        title: '使用帮助功能',
        icon: 'none'
      })
      break
    case 'contact':
      Taro.showToast({
        title: '联系客服功能',
        icon: 'none'
      })
      break
    case 'version':
      Taro.showModal({
        title: '软件版本',
        content: `当前版本：${appVersion.value}\n\n这是一个基于Taro和Vue3开发的日记应用`,
        showCancel: false
      })
      break
    case 'logout':
      handleLogout()
      break
    case 'password':
      // 密码功能由开关处理，这里不做操作
      break
  }
}

// 处理退出账号
const handleLogout = () => {
  Taro.showModal({
    title: '退出账号',
    content: '确定要退出当前账号吗？',
    confirmText: '退出',
    confirmColor: '#F44336',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 显示加载提示
          Taro.showLoading({
            title: '退出中...',
            mask: true
          })

          // 调用用户store的退出登录方法
          const success = await userStore.logout()

          Taro.hideLoading()

          if (success) {
            // 退出成功，跳转到首页
            Taro.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            Taro.showToast({
              title: '退出失败，请重试',
              icon: 'none',
              duration: 2000
            })
          }
        } catch (error) {
          Taro.hideLoading()
          console.error('退出账号异常:', error)

          Taro.showToast({
            title: '退出异常，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

// 处理密码开关切换
const handlePasswordToggle = (e) => {
  passwordEnabled.value = e.detail.value
  const message = passwordEnabled.value ? '已开启日记本密码' : '已关闭日记本密码'
  Taro.showToast({
    title: message,
    icon: passwordEnabled.value ? 'success' : 'none'
  })
}
</script>

