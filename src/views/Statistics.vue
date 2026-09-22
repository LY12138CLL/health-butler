<!-- 统计 -->
<template>
    <div id="statistics">
        <BPstatisticsCard :bp-data="bpData" class="bp-card"/>
        <MedicineStatisticsCard :total-price="totalPrice" :total-record="totalMedicineTaskNumber" />
    </div> 
</template>
<script setup>
import { computed } from "vue"
import BPstatisticsCard from "../components/BP/BPstatisticsCard.vue"
import MedicineStatisticsCard from "../components/Medicine/MedicineStatisticsCard.vue"
import { xueyaStore } from "../stores/xueyaStore.js"
import {BPstatisticsCardData} from "../utils/tools.js"
import {medicineStore,medicineTaskStore} from "../stores/medicineStore.js"
/* 路由与仓库 */
const xyStore = xueyaStore()
const ypStore = medicineStore()
const yprwStore = medicineTaskStore()
/* 数据 */
// 血压数据
const bpData = computed(() => {
    return BPstatisticsCardData(xyStore.records)
})
// 药品价格
const totalPrice = computed(() => {
    return ypStore.medicineData.reduce((total_price,item) => {
        return total_price += Number(item.price)*100
    },0)/100
})
// 服药记录数量
const totalMedicineTaskNumber = computed(() => {
    return yprwStore.medicineTask.length
})
</script>
<style scoped>
#statistics{
    /* padding-top: calc(env(safe-area-inset-top)); */
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.bp-card{
    margin-top: 10px;
}
</style>