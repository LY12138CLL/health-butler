<!-- 编辑任务 -->
<template>
    <div id="add-edit-task">
        <van-nav-bar title="编辑任务" @click-left="router.back()" safe-area-inset-top placeholder fixed>
                <template #left>
                    <van-icon name="arrow-left" size="18" color="#000000" />
                </template>
        </van-nav-bar>
        <van-form @submit="onSubmit" class="form">
            <van-cell-group inset>
                <van-field
                    v-model="formData.name"
                    name="name"
                    label="任务名称"
                    placeholder="任务1"
                    :rules="rules.name"   
                />
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.noticeDate"
                    name="noticeTime"
                    label="提醒日期"
                    placeholder="2026-08-13"
                    is-link
                    readonly
                    :rules="rules.noticeDate"
                    @click="showNoticeDatePicker = true"
                />
                <van-popup v-model:show="showNoticeDatePicker" destroy-on-close position="bottom">
                    <van-date-picker
                        v-model="noticeDatePickerDefaultValue"
                        title="选择日期"
                        @confirm="onNoticeDateConfirm"
                        @cancel="showNoticeDatePicker = false"
                    />
                </van-popup>
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.noticeTime"
                    name="noticeTime"
                    label="提醒时间"
                    placeholder="12:30:30"
                    is-link
                    readonly
                    :rules="rules.noticeTime"
                    @click="showNoticeTimePicker = true"
                />
                <van-popup v-model:show="showNoticeTimePicker" destroy-on-close position="bottom">
                    <van-time-picker
                        v-model="noticeTimePickerDefaultValue"
                        title="选择时间"
                        :columns-type="['hour', 'minute', 'second']"
                        @confirm="onNoticeTimeConfirm"
                        @cancel="showNoticeTimePicker = false"
                    />
                </van-popup>
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.takeMedicineNumber"
                    name="takeMedicineNumber"
                    label="服用剂量"
                    placeholder="1.75"
                    type="number"
                    :rules="rules.takeMedicineNumber"
                >
                    <template #extra>
                        <span>{{ formData.normsUnit }}</span>
                    </template>
                </van-field>
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.confirmDate"
                    name="confirmDate"
                    label="完成日期"
                    placeholder="2026-08-13"
                    :rules="rules.confirmDate"
                    :clearable="true"
                >
                    <template #right-icon>
                        <van-icon name="arrow" @click.stop="showConfirmDatePicker = true" />
                    </template>
                </van-field>
                <van-popup v-model:show="showConfirmDatePicker" destroy-on-close position="bottom">
                    <van-date-picker
                        v-model="confirmDatePickerDefaultValue"
                        title="选择日期"
                        @confirm="onConfirmDateConfirm"
                        @cancel="showConfirmDatePicker = false"
                    />
                </van-popup>
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.confirmTime"
                    name="confirmDate"
                    label="完成时间"
                    placeholder="12:30:30"
                    :rules="rules.confirmTime"
                    :clearable="true"
                >
                    <template #right-icon>
                        <van-icon name="arrow" @click.stop="showConfirmTimePicker = true" />
                    </template>
                </van-field>

                <van-popup v-model:show="showConfirmTimePicker" destroy-on-close position="bottom">
                    <van-time-picker
                        v-model="confirmTimePickerDefaultValue"
                        title="选择时间"
                        :columns-type="['hour', 'minute', 'second']"
                        @confirm="onConfirmTimeConfirm"
                        @cancel="showConfirmTimePicker = false"
                    />
                </van-popup>
            </van-cell-group>
            <van-cell-group inset>
                <van-field
                    v-model="formData.status"
                    is-link
                    readonly
                    name="picker"
                    label="状态"
                    placeholder="未执行"
                    @click="showStatusPicker = true"
                />
                <van-popup v-model:show="showStatusPicker" destroy-on-close position="bottom">
                    <van-picker
                        :columns="statusPickerColums"
                        :model-value="statusPickerDefaultValue"
                        @confirm="onStatusConfirm"
                        @cancel="showStatusPicker = false"
                    />
                </van-popup>
            </van-cell-group>
            <van-cell-group inset class="option">
                    <van-button block type="primary" native-type="submit">保存</van-button>
                    <van-button block type="default" @click="resetForm">重置</van-button>
            </van-cell-group>
           </van-form>
    </div>
</template>
<script setup>
import { ref,toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {medicineTaskStore} from "../../stores/medicineStore"
import {checkDate,checkTime,formatDateTime4} from "../../utils/tools"
import { showToast } from 'vant'

/* 路由与仓库 */
const router = useRouter()
const route = useRoute()
const yprwStore = medicineTaskStore()

/* 展示组件 */
const showNoticeDatePicker = ref(false) // 提醒日期选择器
const showNoticeTimePicker = ref(false) // 提醒时间选择器
const showConfirmDatePicker = ref(false) // 完成日期选择器
const showConfirmTimePicker = ref(false) // 完成时间选择器
const showStatusPicker = ref(false) // 状态选择器

/* 数据 */
// 路由传递过来的参数
const taskId = route.query.taskId // 任务id
// 表单数据
const formData = ref({
    taskId: '',
    name: '',
    message: '',
    noticeDate: '',
    noticeTime: '',
    medicineTypeId: '',
    planId: '',
    takeMedicineNumber: '',
    normsUnit: '',
    confirmDate: '',
    confirmTime: '',
    status: ''
})
let formDataCopy = {} // 表单数据副本，用于提交时对比是否修改了
// 打开选择器时的默认选项
const noticeDatePickerDefaultValue = ref([]) // 提醒日期
const noticeTimePickerDefaultValue = ref([]) // 提醒时间选
const confirmDatePickerDefaultValue = ref([]) // 完成日期
const confirmTimePickerDefaultValue = ref([]) // 完成时间
const statusPickerDefaultValue = ref([]) // 状态

// 状态选择器的选项
let statusPickerColums = [
    {text: '未执行', value: '未执行'},
    {text: '已执行', value: '已执行'},
    {text: '已过期', value: '已过期'},
    {text: '已取消', value: '已取消'}
] 
// 表单校验规则
const rules = {
    name: [{required: true, message: "不能为空"}],
    noticeDate: [{required: true, message: "不能为空"}],
    noticeTime: [{required: true, message: "不能为空"}],
    status: [{required: true, message: "不能为空"}],
    takeMedicineNumber: [
        {required: true, message: "不能为空"},
        {validator: (value) => {
            if (Number(value) < 0 || !Number(value)) return "剂量必须为大于零的数字"
        }}
    ],
    confirmDate: [
        {validator: (value) => {
            if (value !== "") {
                const result = checkDate(value)
                if (result === "日期格式不对") return "日期必须为xxxx-xx-xx格式"
                else if (result === "日期不合法") return "日期不合法"
                else if (formData.value.status !== "已执行") return `${formData.value.status}状态下不能有日期`
            }
            else if (formData.value.status === "已执行" && value === "") return "已执行状态下必须得有日期"
        }}
    ],
    confirmTime: [
        {validator: (value) => {
            // if (formData.value.status === "已执行") {
            //     if (value === "") return "已执行状态下必须得有时间"
            //     else {
            //         const result = checkTime(value)
            //         if (result === "时间格式不对") return "时间必须为xx:xx:xx格式"
            //         else if (result === "时间不合法") return "时间不合法"
            //     }
            // }
            // else {
            //     if (value !== "") return `${formData.value.status}状态下不能有时间`
            // }

            if (value !== "") {
                const result = checkTime(value)
                if (result === "时间格式不对") return "时间必须为xx:xx:xx格式"
                else if (result === "时间不合法") return "时间不合法"
                else if (formData.value.status !== "已执行") return `${formData.value.status}状态下不能有时间`
            }
            else if (formData.value.status === "已执行" && value === "") return "已执行状态下必须得有时间"
        }}
    ],

}


/* 功能函数 */
// 初始化表单数据
function init() {
    // 获取对应任务的数据并赋值给formData
    const data = yprwStore.medicineTask.filter(item => item.taskId === taskId)[0]
    // 初始化确认日期时间
    let confirmDate = ""
    let confirmTime = ""
    if (data.confirmTime !== "") {
        confirmDate = data.confirmTime.split(' ')[0]
        confirmTime = data.confirmTime.split(' ')[1]
        confirmDatePickerDefaultValue.value = confirmDate.split('-')
        confirmTimePickerDefaultValue.value = confirmTime.split(":")
    }
    else {
        const now = formatDateTime4(new Date)
        confirmDatePickerDefaultValue.value = now.split(' ')[0].split('-')
        confirmTimePickerDefaultValue.value = now.split(' ')[1].split(':')
    }
    // 初始化提醒日期时间
    const noticeDate = data.noticeTime.split(' ')[0]
    const noticeTime = data.noticeTime.split(' ')[1]
    noticeDatePickerDefaultValue.value = noticeDate.split('-')
    noticeTimePickerDefaultValue.value =  noticeTime.split(':')
    statusPickerDefaultValue.value = [data.status]
    // 初始化表单数据
    formData.value = {...data, noticeDate: noticeDate, noticeTime: noticeTime, confirmDate: confirmDate, confirmTime: confirmTime}  
    // 复制一份初始化后的表单数据
    formDataCopy = structuredClone(toRaw(formData.value))
}
// 确认提醒日期选择器
function onNoticeDateConfirm({ selectedValues }) {
    formData.value.noticeDate = selectedValues.join('-')
    noticeDatePickerDefaultValue.value = selectedValues
    showNoticeDatePicker.value = false
}
// 确认提醒时间选择器
function onNoticeTimeConfirm({ selectedValues }) {
    formData.value.noticeTime = selectedValues.join(':')
    noticeTimePickerDefaultValue.value = selectedValues;
    showNoticeTimePicker.value = false
}
// 确认完成日期选择器
function onConfirmDateConfirm({ selectedValues }) {
    formData.value.confirmDate = selectedValues.join('-')
    confirmDatePickerDefaultValue.value = selectedValues
    showConfirmDatePicker.value = false
}
// 确认完成时间选择器
function onConfirmTimeConfirm({ selectedValues }) {
    formData.value.confirmTime = selectedValues.join(':')
    confirmTimePickerDefaultValue.value = selectedValues
    showConfirmTimePicker.value = false
}
// 确认 状态选择器
function onStatusConfirm({ selectedValues }) {
    formData.value.status = selectedValues[0]
    statusPickerDefaultValue.value = selectedValues
    showStatusPicker.value = false
}
// 提交表单
function onSubmit() {
    // 是否修改了表单数据
    const isEditFormData = JSON.stringify(formData.value) === JSON.stringify(formDataCopy)
    let data = {...formData.value}
    data.noticeTime = formData.value.noticeDate + " " + formData.value.noticeTime
    data.confirmTime = formData.value.status === "已执行" ? formData.value.noticeDate + " " +  formData.value.noticeTime : ""
    delete data.noticeDate
    delete data.confirmDate
    if (!isEditFormData) {
        showConfirmDialog({
        message: '内容已修改，是否保存？',
        }).then(async () => {
            const result = await yprwStore.updateTask(data.taskId,data.name,data.message,data.noticeTime,data.medicineTypeId,data.planId,data.takeMedicineNumber,data.normsUnit,data.confirmTime,data.status)
            if (result === "更新成功") {
                router.back()
                showToast({message: '更新成功', type: 'success'})
            }
            else showToast({message:"更新失败",type:'fail', duration:2000})
        }).catch(() => {
        })
    } else {
        showDialog({ message: '只有修改了内容，才能保存' })
    }
    
}
// 重置表单
function resetForm() {
    formData.value = formDataCopy
}
init()
</script>
<style scoped>
.form{
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.option{
    display: flex;
    justify-content: space-between;
    gap: 20px;
}
</style>