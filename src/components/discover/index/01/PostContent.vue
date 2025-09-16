<template>
  <view class="post-content" :class="themeStore.currentThemeClass">
    <view class="post-list">
      <view
        v-for="post in postList"
        :key="post.id"
        class="post-item"
      >
        <!-- 用户信息 -->
        <view class="user-info">
          <image
            class="user-avatar"
            :src="post.user.avatar"
            mode="aspectFill"
            @tap="handleUserClick(post.user)"
          />
          <view class="user-details">
            <view class="user-name" @tap="handleUserClick(post.user)">{{ post.user.name }}</view>
            <view class="post-time">{{ formatTime(post.createTime) }}</view>
          </view>
          <view class="post-date">{{ formatDate(post.createTime) }}</view>
        </view>

        <!-- 帖子内容 -->
        <view class="post-body">
          <view class="post-text">{{ post.content }}</view>
          <view v-if="post.images && post.images.length" class="post-images">
            <image
              v-for="(img, index) in post.images"
              :key="index"
              class="post-image"
              :src="img"
              mode="aspectFill"
              @tap="previewImage(post.images, index)"
            />
          </view>
        </view>

        <!-- 帖子互动 -->
        <view class="post-actions">
          <view class="action-left">
            <view class="avatars">
              <image
                v-for="(avatar, index) in post.likeAvatars.slice(0, 3)"
                :key="index"
                class="like-avatar"
                :src="avatar"
                mode="aspectFill"
              />
            </view>
            <view class="more-indicator" v-if="post.likeAvatars.length > 3">
              <text class="arrow">></text>
            </view>
          </view>

          <view class="action-right">
            <view class="like-btn" @tap="toggleLike(post)">
              <image class="action-icon" :src="searchIcon" mode="aspectFit" />
              <text class="like-count">{{ post.likeCount }}</text>
            </view>
            <view class="comment-btn" @tap="showComments(post)">
              <image class="action-icon" :src="labelIcon" mode="aspectFit" />
            </view>
            <view class="more-btn" @tap="showMore(post)">
              <text class="more-icon">⋯</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import { useThemeStore } from '../../../../stores/theme'
import Taro from '@tarojs/taro'
import './PostContent.scss'

// 导入图片
import test1Image from '../../../../assets/images/test1.webp'
import test2Image from '../../../../assets/images/test2.webp'
import test3Image from '../../../../assets/images/test3.webp'

// 导入图标
import searchIcon from '../../../../assets/svg/diary/search.svg'
import labelIcon from '../../../../assets/svg/diary/label.svg'

defineOptions({
  name: 'PostContent'
})

// 使用主题状态
const themeStore = useThemeStore()

// 模拟帖子数据
const postList = ref([
  {
    id: '1',
    user: {
      id: 'user1',
      name: '静若闲',
      avatar: test1Image
    },
    content: '躲在蚊子后面的大象\n别让蚊子大的事儿牵出大象一样的情绪',
    images: [test2Image],
    createTime: new Date(2023, 8, 16, 23, 4),
    likeCount: 3,
    likeAvatars: [
      test1Image,
      test2Image,
      test3Image
    ],
    isLiked: false
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'chile22',
      avatar: test3Image
    },
    content: '下午一个人在单位外面转，主要是想看看有没有新的店开张，我们这条很老旧的商业街，吵了一些很早开在这里的水产店、餐饮店和药店，得多新开了这个男装...小则一两个店',
    images: [],
    createTime: new Date(2023, 8, 16, 23, 0),
    likeCount: 0,
    likeAvatars: [],
    isLiked: false
  }
])

// 格式化时间
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `昨天 ${hours}:${minutes}`
}

// 格式化日期
const formatDate = (date) => {
  return '昨天'
}

// 处理用户点击
const handleUserClick = (user) => {
  console.log('点击用户:', user.name)
  Taro.showToast({
    title: `查看${user.name}的主页`,
    icon: 'none'
  })
}

// 预览图片
const previewImage = (images, current) => {
  Taro.previewImage({
    urls: images,
    current: current
  })
}

// 切换点赞
const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1

  Taro.showToast({
    title: post.isLiked ? '点赞成功' : '取消点赞',
    icon: 'none'
  })
}

// 显示评论
const showComments = (post) => {
  console.log('显示评论:', post.id)
  Taro.showToast({
    title: '评论功能即将上线',
    icon: 'none'
  })
}

// 显示更多选项
const showMore = (post) => {
  Taro.showActionSheet({
    itemList: ['举报', '不感兴趣', '屏蔽此用户'],
    success: (res) => {
      console.log('选择了:', res.tapIndex)
    }
  })
}
</script>
