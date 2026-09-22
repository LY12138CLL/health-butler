<!-- 用药管理首页 -->
<template>
  <div id="medicine-home">
    <van-nav-bar
      title="用药管理"
      @click-left="router.back()"
      @click-right="showMoreOptionPopover = true"
      safe-area-inset-top
      placeholder
      fixed
    >
      <template #left>
        <van-icon name="arrow-left" size="18" color="#000000" />
      </template>
    </van-nav-bar>
    <div class="continer">
      <div class="option">
        <MenuCard
          :icon-color="`#f97316`"
          :icon-name="`jiaonang`"
          :menu-name="`药品管理`"
          :message="`${medicineMessage}`"
          @click="router.push('/medicinemanage')"
        />
        <MenuCard
          :icon-color="`#1296db`"
          :icon-name="`jilu`"
          :menu-name="`任务管理`"
          :message="`${planMessage}`"
          @click="router.push('/takemanage')"
        />
      </div>
      <div class="take-medicine">
        <div class="heand">
          <div class="left">
            <van-icon name="notes-o" />
            <span class="title">今日需服药</span>
          </div>
          <span class="number">{{ todayNotTake.length }}次</span>
        </div>
        <div class="tasks">
          <TakeMedicineTask
            v-for="task in todayNotTake"
            :key="task.taskId"
            :name="task.name"
            :dosage="task.takeMedicineNumber + task.normsUnit"
            :usage="task.message"
            :time="task.noticeTime.split(' ')[1]"
            :status="task.status"
            @confirm="okTakeMedicine(task)"
            @cancel="cancelTakeMedicine(task)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MenuCard from '../../components/Medicine/MenuCard.vue'
import TakeMedicineTask from '../../components/Medicine/TakeMedicineTask.vue'
import { medicineStore, medicineTaskStore } from '../../stores/medicineStore.js'
import { computed } from 'vue'
import { formatDateTime4 } from '../../utils/tools.js'
/* 路由与仓库 */
const router = useRouter() // 路由实例
const ypStore = medicineStore()
const yprwStore = medicineTaskStore()

/* 数据 */
// 药品管理提示信息
const medicineMessage = computed(() => {
  return `${ypStore.remainingMedicineData.length === 0 ? '暂无药品' : ypStore.remainingMedicineData.length + '种药品'}`
})
// 任务管理提示信息
const planMessage = computed(() => {
  return `${yprwStore.medicinePlan.length === 0 ? '暂无计划' : yprwStore.medicinePlan.length + '个计划'}`
})
// 今日未的任务
const todayNotTake = computed(() => {
  return yprwStore.medicineTask.filter(
    (item) =>
      new Date(item.noticeTime).toDateString() === new Date().toDateString()
  ).slice().sort((a, b) => a.noticeTime.localeCompare(b.noticeTime))
})
/* 功能函数 */
// 已服药
async function okTakeMedicine(task) {
  let data = task
  const total = Number(
    ypStore.remainingMedicineData.filter(
      (item) => item.typeid === data.medicineTypeId
    )[0].total
  )
  if (total < Number(data.takeMedicineNumber)) {
    showDialog({ message: '药品库存不足，确认失败' })
    return
  }
  data.confirmTime = formatDateTime4(new Date())
  data.status = '已执行'
  const result = await yprwStore.updateTask(
    data.taskId,
    data.name,
    data.message,
    data.noticeTime,
    data.medicineTypeId,
    data.planId,
    data.takeMedicineNumber,
    data.normsUnit,
    data.confirmTime,
    data.status
  )
  const result2 = await ypStore.updateRemainingMedicine(
    data.medicineTypeId,
    '-' + data.takeMedicineNumber
  )
  if (result === '更新成功' && result2 === '修改成功')
    showToast({ message: '已确认', type: 'success' })
  else showToast({ message: '确认失败', type: 'fail', duration: 2000 })
}
// 取消服药
async function cancelTakeMedicine(task) {
  let data = task
  data.confirmTime = formatDateTime4(new Date())
  data.status = '已取消'
  const result = await yprwStore.updateTask(
    data.taskId,
    data.name,
    data.message,
    data.noticeTime,
    data.medicineTypeId,
    data.planId,
    data.takeMedicineNumber,
    data.normsUnit,
    data.confirmTime,
    data.status
  )
  if (result === '更新成功') showToast({ message: '更新成功', type: 'success' })
  else showToast({ message: '更新失败', type: 'fail', duration: 2000 })
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.continer {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.take-medicine {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.heand {
  background-color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
:deep(.van-icon-notes-o) {
  font-size: 28px;
  margin-top: 3px;
}
.number {
  font-size: 16px;
  /* font-weight: bold; */
  color: #848586;
}
.tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
