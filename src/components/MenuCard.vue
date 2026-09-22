<!-- 菜单项 -->
<template>
    <div class="card">
        <div class="left" v-if="isShowIcon">
            <van-icon class="menu-icon" :style="iconStyle" :class-prefix="iconClassPrefix" :name="iconName" />
        </div>
        <div class="middle">
            <span class="name">{{ name }}</span>
            <span class="message">{{ message }}</span>
        </div>
        <div class="right">
            <van-icon name="arrow" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

/* 数据 */
// 接收父组件数据
const props = defineProps({
    iconBackgroundColor: String,
    iconClassPrefix: String,
    iconName: String,
    name: String,
    message: String,
    isShowIcon: {
        type: Boolean,
        default: true
    }
})
// 计算最终样式对象（动态绑定）
const iconStyle = computed(() => ({
  color: '#ffffff',
  backgroundColor: props.iconBackgroundColor || '#3b82f6'
}))
</script>
<style scoped>
.card{
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    gap: 10px;
    font-size: 14px;
}
.middle{
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.left,.right{
    flex-shrink: 0;
}
.menu-icon {
  font-size: 25px;
  border-radius: 25%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.name{
    font-size: 16px;
}
.message{
    color: #6b7a8a;
}
:deep(.van-icon-arrow){
    color: #6b7a8a;
    font-size: 16px;
}
</style>