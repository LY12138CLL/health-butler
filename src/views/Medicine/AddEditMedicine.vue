<template>
    <div class="add-edit-medcine">
        <van-nav-bar :title="title" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <van-form @submit="onSubmit" class="form">
                <van-cell-group inset>
                    <van-field
                        v-model="formData.name"
                        name="name"
                        label="药品名称"
                        placeholder="优甲乐"
                        :rules="rules.name"
                    />
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.norms"
                        name="norms"
                        label="规格"
                        placeholder="28"
                        type="digit"
                        :rules="rules.norms"
                    />
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.normsUnit"
                        is-link
                        readonly
                        label="规格单位"
                        placeholder="片"
                        @click="showUnitPicker = true"
                        :rules="rules.normsUnit"
                        />
                    <van-popup v-model:show="showUnitPicker" destroy-on-close round position="bottom">
                        <van-picker
                            :model-value="defalutUnitPickValue"
                            :columns="unitArr"
                            @cancel="showUnitPicker = false"
                            @confirm="onSelectUnit"
                        />
                    </van-popup>
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.manufacturer"
                        name="manufacturer"
                        label="生产厂家"
                        placeholder="德国默认"
                        :rules="rules.manufacturer"   
                    />
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.productionDate"
                        name="productionDate"
                        label="生产日期"
                        placeholder="2026-08-16"
                        is-link
                        readonly
                        :rules="rules.productionDate"
                        @click="showProductionDatePicker = true"
                    />
                    <van-popup v-model:show="showProductionDatePicker" destroy-on-close position="bottom">
                        <van-date-picker
                            v-model="productionDatePickerDefaultValue"
                            title="选择日期"
                            @confirm="onProductionDateConfirm"
                            @cancel="showProductionDatePicker = false"
                        />
                    </van-popup>
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.expirationDate"
                        name="expirationDate"
                        label="有效期"
                        placeholder="2027-08-16"
                        is-link
                        :rules="rules.expirationDate"
                        readonly
                        @click="showExpirationDatePicker = true"
                    />
                    <van-popup v-model:show="showExpirationDatePicker" destroy-on-close position="bottom">
                        <van-date-picker
                            v-model="expirationDatePickerDefaultValue"
                            title="选择日期"
                            @confirm="onExpirationDateConfirm"
                            @cancel="showExpirationDatePicker = false"
                        />
                    </van-popup>
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.price"
                        name="price"
                        label="价格"
                        placeholder="1"
                        type="number"
                        :min="1"
                        :rules="rules.price"  
                    >
                        <template #extra>
                            <span>元</span>
                        </template>
                    </van-field>
                </van-cell-group>
                <van-cell-group inset v-if="title === '添加药品'">
                    <van-field
                        v-model="count"
                        name="count"
                        label="数量"
                        placeholder="1"
                        type="digit"
                        :min="1"
                        :rules="rules.count"  
                    />
                </van-cell-group>
                <van-cell-group inset>
                    <van-field
                        v-model="formData.notes"
                        name="notes"
                        label="备注"
                        placeholder="饭后服用"  
                    />
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
import {ref, toRaw,onMounted} from "vue"
import { medicineStore } from '../../stores/medicineStore'
import {formatDateTime4,getId,createName} from "../../utils/tools"

/* 路由与仓库 */
const router = useRouter()
const route = useRoute()
const ypStore = medicineStore()

/* 展示组件 */
const showUnitPicker = ref(false) // 选择规格单位
const showProductionDatePicker = ref(false) // 选择生产日期
const showExpirationDatePicker = ref(false)


/* 数据 */
const medicineId = route.query.medicineId // 药品id
const title = medicineId === "" ? "添加药品" : "编辑药品" // 标题
// 打开选择器时的默认值
const defalutUnitPickValue = ref([]) // 单位
const productionDatePickerDefaultValue = ref([]) // 生产日期
const expirationDatePickerDefaultValue = ref([])

let unitArr = [] // 规格单位选择器的选项
let count = ref(1) // 添加药品时的盒数
 
// 表单数据
const formData = ref({
    medicineId: '',
    name: '',
    norms: '',
    normsUnit: '',
    manufacturer: '',
    productionDate: '',
    expirationDate: '',
    notes: '',
    typeid: '',
    price: ''
})
let formDataCopy = {} // 表单数据副本，用于提交时对比是否修改了
// 表单校验规则
const rules = {
    name: [{required: true, message: "不能为空"}],
    norms: [{required: true, message: "不能为空"}],
    normsUnit: [{required: true, message: "不能为空"}],
    manufacturer: [{required: true, message: "不能为空"}],
    productionDate: [{required: true, message: "不能为空"}],
    expirationDate: [
        {required: true, message: "不能为空"},
        {validator: (value) => {
            if (new Date(value).setHours(0, 0, 0, 0) >= new Date(formData.value.productionDate).setHours(0, 0, 0, 0)) {
                return true
            }
            else {
                return "有效期不能小于生产日期"
            }
        }}
    ],
    count: [{required: true, message: "不能为空"}],
    price: [
    { required: true, message: '不能为空' },
    {
      validator: (value) => {
        if (Number(value) < 0 || !Number(value)) return '价格必须大于0'
      }
    }
  ],
}

/* 功能函数 */
// 初始化
function init() {
    // 规格单位
    unitArr = ypStore.normsUnit.map(item => {
        return {text: item,value:item}
    })
    if (medicineId !== "") {
        const data = ypStore.medicineData.filter(item => item.medicineId === medicineId)[0]
        // 生产日期
        formData.value.productionDate = data.productionDate
        productionDatePickerDefaultValue.value = data.productionDate.split('-')
        // 有效期
        formData.value.expirationDate = data.expirationDate
        expirationDatePickerDefaultValue.value = data.expirationDate.split('-')
        // 单位
        defalutUnitPickValue.value = [data.normsUnit]
        formData.value = {...data}
    }
    else {
        const now = formatDateTime4(new Date)
        productionDatePickerDefaultValue.value = now.split(' ')[0].split('-')
        expirationDatePickerDefaultValue.value = now.split(' ')[0].split('-')
        defalutUnitPickValue.value = unitArr.length ? [] : unitArr[0]
    }
    
    // 复制一份初始化后的表单数据
    formDataCopy = structuredClone(toRaw(formData.value))
}
// 单位选择器
function onSelectUnit({ selectedValues }) {
    defalutUnitPickValue.value = selectedValues
    formData.value.normsUnit = selectedValues[0]
    showUnitPicker.value = false
}
// 生产日期选择器
function onProductionDateConfirm({ selectedValues }) {
    formData.value.productionDate = selectedValues.join('-')
    productionDatePickerDefaultValue.value = selectedValues
    showProductionDatePicker.value = false
}
// 有效期选择器
function onExpirationDateConfirm({ selectedValues }) {
    formData.value.expirationDate = selectedValues.join('-')
    expirationDatePickerDefaultValue.value = selectedValues
    showExpirationDatePicker.value = false
}
// 添加药品
async function addMedicine() {
    // 处理分类
    const {name, norms, normsUnit, manufacturer,typeid} = formData.value // 筛选药品分类的必然参数
    // 判断修改后的数据在分类中是否存在
    let newTypeid = '' // 修改后的数据所属分类id
    const filterResult = ypStore.medicineData.filter(item => item.name === name && item.norms === norms && item.normsUnit === normsUnit && item.manufacturer === manufacturer)
    if (filterResult.length > 0) {
        // 有对应的分类
        newTypeid = filterResult[0].typeid // 获取所属分类id
        // 将该盒药品的规格数量添加到该分类的总数中
        await ypStore.updateRemainingMedicine(newTypeid, parseInt(norms) * Number(count.value))
    }
    else {
        // 没有对应分类，则创建分类并将该盒药品信息添加到其中
        newTypeid = getId() // 生成分类id
        const total = parseInt(norms)  * Number(count.value)
        const surplus = Number(count.value)+"盒"
        // ypStore.remainingMedicineData.map(item => {
        //     if(item.name === name) {

        //     }
        // })
        const nameArry = ypStore.remainingMedicineData.map(item => item.name)
        const newName = createName(nameArry,name)
        const addResult = await ypStore.addRemainingMedicine(newTypeid,newName,norms,normsUnit,surplus,manufacturer,total)
        if (addResult === "添加失败") {
            showToast({message:"分类添加失败",type:'fail', duration:2000})
            return
        }
    }
    
    let medicineData = []
    for (let i = 0; i < Number(count.value); i++) {
        let formDataCopy2 = structuredClone(toRaw(formData.value))
        formDataCopy2.medicineId = getId()
        medicineData.push(formDataCopy2)
    }
    let successCount = 0
    for (const data of medicineData) {
        data.typeid = typeid
        const result = await ypStore.addMedicine(data.medicineId,data.name,data.norms,data.normsUnit,data.manufacturer,data.productionDate,data.expirationDate,data.notes,newTypeid,data.price)
        if (result === "添加成功") successCount += 1
    }
    if (successCount === Number(count.value)) {
        router.back()
        showToast({message:"添加成功",type:'success'})
    } else{
        let message = ''
        let failCount = Number(count.value) - successCount
        if (successCount === 0) {
            message = "全部添加失败"
        } 
        else{
            message = `添加成功${successCount}个，失败${failCount}个`
        }
        router.back()
        showToast({message:message,type:'fail', duration:2000})
    }
}
// 修改药品
async function updateMedicine() {
    // 处理分类
    const {medicineId, name, norms, normsUnit, manufacturer,productionDate,expirationDate,notes, typeid,price} = formData.value 
    // 判断修改后的数据在分类中是否存在
    let newTypeid = '' // 修改后的数据所属分类id
    const filterResult = ypStore.medicineData.filter(item => item.name === name && item.norms === norms && item.normsUnit === normsUnit && item.manufacturer === manufacturer)
    if (filterResult.length > 0) {
        // 有对应的分类
        newTypeid = filterResult[0].typeid // 获取所属分类id
        // 将该盒药品的规格数量添加到该分类的总数中
        await ypStore.updateRemainingMedicine(newTypeid, parseInt(norms))
    }
    else {
        // 没有对应分类，则创建分类并将该盒药品信息添加到其中
        newTypeid = getId() // 生成分类id
        const total = parseInt(norms)
        const nameArry = ypStore.remainingMedicineData.map(item => item.name)
        const newName = createName(nameArry,name)
        const surplus = "1盒"
        const addResult = await ypStore.addRemainingMedicine(newTypeid,newName,norms,normsUnit,surplus,manufacturer,total)
        if (addResult === "添加失败") {
            showToast({message:"分类添加失败",type:'fail', duration:2000})
            return
        }
    }
    
    // 更新药品信息
    const result = await ypStore.updateMedicine(medicineId, name, norms, normsUnit, manufacturer,productionDate,expirationDate,notes,newTypeid,price)

    // 修改该药品所属的旧分类信息
    // 判断旧分类信息在药品信息中是否还有对应的药品
    const isExtist = ypStore.medicineData.some(item => item.typeid === typeid)
    if (isExtist) {
        // 修改剩余药品数量，减去一盒药品的norms
        // 获取一盒药原本的norms
        const oldNorms = ypStore.remainingMedicineData.filter(item => item.typeid === typeid)[0].norms
        await ypStore.updateRemainingMedicine(typeid, parseInt(-oldNorms))
    }
    else {
        // 将该分类直接删除
        await ypStore.deleteTypeRemainingMedicine(typeid)
        router.back()
    }
    if (result === "更新成功") {
        router.back()
        showToast({message:result,type:'success'})
    } else{
        showToast({message:result,type:'fail', duration:2000})
    }
}
// 提交表单
async function onSubmit() {
    if (medicineId === "") {
        await addMedicine()
    }
    else {
        // 是否修改了表单数据
        const isEditFormData = JSON.stringify(formData.value) === JSON.stringify(formDataCopy)
        if (!isEditFormData) {
            showConfirmDialog({
                message:'内容修改了，是否保存？',
                }).then(async () => {
                    await updateMedicine()
                }).catch(() => {
                    // on cancel
                })
            
        } else {
            showDialog({ message: '只有修改了内容，才能保存' })
        }
    }
}   
// 重置表单
function resetForm() {
    formData.value = formDataCopy
}
init()
// const { keyboardHeight } = useDynamicViewport()
onMounted(() => {
    
})
</script>
<style>
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