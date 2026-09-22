<!-- 选择通知提示音选项 -->
 <template>
    <div class="item">
        <span>{{ name }}</span>
        <van-icon name="success" size="0.5rem" color="#07c160" v-if="isSelect" />
    </div>
 </template>
 <script setup>
/* 数据 */
// 父组件传递的数据
const props = defineProps({
    name: String,
    isSelect: {
        type:Boolean,
        defalut: true
    }
})
</script>
 <style scoped>
.item{
    font-size: 16px;
    background-color: #ffffff;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
}
</style>