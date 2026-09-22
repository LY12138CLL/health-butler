<!-- 用药管理首页菜单 -->
<template>
    <div class="card">
        <div class="row1">
            <van-icon class-prefix="my-icon"  :name="iconName" :style="iconStyle"/>
        </div>
        <div class="row2">
            <span class="menu-name">{{ menuName }}</span>
            <span class="message">{{ message }}</span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

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
  color: props.iconColor
}))

</script>
<style scoped>
.card {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    height: 100px;
    justify-content: space-around;
    padding: 0 10px 0 10px;
    background-color: #ffffff;
    width: 50%;
    align-items: center;
}
.my-icon{
    font-size: 48px;
}
.row2{
    display: flex;
    gap: 10px;
    align-items: center;
}
.menu-name {
    font-size: 16px;
    font-weight: bolder;
}
.message{
    font-size: 14px;
    color: #848586;
}
</style>