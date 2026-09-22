<!-- 用药管理页面今日服药任务 -->
<template>
        <div class="task">
            <van-swipe-cell>
                <div class="continer">
                    <div class="left">
                    <div class="row1">
                        <span class="name">{{ name }}</span>
                    </div>
                    <div class="row2">
                        <div class="dosage">
                            <span class="number">{{ dosage }}</span>
                            <span class="usage">{{ usage }}</span>
                            <van-tag :type="statusData.type">{{ statusData.message }}</van-tag>
                            
                        </div>
                    </div>
                    </div>
                    <div class="right">
                        <span class="time">{{ time }}</span>
                    </div>
                </div>
                <template #right>
                    <van-button :disabled="status !== '未执行'" size="small"  square type="primary" text="确认" @click="confirm" />
                    <van-button :disabled="status !== '未执行'" size="small" square type="danger" text="取消" @click="cancel" />
                </template>
            </van-swipe-cell>
        </div>
</template>
<script setup>
import { computed } from 'vue'

// 子传父事件
const emit = defineEmits(['confirm', 'cancel'])

/* 数据 */
const props = defineProps({
    name: String,
    dosage: String,
    usage: String,
    time: String,
    status: String
})
// 计算任务状态
const statusData = computed(() => {
    if (props.status === "未执行") return {type: 'primary', message: "未执行"}
    else if (props.status === "已执行") return {type: 'success',message: "已执行"}
    else if(props.status === "已过期") return {type: 'danger', message: "已过期"}
    else if(props.status === "已取消") return {type: 'warning', message: "已取消"}
})

/* 功能函数 */
// 确认
function confirm() {
    showConfirmDialog({
        message:'是否已服用？',
        }).then(() => {
            emit("confirm")
        }).catch(() => {
            // on cancel
        })
}
// 取消
function cancel() {
    showConfirmDialog({
        message:'是否取消？',
        }).then(() => {
            emit("cancel")
        }).catch(() => {
            // on cancel
        })
}
</script>
<style scoped>
*{
    box-sizing: border-box;
}
.task{
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 10px;
}
.continer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
}
.left{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.row1{
    display: flex;
    gap: 10px;
    align-items: center;
}
.name{
    font-weight: bold;
    font-size: 16px;
}
.row2{
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #848586;

}
.dosage{
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 14px;
}
.right{
    display: flex;
}
.time{
    padding: 5px;
    background-color: #f0f4ff;
    color: #4a7cf7;
    font-size: 14px;
    border-radius: 10px;
}

.dot{
    width: 10px; /* 圆的宽度 */
    height: 10px; /* 圆的高度 */
    border-radius: 50%; /* 使元素成为圆形 */
    display: inline-block;
    background-color: #3498db;
    margin-top: 2.5px;
}
:deep(.van-swipe-cell__right) {
    display: flex;
    align-items: flex-end;
    gap: 2px;
}
</style>