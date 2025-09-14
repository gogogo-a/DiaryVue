import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.css'
import { useThemeStore } from './stores/theme'

const App = createApp({
  onLaunch() {
    // 初始化主题
    const themeStore = useThemeStore()
    themeStore.initTheme()
  },
  onShow(options) {
    // 每次显示应用时更新导航栏颜色
    const themeStore = useThemeStore()
    themeStore.updateNavigationBarColor()
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
