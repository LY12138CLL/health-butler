<!-- 首页菜单卡片展示 -->
<template>
    <div class="item">
        <van-icon
          class-prefix="my-icon"
          :name="iconName"
          :style="iconStyle"
        />
        <div class="info">
          <span class="name">{{ menuName }}</span>
          <van-highlight class="message" :keywords="lightText" :source-string="message" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {getBackgroundColor} from "../utils/tools.js"
/* 数据 */
// 接收父组件数据
const props = defineProps({
  iconName: {
    type: String,
    default: 'jiaonang'
  },
  iconColor: {
    type: String,
    default: '#f97316'
  },
  menuName: {
    type: String,
    default: '未知'
  },
  message: String
})
// 计算最终样式对象（动态绑定）
const iconStyle = computed(() => ({
  color: props.iconColor,
  backgroundColor: getBackgroundColor(props.iconColor)
}))
// 计算获取高亮文本
const lightText = computed(() => {
    const text = props.message
    // 提取 xx次 与 xx:xx 格式的文本
    return text.match(/\d+次|\d{1,2}:\d{1,2}:\d{1,2}/g) ?? []
})


/* 功能函数 */

</script>

<style scoped>
.item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
}
.my-icon {
  font-size: 32px;
  border-radius: 25%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info {
  display: flex;
  flex-direction: column;
}
.name {
  font-size: 20px;
  font-weight: 700;
}
.message {
  font-size: 14px;
  color: #848586;
}
</style>