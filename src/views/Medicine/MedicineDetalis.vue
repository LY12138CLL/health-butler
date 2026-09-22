<!-- 某个药品的详情记录 -->
<template>
    <div id="medicine-details">
        <van-nav-bar :title="title" @click-left="router.back()" @click-right="!showMoreOptionPopover" safe-area-inset-top placeholder fixed>
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
        <van-sticky offset-top="1.22639rem">
            <div class="search">
                    <van-search
                        v-model="searchValue"
                        show-action
                        placeholder="按名称/有效期/状态/备注搜索"
                        @search="onSearch"
                    >
                    <template #action>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>
            </div>
        </van-sticky>
        <div class="records">
            <MedicineRecord v-for="data in showRecord" :name="data.name" :norms="data.norms" :normsUnit="data.normsUnit" :expirationDate="data.expirationDate" :manufacturer="data.manufacturer" :notes="data.notes" :key="data.medicineId" @edit="updateMedicine(data.medicineId)" @delete="deteteMedicine(data.medicineId,data.typeid)"/>
        </div>
        <!-- 加减库存 -->
        <van-dialog
            class="stockDialog" 
            v-model:show="showZjStockDialog" 
            show-cancel-button 
            :before-close="updateZjStock"
        >
            <van-stepper v-model="ZjStockCount" :min="-(normsNumber-1)" :max="normsNumber-1" :before-change="onStepperBeforeChange" />
        </van-dialog>
        <div class="more">
            <span v-if="filteredRecords.length > showRecord.length" style="color: #1989fa;" @click="getMoreRecord">点击加载更多</span>
        </div>
    </div>
</template>
<script setup>
import { useRouter,useRoute } from 'vue-router'
import { ref,computed } from 'vue'
import MedicineRecord from "../../components/Medicine/MedicineRecord.vue"
import { medicineStore,medicineTaskStore } from '../../stores/medicineStore.js'
import { showToast } from 'vant'
import {isExpired} from "../../utils/tools.js"

/* 展示组件 */
const showMoreOptionPopover = ref(false) // 更多下拉框
const showZjStockDialog = ref(false)

/* 路由与仓库 */
const router = useRouter()
const route = useRoute()
const ypStore = medicineStore()
const yprwStore = medicineTaskStore()

// 路由传递的参数
const name = route.query.name // 药品名称
const typeid = route.query.typeid // 药品分类id


/* 数据 */
const searchValue = ref('') // 搜索栏输入的关键字
const defaultNumber = 10 // 加载的条数
const prevEndIndex = ref(0) // 上次提取的记录结束位置索引
const searchQuery = ref("") // 保存真正用来搜索的关键字
// 当前类型药品的规格数量
const normsNumber = parseInt(ypStore.remainingMedicineData.find(item => item.typeid === typeid)?.norms) || 0
const ZjStockCount = ref(0) // 增减的库存数量
// 所有药品
const allDeticineData = computed(() => {
    if (name === "全部药品") {
        return ypStore.medicineData.slice().sort((a, b) => a.expirationDate.localeCompare(b.expirationDate))
    }
    else {
        return ypStore.medicineData.filter(item => item.typeid === typeid).slice().sort((a, b) => a.expirationDate.localeCompare(b.expirationDate))
    }
})
// 搜索后的记录
const filteredRecords = computed(() => {
    // 如果搜索关键字为空，则返回排序后的记录
    if (!searchQuery.value.trim()) return allDeticineData.value
    // 去除关键字额空格
    const q = searchQuery.value.trim()
    // 返回过滤后的结果
    return allDeticineData.value.filter(r => {
        // 计算该药品是否过期
        const status = isExpired(r.expirationDate)
        // 将需要检索的字段拼接为字符串用空格分开
        const full = (r.expirationDate || '') + ' ' + (r.name || '') + ' ' + (r.notes || '')+ ' ' + (r.groupName || '' ) + (status || '' )
        // 判断要检索的字段中是否包含搜索关键字。
        // includes方法用于判断数组是否包含某个元素，或字符串是否包含某个子串，找到则返回true，否则返回false
        return full.includes(q)
    })
})
// 页面展示的记录
const showRecord = computed(() => {
    return filteredRecords.value.slice(0, prevEndIndex.value)
})
// 标题
const title = computed(() => {
    return name + " " + allDeticineData.value.length + "盒"
})
// 更多操作菜单选项
const moreOptionActions = computed(() => {
    if (name === "全部药品") {
        return [
                { text: '添加药品', icon: 'records-o' },
                { text: '删除所有', icon: 'delete-o' },
            ]
    }
    else {
    return [
            { text: '添加药品', icon: 'records-o' },
            { text: '增减库存', icon: 'edit'},
            { text: '删除所有', icon: 'delete-o' },
        ]
    }
})


/* 功能函数 */
// 更多选择
function onSelectMoreOption(action) {
    const text = action.text
    if (text === "添加药品") {
        addMedicine()
    }
    else if (text === "删除所有") {
        allDeleteMedicine()
    }
    else if (text === "增减库存") {
        showZjStockDialog.value = true
        ZjStockCount.value = 0
    }   
}
// 更新药品信息
function updateMedicine(medicineId) {
    router.push({
        path: '/addeditmedicine',
        query: {medicineId: medicineId}
    })
}
// 删除药品
async function deteteMedicine(medicineId,typeid) {
    const result = await ypStore.deleteMedicine(medicineId)
    if (result === "删除成功") {
        // 判断是否还存在本类型的药品
        const filterResult = allDeticineData.value.filter(item => item.typeid === typeid)
        if (filterResult.length === 0) {
            // 删除该药品分类
            const deleteResult = await ypStore.deleteTypeRemainingMedicine(typeid)
            const deleteResult2 = await yprwStore.deleteMedicineTypeIdTask(typeid)
            const deleteResult3 = await yprwStore.deleteMedicineTypeIdPlan(typeid)
            if (deleteResult === "删除失败" && deleteResult2 === "删除成功" && deleteResult3 === "删除成功") {
                showToast({message:"分类删除失败",type:'fail', duration:2000})
                return
            }
            else router.back()
        }
        else {
            // 修改剩余药品数量，减去一盒药品的norms
            // 获取一盒药原本的norms
            const oldNorms = ypStore.remainingMedicineData.filter(item => item.typeid === typeid)[0].norms
            await ypStore.updateRemainingMedicine(typeid, parseInt(-oldNorms))
        }
        showToast({message:result,type:'success'})
    } else{
        showToast({message:result,type:'fail', duration:2000})
    }
}
// 全部删除
function allDeleteMedicine() {
    showConfirmDialog({
        title: '删除警告',
        message:'删除药品信息后，所有关于该药品的计划与未执行的任务将被清除，是否继续？',
        }).then(async () => {
            const result = await ypStore.deleteTypeMediciine(typeid)
            const result2 = await ypStore.deleteTypeRemainingMedicine(typeid)
            const result3 = await yprwStore.deleteMedicineTypeIdTask(typeid)
            const result4 = await yprwStore.deleteMedicineTypeIdPlan(typeid)
            if (result === "删除成功" && result2 === "删除成功" && result3 === "删除成功" && result4 === "删除成功") {
                router.back()
                showToast({message:"删除成功",type:'success'})
            }
            else showToast({message:"删除失败",type:'fail', duration:2000})
        }).catch(() => {
            // on cancel
        })
}
// 添加药品
async function addMedicine() {
    router.push({
        path: '/addeditmedicine',
        query: {medicineId: ''}
    })
}
// 修改库存
async function updateZjStock(action) {
    if (action === "confirm") {
        const total = Number(ypStore.remainingMedicineData.filter(item => item.typeid === typeid)[0].total)
        const calculateValue = total + Number(ZjStockCount.value)
        if (calculateValue <= 0) {
            showDialog({ message: "数量不能大于等于库存总数" })
            return false
        }
        else if (parseInt(ZjStockCount.value) === 0) {
            showDialog({ message: "增减的数量不能为0" })
            return false
        }
        else if (parseInt(ZjStockCount.value) >= normsNumber && parseInt(ZjStockCount.value) <= normsNumber) {
            showDialog({ message: "增减的数量不能等于或超过一盒的规格" })
            return false
        }
        else {
            const result = await ypStore.updateRemainingMedicine(typeid, ZjStockCount.value)
            if (result === "修改成功") {
                showToast({message: "修改成功", type: 'success'})
                return true
            }
            else showToast({message: "修改失败", type: 'fail'})
        }
    }
    else {
        return true
    }
    
}
// 限制输入的增减数量
function onStepperBeforeChange(value) {
    if(Number(value) >= normsNumber || Number(value) <= -normsNumber) return false
    else return true
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
// 初始化加载一次记录
getMoreRecord()
</script>
<style scoped>
.records{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}
:deep(.stockDialog){
    border-radius: 10px;
    
 }
 :deep(.van-dialog__content) {
    display: flex;
    justify-content: center;
    padding: 30px 0;
 }
 /* 覆盖 van-stepper 内部输入框宽度 */
:deep(.van-stepper__input) {
  width: 80px;   /* 这里写 px，postcss-pxtorem 会自动转 rem */
  height: 34px;
  font-size: 18px;
}

/* 覆盖加减按钮尺寸 */
:deep(.van-stepper__minus),
:deep(.van-stepper__plus) {
  width: 34px;
  height: 34px;

  /* 如果需要调整内部图标大小也可一并覆盖 */
}
.search{
    /* margin-top: 10px; */
    padding-top: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
    background-color: #f5f7fa;
}
.more{
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-size: 18px;
}
</style>