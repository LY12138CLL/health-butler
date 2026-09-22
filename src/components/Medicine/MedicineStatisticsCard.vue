<!-- 统计 药品统计 -->
<template>
  <div class="card">
    <div class="row1">
      <van-icon class-prefix="my-icon" name="jiaonang" size="0.6rem" color="#ff8a00" />
      <span class="title">药品统计</span>
    </div>
    <div class="row2">
      <div class="left">
        <span @click="router.push('/medicinemanage')">总费用</span>
        <span class="total-price">
          <!-- 整数部分 -->
          <van-rolling-text class="my-rolling-text" v-if="totalPriceInteger" :start-num="0" :target-num="totalPriceInteger"/>
          <span class="text" v-else>0</span>
          <span class="dot" v-if="totalPriceDecimal">.</span>
          <!-- 小数部分 -->
          <van-rolling-text v-if="totalPriceDecimal" class="my-rolling-text" :start-num="0" :target-num="totalPriceDecimal"/>
          <span class="unity">元</span>
        </span>
      </div>
      <div class="right">
        <span @click="router.push('/takemanage')">总服药记录</span>
        <span class="total-record">
          <van-rolling-text class="my-rolling-text" v-if="totalRecord" :start-num="0" :target-num="totalRecord"/>
          <span class="text" v-else>0</span>
          <span class="unity">条</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed,ref } from 'vue'
import { useRouter } from 'vue-router'
/* 路由 */
const router = useRouter()

/* 数据 */
const props = defineProps({
  totalPrice: Number,
  totalRecord: Number
})
// 总价格整数部分
const totalPriceInteger = computed(() => {
    return Number(String(props.totalPrice).split('.')[0])
})
// 总价格小数部分
const totalPriceDecimal = computed(() => {
    return Number(String(props.totalPrice).split('.')[1] || 0)
})
</script>

<style scoped>
/* 原有样式保持不变，新增小数点样式 */
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
}
.row1 {
  display: flex;
  align-items: center;
}
.title {
  font-size: 15px;
  font-weight: bold;
}
.row2 {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  display: flex;
  flex-direction: column;
  color: #3498db;
  font-size: 14px;
}
.unity {
  color: #000000;
}
.dot {
  color: #ff8a00;
  font-weight: bold;
  font-size: 30px;
  margin: 0 2px;
}

.my-rolling-text {
  --van-rolling-text-color: #ff8a00;
  --van-rolling-text-font-size: 30px;
  --van-rolling-text-item-width: 20px;
  font-weight: bold;
  /* 固定每个数字位的宽度，避免位数变化时抖动 */
  --van-rolling-text-item-width: 20px;
}
.text{
  color: #ff8a00;
  font-size: 30px;
  font-weight: bold;
  line-height: 40px;
}
</style>