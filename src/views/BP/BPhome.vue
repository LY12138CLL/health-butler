<!-- 首页 -->
<template>
    <div id="home">
        <van-nav-bar title="血压记录" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
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
        
        <div class="continer">
            
                <div class="top">
                    <div class="header">
                        <span><van-icon name="like" color="red"/>血压记录</span>
                        <!-- <div class="tool_bar">
                            <button title="导出数据" @click="exportData">📤</button>
                            <button title="全部删除" @click="deleatAll">🗑️</button>
                        </div> -->
                    </div>
                </div>
                <van-sticky  offset-top="0.9rem">
                    <div class="function_bar">
                    <van-button color="#4f7cff" icon="plus" @click="showAddGroup = true">新建分组</van-button>
                    <van-button color="#7b61ff" icon="records-o" @click="showAddRecord = true">添加记录</van-button>
                    <van-button @click="router.push('/bpgallrecord')" color="#34c759" icon="notes-o">全部记录</van-button>
                </div>
                </van-sticky>
                
           
            <div class="group">
                <groupCardModule v-for="item in groupsCardData" :key="item.groupId" :groupData="item" @delete="deleteGroup" @click="toGroupDetails(item.groupId,item.groupName)"/>
                
            </div>
            <div class="add_record">
                <van-button color="linear-gradient(to bottom right, #4f7cff, #7067ff)" icon="plus" @click="showAddRecord = true"></van-button>
            </div>
            
        </div>
        <AddRecordModule v-if="showAddRecord" :groupData="orderGroups" @save="addRecord" @cancel="showAddRecord = false"/>
        <AddGroupModule  v-if="showAddGroup" @save="addGroup" @cancel="showAddGroup = false"/>
        
    </div>
    
</template>
<script setup>
import groupCardModule from '../../components/BP/GroupCardModule.vue'
import AddRecordModule from '../../components/BP/AddRecordModule.vue'
import AddGroupModule from '../../components/BP/AddGroupModule.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { xueyaStore,groupStrore } from "../../stores/xueyaStore.js"
import {groupCardSummaryData,formatDateTime2} from "../../utils/tools.js"
import { showToast } from 'vant'
import { writeFile } from '@tauri-apps/plugin-fs'
import { invoke } from "@tauri-apps/api/core"
import {othersStore} from "../../stores/othersStore.js"

/* 路由与仓库 */
const router = useRouter() // 路由实例
const xyStore = xueyaStore() // 血压记录仓库
const fzStore = groupStrore() // 分组记录仓库
const otherStore = othersStore() // 其它数据仓库

/* 展示组件 */ 
const showAddGroup = ref(false) // 展示添加分组
const showAddRecord = ref(false) // 展示添加记录
const showMoreOptionPopover = ref(false) // 展示选择更多选项


/* 数据 */
// 更多操作菜单选项
const moreOptionActions = [
    { text: '新建分组', icon: 'plus' },
    { text: '添加记录', icon: 'records-o' },
    { text: '全部记录', icon: 'notes-o' },
    { text: '导出记录', icon: 'down' },
    { text: '删除所有', icon: 'delete-o' },
]

/* 计算属性 */
// 整理分组卡片数据 （[{平均高压、平均低压、平均心率、总数、记录开始时间、记录结束时间、分组id、分组名称}]）
const groupsCardData = computed(() => {
    let data = []
    // 没有分组的记录
    const noGroupRecord = xyStore.records.filter(item2 => item2.groupId === "null")
    if (noGroupRecord.length > 0) {
        const noGroupRecordSummaryData = groupCardSummaryData(noGroupRecord)
        noGroupRecordSummaryData.groupId = "null"
        noGroupRecordSummaryData.groupName = "未分组"
        data.push(noGroupRecordSummaryData)
    }
    // 有分组的记录
    // 按照id（创建分组时的时间）从新到旧排序，最新创建的往前排
    const groups2 = fzStore.groups.sort((a, b) => Number(b.id) - Number(a.id))
    groups2.forEach(item => {
        const groupId = item.id
        const data2 = xyStore.records.filter(item2 => item2.groupId === groupId)
        const data3 = groupCardSummaryData(data2)
        data3.groupId = groupId
        data3.groupName = item.name
        data.push(data3)
    })
    return data
    
})
// 所有血压记录按时间倒序
const sortRecords = computed(() => {
    return [...xyStore.records].sort((a, b) => b.dateTime.localeCompare(a.dateTime))
})
// 将上一次添加的血压记录选择的分组排到分组中的第一个位置
const orderGroups = computed(() => {
    const groups = fzStore.groups
    const groupId = xyStore.records.length > 0 ? xyStore.records.at(-1).groupId : groups.id
    if (xyStore.records.length > 1) {
        const target = groups.find(item => item.id === groupId)
        if (!target) return groups // 未找到则返回原数组副本
        const others = groups.filter(item => item.id !== groupId)
        return [target, ...others]
    }
    return groups
    
})



/* 功能函数 */
// 选择更多选项
function onSelectMoreOption(action) {
    const text = action.text
    if (text === "新建分组") {
        showAddGroup.value = true
    }
    else if (text === "添加记录") {
        showAddRecord.value = true
    }
    else if (text === "全部记录") {
        router.push('/bpgallrecord')
    }
    else if (text === "导出记录") {
        exportData()
    }
    else if (text === "删除所有") {
        deleatAll()
    }  
}
// 添加分组
async function addGroup(groupName){
    const timestamp = new Date().getTime()
    const result = await fzStore.addGroup(timestamp, groupName)
    if (result === "添加成功") {
        showToast({message: result, type: "success",duration: 1000})
    } else {
        showToast({message: result, type: "fail",duration: 2000})
    }
    showAddGroup.value = false  
}
// 添加血压记录
async function addRecord(data) {
    const data2 = {
        dbp: parseInt(data.dbp),
        sbp: parseInt(data.sbp),
        hr: parseInt(data.hr),
        notes: data.notes,
        group_id: parseInt(data.groupId),
        group_name: data.groupName,
        date_time: data.date + " " + data.time
    }
    // 后台添加记录
    const result = await xyStore.addRecord(data2)
    if (result === "添加成功") {
        showToast({message: result, type: "success",duration: 1000})
    } else {
        showToast({message: result, type: "fail",duration: 2000})
    }
    showAddRecord.value = false
}
// 删除分组
async function deleteGroup(groupId) {
    // 后台删除分组
    const result = await fzStore.deleteGroup(groupId)
    // 后台迁移属于该分组的记录到未分组中
    for (const record of xyStore.records) {
        if (record.groupId === groupId) {
            await xyStore.changeGroup(record.id, "null", "未分组")
        }
    }
    if (result === "删除成功") {
        showToast({message: result, type: "success",duration: 1000})
    } else {
        showToast({message: result, type: "fail",duration: 2000})
    }
}
// 跳转到分组详情页
function toGroupDetails(groupId,groupName) {
    router.push({
        path: '/bpgrouprecord',
        query: {
            groupId,
            groupName
        }
    })
}
// 删除所有血压记录与分组
function deleatAll() {
    if (xyStore.records.length === 0) {
        showToast({message: "暂无数据", type: "fail",duration: 1000})
        return
    }
    showConfirmDialog({
        message:
            '是否删除所有血压记录与分组',
        })
        .then(async () => {
            showLoadingToast({message: "正在删除中...",duration: 0,overlay:true,forbidClick:true})
            const result = await xyStore.deleteAllRecord()
            if (result === "清空成功") {
                const result2 = await fzStore.deleteAllGroups()
                if (result2 === "清空成功") {
                    showToast({message: result2, type: "success",duration: 1000})
                } else {
                    showToast({message: "分组记录删除失败", type: "fail",duration: 2000})
                }
            } else {
                showToast({message: "血压记录删除失败", type: "fail",duration: 2000})
            }
        })
        .catch(() => {
            // on cancel
        })
    }
// 导出血压记录
async function exportData() {
    try {
        if (sortRecords.value.length === 0) {
            showToast({message:"暂无数据",type: "error",duration:1000})
            return
        }
        // 整理数据
        let tableData = xyStore.records.map(record => {
            const dateTime = record.dateTime.split(" ")
            const date = dateTime[0]
            const time = dateTime[1]
            return [date,time,record.sbp.toString(),record.dbp.toString(),record.hr.toString(),record.notes]
        })
        tableData.unshift(["日期","时间","高压","低压","脉率","备注"])

        // 调用 Rust 生成 Excel 字节
        const result = await invoke('create_excel',{data: tableData})
        const fileData = new Uint8Array(result.data)

       // 生成文件名（带时间戳）
       const fileName = `血压记录_${formatDateTime2(new Date())}.xlsx`

        // 写入文件到下载目录中
        const downloadPath = otherStore.fileSavePath
        const fullPath = `${downloadPath}/${fileName}`
        await writeFile(fullPath, fileData)

        showToast({ message: "导出成功", type: "success", duration: 2000 })
    }catch (e) {
      showToast({message:"导出失败，请重试",type: "error",duration:2000})
    }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
}
.continer {
    margin: 10px;
}
.top{
    top: 0;
    /* background-color: #f5f7faa3; */
    background-color: #f5f7fa;
    backdrop-filter: none; 
}
.header {
    display: flex;
    justify-content: space-between;
    /* padding-top: 10px; */
    flex-wrap: wrap;
}
.header span{
    font-size: 27px;
    font-weight: bolder;
    color: #4f7cff;
}
.header .tool_bar{
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 80px;
}
.header .tool_bar button {
    font-size: 18px;
    border: none;
    background-color: #ffffff;
}

.function_bar {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: #f5f7fa;
}
.function_bar button {
    width: 110px;
    height: 40px;
    border-radius: 15px;
    font-size: 13px;
    margin-top: 10px;
}
.group {
    margin-top: 10px;
}
.add_record {
    position: fixed;
    bottom: 7%;
    left: 50%;
    transform: translateX(-50%);
}
.add_record button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
</style>