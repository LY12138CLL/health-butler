<!-- 选择服药提示音 -->
<template>
    <div id="notice-audio">
        <van-nav-bar title="服药消息提示音" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
                <template #left>
                    <van-icon name="arrow-left" size="18" color="#000000" />
                </template>
                <template #right>
                    <van-button type="success" :disabled="!isChange" size="small" @click="confirm">完成</van-button>
                </template>
        </van-nav-bar>
        <div class="continer">
            <SelectItem v-for="(item,index) in audioList" :name="item.name" :isSelect="index === selectIndex" @click="selectAudio(index)" />
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref,onMounted } from 'vue'
import SelectItem from '../../components/SelectItem.vue'
import {othersStore} from "../../stores/othersStore.js"
/* 路由与仓库 */
const router = useRouter()
const otherStore = othersStore()

/* 数据 */
// 所有服药提示音
const audioList = [
    {name: '普通话',file_name: 'take_medicine_notice_putonghua', path: '/audio/takeMedicineNitoce/take_medicine_notice_putonghua.wav'},
    {name: '陕西话',file_name: 'take_medicine_notice_shanxi', path: '/audio/takeMedicineNitoce/take_medicine_notice_shanxi.wav'},
    {name: '河南话',file_name: 'take_medicine_notice_henan', path: '/audio/takeMedicineNitoce/take_medicine_notice_henan.wav'},
    {name: '四川话',file_name: 'take_medicine_notice_sichuan', path: '/audio/takeMedicineNitoce/take_medicine_notice_sichuan.wav'},
    {name: '广东话',file_name: 'take_medicine_notice_guangdong', path: '/audio/takeMedicineNitoce/take_medicine_notice_guangdong.wav'},
    {name: '湖南话',file_name: 'take_medicine_notice_hunan', path: '/audio/takeMedicineNitoce/take_medicine_notice_hunan.wav'},
    {name: '台湾话',file_name: 'take_medicine_notice_taiwan', path: '/audio/takeMedicineNitoce/take_medicine_notice_taiwan.wav'},
]
const selectIndex = ref(0) // 选择的音频选项索引
const isChange = ref(false) // 是否更改了选项
let configContent = {} // 配置文件内容

// 选择服药通知铃声
function selectAudio(index) {
    if (selectIndex.value != index) {
        new Audio(audioList[index].path).play()
        selectIndex.value = index
        isChange.value = true
    }
}
// 完成
async function confirm() {
    const file_name = audioList[selectIndex.value].file_name
    // 旧渠道设置为改变前的渠道
    configContent.oldTakeMedicineNoticeAudio = configContent.takeMedicineNoticeAudio
    // 新渠道为文件名
    configContent.takeMedicineNoticeAudio = file_name
    const result = await otherStore.updateConfigFileContent(configContent)
    if (result === "修改成功") {
        router.back()
        showToast({message:"修改成功",type:'success'})
    } else {
        showToast({message:"修改失败",type:'fail', duration:2000})
    }
    
}
onMounted(async () => {
    // 读取配置表中的默认提示声音索引
    configContent = otherStore.configContent
    const findIndex = audioList.findIndex(item => item.file_name === configContent.takeMedicineNoticeAudio)
    selectIndex.value = findIndex === -1 ? 0 : findIndex
})
</script>
<style scoped>
.continer{
    display: flex;
    flex-direction: column;
    gap: 1px;
}
</style>