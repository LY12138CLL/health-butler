<!-- 展示指定分组或全局记录中的平均、最高、最低血压记录 -->
<template>
    <div class="card" ref="cardRef">
        <div class="left">
            <slot name="title"></slot>
            <!-- 平均 -->
            <div class="average">
                <div class="item_box1">
                    <div class="item_box1_box1">
                        <span class="label">平均&emsp;&emsp;</span>
                        <span class="data sbp">{{ summaryData.averageSbp }}</span>
                        <span class="data">&nbsp;/&nbsp;</span>
                        <span class="data dbp">{{ summaryData.averageDbp }}</span>
                    </div>
                    <div class="item_box1_box2">
                        <span class="data hr"><span style="color: red;">❤</span>{{ summaryData.averageHr }}</span>
                    </div>
                </div>
            </div>
            <!-- 最高 -->
            <div class="supreme">
                <!-- 最高高压 -->
                <div class="max_sbp item">
                    <div class="item_box1">
                        <div class="item_box1_box1">
                        <span class="label">最高高压</span>
                        <span class="data sbp">{{ summaryData.maxSbpRecord.sbp }}</span>
                        <span class="data">&nbsp;/&nbsp;</span>
                        <span class="data dbp">{{ summaryData.maxSbpRecord.dbp }}</span>
                        </div>
                        <div class="item_box1_box2">
                            <span class="data hr"><span style="color: red;">❤</span>{{ summaryData.maxSbpRecord.hr }}</span>  
                        </div>
                    </div>
                    <span class="date">{{ summaryData.maxSbpRecord.dateTime }}</span>
                </div>
                <!-- 最高低压 -->
                <div class="max_dbp item">
                    <div class="item_box1">
                        <div class="item_box1_box1">
                            <span class="label">最高低压</span>
                            <span class="data sbp">{{ summaryData.maxDbpRecord.sbp }}</span>
                            <span class="data">&nbsp;/&nbsp;</span>
                            <span class="data dbp">{{ summaryData.maxDbpRecord.dbp }}</span>
                        </div>
                        <div class="item_box1_box2">
                            <span class="data hr"><span style="color: red;">❤</span>{{ summaryData.maxDbpRecord.hr }}</span>
                        </div>
                    </div>
                    <span class="date">{{ summaryData.maxDbpRecord.dateTime }}</span>
                </div>
            </div>
            <!-- 低压 -->
            <div class="minimum">
                <!-- 最低高压 -->
                <div class="min_sbp item">
                    <div class="item_box1">
                        <div class="item_box1_box1">
                            <span class="label">最低高压</span>
                            <span class="data sbp">{{ summaryData.minSbpRecord.sbp }}</span>
                            <span class="data">&nbsp;/&nbsp;</span>
                            <span class="data dbp">{{ summaryData.minSbpRecord.dbp }}</span>
                        </div>
                        <div class="item_box1_box2">
                            <span class="data hr"><span style="color: red;">❤</span>{{ summaryData.minSbpRecord.hr }}</span>  
                        </div>
                    </div>
                    <span class="date">{{ summaryData.minSbpRecord.dateTime }}</span>
                </div>
                <!-- 最低低压 -->
                <div class="max_dbp item">
                    <div class="item_box1">
                        <div class="item_box1_box1">
                            <span class="label">最低低压</span>
                            <span class="data sbp">{{ summaryData.minDbpRecord.sbp }}</span>
                            <span class="data">&nbsp;/&nbsp;</span>
                            <span class="data dbp">{{ summaryData.minDbpRecord.dbp }}</span>
                        </div>
                        <div class="item_box1_box2">
                            <span class="data hr"><span style="color: red;">❤</span>{{ summaryData.minDbpRecord.hr }}</span>
                        </div>
                    </div>
                    <span class="date">{{ summaryData.minDbpRecord.dateTime }}</span>
                </div>
            </div>
            <!-- 记录时间范围 -->
             <div class="record_time_range">
                <div class="start_time">
                    <span class="label">开始记录时间</span>
                    <span class="date">{{summaryData.starRecordTime}}</span>
                </div>
                <div class="end_time">
                    <span class="label">最新记录时间</span>
                    <span class="date">{{summaryData.endRecordTime}}</span>
                </div>
             </div>
        </div>
        <div class="right">
            <van-tag color="#f3f4f6" text-color="#9bb3d2" class="number">{{ summaryData.totality }}</van-tag>
        </div>

        <!-- ====== 展开/合并按钮 ====== -->
        <button class="toggle-btn" @click="toggleCard">
            {{ isExpanded ? '合并' : '展示' }}
            <span class="arrow" :class="{ rotated: isExpanded }">▼</span>
        </button>
    </div>
</template>

<script setup>
import { ref, toRef, onMounted, nextTick, watch, onUpdated } from 'vue'

/* 组件通信 */
const props = defineProps({
    data: Object,
    isAllRecord:Boolean
})
/* 数据 */
const summaryData = toRef(props, 'data')

/* ====== 自适应折叠高度 ====== */
const cardRef = ref(null)
const averageRef = ref(null)
const isExpanded = ref(false)
const collapsedHeight = ref(props.isAllRecord ? 75: 110)  // 初始占位，实际会动态计算

// 计算折叠高度：平均行底部到卡片顶部 + 按钮占用空间
const calcCollapsedHeight = async () => {
    const el = cardRef.value
    const avgEl = averageRef.value
    if (!el || !avgEl) return

    // 暂时完全展开，以便获取准确位置
    el.style.maxHeight = 'none'
    await nextTick()
    // 强制浏览器重排
    void el.offsetHeight

    const cardRect = el.getBoundingClientRect()
    const avgRect = avgEl.getBoundingClientRect()

    // 平均行底部到卡片顶部的距离（已包含标题高度）
    const avgBottom = avgRect.bottom - cardRect.top
    // 加 1-2px 避免四舍五入截断
    const height = Math.max(avgBottom + 2, 20)
    collapsedHeight.value = height

    // 如果当前处于折叠状态，立即应用新高度
    if (!isExpanded.value) {
        el.style.maxHeight = height + 'px'
    }
}

// 切换展开/合并
const toggleCard = async () => {
    const el = cardRef.value
    if (!el) return

    if (isExpanded.value) {
        // ---- 合并 ----
        el.style.maxHeight = collapsedHeight.value + 'px'
        isExpanded.value = false
    } else {
        // ---- 展开 ----
        // 先暂时无限制，获取完整内容高度
        el.style.maxHeight = 'none'
        await nextTick()
        void el.offsetHeight
        const fullHeight = el.scrollHeight

        // 触发过渡动画：先设回折叠高度，再设为完整高度
        el.style.maxHeight = collapsedHeight.value + 'px'
        void el.offsetHeight
        el.style.maxHeight = fullHeight + 'px'

        isExpanded.value = true
    }
}

// 组件挂载和更新时计算折叠高度
onMounted(async () => {
    await calcCollapsedHeight()
    // 确保初始为折叠状态
    const el = cardRef.value
    if (el) {
        el.style.maxHeight = collapsedHeight.value + 'px'
        el.style.overflow = 'hidden'
    }
    isExpanded.value = false
})

// 在 DOM 更新后重新计算（例如插槽内容变化）
onUpdated(async () => {
    // 只在折叠状态下重新计算，防止展开时误调整
    if (!isExpanded.value) {
        await calcCollapsedHeight()
    }
})

// 监听数据变化（如平均数值改变导致行高变化）
watch(summaryData, async () => {
    if (!isExpanded.value) {
        await calcCollapsedHeight()
    }
}, { deep: true })

// 窗口大小变化时重新计算（如响应式布局导致换行）
window.addEventListener('resize', () => {
    if (!isExpanded.value) {
        calcCollapsedHeight()
    }
})
</script>

<style scoped>
/* ====== 原有样式（完全保留，未作任何修改） ====== */
* {
    margin: 0;
    padding: 0;
}
.card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.max_dbp{
    margin-top: 10px;
}
.item, .item_box1 {
    display: flex;
}
.item {
    flex-direction: column;
}
.item_box1_box1, .item_box1_box2 {
    /* display: inline-block; */
    display: flex;
    align-items: center;
}
.left{
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.item_box1_box1 {
    width: 180px;
}
.label {
    margin-right: 10px;
    font-size: 16px;
}
.data {
    font-size: 15px;
    font-weight: bold;
}
.date {
    font-size: 14px;
    color: #9e9e8b;
}
.sbp {
    color: red;
}
.dbp {
    color: #4f7cff;
}
.hr {
    color: #34c759;
}
.start_time, .end_time {
    display: flex;
    margin-top: 13px;
    align-items: center;
}
.start_time{
    margin-top: 0;
}
.right {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 10px;  
}

/* ====== 新增样式（仅用于展开/合并功能） ====== */
.card {
    position: relative;
    transition: max-height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    overflow: hidden;
}

/* 为“最新记录时间”增加底部间距，避免被按钮遮挡（展开时） */
.record_time_range {
    margin-bottom: 30px;
}

.toggle-btn {
    position: absolute;
    bottom: 6px;
    right: 12px;
    background: #ffffff;
    border: 1px solid #dce3ec;
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 14px;
    font-weight: 500;
    color: #2d5a8a;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;
    transition: all 0.2s ease;
    /* z-index: 1; */
}
.toggle-btn:hover {
    background: #f5f8fe;
    border-color: #b0c8e0;
    box-shadow: 0 4px 12px rgba(45, 90, 138, 0.10);
}
.toggle-btn:active {
    transform: scale(0.96);
}

.arrow {
    display: inline-block;
    font-size: 12px;
    transition: transform 0.3s ease;
}
.arrow.rotated {
    transform: rotate(180deg);
}
</style>