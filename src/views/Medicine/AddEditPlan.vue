<!-- 添加编辑计划 -->
<template>
  <div id="add-edit-plan">
    <van-nav-bar
      :title="title"
      @click-left="router.back()"
      safe-area-inset-top
      placeholder
      fixed
    >
      <template #left>
        <van-icon name="arrow-left" size="18" color="#000000" />
      </template>
    </van-nav-bar>

    <van-form @submit="onSubmit" class="form">
      <van-cell-group inset>
        <van-field
          v-model="formData.name"
          name="name"
          label="计划名称"
          placeholder="计划1"
          :rules="rules.name"
        />
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
        <van-popup
          v-model:show="showNoticeTimePicker"
          destroy-on-close
          position="bottom"
        >
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
          name="checkboxGroup"
          label="重复星期"
          label-align="top"
          :rules="rules.implementWeek"
        >
          <template #input>
            <SelectWeek
              @select="onSelectWeek"
              :afferentSelectedWeeks="formData.implementWeek"
            />
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="formData.message"
          name="message"
          label="提醒内容"
          placeholder="饭后服用"
          :rules="rules.message"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="selectedMedicineName"
          is-link
          readonly
          name="picker"
          label="药品名称"
          placeholder="优甲乐"
          @click="showMedicinePicker = true"
          :rules="rules.medicineTypeId"
        />
        <van-popup
          v-model:show="showMedicinePicker"
          destroy-on-close
          position="bottom"
        >
          <van-picker
            :columns="medicinePickerColums"
            :model-value="medicinePickerDefaultValue"
            @confirm="onMedicineConfirm"
            @cancel="showMedicinePicker = false"
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
          v-model="formData.startDate"
          name="startDate"
          label="开始日期"
          placeholder="2026-08-13"
          is-link
          readonly
          :rules="rules.startDate"
          @click="showStartDatePicker = true"
        >
        </van-field>
        <van-popup
          v-model:show="showStartDatePicker"
          destroy-on-close
          position="bottom"
        >
          <van-date-picker
            v-model="startDatePickerDefaultValue"
            title="选择日期"
            @confirm="onStartDateConfirm"
            @cancel="showStartDatePicker = false"
          />
        </van-popup>
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="formData.startTime"
          name="startTime"
          label="开始时间"
          placeholder="12:30:00"
          is-link
          readonly
          :rules="rules.startTime"
          @click="showStartTimePicker = true"
        >
        </van-field>
        <van-popup
          v-model:show="showStartTimePicker"
          destroy-on-close
          position="bottom"
        >
          <van-time-picker
            v-model="startTimePickerDefaultValue"
            title="选择时间"
            :columns-type="['hour', 'minute', 'second']"
            @confirm="onStartTimeConfirm"
            @cancel="showStartTimePicker = false"
          />
        </van-popup>
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="formData.endDate"
          name="endDate"
          label="结束日期"
          placeholder="2026-08-13"
          is-link
          readonly
          :rules="rules.endDate"
          @click="showEndDatePicker = true"
        >
        </van-field>
        <van-popup
          v-model:show="showEndDatePicker"
          destroy-on-close
          position="bottom"
        >
          <van-date-picker
            v-model="endDatePickerDefaultValue"
            title="选择日期"
            @confirm="onEndDateConfirm"
            @cancel="showEndDatePicker = false"
          />
        </van-popup>
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="formData.endTime"
          name="endTime"
          label="结束时间"
          placeholder="12:30:00"
          is-link
          readonly
          :rules="rules.endTime"
          @click="showEndTimePicker = true"
        >
        </van-field>
        <van-popup
          v-model:show="showEndTimePicker"
          destroy-on-close
          position="bottom"
        >
          <van-time-picker
            v-model="endTimePickerDefaultValue"
            title="选择时间"
            :columns-type="['hour', 'minute', 'second']"
            @confirm="onEndTimeConfirm"
            @cancel="showEndTimePicker = false"
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
import { useRouter, useRoute } from 'vue-router'
import { ref, toRaw } from 'vue'
import { medicineTaskStore, medicineStore } from '../../stores/medicineStore'
import { checkDate, checkTime, formatDateTime4, getId } from '../../utils/tools'
import SelectWeek from '../../components/Medicine/SelectWeek.vue'

/* 路由与仓库 */
const router = useRouter()
const route = useRoute()
const yprwStore = medicineTaskStore()
const ypStore = medicineStore()

/* 展示组件 */
const showNoticeTimePicker = ref(false) // 提醒时间选择器
const showMedicinePicker = ref(false) // 药品选择器
const showStartDatePicker = ref(false) // 开始日期选择器
const showStartTimePicker = ref(false) // 开始时间选择器
const showEndDatePicker = ref(false) // 结束日期选择器
const showEndTimePicker = ref(false) // 结束时间选择器

/* 数据 */
const planId = route.query.planId // 计划id
const title = planId === '' ? '添加计划' : '编辑计划' // 标题
// 打开选择器时的默认选项
const noticeTimePickerDefaultValue = ref([]) // 提醒时间选
const medicinePickerDefaultValue = ref([]) // 药品
const startDatePickerDefaultValue = ref([]) // 开始日期
const startTimePickerDefaultValue = ref([]) // 开始日期
const endDatePickerDefaultValue = ref([]) // 结束日期
const endTimePickerDefaultValue = ref([]) // 结束日期

const selectedMedicineName = ref('') // 选则的定药品名称
let medicinePickerColums = [] // 药品选择器的选项
// 表单数据
const formData = ref({
  planId: '',
  name: '',
  noticeTime: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  implementWeek: '',
  message: '',
  medicineTypeId: '',
  takeMedicineNumber: '',
  normsUnit: ''
})
let formDataCopy = {} // 表单数据副本，用于提交时对比是否修改了
const rules = {
  name: [{ required: true, message: '不能为空' }],
  noticeTime: [
    {
      validator: (value) => {
        if (value === '') return '不能为空'
        else {
          const result = checkTime(value)
          if (result === '时间格式不对') return '时间必须为xx:xx:xx格式'
          else if (result === '时间不合法') return '时间不合法'
        }
      }
    }
  ],
  startDate: [
    {
      validator: (value) => {
        if (value === '') return '不能为空'
        else {
          const result = checkDate(value)
          if (result === '日期格式不对') return '时间必须为xxxx-xx-xx格式'
          else if (result === '日期不合法') return '日期不合法'
        }
      }
    }
  ],
  startTime: [
    {
      validator: (value) => {
        if (value === '') return '不能为空'
        else {
          const result = checkTime(value)
          if (result === '时间格式不对') return '时间必须为xx:xx:xx格式'
          else if (result === '时间不合法') return '时间不合法'
        }
      }
    }
  ],
  endDate: [
    {
      validator: (value) => {
        if (value === '') return '不能为空'
        else {
          const result = checkDate(value)
          if (result === '日期格式不对') return '时间必须为xxxx-xx-xx格式'
          else if (result === '日期不合法') return '日期不合法'
        }
      }
    }
  ],
  endTime: [
    {
      validator: (value) => {
        if (value === '') return '不能为空'
        else {
          const result = checkTime(value)
          if (result === '时间格式不对') return '时间必须为xx:xx:xx格式'
          else if (result === '时间不合法') return '时间不合法'
        }
      }
    }
  ],
  message: [{ required: true, message: '不能为空' }],
  takeMedicineNumber: [
    { required: true, message: '不能为空' },
    {
      validator: (value) => {
        if (Number(value) < 0 || !Number(value)) return '剂量必须为大于零的数字'
      }
    }
  ],
  implementWeek: [
    {
      validator: () => {
        if (formData.value.implementWeek === '') return '不能为空'
      }
    }
  ],
  message: [{ required: true, message: '不能为空' }],
  takeMedicineNumber: [
    { required: true, message: '不能为空' },
    {
      validator: (value) => {
        if (Number(value) < 0 || !Number(value)) return '剂量必须为大于0的数字'
      }
    }
  ],
  medicineTypeId: [{ required: true, message: '不能为空' }]
}

/* 功能函数 */
// 初始化
function init() {
  if (planId !== '') {
    const data = yprwStore.medicinePlan.filter((plan) => plan.planId === planId)[0]
    const startDate = data.startTime.split(' ')[0]
    const startTime = data.startTime.split(' ')[1]
    const endDate = data.endTime.split(' ')[0]
    const endTime = data.endTime.split(' ')[1]
    noticeTimePickerDefaultValue.value = data.noticeTime.split(':')
    startDatePickerDefaultValue.value = startDate.split('-')
    startTimePickerDefaultValue.value = startTime.split(':')
    endDatePickerDefaultValue.value = startDate.split('-')
    endTimePickerDefaultValue.value = startTime.split(':')
    // 药品
    medicinePickerColums = ypStore.remainingMedicineData.map((item) => {
      return { text: item.name, value: item.typeid }
    })
    medicinePickerDefaultValue.value = [data.medicineTypeId]
    selectedMedicineName.value = medicinePickerColums.filter(item => data.medicineTypeId === item.value)[0].text
    formData.value = { ...data, startDate, startTime, endDate, endTime }
  } else {
    const now = formatDateTime4(new Date())
    noticeTimePickerDefaultValue.value = now.split(' ')[1].split(':')
    startDatePickerDefaultValue.value = now.split(' ')[0].split('-')
    startTimePickerDefaultValue.value = now.split(' ')[1].split(':')
    endDatePickerDefaultValue.value = now.split(' ')[0].split('-')
    endTimePickerDefaultValue.value = now.split(' ')[1].split(':')
    // 药品
    medicinePickerColums = ypStore.remainingMedicineData.map((item) => {
      return { text: item.name, value: item.typeid }
    })
    medicinePickerDefaultValue.value = medicinePickerColums.length === 0 ? [] : [medicinePickerColums[0].value]
    selectedMedicineName.value = medicinePickerColums.length === 0 ? '' : medicinePickerColums[0].text
    formData.value.medicineTypeId = medicinePickerColums.length === 0 ? '' : medicinePickerColums[0].value
  }
  
  
  // 药品计量单位
  // formData.value.normsUnit = ypStore.remainingMedicineData[0].normsUnit
  formData.value.normsUnit =
    ypStore.remainingMedicineData.length === 0
      ? ypStore.normsUnit[0]
      : ypStore.remainingMedicineData[0].normsUnit
  // 复制一份初始化后的表单数据
  formDataCopy = structuredClone(toRaw(formData.value))
}
// 确认提醒时间选择器
function onNoticeTimeConfirm({ selectedValues }) {
  formData.value.noticeTime = selectedValues.join(':')
  noticeTimePickerDefaultValue.value = selectedValues
  showNoticeTimePicker.value = false
}
// 选中的星期
function onSelectWeek(values) {
  formData.value.implementWeek = values.map((item) => '星期' + item).join('、')
}
// 药品选择器
function onMedicineConfirm({ selectedOptions }) {
  if (selectedOptions[0] !== undefined) {
    formData.value.medicineTypeId = selectedOptions[0].value
    selectedMedicineName.value = selectedOptions[0].text
    medicinePickerDefaultValue.value = [selectedOptions[0].value]
    formData.value.normsUnit = ypStore.remainingMedicineData.filter(
      (item) => item.typeid === formData.value.medicineTypeId
    )[0].normsUnit
  }
  showMedicinePicker.value = false
}
// 开始日期选择器
function onStartDateConfirm({ selectedValues }) {
  formData.value.startDate = selectedValues.join('-')
  startDatePickerDefaultValue.value = selectedValues
  showStartDatePicker.value = false
}
// 开始时间选择器
function onStartTimeConfirm({ selectedValues }) {
  formData.value.startTime = selectedValues.join(':')
  startTimePickerDefaultValue.value = selectedValues
  showStartTimePicker.value = false
}
// 结束日期选择器
function onEndDateConfirm({ selectedValues }) {
  formData.value.endDate = selectedValues.join('-')
  endDatePickerDefaultValue.value = selectedValues
  showEndDatePicker.value = false
}
// 结束时间选择器
function onEndTimeConfirm({ selectedValues }) {
  formData.value.endTime = selectedValues.join(':')
  endTimePickerDefaultValue.value = selectedValues
  showEndTimePicker.value = false
}
// 提交表单
async function onSubmit() {
  let data = { ...formData.value }
  data.startTime = formData.value.startDate + ' ' + formData.value.startTime
  data.endTime = formData.value.endDate + ' ' + formData.value.endTime

  delete data.startDate
  delete data.endDate

  if (planId !== '') {
    // 是否修改了表单数据
    const isEditFormData =
      JSON.stringify(formData.value) === JSON.stringify(formDataCopy)

    if (!isEditFormData) {
      showConfirmDialog({
        message: '内容已修改，是否保存？'
      })
        .then(async () => {
          const result = await yprwStore.updatePlan(
            data.planId,
            data.name,
            data.noticeTime,
            data.startTime,
            data.endTime,
            data.implementWeek,
            data.message,
            data.medicineTypeId,
            data.takeMedicineNumber,
            data.normsUnit
          )
          if (result === '更新成功') {
            showToast({ message: '更新成功', type: 'success' })
            router.back()
          } else
            showToast({ message: '更新失败', type: 'fail', duration: 2000 })
        })
        .catch(() => {})
    } else {
      showDialog({ message: '只有修改了内容，才能保存' })
    }
  } else {
    data.planId = getId()
    const result = await yprwStore.addPlan(
      data.planId,
      data.name,
      data.noticeTime,
      data.startTime,
      data.endTime,
      data.implementWeek,
      data.message,
      data.medicineTypeId,
      data.takeMedicineNumber,
      data.normsUnit
    )
    if (result === '添加成功') {
      showToast({ message: '添加成功', type: 'success' })
      router.back()
    } else showToast({ message: '添加失败', type: 'fail', duration: 2000 })
  }
}
// 重置表单
function resetForm() {}
init()
</script>
<style scoped>
.form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>
