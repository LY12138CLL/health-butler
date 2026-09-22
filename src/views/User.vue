<template>
    <div id="user">
        <div class="header">
            <div class="row1">
                <van-image class="avatar" round :src="avatarUrl" @click="showAvatarAction = true" >
                    <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                    </template>
                </van-image>
            </div>
            <div class="row2">
                <div class="card bp">
                    <div class="row1">
                        <span class="sbp">{{ todayBPrecord.sbp }}</span>
                        <span> / </span>
                        <span>{{ todayBPrecord.dbp }}</span>
                    </div>
                    <div class="row2">
                        <span class="name">血压 (mmHg)</span>
                    </div>
                    <div class="time">
                        <span class="name">{{ todayBPrecord.timeName }}</span>
                    </div>
                </div>
                <div class="card bs">
                    <div class="row1">
                        <span class="number">6.2</span>
                    </div>
                    <div class="row2">
                        <span class="name">血糖(mmol/L)</span>
                    </div>
                    <div>
                        <span class="name">空腹</span>
                    </div>
                </div>
                <div class="card medicine-record">
                    <div class="row1">
                        <span class="number">{{ todayNeedTakeMedicineRecord.totalNumber }}</span>
                        <span>&nbsp;次</span>
                    </div>
                    <div class="row2">
                        <span class="name">今日服药</span>
                    </div>
                    <div>
                        <span class="name">已服用{{todayNeedTakeMedicineRecord.finishNumber}}次</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="health-record">
            <span class="title">健康记录</span>
            <div class="container">
                <MenuCard @click="router.push('/bphome')" icon-background-color="#ff0000" icon-class-prefix="my-icon" iconName="xieyaguanjia" name="血压记录" message="查看或添加血压记录"></MenuCard>
                <MenuCard icon-background-color="#10b981" icon-class-prefix="my-icon" iconName="xietang" name="血糖记录" message="查看或添加血糖记录"></MenuCard>
                <MenuCard @click="router.push('/medicinehome')" icon-background-color="#f97316" icon-class-prefix="my-icon" iconName="jiaonang" name="用药管理" :message="todayNeedTakeMedicineRecord.totalNumber ? `今日需服药${todayNeedTakeMedicineRecord.totalNumber}次` : '今日暂无服药任务'"></MenuCard>
            </div>
        </div>
        <div class="about">
            <span class="title">设置关于</span>
            <div class="container">
                <MenuCard @click="router.push('/settinghome')" icon-background-color="#64748b" icon-class-prefix="" iconName="setting" name="设置"></MenuCard>
                <MenuCard @click="router.push('/helphome')" icon-background-color="#64748b" icon-class-prefix="" iconName="question" name="帮助"></MenuCard>
                <MenuCard @click="router.push('/abouthome')" icon-background-color="#64748b" icon-class-prefix="" iconName="info" name="关于应用"></MenuCard>
            </div>
        </div>
        <!-- 更换头像 -->
        <van-action-sheet v-model:show="showAvatarAction" :actions="avatarActions" cancel-text="取消" @select="onSelectItem" />
    </div>
</template>

<script setup>
import MenuCard from '../components/MenuCard.vue'
import { useRouter } from 'vue-router'
import {medicineTaskStore} from "../stores/medicineStore.js"
import {xueyaStore} from '../stores/xueyaStore.js'
import { computed,ref,onMounted } from 'vue'
import {getTimeName} from '../utils/tools.js'
import { othersStore } from '../stores/othersStore.js'
import { invoke } from '@tauri-apps/api/core'
import { appDataDir  } from '@tauri-apps/api/path'
import {requestPermission,openPermissionSettings,checkPermission,openAppDetails,pickImage } from "tauri-plugin-lingyi-toolbox"
import {isExists} from "../utils/optionAvatar.js"
import { BaseDirectory,remove,copyFile,mkdir,exists,writeFile } from '@tauri-apps/plugin-fs'
/* 路由与仓库 */
const router = useRouter()
const yprwStore = medicineTaskStore()
const xyStore = xueyaStore()
const otherStore = othersStore()

/* 数据 */
const showAvatarAction = ref(false) // 展示选择头像面板
const avatarActions = [
      { name: '从相册选择', className:['avatar-item']},
      { name: '拍照', className:['avatar-item'] },
      { name: '查看' },
    ]
const avatarUrl = ref("")
// 今日服药记录
const todayNeedTakeMedicineRecord = computed(() => {
    const records = yprwStore.medicineTask.filter(item => new Date(item.noticeTime).toDateString() === new Date().toDateString())
    const finishTakeMedicineNumber = records.filter(item => item.status === '已执行').length
    return {totalNumber: records.length,finishNumber:finishTakeMedicineNumber}
})

// 今日最新血压记录
const todayBPrecord = computed(() => {
    const records = xyStore.records.filter(item => new Date(item.dateTime).toDateString() === new Date().toDateString())
    if (records.length) {
        const record = records.at(-1)
        const sbp = record.sbp
        const dbp = record.dbp
        const timeName = getTimeName(record.dateTime.split(' ')[1]) + record.dateTime.split(' ')[1].substring(0, 5)
        return {sbp,dbp,timeName}
    }
    else return {spb:'',dpb:'',timeName:''}
    
}) 

/* 功能函数 */
async function onSelectItem(item) {
    showAvatarAction.value = false
    const name = item.name
    if (name === "查看") {
        await lookAvatar()
    } else if (name === "从相册选择") {
        await selectAvatar()
    } else if (name === "拍照") {
        await openCamera()
    }
}
// 查看头像
async function lookAvatar() {
    const avatarUrl = await otherStore.getAvatarUrl()
    showImagePreview({images: [avatarUrl], showIndex: false})
}
// 选择头像
async function selectAvatar() {
    try {
        const {filePath} = await pickImage()
        const saveResult = await otherStore.saveAvatarImage(filePath)
        if (saveResult) {
            const url = await otherStore.getAvatarUrl()
            if (url !== "") {
                // 因为返回的图片rul一致（但是该url已经指向新图片了），所以url中添加时间戳，防止因为url一致造成ref检测不到到url变化，造成头像不更新
                avatarUrl.value = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now()
            }
            else showToast({ message: '更换失败', type: 'fail', duration: 2000 })
        }
        else showToast({ message: '更换失败', type: 'fail', duration: 2000 })
    } catch {

    }
}
// 打开摄像头拍照
async function openCamera() {
  try {
    // 1. 先检查摄像头权限
    const checkResult = await checkPermission("android.permission.CAMERA")
    if (!checkResult.granted) {
      // 2. 未被授权 → 发起申请
      const requestResult = await requestPermission("android.permission.CAMERA")
      if (requestResult.granted) {
        // 情况2：用户点击【允许】→ 继续往下走拍照
      } else if (requestResult.neverAskAgain) {
        // 情况3：永久拒绝 → 弹出设置引导，直接 return
        showConfirmDialog({
          title: '授权提醒',
          message: '相机权限申请失败，请手动前往权限管理页面授权',
          confirmButtonText: '设置',
        })
          .then(async () => {
            await openAppDetails()
          })
          .catch(() => {
            // 用户取消，什么都不做
          })
        return
      } else {
        // 情况1：临时拒绝 → 直接退出，不再调 take_photo
        return
      }
    }

    // 3. 权限已授予（本次授予 / 之前已授予）→ 拍照
    const ok = await invoke('take_photo')
    if (ok) {
      // 将保存的路径写入配置表
      let configContent = otherStore.configContent
      configContent.avatartPath = (await appDataDir()) + '/avatar/avatar.jpg'
      const writeResult = await otherStore.updateConfigFileContent(configContent)
      if (writeResult) {
        // 获取加工好的 url
        const url = await otherStore.getAvatarUrl()
        avatarUrl.value = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now()
      } else {
        showToast({ message: '更换失败', type: 'fail', duration: 2000 })
      }
    } else {
      showToast({ message: '更换失败', type: 'fail', duration: 2000 })
    }
  } catch (err) {
    console.log(err)
    showToast({ message: '更换失败', type: 'fail', duration: 2000 })
  }
}

onMounted(async () => {
    const url = await otherStore.getAvatarUrl()
    avatarUrl.value = url
})
</script>

<style scoped>
#user{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 55px;
}
.header{
    margin-top: 10px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
}
.header>.row1{
    display: flex;
    justify-content: center;
}
/* .avatar{
    width: 72px;
    height: 72px;
} */
.avatar{
    width: 74px;
    height: 74px;
    /* 图片本身加边框 */
    border: 2px solid #e2e8f0;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: #f1f5f9;
    /* 可选：轻微阴影让头像更立体，与白色卡片区分 */
    box-shadow: 0 0 0 3px #ffffff, 0 2px 8px rgba(0, 0, 0, 0.08);
    object-fit: cover;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.header>.row2 {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.header>.row2>.card{
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;
    background-color: #f8fafc;
    padding: 10px;
    border-radius: 10px;
    color: #6b7a8a;
    align-items: center;
}
.header>.row2>.bp>.row1>.sbp{
    font-size: 18px;
    font-weight: bold;
    color: #2563eb;
}
.header>.row2>.bs>.row1>.number{
    font-size: 18px;
    font-weight: bold;
    color: #000000;
}
.header>.row2>.medicine-record>.row1>.number{
    font-size: 18px;
    font-weight: bold;
    color: #000000;
}
.health-record>.title{
    font-size: 18px;
    font-weight: bold;
}
.health-record>.container{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.about>.title{
    font-size: 18px;
    font-weight: bold;
}
.about>.container{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* van-action-sheet子项添加分割线 */
:deep(.avatar-item) {
  position: relative;
  padding-bottom: 12px;   /* 给线留出空间 */
}
:deep(.avatar-item)::after {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 0;
  height: 1px;
  background: #e5e5e5;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}
</style>