<!-- 
 添加分组
 -->
<template>
    <van-dialog 
        v-model:show="show" 
        show-cancel-button 
        :before-close="beforeClose"
    >
        <van-cell-group inset>
            <van-field
             v-model="group_name" 
             placeholder="请输入分组名称" 
             input-align="left"
             :error-message="error_info"
             />
        </van-cell-group>
    </van-dialog>

</template>
<script setup>
import { ref } from 'vue'


/* 展示组件 */
const show = ref(true) // 展示当前组件


/* 组件通信 */
const emit = defineEmits(['save','cancel']) // 子传父事件名称

/* 数据 */
const group_name = ref("") // 分组名称
const error_info = ref("") // 错误提示信息


/* 功能函数 */
// 关闭弹窗前的回调函数，用于控制是否关闭弹窗，返回true（关闭），false（不关闭），action是点击了确认、取消哪个按钮。
function beforeClose(action) {
    if (action === "confirm") {
        // 点击了确认按钮
        if (group_name.value === "") {
            error_info.value = "分组名称不能为空"
            return false
        }
        else {
            emit('save',group_name.value)
        }
    }
    else {
        // 点击了取消按钮
        emit('cancel')
    }
}
</script>
<style scoped>
 :deep(input){
    border: 2px solid #7b61ff;
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    font-size: 16px;
 }
</style>