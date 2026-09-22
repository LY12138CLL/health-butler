<!-- 选择星期组件，监听select事件，返回已选中的星期 -->
<template>
     <div class="week">
        <div class="item" v-for="day in weekDays" :class="{active: selectedWeeks.includes(day)}" @click="toggleWeek(day)">{{ day }}</div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  afferentSelectedWeeks: String
})
const emit = defineEmits(['select'])
const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const selectedWeeks = ref([])
function init() {
  const afferentSelectedWeeks = props.afferentSelectedWeeks
  if (afferentSelectedWeeks !== "") {
    const weeks = afferentSelectedWeeks.split('、')
    weeks.forEach((item,index) => {
      weeks[index] = item.at(-1)
    })
    selectedWeeks.value = weeks
  }
}
init()
const toggleWeek = (day) => {
  const index = selectedWeeks.value.indexOf(day)
  if (index !== -1) {
    selectedWeeks.value.splice(index, 1)
  } else {
    selectedWeeks.value.push(day)
  }
  emit('select',selectedWeeks.value)
}
</script>
<style scoped>
 /* 父容器设置 Grid 布局 */
 .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 等分为 7 列 */
    gap: 10px; /* 间隔距离，可根据需求调整 */
    width: 100%; /* 填满父容器宽度 */
    max-width: 600px; /* 可选，限制最大宽度 */
    margin: 0 auto;   /* 居中显示 */
}

/* 每个星期项：正方形 + 美观样式 */
.week .item {
    aspect-ratio: 1 / 1;          /* 宽高比 1:1，保证正方形 */
    background-color: #f0f4f8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #4b4b4b;
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;
}

/* 模拟点击高亮（示例） */
.week .item.active {
    background-color: #1989fa;
    color: #fff;
}
</style>