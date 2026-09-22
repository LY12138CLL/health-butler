<!-- 所有血压记录 -->
<template> 
    <div id="all">
        <van-nav-bar title="全部记录" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
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
        <div style="height: 1px;"></div>
        <div class="content">
            <div class="summary">
                <SummarryCardModule :data="summaryData" :is-all-record="true"/>
            </div>
            <van-sticky offset-top="1.22639rem">
                <div class="search">
                    <van-search
                        v-model="searchValue"
                        show-action
                        placeholder="按时间/备注/状态/分组搜索"
                        @search="onSearch"
                    >
                    <template #action>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>
            </div>
            </van-sticky>
            
            <div class="record">
                <RecordModule v-for="record in showRecord" :groupData="fzStore.groups" :recordData="record" :key="record.id" @changeGroup="changeGroup" @deleteRecord="deleteRecord"/>
            </div>
            <div class="more">
                <span v-if="filteredRecords.length > showRecord.length" style="color: #1989fa;" @click="getMoreRecord">点击加载更多</span>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import SummarryCardModule from "../../components/BP/SummaryCardModule.vue"
import RecordModule from "../../components/BP/RecordModule.vue"
import { useRouter } from "vue-router"
import { ref,computed } from "vue"
import { xueyaStore,groupStrore } from "../../stores/xueyaStore.js"
import {detailsSummaryData,formatDateTime2,bpStatus} from "../../utils/tools.js"
import {deleteBPrecord} from '../../utils/optionData.js'
import { writeFile } from '@tauri-apps/plugin-fs'
import { invoke } from "@tauri-apps/api/core"
import {othersStore} from "../../stores/othersStore.js"

/* 路由与仓库 */
const router = useRouter() // 路由实例
const xyStore = xueyaStore() // 血压记录仓库
const fzStore = groupStrore() // 分组记录仓库
const otherStore = othersStore() // 其它数据仓库


/* 展示组件 */
const showMoreOptionPopover = ref(false) // 展示选择更多选项

/* 数据 */
// 更多操作菜单选项
const moreOptionActions = [
    { text: '导出记录', icon: 'down' },
    { text: '删除所有', icon: 'delete-o' },
]
const searchValue = ref('') // 搜索栏输入的关键字
const defaultNumber = 10 // 加载的条数
const prevEndIndex = ref(0) // 上次提取的血压记录结束位置索引
const searchQuery = ref("") // 保存真正用来搜索的关键字


/* 计算属性 */
// 所有血压记录按时间倒序
const sortRecords = computed(() => {
    return [...xyStore.records].sort((a, b) => b.dateTime.localeCompare(a.dateTime))
})

// 总结数据
const summaryData = computed(() => {
    return detailsSummaryData(sortRecords.value)
})
// 搜索后的记录
const filteredRecords = computed(() => {
    // 如果搜索关键字为空，则返回排序后的记录
    if (!searchQuery.value.trim()) return sortRecords.value
    // 去除关键字额空格
    const q = searchQuery.value.trim()
    // 返回过滤后的结果
    return sortRecords.value.filter(r => {
        // 记录中的dateTime分隔为date与time
        const dateTimeArr = r.dateTime.split(" ")
        const date = dateTimeArr[0]
        const time = dateTimeArr[1]
        const status = bpStatus(r.sbp, r.dbp)
        // 将需要检索的字段拼接为字符串用空格分开
        const full = (date || '') + ' ' + (time || '') + ' ' + (r.notes || '')+ ' ' + (r.groupName || '' ) + (status || '' )
        // 判断要检索的字段中是否包含搜索关键字。
        // includes方法用于判断数组是否包含某个元素，或字符串是否包含某个子串，找到则返回true，否则返回false
        return full.includes(q)
    })
})
// 页面展示的血压记录
const showRecord = computed(() => {
    return filteredRecords.value.slice(0, prevEndIndex.value)
})



/* 功能函数 */
// 选择更多选项
function onSelectMoreOption(action) {
    const text = action.text
    if (text === "导出记录") {
        exportData()
    }
    else if (text === "删除所有") {
        deleatAll()
    }   
}
// 搜索血压记录
function onSearch() {
    // 将搜索栏输入的关键字赋值给searchQuery，用于filteredRecords计算属性检索
    searchQuery.value = searchValue.value
    // 从头开始，重新提取记录
    prevEndIndex.value = defaultNumber
}
// 更改血压记录分组
function changeGroup(data) {
    xyStore.changeGroup(data.recordId,data.newGroupId,data.newGroupName)
}
// 删除血压记录
function deleteRecord(recordId) {
    xyStore.deleteRecord(recordId)
}
// 加载更多
function getMoreRecord() {
    prevEndIndex.value += defaultNumber
}
// 导出血压记录
async function exportData() {
    try {
        if (sortRecords.value.length === 0) {
            showToast({message:"暂无数据",type: "error",duration:1000})
            return
        }
        // 整理血压记录为数组格式，便于rust处理
        let tableData = sortRecords.value.map(record => {
            const dateTime = record.dateTime.split(" ")
            const date = dateTime[0]
            const time = dateTime[1]
            return [date,time,record.sbp.toString(),record.dbp.toString(),record.hr.toString(),record.notes]
        })
        tableData.unshift(["日期","时间","高压","低压","脉率","备注"])

        // 调用 Rust 生成 Excel 字节
        const result = await invoke('create_excel', { data: tableData })
        const fileData = new Uint8Array(result.data)

        // 生成文件名（带时间戳）
        const fileName = `血压记录_${formatDateTime2(new Date())}.xlsx`

        //入文件到下载目录中
        const downloadPath = otherStore.fileSavePath
        const fullPath = `${downloadPath}/${fileName}`
        await writeFile(fullPath, fileData)

        showToast({ message: "导出成功", type: "success", duration: 2000 })
    }catch (e) {
      showToast({message:"导出失败，请重试",type: "error",duration:2000})
    }
}
// 删除所有血压记录
function deleatAll() {
    if (sortRecords.value.length === 0) {
        showToast({message: "暂无数据", type: "fail",duration: 1000})
        return
    }
    showConfirmDialog({
        message:
            '是否删除本组所有血压记录',
        })
        .then(async () => {
            try {
                showLoadingToast({message: "正在删除中...",duration: 0,overlay:true,forbidClick:true})
                for (const record of sortRecords.value) {
                        await deleteBPrecord(record.id)
                    }
                await xyStore.getAllRecord()
                showToast({message: "删除成功", type: "success",duration: 1000})
            }
            catch(error) {
                showToast({message: "删除失败", type: "fail",duration: 2000})
            }    
        })
        .catch(() => {
            // on cancel
        })
}

// 初始化加载一次记录
getMoreRecord()
</script>
<style scoped>
.content{
    margin: 0 10px;
}
.search{
    /* margin-top: 10px; */
    padding-top: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
    background-color: #f5f7fa;
}
.search :deep(.van-search) {
    border-radius: 10px;
}
.more{
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-size: 18px;
}
.record{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}
</style>