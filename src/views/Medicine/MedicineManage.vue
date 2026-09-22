<template>
    <div id="medicine-manage">
        <van-nav-bar title="药品管理" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
                <template #left>
                    <van-icon name="arrow-left" size="18" color="#000000" />
                </template>
                <template #right>
                    <van-popover close-on-click-outside close-on-click-overlay v-model:show="showMoreOptionPopover" :actions="moreOptionActions" @select="onSelectMoreOption" placement="bottom-end">
                        <template #reference>
                            <van-icon name="ellipsis" color="#000000" size="20" />
                        </template>
                    </van-popover>
            </template>
        </van-nav-bar>
        <div class="cards">   
            <MedicineCard v-for="data in ypStore.remainingMedicineData" :name="data.name" :norms="data.norms" :normsUnit="data.normsUnit" :surplus="data.surplus" :manufacturer="data.manufacturer" :typeid="data.typeid" :key="data.typeid" @delete="deleteMedicine(data.typeid)" @click="toDetalis(data.name,data.manufacturer, data.typeid)"/>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MedicineCard from '../../components/Medicine/MedicineCard.vue'
import {ref, computed} from "vue"
import { medicineStore,medicineTaskStore } from '../../stores/medicineStore.js'


/* 路由与仓库 */
const router = useRouter()
const ypStore = medicineStore()
const yprwStore = medicineTaskStore()

/* 展示组件 */
const showMoreOptionPopover = ref(false) // 更多下拉框


/* 数据 */
// 更多操作菜单选项
const moreOptionActions = computed(() => {
    return [
    { text: '添加药品', icon: 'records-o' },
    { text: '全部药品', icon: 'notes-o', disabled: ypStore.remainingMedicineData.length === 0},
    { text: '清空药品', icon: 'delete-o' },
]
})
/* 功能函数 */
function onSelectMoreOption(action) {
    const text = action.text
    if (text === "添加药品") {
        addMedicine()
    }
    else if (text === "全部药品") {
        router.push({
        path: '/medicindetails',
        query: {
            name: "全部药品",
            manufacturer: ""
        }
    })
    }
    else if (text === "清空药品") {
        deleteAllMedicinie()
    }  
}
// 进入今日药品详情
function toDetalis(name, manufacturer,typeid) {
    router.push({
        path: '/medicindetails',
        query: {
            name,
            manufacturer,
            typeid
        }
    })
}
// 删除当前药品
async function deleteMedicine(typeid) {
    showConfirmDialog({
        title: '删除警告',
        message:'删除药品信息后，所有关于该药品的计划与未执行的任务将被清除，是否继续？',
        }).then(async () => {
            const result = await ypStore.deleteTypeMediciine(typeid)
            const result2 = await ypStore.deleteTypeRemainingMedicine(typeid)
            const result3 = await yprwStore.deleteMedicineTypeIdTask(typeid)
            const result4 = await yprwStore.deleteMedicineTypeIdPlan(typeid)
            if (result === "删除成功" && result2 === "删除成功" && result3 === "删除成功" && result4 === "删除成功") showToast({message:"删除成功",type:'success'})
            else showToast({message:"删除失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
}
// 添加药品
function addMedicine() {
    router.push({
        path: '/addeditmedicine',
        query: {medicineId: ''}
    })
}
// 清空药品
function deleteAllMedicinie() {
    showConfirmDialog({
        title: '清空警告',
        message:'清空药品信息后，所有的计划与未执行的任务将被清除，是否继续？',
        }).then(async () => {
            const result = await ypStore.deleteAllMedicine()
            const result2 = await yprwStore.deleteAllPlan()
            const result3 = await yprwStore.deleteStatusTask("未执行")
            if (result === "清空成功" && result2 === "清空成功" && result3 === "清空成功") showToast({message:"清空成功",type:'success'})
            else showToast({message:"清空失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
    
}
</script>
<style scoped>
.cards{
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>