<template>
  <view class="counter-container">
    <text class="subtitle-text text-center">{{ counter.count }}</text>
    <view class="button-container">
      <view class="button" @tap="onAdd">增加</view>
    </view>
  </view>
</template>

<script setup>
import { useCounterStore } from '../stores/counter'
import { defineOptions } from 'vue'

defineOptions({
  name: 'CounterComponent'
})

const counter = useCounterStore()

const onAdd = () => {
  counter.count++

  // with autocompletion ✨
  // counter.$patch({count: counter.count + 1})

  // or using an action instead
  // counter.increment()
}
</script>

<style scoped>
.counter-container {
  padding: 15px 0;
}
.button-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
</style>
