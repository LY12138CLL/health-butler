<!-- 历史任务记录 -->
<template>
    <div class="record">
        <van-swipe-cell>
            <div class="continer">
                <div class="row1">
                    <span class="name">{{ name }}</span>
                    <van-tag class="status" :type="statusData.type">{{ statusData.message }}</van-tag>
                </div>
                <div class="row2">
                    <span class="noticeTime">计划：{{ noticeTime }}</span>
                </div>
                <div class="row3">
                    <span class="confirmTime" v-if="status === '已执行'">实际：{{ confirmTime }}</span>
                </div>
            </div>
            <template #right>
                <van-button size="small" square type="danger" text="删除" @click="deleteTask" />
            </template>
        </van-swipe-cell>
    </div>
</template>
<script setup>
import { computed } from 'vue'

// 接收父组件数据
const props = defineProps({
    name: String, // 药品名称
    noticeTime: String, // 需要服药的时间
    confirmTime: String, // 实际服药的时间
    status: String // 任务状态
})
// 子传父事件
const emit = defineEmits(['delete'])
// 计算任务状态
const statusData = computed(() => {
    if (props.status === "未执行") return {type: 'primary', message: "未执行"}
    else if (props.status === "已执行") return {type: 'success',message: "已执行"}
    else if(props.status === "已过期") return {type: 'danger', message: "已过期"}
    else if(props.status === "已取消") return {type: 'warning', message: "已取消"}
})
/* 功能函数 */
// 删除
function deleteTask() {
    emit('delete')
}
</script>
<style scoped>
*{
    box-sizing: border-box;
}
.record{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px;
}
.continer{
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
}
.name{
    font-size: 16px;
    font-weight: bold;
}
.row1 {
    display: flex;
    justify-content: space-between;
}
.row2, .row3{
    color: #848586;
    font-size: 14px;
}
.status{
    margin-right: 2px;
}
:deep(.van-swipe-cell__right) {
    display: flex;
    align-items: flex-end;
    gap: 2px;
}
</style>