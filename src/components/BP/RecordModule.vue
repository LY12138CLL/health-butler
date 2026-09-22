<!-- 一条血压记录 -->
<template>
    <div class="record">
        <van-swipe-cell>
            <div class="continer">
                <div class="row1">
                    <div class="bp">
                        <span style="color: red;">{{ recordData.sbp }}</span>
                        <span>&nbsp;/&nbsp;</span>
                        <span style="color: #4f7cff">{{ recordData.dbp }}</span>
                    </div>
                    <span style="color: #34c759;"><span style="color: red;">❤</span>{{ recordData.hr }}</span>
                </div>
                <div class="row2">
                    <van-text-ellipsis :content="recordData.notes" expand-text="展开" collapse-text="收起" />
                </div>
                <div class="row3">
                    <span class="date">{{ recordData.dateTime }}</span>
                    <van-tag :class="status.cls" class="tag">{{ status.label }}</van-tag>
                    <van-tag type="primary" @click="showGroupPopup = true">{{ recordData.groupName }}</van-tag>
                </div>
            </div>
            
            <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="deleteRecord"/>
            </template>
        </van-swipe-cell>
        
    </div>

    <van-popup v-model:show="showGroupPopup" destroy-on-close round position="bottom">
        <van-picker
            :model-value="defaultGroupOption"
            :columns="groups"
            @confirm="onGroupConfirm"
            @cancel="showGroupPopup = false"
        />
    </van-popup>
</template>
<script setup>
import { ref,computed, toRefs } from 'vue'
import {bpStatus} from "../../utils/tools"

/* 展示组件 */
const showGroupPopup = ref(false)


/* 组件通信 */
// 接收父组件传递的数据
const props = defineProps({
    groupData: Array,
    recordData: Object
})
// 子传父事件名称
const emit = defineEmits(['changeGroup','deleteRecord'])

/* 数据 */
const { groupData, recordData } = toRefs(props)
// 默认分组选项（由于van-picker组件model-value需要的是数组，所以使用数组包裹）
const defaultGroupOption = computed(() => [recordData.value.groupId]) 
// 处理分组信息，用于选择分组。更改传递过来的分组信息中的属性名称符合Picker组件的要求
const groups = groupData.value.map(item => {
    return {
        text: item.name,
        value: item.id
    }
})

/* 功能函数 */
// 根据血压判断状态，如正常、偏高、1级高血压等，并返回对应的css类名
const status = computed(() => {
    const status = bpStatus(recordData.value.sbp,recordData.value.dbp)
    if (status === "低血压") return { label: '低血压', cls: 'dxy' }
    if (status === "3级") return { label: '3级', cls: 'crisis' }
    if (status === "2级") return { label: '2级', cls: 'hypertension2' }
    if (status === "1级") return { label: '1级', cls: 'hypertension1' }
    if (status === "偏高") return { label: '偏高', cls: 'elevated' }
    if (status === "正常") return { label: '正常', cls: 'normal' }
    // 兜底（若都不满足）
    return { label: '正常', cls: 'normal' }
})
// 选择分组
function onGroupConfirm(val) {
    const option = val.selectedOptions[0]
    if (option.value !== recordData.value.groupId) {
        emit("changeGroup",{recordId:recordData.value.id,newGroupId:option.value,newGroupName:option.text})
    }
    showGroupPopup.value = false
}
// 删除血压记录
function deleteRecord() {
    showConfirmDialog({
        message:
            '是否确认删除此记录',
        })
        .then(() => {
            emit("deleteRecord",recordData.value.id)
        })
        .catch(() => {
        })
    
}
</script>
<style scoped>
.record{
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
    
}
.continer{
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
}
.row1{
    font-size: 18px;
    display: flex;
    align-items: center;
}
.bp{
    width: 100px;
}
.row2{
    font-size: 16px;
}
.row3{
    display: flex;
    justify-content: flex-start;
    gap: 10px;
}
.date{
    font-size: 16px;
    color: #9e9e8b;
}
:deep(.van-swipe-cell__right) {
    display: flex;
    /* margin-right: -1px; */
}
.delete-button{
    height: 30px;
    margin-top: auto;      /* 推到底部 */
    margin-bottom: 10px;
}
.dxy{
    background-color: #5499a9;
}
.normal{
    background-color: #1A8A3F;
}
.elevated{
    background-color: #B76E00;
}
.hypertension1{
    background-color: #C62828;
}
.hypertension2{
    background-color: #B71C1C;
}
.crisis{
    background-color: #ba0404;
}
.middle{
    margin-top: 12px;
    font-size: 12px;
}
.tag{
    width: 42px;
    display: flex;
    justify-content: center;
}
</style>