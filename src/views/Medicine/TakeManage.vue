<!-- 任务管理 -->
<template>
    <div id="take-manage">
        <van-nav-bar title="任务管理" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
                <template #left>
                    <van-icon name="arrow-left" size="18" color="#000000" />
                </template>
                <template #right>
                    <van-popover v-model:show="showMoreOptionPopover" :actions="moreOptionActions" @select="onSelectMoreOption" placement="bottom-end">
                        <template #reference>
                            <van-icon name="ellipsis" color="#000000" size="20" />
                        </template>
                    </van-popover>
            </template>
        </van-nav-bar>
        <div class="continer">
            <van-tabs v-model:active="active" type="card" sticky offset-top="1.22639rem">
                <van-tab title="当天任务">
                    <div class="tasks">
                        <TakeRecordCard v-for="task in todayTask" :key="task.taskId" :name="task.name" :dosage="task.takeMedicineNumber + task.normsUnit"  :usage="task.message" :takeDateTime="task.noticeTime" @detete="deteteTake(task.taskId)" @edit="editTake(task.taskId)"/>
                    </div> 
                </van-tab>
                <van-tab title="历史任务">
                   <HistoryTasks />
                </van-tab>
                <van-tab title="计划管理">
                    <div class="plans">
                        <PlanRecordCard v-for="plan in allPlan" :key="plan.planId" :name="plan.name" :noticeTime='plan.noticeTime' :implementWeek="plan.implementWeek" @edit="editPlan(plan.planId)" @detete="deletePlan(plan.planId)" />
                    </div> 
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import TakeRecordCard from '../../components/Medicine/TakeRecordCard.vue'
import HistoryTasks from '../../components/Medicine/HistoryTasks.vue'
import { computed, ref } from 'vue'
import {medicineTaskStore} from "../../stores/medicineStore.js"
import PlanRecordCard from "../../components/Medicine/PlanRecordCard.vue"
/* 路由与仓库 */
const router = useRouter()
const yprwStore = medicineTaskStore()

/* 展示组件 */
const showMoreOptionPopover = ref(false)

/* 数据 */
const active = ref(0) // 当前选中标签的标识符
// 获取所有任务，用于缓存，只要后台不修改，则不会重新请求
const allTask = computed(() => {
    return yprwStore.medicineTask.slice().sort((a, b) => a.noticeTime.localeCompare(b.noticeTime))
})

// 更多操作菜单选项
const moreOptionActions = [
    { text: '添加计划', icon: 'records-o' },
    { text: '清空计划', icon: 'delete-o' },
    { text: '清空任务', icon: 'delete-o' },
]
// 当天任务
const todayTask = computed(() => {
    const now = new Date()
    return allTask.value.filter(item => new Date(item.noticeTime).toDateString() === now.toDateString())
})
// 所有计划
const allPlan = computed(() => {
    return yprwStore.medicinePlan.slice().sort((a, b) => a.noticeTime.localeCompare(b.noticeTime))
})

/* 功能函数 */
// 更多选项
function onSelectMoreOption(action) {
    const text = action.text
    if (text === "添加计划") {
        addPlan()
    }
    else if (text === "清空计划") {
        deleteAllPlan()
    }
    else if (text === "清空任务") {
        deteteAllTake()
    }  
}
// 更新任务
function editTake(taskId) {
    router.push({
        path: '/editask',
        query: {taskId:taskId}
    })
}
// 删除任务
function deteteTake(id) {
    showConfirmDialog({
        message:
            '是否删除任务',
        }).then(async () => {
            const result = await yprwStore.deleteTask(id)
            if (result === "删除成功") showToast({message:"删除成功",type:'success'})
            else showToast({message:"删除失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
    
}
// 清空任务
function deteteAllTake() {
    showConfirmDialog({
        message:
            '是否清空所有任务',
        }).then(async () => {
            const result = await yprwStore.deleteAllTask()
            if (result === "清空成功") showToast({message:"清空成功",type:'success'})
            else showToast({message:"清空失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
    
}
// 添加计划
function addPlan() {
    router.push({
        path: '/addeditplan',
        query: {planId: ''}
    })
}
// 更新计划
function editPlan(planId) {
    router.push({
        path: '/addeditplan',
        query: {planId: planId}
    })
}
// 删除计划
function deletePlan(planId) {
    showConfirmDialog({
        message:
            '是否删除计划',
        }).then(async () => {
            // 删除该计划未执行的任务
            const result = await yprwStore.deleteThisTask(planId)
            const result2 = await yprwStore.deletePlan(planId)
            if (result === "删除成功" && result2 === "删除成功") showToast({message:"删除成功",type:'success'})
            else showToast({message:"删除失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
}
// 清空计划
function deleteAllPlan() {
    showConfirmDialog({
        message:
            '是否清空所有计划',
        }).then(async () => {
            // 删除所有未执行的任务
            const result = await yprwStore.deleteStatusTask("未执行")
            // 删除所有计划
            const result2 = await yprwStore.deleteAllPlan()
            if (result === "清空成功" && result2 === "清空成功") showToast({message:"清空成功",type:'success'})
            else showToast({message:"清空失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
}

</script>
<style scoped>
*{
    box-sizing: border-box;
}
.continer{
    margin: 0 10px 10px 10px;
}
.tasks,.plans{
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* background-color: #f5f7fa; */
}

:deep(.van-tabs__nav--card) {
    margin: 0;
}
:deep(.van-tabs__wrap) {
    padding: 10px 0;
    background-color: #f5f7fa;
}
</style>