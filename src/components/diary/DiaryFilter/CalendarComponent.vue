<!-- CalendarComponent.vue -->
<template>
  <view class="calendar-component">
    <!-- 日历头部 - 年月和导航 -->
    <view class="calendar-header">
      <view class="nav-btn" @tap="prevMonth">←</view>
      <view class="current-month">{{ currentYear }}年{{ currentMonth + 1 }}月</view>
      <view class="nav-btn" @tap="nextMonth">→</view>
    </view>

    <!-- 星期头部 -->
    <view class="week-header">
      <view v-for="day in weekDays" :key="day" class="week-day">{{ day }}</view>
    </view>

    <!-- 日期网格 -->
    <view class="days-grid">
      <view
        v-for="(day, index) in days"
        :key="index"
        class="day-cell"
        :class="{
          'current-month': day.isCurrentMonth,
          'selected': isSelected(day.date),
          'today': isToday(day.date)
        }"
        @tap="selectDate(day)"
      >
        <text class="day-number">{{ day.date.getDate() }}</text>
        <view v-if="hasEvents(day.date)" class="event-indicator"></view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="calendar-actions">
      <view class="action-btn today-btn" @tap="goToToday">今天</view>
      <view class="action-btn confirm-btn" @tap="confirmSelection">确认</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 星期几的显示文本
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 当前显示的年份和月份
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 选中的日期（可以是单个日期或日期范围）
const selectedDate = ref(null)
const selectedDateRange = ref({ start: null, end: null })

// 模拟的事件数据（实际应用中应从外部传入）
const events = ref([
  new Date(2025, 8, 15), // 9月15日有事件
  new Date(2025, 8, 20), // 9月20日有事件
  new Date(2025, 8, 25)  // 9月25日有事件
])

// 计算当前月要显示的所有天数（包括前后月的填充天数）
const days = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  // 当月第一天
  const firstDay = new Date(year, month, 1)
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  // 当月第一天是星期几（0-6，0代表周日）
  const firstDayOfWeek = firstDay.getDay()
  // 当月总天数
  const daysInMonth = lastDay.getDate()

  // 上个月需要显示的天数
  const daysFromPrevMonth = firstDayOfWeek
  // 下个月需要显示的天数（确保日历网格是6行7列=42天）
  const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth)

  const daysArray = []

  // 添加上个月的天数
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = new Date(year, month - 1, prevMonthLastDay - daysFromPrevMonth + i + 1)
    daysArray.push({ date, isCurrentMonth: false })
  }

  // 添加当月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    daysArray.push({ date, isCurrentMonth: true })
  }

  // 添加下个月的天数
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const date = new Date(year, month + 1, i)
    daysArray.push({ date, isCurrentMonth: false })
  }

  return daysArray
})

// 切换到上个月
const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

// 切换到下个月
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// 判断是否是今天
const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

// 判断是否被选中
const isSelected = (date) => {
  if (!selectedDate.value) return false
  return date.getDate() === selectedDate.value.getDate() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getFullYear() === selectedDate.value.getFullYear()
}

// 判断某天是否有事件
const hasEvents = (date) => {
  return events.value.some(eventDate =>
    eventDate.getDate() === date.getDate() &&
    eventDate.getMonth() === date.getMonth() &&
    eventDate.getFullYear() === date.getFullYear()
  )
}

// 选择日期
const selectDate = (day) => {
  if (!day.isCurrentMonth) {
    // 点击非当前月的日期，切换到对应的月份
    currentDate.value = new Date(day.date.getFullYear(), day.date.getMonth(), 1)
  }
  selectedDate.value = new Date(day.date)
}

// 跳转到今天
const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

// 确认选择
const confirmSelection = () => {
  // 触发事件，将选中的日期传递给父组件
  emit('dateSelected', selectedDate.value)
}

// 定义事件
const emit = defineEmits(['dateSelected'])

onMounted(() => {
  // 初始化选中今天
  selectedDate.value = new Date()
})
</script>

<style lang="scss">
@import "../../../styles/variables.scss";
@import "../../../styles/themes.scss";

.calendar-component {
  width: 100%;
  padding: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}

.current-month {
  font-size: $subtitle-font-size;
  font-weight: $font-weight-medium;
  color: var(--text-color);
}

.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
  color: var(--text-color);
  background-color: var(--background-color);

  &:active {
    background-color: var(--primary-pitch-on);
  }
}

.week-header {
  display: flex;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.week-day {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: $body-font-size;
  color: var(--text-color-light);
  font-weight: $font-weight-medium;
}

.days-grid {
  display: flex;
  flex-wrap: wrap;
}

.day-cell {
  width: calc(100% / 7);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-number {
  font-size: $body-font-size;
  color: var(--text-color);
}

.day-cell:not(.current-month) .day-number {
  color: var(--text-color-lighter);
  opacity: 0.6;
}

.day-cell.today .day-number {
  color: var(--primary-button-background);
  font-weight: $font-weight-bold;
}

.day-cell.selected {
  background-color: var(--primary-button-background);
  border-radius: 50%;

  .day-number {
    color: var(--white-color);
  }

  .event-indicator {
    background-color: var(--white-color);
  }
}

.event-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--primary-button-background);
  margin-top: 2px;
}

.calendar-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: $body-font-size;
  font-weight: $font-weight-medium;
}

.today-btn {
  color: var(--primary-button-background);
  background-color: transparent;
  border: 1px solid var(--primary-button-background);
}

.confirm-btn {
  color: var(--white-color);
  background-color: var(--primary-button-background);
}
</style>
