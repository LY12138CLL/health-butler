<!-- 每盒药品记录 -->
<template>
        <div class="record">
            <van-swipe-cell>
                <div class="continer">
                    <div class="row1">
                        <span class="name">{{ name }}</span>
                        <van-tag :type="status.type">{{ status.message }}</van-tag>
                    </div>
                    <div class="row2">
                        <van-text-ellipsis :content="notes" expand-text="展开" collapse-text="收起" />
                    </div>
                    <div class="row3">
                        <span class="norms">{{ norms + normsUnit }}</span>
                        <span class="expiration-date">有效期至{{ expirationDate }}</span>
                        <span class="manufacturer">{{ manufacturer }}</span>
                    </div>
                </div>
            <template #right>
                <van-button square type="primary" size="small" text="编辑" @click="editMedicine"/>
                <van-button square type="danger" size="small"  text="删除" @click="deleteMedicine" />
            </template>
            </van-swipe-cell>  
        </div>   
</template>
<script setup>
import { computed } from 'vue';

// 子传父事件
const emit = defineEmits(['edit','delete'])

/* 数据 */
// 父传子数据
const props = defineProps({
    name: String,
    norms:String,
    normsUnit: String,
    expirationDate: String,
    manufacturer: String,
    status: String,
    notes: String
})
/* 计算属性 */
// 药品有效期状态，未过期、临期、过期
const status = computed(() => {
    const now = new Date()
    const expirationDate = new Date(props.expirationDate)
    const diffTime = expirationDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 10) return {message: "未过期", type: "success"}
    else if (diffDays > 0 && diffDays <= 10) return {message: "临期", type: "warning"}
    else return {message: "已过期", type: "danger"}
})

/* 功能函数 */
// 编辑
function editMedicine() {
    emit('edit')
}
// 删除
function deleteMedicine() {
    emit('delete')
}
</script>
<style scoped>
*{
    box-sizing: border-box;
}
.record{
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px; 
}
.continer{
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
}
.row1{
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
:deep(.van-tag){
    margin-right: 2px;
}
.name{
    font-size: 16px;
    font-weight: bold;
}
.row2,.row3{
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