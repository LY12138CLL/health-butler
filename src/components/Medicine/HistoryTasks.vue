<!-- 历史任务展示 -->
<template>
     <div class="takes">
        <van-sticky offset-top="2.6rem">
            <div class="menus" @click="menuChange">
                <span class="menu" :class="{'active-menu': activeMenuName === '全部'}" data-name="全部">全部</span>
                <span class="menu" :class="{'active-menu': activeMenuName === '未执行'}" data-name="未执行">未执行</span>
                <span class="menu" :class="{'active-menu': activeMenuName === '已执行'}" data-name="已执行">✅已执行</span>
                <span class="menu" :class="{'active-menu': activeMenuName === '已过期'}" data-name="已过期">⏰已过期</span>
                <span class="menu" :class="{'active-menu': activeMenuName === '已取消'}" data-name="已取消">🚫已取消</span>
            </div>
            <div class="search">
                    <van-search
                        v-model="searchValue"
                        show-action
                        placeholder="按时间/状态/名称搜索"
                        @search="onSearch"
                    >
                    <template #action>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>
            </div>
        </van-sticky>
        <div class="records">
            <HistoryTakeCard v-for="task in showTask" :key="task.taskId" :name="task.name" :noticeTime="task.noticeTime" :confirmTime="task.confirmTime" :status="task.status" @delete="deteteTake(task.taskId)"/>
        </div>
        <div class="more">
            <span v-if="totalInCurrentMenu > showTask.length" style="color: #1989fa;" @click="getMoreRecord">点击加载更多</span>
        </div>
    </div>
</template>
<script setup>
import { computed,ref } from "vue"
import {medicineTaskStore} from "../../stores/medicineStore"
import HistoryTakeCard from "./HistoryTakeCard.vue"

/* 路由与仓库 */
const yprwStore = medicineTaskStore() // 服药任务

/* 展示组件 */

/* 数据 */
const searchValue = ref('') // 搜索栏输入的关键字
const defaultNumber = 10 // 加载的条数
const prevEndIndex = ref(0) // 上次提取的记录结束位置索引
const searchQuery = ref("") // 保存真正用来搜索的关键字
const activeMenuName = ref("全部") // 历史记录中被点击的菜单
// 获取所有任务
const allTask = computed(() => {
    return yprwStore.medicineTask.slice().sort((a, b) => a.noticeTime.localeCompare(b.noticeTime))
})


// 搜索后的记录
const filteredRecords = computed(() => {
    // 如果搜索关键字为空，则返回排序后的记录
    if (!searchQuery.value.trim()) return allTask.value
    // 去除关键字额空格
    const q = searchQuery.value.trim()
    // 返回过滤后的结果
    return allTask.value.filter(r => {
        // 记录中的noticeTime分隔为date与time
        const noticeDateTimeArr = r.noticeTime.split(" ")
        const noticeDate = noticeDateTimeArr[0]
        const noticeTime = noticeDateTimeArr[1]

        // 记录中的confirmTime分隔为date与time
        const confirmDateTimeArr = r.confirmTime.split(" ")
        const confirmDate = confirmDateTimeArr[0]
        const confirmTime = confirmDateTimeArr[1]

        // 将需要检索的字段拼接为字符串用空格分开
        const full = (noticeDate || '') + ' ' + (noticeTime || '') + ' ' + (confirmDate || '') + ' ' + (confirmTime || '') + ' ' + (r.name || '') + ' ' + (r.status || '')
        // 判断要检索的字段中是否包含搜索关键字。
        // includes方法用于判断数组是否包含某个元素，或字符串是否包含某个子串，找到则返回true，否则返回false
        return full.includes(q)
    })
})
 // 历史任务切换菜单时展示的任务
const showTask = computed(() => {
    if (activeMenuName.value !== "全部") {
        return filteredRecords.value.filter(item => item.status === activeMenuName.value).slice(0, prevEndIndex.value)
    }
    return filteredRecords.value.slice(0, prevEndIndex.value)  
})
// 当前菜单状态下的总记录数（用于判断是否显示加载更多）
const totalInCurrentMenu = computed(() => {
  let list = filteredRecords.value
  if (activeMenuName.value !== "全部") {
    list = list.filter(item => item.status === activeMenuName.value)
  }
  return list.length
})
/* 功能函数 */
// 历史任务中的菜单样式切换
function menuChange(e) {
    const activeMenuDom = e.target.closest('span') // 获取所有子菜单dom
    if (activeMenuDom) {
        // 如果是子菜单则激活此菜单的样式
        activeMenuName.value = activeMenuDom.dataset.name
       // 切换菜单后重置分页，从头加载
        prevEndIndex.value = defaultNumber
        searchQuery.value = ""
        searchValue.value = ""
    }
}

// 加载更多
function getMoreRecord() {
    prevEndIndex.value += defaultNumber
}
// 搜索记录
function onSearch() {
    // 将搜索栏输入的关键字赋值给searchQuery，用于filteredRecords计算属性检索
    searchQuery.value = searchValue.value
    // 从头开始，重新提取记录
    prevEndIndex.value = defaultNumber
}
// 删除任务
async function deteteTake(taskId) {
    const result = await yprwStore.deleteTask(taskId)
    if (result === "删除成功") showToast({message:"删除成功",type:'success'})
    else showToast({message:"删除失败",type:'fail', duration:2000})
}
// 初始化加载一次记录
getMoreRecord()
</script>
<style scoped>
.menus{
    margin: 0;
    padding: 0;
    display: flex;
    gap: 5px;
    justify-content: space-between;
    background-color: #f5f7fa;
}
.menu{
    font-size: 13px;
    background-color: #ffffff;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #e2e8f0;
    color: #848586;
}
.active-menu{
    border: 1px solid #1989fa;
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
.records {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>