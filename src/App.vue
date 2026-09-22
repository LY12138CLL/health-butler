<template>
  <router-view></router-view>
</template>

<script setup>
/*
功能：移动端使用左滑返回手势或按物理返回键时只要页面在底部菜单中的任何一个时，可以直接将app切换到后台返回桌面（与微信类似）
*/
import { useRouter } from 'vue-router'
import { watch,onBeforeUnmount } from 'vue'
import { xueyaStore, groupStrore } from './stores/xueyaStore.js'
import { medicineStore, medicineTaskStore } from './stores/medicineStore.js'
import {othersStore} from "./stores/othersStore.js"
import {
  isPermissionGranted,
  requestPermission,
  createChannel,
  Importance,
  Visibility,
  removeChannel,
} from '@choochmeque/tauri-plugin-notifications-api'
import {addNotice,cancelNotice,DailyTaskScheduler1,DailyTaskScheduler2} from "./utils/tools.js"
const yprwStore = medicineTaskStore()
const otherStore = othersStore()
let isInited = false // 是否初始化了

// 配置路由守卫
function configureRouterGuard() {
  const router = useRouter()
  let isRedirecting = false // 是否重定
  router.beforeEach((to) => {
    const menuRoutes = ['/home', '/statistics', '/user'] // 底部菜单路由
    // 如果要进入的路由在菜单路由中，并且没有重定向
    if (menuRoutes.includes(to.path) && !isRedirecting) {
      isRedirecting = true
      return { ...to, replace: true } // 重定向到要进入的路由，并且使用替换模式，替换历史路由记录中的上一条记录
    } else {
      isRedirecting = false
      return true
    }
  })
}

// 申请通知权限
async function applyNoticePermission() {
  // 检查并请求权限
  let permissionGranted = await isPermissionGranted()
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
  }
}
// 创建服药通知渠道
async function createTakeMedicineChannel() {
  const takeMedicineNoticeAudio = otherStore.configContent.takeMedicineNoticeAudio
  const oldTakeMedicineNoticeAudio = otherStore.configContent.oldTakeMedicineNoticeAudio
  // 删除旧渠道
  if (oldTakeMedicineNoticeAudio !== "" || oldTakeMedicineNoticeAudio !== takeMedicineNoticeAudio) await removeChannel(oldTakeMedicineNoticeAudio)
  // 创建渠道
  await createChannel({
    id: otherStore.configContent.takeMedicineNoticeAudio, // 渠道id
    name: '服药提醒', // 渠道名称
    description: '服药提醒', // 渠道描述
    importance: Importance.High, // 高重要性确保声音能播放
    visibility: Visibility.Public, // 锁屏时显示通知的‌完整内容‌（标题+正文）
    sound: takeMedicineNoticeAudio// 自定义的提示声音
  })
}
// 生成今天所有通知
async function createAllTaskNotice() {
  // 清空服药通知
  await cancelNotice(yprwStore.medicineTaskNoticeId)
  // 生成服药通知
  const tasks = yprwStore.medicineTask.filter(task => task.status === "未执行")
  for (const [index, task] of tasks.entries()) {
    const largeBody = task.name + " " + task.takeMedicineNumber + task.normsUnit
    await addNotice(otherStore.configContent.takeMedicineNoticeAudio,index,'服药通知',largeBody,task.noticeTime)
    yprwStore.medicineTaskNoticeId.push(index)
  }
}
// 为所有未执行的服药任务添加定时器，服药时间+3小时后未确定的则过期
let allTakeMedicineTaskScheduler = [] // 所有服药任务定时器
function addTakeMedicineTaskScheduler() {
  // 获取所有未执行的服药任务
  const tasks = yprwStore.medicineTask.filter(item => item.status === "未执行")
  for (const task of tasks) {
    // 设置执行时间
    const noticeTime = task.noticeTime
    const noticeTimeDate = new Date(noticeTime)
    noticeTimeDate.setHours(noticeTimeDate.getHours() + 3) // 延迟3小时
    // 3小时后标记已过期
    const newTask = {...task,status:'已过期'}
    const TakeMedicineTaskScheduler = new DailyTaskScheduler2(noticeTimeDate.getFullYear(),noticeTimeDate.getMonth(),noticeTimeDate.getDate(),noticeTimeDate.getHours(),noticeTimeDate.getMinutes(),noticeTimeDate.getSeconds(),() => {
      yprwStore.updateTask(...Object.values(newTask))
    })
    allTakeMedicineTaskScheduler.push(TakeMedicineTaskScheduler)
    TakeMedicineTaskScheduler.startTimer()
  }
}
// 停止所有服药任务的定时器
function stopTakeMedicineTaskScheduler() {
  for (const TakeMedicineTaskScheduler of allTakeMedicineTaskScheduler) {
    TakeMedicineTaskScheduler.stopTimer()
  }
}
// 刷新页面
function reload() {
  window.location.reload()
}
const scheduler = new DailyTaskScheduler1(0,0,1,reload); // 创建页面刷新定时器实例
// 初始化加载数据
async function initData() {
  await otherStore.init()
  await xueyaStore().getAllRecord()
  await groupStrore().getAllGroup()
  await medicineStore().init()
  await medicineTaskStore().init()
}



// 开始初始化
(async () => {
  configureRouterGuard()
  await initData()
  await applyNoticePermission()
  await createTakeMedicineChannel()
  await createAllTaskNotice()
  scheduler.startTimer() // 启动刷新页面定时任务
  isInited = true // 标记为已初始化
})()

 // 监听服药任务
let isGenerating = false
watch(() => yprwStore.medicineTask, async () => {
  if (!isInited) return
  if (isGenerating) return
  isGenerating = true
  await createAllTaskNotice()
  stopTakeMedicineTaskScheduler()
  addTakeMedicineTaskScheduler()
  isGenerating = false
}, { deep: true })
// 监听服药提示音
watch(() => otherStore.configContent.takeMedicineNoticeAudio, async (newValue, oldValue) => {
  if (!isInited) return // 初始化阶段不执行
  if (newValue === oldValue) return
  await createTakeMedicineChannel()
  await createAllTaskNotice()
})
// 组件卸载时
onBeforeUnmount(() => {
  scheduler.stopTimer()
  stopTakeMedicineTaskScheduler()
})
</script>

<style scoped></style>
