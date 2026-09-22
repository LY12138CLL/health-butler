<!-- 药品种类卡片 -->
<template>
    <div class="card" @click="detalis">
        <div class="row1">
            <span class="name">{{ name }}</span>
            <van-tag :type="daysStatus.type">{{daysStatus.day}}天</van-tag>
        </div>
        <div class="row2">
            <div class="left">
                <span class="surplus">{{ surplus }}</span>
                <span class="manufacturer">{{ manufacturer }}</span>
                <span class="norms">{{ norms + normsUnit }}</span>
                <span class="price">{{ totalPrice }}元</span>
            </div>
            <div class="right">
                <van-icon name="delete-o" />
                <span class="delete" @click.stop="deleteMedicine">删除</span>
            </div>    
        </div>
        
    </div>
</template>
<script setup>
import {medicineTaskStore,medicineStore} from "../../stores/medicineStore"
import { computed } from "vue"
const yprwStore = medicineTaskStore()
const ypStore = medicineStore()
/* 数据 */
// 接收父组件数据
const props = defineProps({
    typeid: String,
    name: String,
    norms: String,
    normsUnit: String,
    surplus: String,
    manufacturer: String
})
// 子传父事件名称
const emit = defineEmits(['delete'])
/* 功能函数 */
// 删除
function deleteMedicine() {
    emit('delete')
}
// 获取剩余服药天数状态
const daysStatus = computed(() => {
    const days = yprwStore.getRemainingDays(props.typeid)
    if (days > 10) return {day:days,type:'success'}
    else if (days >= 5 && days < 10) return {day:days,type:'warning'}
    else if (days >=0 && days < 5) return {day:days,type:'danger'}
    else return {day:days,type:'aaa'}
})
// 获取该类药品的总价
const totalPrice = computed(() => {
    return ypStore.medicineData.reduce((total_price,item) => {
        if (props.typeid === item.typeid)  total_price+=Number(item.price)*100
        return total_price
    },0)/100
})
</script>
<style scoped>
.card{
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
}
.name{
    font-size: 16px;
    font-weight: bold;
}
.row1{
    display: flex;
    justify-content: space-between;
}
.row3{
    color: #848586;
    font-size: 14px;
    display: flex;

}
.row2{
    color: #848586;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
}
.left{
    display: flex;
    gap: 10px;
}
</style>