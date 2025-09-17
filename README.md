# DiaryVue - 基于Taro和Vue 3的日记小程序

DiaryVue是一个使用Taro框架和Vue 3开发的微信小程序，专注于提供简洁、美观的日记记录体验。项目采用了主题切换功能，支持默认主题和怀旧主题，并具有良好的组件化结构。
# Taro 官方文档
https://docs.taro.zone/docs/GETTING-STARTED
# 图片压缩网站，转webp
https://towebp.io/jpg-to-webp
# icon网站找svg的
https://www.iconpacks.net/free-icon/location-2952.html#google_vignette
## 项目

```
DiaryVue/
  ├── babel.config.js        # Babel配置
  ├── config/                # 项目配置
  │   ├── dev.js            # 开发环境配置
  │   ├── index.js          # 基础配置
  │   └── prod.js           # 生产环境配置
  ├── package.json          # 依赖管理
  ├── project.config.json   # 微信小程序配置
  ├── project.tt.json       # 头条小程序配置
  └── src/                  # 源代码
      ├── app.config.js     # 应用配置
      ├── app.css           # 全局样式
      ├── app.js            # 应用入口
      ├── assets/           # 静态资源
      │   └── images/       # 图片资源
      │       └── svg/      # SVG图标
      ├── components/       # 组件目录
      │   ├── index/        # 首页组件
      │   ├── diary/        # 日记页组件
      │   └── public/       # 公共组件
      ├── pages/            # 页面目录
      │   ├── index/        # 首页
      │   └── diary/        # 日记页
      ├── router/           # 路由配置
      ├── stores/           # 状态管理
      │   ├── counter.js    # 计数器状态
      │   └── theme.js      # 主题状态
      ├── styles/           # 样式目录
      │   ├── themes.scss   # 主题变量
      │   ├── themes.js     # 主题配置
      │   └── variables.scss # 全局变量
      └── utils/            # 工具函数
          └── themeManager.js # 主题管理器
```

## 技术栈

- **框架**: Taro + Vue 3
- **状态管理**: Pinia
- **样式**: SCSS
- **构建工具**: Webpack
- **小程序平台**: 微信小程序

## 编码规范

### 命名规范

1. **文件命名**:
   - 组件文件: 使用PascalCase (如 `ThemeSwitch.vue`)
   - 工具/配置文件: 使用camelCase (如 `themeManager.js`)
   - 样式文件: 与组件同名 (如 `ThemeSwitch.scss`)

2. **变量命名**:
   - 常量: 使用UPPER_SNAKE_CASE (如 `THEMES.DEFAULT`)
   - 变量: 使用camelCase (如 `currentTheme`)
   - 私有变量: 使用下划线前缀 (如 `_privateVar`)

3. **组件命名**:
   - 使用PascalCase (如 `<ThemeSwitch>`)
   - 页面组件添加Page后缀 (如 `IndexPage`)

### 样式规范

1. **CSS变量**:
   - 主题相关变量: 使用CSS变量 (如 `--primary-color`)
   - 全局静态变量: 使用SCSS变量 (如 `$padding-size`)

2. **样式结构**:
   - 组件样式: 与组件同级目录，同名文件
   - 全局样式: 放在`styles`目录下
   - 主题变量: 统一在`themes.scss`中定义

3. **样式命名**:
   - 使用kebab-case (如 `.theme-switch`)
   - 使用BEM命名法 (Block-Element-Modifier)

### 组件规范

1. **组件结构**:
   ```vue
   <template>
     <!-- 模板内容 -->
   </template>

   // 导入
   import { defineOptions, ref } from 'vue'
   import './ComponentName.scss'

   // 组件选项
   defineOptions({
     name: 'ComponentName'
   })

   // 状态和逻辑
   const state = ref(initialValue)

   // 方法
   const handleEvent = () => {
     // 处理逻辑
   }
   </script>
   ```

2. **组件分类**:
   - 页面组件: 放在`pages`目录下
   - 业务组件: 放在对应页面的`components`子目录下
   - 公共组件: 放在`components/public`目录下

## 文件创建习惯

1. **新组件创建**:
   - 为每个组件创建单独的目录
   - 目录中包含`.vue`和`.scss`文件
   - 组件目录与组件同名

   例如:
   ```
   components/
     └── ThemeSwitch/
         ├── ThemeSwitch.vue
         └── ThemeSwitch.scss
   ```

2. **页面创建**:
   - 在`pages`目录下创建页面目录
   - 目录中包含`.vue`, `.scss`和`.config.js`文件
   - 页面配置文件与页面同名

   例如:
   ```
   pages/
     └── diary/
         ├── diary.vue
         ├── diary.scss
         └── diary.config.js
   ```

3. **资源文件**:
   - 图片资源放在`assets/images`目录下
   - SVG图标按功能分类存放在`assets/svg`的子目录中

## 主题系统

项目实现了主题切换功能，包括默认主题和怀旧主题。主题系统的核心包括:

1. **主题变量定义**: 在`styles/themes.scss`中使用CSS变量定义主题颜色
2. **主题切换逻辑**: 在`utils/themeManager.js`中实现主题的保存和切换
3. **全局状态管理**: 使用Pinia的`stores/theme.js`管理全局主题状态
4. **主题应用**: 在组件中通过`:class="themeStore.currentThemeClass"`应用主题

## 项目启动和构建

### 环境要求

- Node.js ==22.17.0
- 使用pnpm

### 安装依赖
```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:weapp --watch
```

### 预览和调试

1. 使用微信开发者工具打开项目根目录下的`dist`文件夹
2. 在开发者工具中预览和调试小程序





## 用户管理核心模块分工

### tokenmanager.js 

- Token生命周期管理

- **职责**: Token的底层存储和生命周期管理
- **核心功能**:
  - Token存储/读取 (`setTokens`, `getAccessToken`)
  - 过期检查 (`isTokenExpired`, `checkTokenRemainingTime`)
  - 自动刷新定时器 (`setupAutoRefresh`)
  - 回调机制 (`setRefreshCallback`, `setExpiredCallback`)

### http.js 

- HTTP请求处理器

- **职责**: HTTP请求封装、拦截器和错误处理
- **核心功能**:
  - 请求/响应拦截器 (`processRequestConfig`, `processResponse`)
  请求：
  除了登录-》添加通用信息（设备型号等），添加自动添加Token (`addAuthToken`)

  - Token过期处理 (`handleTokenExpired` - 委托给user.js)--避免循环
  响应：

  - 通过状态码，统一错误处理 (`handleHttpError`, `showErrorToast`) 
  注意，实际接口开发中不需要再次错误处理！！！

  - 便捷请求方法 (`get`, `post`, `put`, `delete`)

#### HTTP拦截器使用方法

**基础使用**:

```javascript
import http from '@/utils/http'

// GET请求
const userData = await http.get('/user/profile')

// 带参数的GET请求
const diaryList = await http.get('/diary/list', { page: 1, size: 10 })

// POST请求
const newDiary = await http.post('/diary/create', {
  title: '今天的心情',
  content: '今天天气不错...'
})

// PUT请求
const updated = await http.put('/diary/123', { title: '更新标题' })

// DELETE请求
await http.delete('/diary/123')
```

**特殊配置**:
```javascript
// 跳过token验证（用于登录接口）
await http.post('/auth/login', data, { skipAuth: true })

// 自定义超时时间
await http.get('/api/data', {}, { timeout: 15000 })

// 自定义请求头
await http.post('/upload', formData, {
  header: { 'Content-Type': 'multipart/form-data' }
})
```

**在Store中使用**:
```javascript
// stores/diary.js
export const useDiaryStore = defineStore('diary', {
  actions: {
    async fetchDiaryList() {
      try {
        this.loading = true
        this.diaryList = await http.get('/diary/list')
      } catch (error) {
        // 错误已自动处理和显示
        console.log('请求失败，可显示重试按钮')
      } finally {
        this.loading = false
      }
    }
  }
})
```

**自动功能**:
- ✅ **Token管理**: 自动添加Authorization头，token过期时自动刷新
- ✅ **错误处理**: 自动显示错误Toast提示，无需手动处理
- ✅ **请求队列**: token刷新期间请求会自动排队等待
- ✅ **通用配置**: 自动添加设备信息、时间戳等请求头
- ✅ **URL处理**: 自动拼接基础URL和处理查询参数

###  userinfo.js 

- 登录API封装

- **职责**: 纯API调用，不处理状态管理
- **核心功能**:
  - 完整登录 (`wxLogin` - 带UI交互)->跟用户有交互
  - 静默登录 (`silentWxLogin` - 无UI交互)->用户无感，防止打断
  - 用户信息获取 (`getUserInfo`)
  - 通用API请求 (`apiRequest`)

###  user.js 

- 用户状态管理

- **职责**: 用户状态管理和登录流程协调
- **核心功能**:
  - 用户状态管理 (`userInfo`, `isLoggedIn`, `userStats`)
  - 登录流程协调 (`login`, `silentLogin`, `checkAndEnsureLogin`)
  - 状态持久化 (`setLoginState`, `clearLoginState`)
  - Token刷新协调 (调用userinfo.js后更新tokenmanager.js)

### 调用逻辑

```
用户登录流程:
App → user.js → userinfo.js → http.js → 后端API
                     ↓
             tokenmanager.js (存储token)

Token自动刷新:
http.js (检测过期) → user.js (协调刷新) → userinfo.js (静默登录) 
                                              ↓
                              tokenmanager.js (更新token)
```

**依赖关系**: `tokenmanager.js`(底层) ← `http.js` ← `userinfo.js` ← `user.js`(业务层)

## 项目特性

- **主题切换**: 支持默认主题和怀旧主题，可随时切换
- **响应式设计**: 适配不同尺寸的设备屏幕
- **组件化**: 高度组件化的设计，提高代码复用性
- **状态管理**: 使用Pinia进行全局状态管理
- **自定义导航栏**: 实现了自定义的TabBar导航组件
- **筛选功能**: 在日记页面实现了分类、标签、日期和搜索筛选
- **Token自动管理**: 自动刷新机制，用户无感知登录状态维护

## 开发注意事项

1. **样式隔离**: 微信小程序中的样式是隔离的，全局样式需要在`app.css`中引入
2. **主题切换**: 在组件中使用`:class="themeStore.currentThemeClass"`应用主题
3. **导航栏颜色**: 页面切换时需要调用`themeStore.updateNavigationBarColor()`更新导航栏颜色
4. **TabBar激活状态**: 页面加载时需要设置当前页面对应的TabBar激活状态

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

