<!-- 统计页面中的血压统计卡片 -->
<template>
    <div id="bp">
        <div class="title">
            <span style="color: red;">❤</span>
            <span>血压统计</span>
        </div>
        <div class="body">
            <div class="chart-wrap">
                <Doughnut :data="chartData" :options="chartOptions" :plugins="centerTextPlugins" />
            </div>
            <div class="indicator-list">
                <div class="indicator-item">
                    <div class="indicator-item-left">
                        <span class="dot dot-normal"></span>
                        <span class="label">正常</span>
                    </div>
                    <div class="indicator-item-right">
                        <span class="amount">{{ bpData.normal }}</span>
                        <span class="percentage">{{precentage.normal}}%</span>
                    </div>
                    
                </div>
                <div class="indicator-item">
                    <div class="indicator-item-left">
                        <span class="dot dot-height-bp"></span>
                        <span class="label">高血压</span>
                    </div>
                    <div class="indicator-item-right">
                        <span class="amount">{{ bpData.high }}</span>
                        <span class="percentage">{{precentage.hight}}%</span>
                    </div>
                    
                </div>
                <div class="indicator-item">
                    <div class="indicator-item-left">
                        <span class="dot dot-low-bp"></span>
                        <span class="label">低血压</span>
                    </div>
                    <div class="indicator-item-right">
                        <span class="amount">{{ bpData.low }}</span>
                        <span class="percentage">{{precentage.low}}%</span>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="aver">
                <span class="label">平均</span>
                <span class="record">{{bpData.avgBp.sbp}}/{{bpData.avgBp.dbp}}</span>
                <span class="label">mmHg</span>
            </div>
            <div class="details">
                <span>📈</span>
                <span @click="router.push('/bphome')">查看详情</span>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement } from 'chart.js'
import { useRouter } from 'vue-router'
import {calcPercentages} from "../../utils/tools"

/* 路由 */
const router = useRouter()
/* 数据 */
// 接收父组件数据
const props = defineProps({
    bpData: Object
})
// 血压记录占比
const precentage = computed(() => {
    const bfbArr = calcPercentages(props.bpData.total,[props.bpData.normal,props.bpData.high,props.bpData.low])
    return {
        normal: bfbArr[0],
        hight: bfbArr[1],
        low: bfbArr[2]
    }
})

/* 甜甜圈图 */
// 颜色配置
const DoughnutColors = {
    normal: '#2d9cdb',
    high: '#eb5757',
    low: '#f2994a',
}
// 注册必需的 Chart.js 组件（甜甜圈图需要 ArcElement）
ChartJS.register(ArcElement)
// 图表数据
const chartData = {
    datasets: [
      {
        data: [props.bpData.normal,props.bpData.high,props.bpData.low],
        backgroundColor: [DoughnutColors.normal,DoughnutColors.high,DoughnutColors.low],
        borderWidth: 0,
        hoverOffset: 2,
      }
    ]
  }
// 图表配置（设置环形宽度等）
const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%', // 环形中心的空心大小
    interaction: {enabled: false},
}
// 图表自定义插件（在中心位置添加文字）
const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
        const { ctx, chartArea: { left, top, right, bottom } } = chart
        const centerX = (left + right) / 2
        const centerY = (top + bottom) / 2

        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const textColor = isDark ? '#e8edf2' : '#1a2a3a'
        const subColor = isDark ? '#8aa0b8' : '#8a9aa8'

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 总数（大号）
        ctx.font = `bold ${18}px -apple-system, BlinkMacSystemFont, sans-serif`
        ctx.fillStyle = textColor
        ctx.fillText(props.bpData.total, centerX, centerY - 10)

        // “总记录”小字
        ctx.font = `${12}px -apple-system, BlinkMacSystemFont, sans-serif`
        ctx.fillStyle = subColor
        ctx.fillText('总记录', centerX, centerY + 18)

        ctx.restore()
    }
}
// 插件以数组形式传入组件
const centerTextPlugins = [centerTextPlugin]
</script>
<style scoped>
#bp {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    font-size: 14px;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
}
.title{
    font-size: 15px;
    font-weight: 600;
}
.record{
    font-weight: 600;
}
.aver{
    display: flex;
    justify-content: space-between;
    gap: 4px;
}
.body{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}
.chart-wrap{
    width: 120px;
}
.indicator-list{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 10px;
}
.indicator-item{
    display: flex; 
    gap: 20px;
}
.indicator-item-left{
    width: 70px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.indicator-item-right{
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;                      /* 撑满右侧空间 */
    justify-content: space-between; /* 两端对齐 */
}
.amount{
    font-weight: 600;
}
.percentage{
    color: #6b7a8a;
}
.label{
    font-size: 13px;
    color: #6b7a8a;
}



.bottom{
    display: flex;
    justify-content: space-between;
}

.bottom>.details{
    color: #3498db;
}
.dot{
    width: 10px; /* 圆的宽度 */
    height: 10px; /* 圆的高度 */
    border-radius: 50%; /* 使元素成为圆形 */
    display: inline-block;
}
.dot-normal{
    background-color: #3498db;
}
.dot-height-bp{
    background-color: #eb5757;
}
.dot-low-bp{
    background-color: #f2994a;
}
</style>