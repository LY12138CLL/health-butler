<!-- 任务管理 计划计划 计划 -->
<template>
    <div class="record">
        <van-swipe-cell>
            <div class="continer">
                <div class="row1">
                    <span class="name">{{ name }}</span>
                    <span class="date">{{ noticeTime }}</span>
                </div>
                <div class="row2">
                    <span class="implementWeek">{{ implementWeek }}</span>
                </div>
            </div>
            <template #right>
                <van-button square type="primary" size="small" text="编辑" @click="edit" />
                <van-button square type="danger" size="small" text="删除" @click="deteleteTake" />
                    
            </template>
        </van-swipe-cell>
    </div>
</template>
<script setup>
/* 数据 */
// 接收父组件数据
const props = defineProps({
    name: String, // 计划名称
    noticeTime: String, // 提醒时间
    implementWeek: String // 提醒的周
})

// 子传父事件
const emit = defineEmits(['edit','detete'])


/* 功能函数 */
function edit() {
    emit('edit')
}
function deteleteTake() {
    emit('detete')
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

}
.row1{
    display: flex;
    justify-content: space-between;
    padding-right: 5px;
}
.name{
    font-size: 16px;
    font-weight: bold;
}
.date{
    color: #4a7cf7;
    font-size: 14px;
}
.row2{
    display: flex;
    gap: 5px;
    font-size: 14px;
    color: #848586;
}
:deep(.van-swipe-cell__right) {
    display: flex;
    align-items: flex-end;
    gap: 2px;
}
</style>