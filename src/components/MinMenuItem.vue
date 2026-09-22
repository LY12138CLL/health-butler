<!-- 首页矩形菜单卡片 -->
<template>
    <div class="card" :style="{color: color,backgroundColor: getBackgroundColor(color)}">
        <span class="title">{{ title }}</span>
        <span class="count">{{ count }}</span>
        <slot name='message'></slot>
    </div>
</template>
<script setup>
import {getBackgroundColor} from "../utils/tools.js"
/* 数据 */
// 接收父组件数据
const props = defineProps({
    color: String,
    title: String,
    count: String,

})

</script>
<style scoped>
.card {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    height: 100px;
    justify-content: space-around;
    padding: 0 10px 0 10px;
}
.title,span{
    font-size: 18px;
}
.count{
    font-size: 18px;
    font-weight: 700;
}
</style>