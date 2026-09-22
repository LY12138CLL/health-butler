<!-- 添加记录 -->
<template>
    <van-action-sheet 
        v-model:show="showAction" 
        title="添加血压记录" 
        :closeable="false"
        :before-close="() => false"
        :duration="0.4"
        :style="{bottom: actionSheetBottom + 'px'}"
    >
        <van-form @submit="onFormPass">
            <van-cell-group inset>
                <van-row>
                    <!-- 日期 -->
                    <van-col span="12">
                        <van-field
                            name="date"
                            label="日期"
                            label-align="top"
                        >
                            <template #input>
                                <div class="custom-input-group">
                                    <input
                                        ref="yearInput"
                                        :value="year"
                                        @input="onYearInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctYear"
                                        @keydown="(e) => onDateKeydown(e, 'year')"
                                        class="custom-input year-input"
                                        maxlength="4"
                                        inputmode="numeric"
                                        placeholder="2026"
                                    />
                                    <span class="separator">-</span>
                                    <input
                                        ref="monthInput"
                                        :value="month"
                                        @input="onMonthInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctMonth"
                                        @keydown="(e) => onDateKeydown(e, 'month')"
                                        class="custom-input"
                                        maxlength="2"
                                        inputmode="numeric"
                                        placeholder="07"
                                    />
                                    <span class="separator">-</span>
                                    <input
                                        ref="dayInput"
                                        :value="day"
                                        @input="onDayInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctDay"
                                        @keydown="(e) => onDateKeydown(e, 'day')"
                                        class="custom-input"
                                        maxlength="2"
                                        inputmode="numeric"
                                        placeholder="28"
                                    />
                                    <van-icon
                                        name="calendar-o"
                                        @click="showDateCalendar = true"
                                        class="field-icon"
                                    />
                                </div>
                            </template>
                        </van-field>
                        <van-calendar
                            class="select-date-calendar"
                            v-model:show="showDateCalendar"
                            :show-title="false"
                            switch-mode="month"
                            :closeable="false"
                            @confirm="onDateConfirm"
                        />
                    </van-col>

                    <!-- 时间 -->
                    <van-col span="12">
                        <van-field
                            name="time"
                            label="时间"
                            label-align="top"
                        >
                            <template #input>
                                <div class="custom-input-group">
                                    <input
                                        ref="hourInput"
                                        :value="hour"
                                        @input="onHourInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctHour"
                                        @keydown="(e) => onTimeKeydown(e, 'hour')"
                                        class="custom-input"
                                        maxlength="2"
                                        inputmode="numeric"
                                        placeholder="12"
                                    />
                                    <span class="separator">:</span>
                                    <input
                                        ref="minuteInput"
                                        :value="minute"
                                        @input="onMinuteInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctMinute"
                                        @keydown="(e) => onTimeKeydown(e, 'minute')"
                                        class="custom-input"
                                        maxlength="2"
                                        inputmode="numeric"
                                        placeholder="30"
                                    />
                                    <span class="separator">:</span>
                                    <input
                                        ref="secondInput"
                                        :value="second"
                                        @input="onSecondInput"
                                        @focus="(e) => e.target.select()"
                                        @blur="correctSecond"
                                        @keydown="(e) => onTimeKeydown(e, 'second')"
                                        class="custom-input"
                                        maxlength="2"
                                        inputmode="numeric"
                                        placeholder="00"
                                    />
                                    <van-icon
                                        name="clock-o"
                                        @click="showTimePicker = true"
                                        class="field-icon"
                                    />
                                </div>
                            </template>
                        </van-field>
                        <van-popup
                            v-model:show="showTimePicker"
                            destroy-on-close
                            position="bottom"
                            class="select-time-popup"
                        >
                            <van-time-picker
                                v-model="bindTime"
                                title="选择时间"
                                @cancel="showTimePicker = false"
                                :columns-type="timeColumnsType"
                                @confirm="getSelectDate"
                            />
                        </van-popup>
                    </van-col>
                </van-row>

                <!-- 其余字段保持不变 -->
                <van-row>
                    <van-col span="12">
                        <van-field
                            v-model="formData.sbp"
                            name="sbp"
                            label="高压"
                            placeholder="120"
                            label-align="top"
                            type="digit"
                            :rules="rules.sbp"
                        />
                    </van-col>
                    <van-col span="12">
                        <van-field
                            v-model="formData.dbp"
                            name="dbp"
                            label="低压"
                            placeholder="80"
                            label-align="top"
                            type="digit"
                            :rules="rules.dbp"
                        />
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="12">
                        <van-field
                            v-model="formData.hr"
                            name="hr"
                            label="脉率"
                            placeholder="100"
                            label-align="top"
                            type="digit"
                            :rules="rules.hr"
                        />
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="24">
                        <van-field
                            v-model="formData.notes"
                            name="notes"
                            label="备注"
                            placeholder="选填"
                            label-align="top"
                            type="text"
                        />
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="24">
                        <van-field
                            v-model="formData.groupName"
                            readonly
                            name="group"
                            label="分组"
                            placeholder="选择分组"
                            label-align="top"
                            @click="showGroupPicker = true"
                            right-icon="arrow-down"
                            :rules="rules.group"
                        />
                        <van-popup v-model:show="showGroupPicker" destroy-on-close position="bottom">
                            <van-picker
                                :columns="groups"
                                :model-value="defaultGroupOption"
                                @confirm="onGroupConfirm"
                                @cancel="showGroupPicker = false"
                            />
                        </van-popup>
                    </van-col>
                </van-row>

                <van-row class="option" gutter="20">
                    <van-col span="10">
                        <van-button 
                            color="#1989fa" 
                            size="large" 
                            native-type="submit"
                            @touchstart.passive="onButtonTouchStart"
                            @mousedown="onButtonTouchStart"
                        >确认</van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button 
                            color="#8b8989" 
                            size="large" 
                            @click="onCancel"
                            @touchstart.passive="onButtonTouchStart"
                            @mousedown="onButtonTouchStart"
                        >取消</van-button>
                    </van-col>
                </van-row>
            </van-cell-group>
        </van-form>
    </van-action-sheet>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { showToast } from 'vant'
import { getDeviceType } from '../../utils/tools'

/* 展示组件 */
const showAction = ref(false)
const showDateCalendar = ref(false)
const showTimePicker = ref(false)
const showGroupPicker = ref(false)

// van-action-sheet距离底部的距离，键盘高度为310
const actionSheetBottom = ref(0)

// 标志：是否正在点击提交或取消按钮（用于阻止blur重置位置）
const isSubmitting = ref(false)

/* 组件通信 */
const emit = defineEmits(['save', 'cancel'])
const props = defineProps({ groupData: Array })

/* 分组数据 */
const groups = props.groupData.map(item => ({
    text: item.name,
    value: item.id
}))
const defaultGroupOption = groups.length > 0 ? [groups[0].value] : []

/* 表单基础数据（不含日期时间） */
const formData = ref({
    sbp: null,
    dbp: null,
    hr: null,
    notes: '',
    groupName: groups.length > 0 ? groups[0].text : '',
    groupId: groups.length > 0 ? groups[0].value : '',
})

/* 日期拆分字段 */
const year = ref('')
const month = ref('')
const day = ref('')
/* 时间拆分字段 */
const hour = ref('')
const minute = ref('')
const second = ref('')

/* 输入框引用 */
const yearInput = ref(null)
const monthInput = ref(null)
const dayInput = ref(null)
const hourInput = ref(null)
const minuteInput = ref(null)
const secondInput = ref(null)

/* 时间选择器配置 */
const timeColumnsType = ref(['hour', 'minute', 'second'])
const bindTime = ref(['00', '00', '00'])

/* 表单校验规则 */
const rules = {
    sbp: [{ required: true, message: "不能为空" }],
    dbp: [{ required: true, message: "不能为空" }],
    hr: [{ required: true, message: "不能为空" }],
    group: [{ required: true, message: "不能为空" }],
}

/* ---------- 日期输入（含实时天数限制） ---------- */
function onYearInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.slice(0, 4)
    year.value = val
    if (val.length === 4) {
        if (month.value && day.value) correctDay()
        nextTick(() => {
            if (monthInput.value) {
                monthInput.value.focus()
                monthInput.value.select()
            }
        })
    }
}

function onMonthInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2)
    month.value = val
    if (val.length === 2) {
        if (day.value && year.value) correctDay()
        nextTick(() => {
            if (dayInput.value) {
                dayInput.value.focus()
                dayInput.value.select()
            }
        })
    }
}

function onDayInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2)
    if (year.value && month.value) {
        const y = parseInt(year.value, 10)
        const m = parseInt(month.value, 10)
        if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
            const maxDay = new Date(y, m, 0).getDate()
            let num = parseInt(val, 10)
            if (!isNaN(num) && num > maxDay) {
                val = String(maxDay)
            }
        }
    }
    day.value = val
}

/* ---------- 时间输入 ---------- */
function onHourInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2)
    hour.value = val
    if (val.length === 2) {
        nextTick(() => {
            if (minuteInput.value) {
                minuteInput.value.focus()
                minuteInput.value.select()
            }
        })
    }
}

function onMinuteInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2)
    minute.value = val
    if (val.length === 2) {
        nextTick(() => {
            if (secondInput.value) {
                secondInput.value.focus()
                secondInput.value.select()
            }
        })
    }
}

function onSecondInput(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2)
    second.value = val
}

/* ---------- 退格键导航 ---------- */
function onDateKeydown(e, type) {
    const target = e.target
    if (e.key === 'Backspace' && target.value === '') {
        e.preventDefault()
        if (type === 'month' && yearInput.value) {
            yearInput.value.focus()
            yearInput.value.select()
        } else if (type === 'day' && monthInput.value) {
            monthInput.value.focus()
            monthInput.value.select()
        }
    }
}

function onTimeKeydown(e, type) {
    const target = e.target
    if (e.key === 'Backspace' && target.value === '') {
        e.preventDefault()
        if (type === 'minute' && hourInput.value) {
            hourInput.value.focus()
            hourInput.value.select()
        } else if (type === 'second' && minuteInput.value) {
            minuteInput.value.focus()
            minuteInput.value.select()
        }
    }
}

/* ---------- 合理性修正（失焦时） ---------- */
function correctYear() {
    if (year.value === '') return
    let num = parseInt(year.value, 10)
    if (!isNaN(num)) {
        if (num < 1900) num = 1900
        else if (num > 2099) num = 2099
        year.value = String(num).padStart(4, '0')
        if (month.value && day.value) correctDay()
    } else {
        year.value = ''
    }
}

function correctMonth() {
    if (month.value === '') return
    let num = parseInt(month.value, 10)
    if (!isNaN(num)) {
        if (num < 1) num = 1
        else if (num > 12) num = 12
        month.value = String(num).padStart(2, '0')
        if (day.value && year.value) correctDay()
    } else {
        month.value = ''
    }
}

function correctDay() {
    if (day.value === '' || month.value === '' || year.value === '') return
    let y = parseInt(year.value, 10)
    let m = parseInt(month.value, 10)
    let d = parseInt(day.value, 10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12) {
        const maxDay = new Date(y, m, 0).getDate()
        if (d < 1) d = 1
        else if (d > maxDay) d = maxDay
        day.value = String(d).padStart(2, '0')
    }
}

function correctHour() {
    if (hour.value === '') return
    let num = parseInt(hour.value, 10)
    if (!isNaN(num)) {
        if (num < 0) num = 0
        else if (num > 23) num = 23
        hour.value = String(num).padStart(2, '0')
    } else {
        hour.value = ''
    }
}

function correctMinute() {
    if (minute.value === '') return
    let num = parseInt(minute.value, 10)
    if (!isNaN(num)) {
        if (num < 0) num = 0
        else if (num > 59) num = 59
        minute.value = String(num).padStart(2, '0')
    } else {
        minute.value = ''
    }
}

function correctSecond() {
    if (second.value === '') return
    let num = parseInt(second.value, 10)
    if (!isNaN(num)) {
        if (num < 0) num = 0
        else if (num > 59) num = 59
        second.value = String(num).padStart(2, '0')
    } else {
        second.value = ''
    }
}

/* ---------- 选择器回调 ---------- */
function onDateConfirm(date) {
    showDateCalendar.value = false
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    year.value = String(y)
    month.value = m
    day.value = d
}

function getSelectDate(value) {
    const [h, m, s] = value.selectedValues
    hour.value = h
    minute.value = m
    second.value = s
    showTimePicker.value = false
}

/* ---------- 分组选择 ---------- */
function onGroupConfirm(value) {
    formData.value.groupName = value.selectedOptions[0].text
    formData.value.groupId = value.selectedOptions[0].value
    showGroupPicker.value = false
}

/* ---------- 按钮触摸/按下时标记 ---------- */
function onButtonTouchStart() {
    isSubmitting.value = true
}

/* ---------- 表单提交 ---------- */
async function onFormPass() {
    // 主动失焦并重置底部偏移
    if (document.activeElement) {
        document.activeElement.blur()
    }
    actionSheetBottom.value = 0
    isSubmitting.value = false // 重置标志

    // 提交前再次修正日期时间
    correctYear()
    correctMonth()
    correctDay()
    correctHour()
    correctMinute()
    correctSecond()

    if (!year.value || !month.value || !day.value) {
        showToast('请填写完整的日期')
        return
    }
    if (!hour.value || !minute.value || !second.value) {
        showToast('请填写完整的时间')
        return
    }

    const submitData = {
        ...formData.value,
        date: `${year.value}-${month.value}-${day.value}`,
        time: `${hour.value}:${minute.value}:${second.value}`,
    }
    
    showAction.value = false
    await new Promise(resolve => setTimeout(resolve, 500))
    emit('save', submitData)
}

async function onCancel() {
    // 取消时同样处理
    if (document.activeElement) {
        document.activeElement.blur()
    }
    actionSheetBottom.value = 0
    isSubmitting.value = false

    showAction.value = false
    await new Promise(resolve => setTimeout(resolve, 500))
    emit("cancel")
}

/* ---------- 初始化默认日期时间 ---------- */
onMounted(() => {
    const now = new Date()
    year.value = String(now.getFullYear())
    month.value = String(now.getMonth() + 1).padStart(2, '0')
    day.value = String(now.getDate()).padStart(2, '0')
    hour.value = String(now.getHours()).padStart(2, '0')
    minute.value = String(now.getMinutes()).padStart(2, '0')
    second.value = String(now.getSeconds()).padStart(2, '0')

    showAction.value = true
})
</script>

<style scoped>
/* ========== 自定义日期时间输入样式（全部 px） ========== */
.custom-input-group {
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    padding: 2px 4px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    flex-wrap: nowrap;
    overflow: hidden;
}

.custom-input {
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
    font-size: 14px;
    color: #323233;
    padding: 4px 0;
    font-variant-numeric: tabular-nums;
    width: 24px;
    min-width: 24px;
    flex: 0 1 24px;
}
.year-input {
    width: 40px;
    min-width: 40px;
    flex: 0 0 40px;
}

.separator {
    padding: 0;
    color: #969799;
    user-select: none;
    flex-shrink: 0;
    font-size: 14px;
    width: 12px;
    text-align: center;
}

.field-icon {
    padding: 0 2px 0 6px;
    color: #969799;
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
    margin-left: auto;
}
.field-icon:active {
    opacity: 0.6;
}

/* ========== 其余全局样式 ========== */
.option :deep(button) {
    margin: 10px auto;
}
:deep(.van-field__body) {
    background-color: #f5f7fa;
}
:deep(input) {
    padding: 5px;
}
:deep(.van-calendar__popup.van-popup--bottom) {
    height: 60%;
}
.select-date-calendar {
    height: 50px;
}
.select-time-popup {
    height: 42%;
}
</style>