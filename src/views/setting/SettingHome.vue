<!-- 设置页面 -->
<template>
    <div id="help">
        <van-nav-bar title="设置" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="container">
            <MenuCard @click="NoticeSetting" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="通知设置" :isShowIcon="false"></MenuCard>
            <MenuCard @click="router.push('/runbackground')" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="后台运行" :isShowIcon="false"></MenuCard>
            <MenuCard @click="router.push('/noticeaudio')" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="服药提示音" :isShowIcon="false"></MenuCard>
            <MenuCard @click="reset" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="重置" :isShowIcon="false"></MenuCard>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MenuCard from '../../components/MenuCard.vue'
import {openPermissionSettings} from "tauri-plugin-lingyi-toolbox"
import {medicineStore,medicineTaskStore} from "../../stores/medicineStore.js"
import {xueyaStore,groupStrore} from "../../stores/xueyaStore.js"
import {othersStore} from "../../stores/othersStore.js"
import {
  createChannel,
  Importance,
  Visibility,
  removeChannel,
  cancelAll} from '@choochmeque/tauri-plugin-notifications-api'
/* 路由与仓库 */
const router = useRouter()
const ypStore = medicineStore()
const yprwStore = medicineTaskStore()
const xyStore = xueyaStore()
const fzStore = groupStrore()
const otherStore = othersStore()
// 通知权限
async function NoticeSetting() {
    try {
        await openPermissionSettings('android.permission.POST_NOTIFICATIONS')
    } catch {
        showDialog({
            message: '设置失败，请手动前往应用的权限管理页面设置',
            }).then(() => {
            // on close
            });
    }
}
// 重置
function reset() {
    showConfirmDialog({message:"是否重置应用？"})
        .then(async () => {
           const loadingToast = showToast({message:"正在重置中...",type:'loading',duration:0})
            try {
                const originTakeMedicineNoticeAudio = otherStore.configContent.takeMedicineNoticeAudio
                const result1 = await xyStore.deleteAllRecord() // 血压记录
                const result2 = await fzStore.deleteAllGroups() // 血压分组
                const result3 = await yprwStore.deleteAllPlan() // 服药计划
                const result4 = await yprwStore.deleteAllTask() // 服药任务
                const result5 = await ypStore.deleteAllMedicine() // 药品记录
                const result6 = await otherStore.resetConfigFileContent() // 配置表
                const result7 = await otherStore.resetAvatarImage() // 重置头像
                await cancelAll() // 删除所有通知
                // 删除原本的通知渠道
                await removeChannel(originTakeMedicineNoticeAudio)
                // 使用默认配置的takeMedicineNoticeAudio创建渠道
                await createChannel({
                    id: otherStore.configContent.takeMedicineNoticeAudio, // 渠道id
                    name: '服药提醒', // 渠道名称
                    description: '服药提醒', // 渠道描述
                    importance: Importance.High, // 高重要性确保声音能播放
                    visibility: Visibility.Public, // 锁屏时显示通知的‌完整内容‌（标题+正文）
                    sound: otherStore.configContent.takeMedicineNoticeAudio// 自定义的提示声音
                })
                if (
                    result1 === "清空成功" && 
                    result2 === "清空成功" && 
                    result3 === "清空成功" &&
                    result4 === "清空成功" &&
                    result5 === "清空成功" &&
                    result6 &&
                    result7
                ) {
                    loadingToast.close()
                    showToast({message:"重置成功",type:'success'})
                }
            } catch(error) {
                loadingToast.close()
                showToast({message:"重置失败",type:'fail', duration:2000})
            }
        }).catch(() => {
        })
}
</script>
<style scoped>
.container{
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
</style>