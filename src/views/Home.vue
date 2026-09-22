<!-- 首页 -->
<template>
    <van-pull-refresh v-model="showPushRefreshLoading" pull-distance="150" @refresh="onRefresh">
        <div id="home">
                <!-- 头部 -->
                <div class="header">
                    <span class="title">健康管家</span>
                    <span class="week">{{ weekDay }}</span>
                </div>
                <!-- 功能菜单 -->
                <div class="container">
                    <!-- 长条菜单选项 -->
                    <MaxMenuItem :icon-name="`xieyaguanjia`" :icon-color="`#ff0000`" :menu-name="`血压记录`" :message="xyStore.promptMessage" @click="router.push('/bphome')"/>
                    <MaxMenuItem :icon-name="`xietang`" :icon-color="`#10b981`" :menu-name="`血糖记录`" :message="`今天已记录2次，状态正常`"/>
                    <MaxMenuItem :icon-name="`jiaonang`" :icon-color="`#f97316`" :menu-name="`用药管理`" :message="yprwStore.promptMessage" @click="router.push('/medicinehome')"/>
                    <!-- 方快菜单选项 -->
                    <div class="min-menu-item">
                        <!-- <MinMenuItem :color="'#10b981'" :title="'今日步数'" :count="'2000'">
                            <template #message>
                                <van-progress color="#10b981" :percentage="50" stroke-width="8" :show-pivot="false"/>
                            </template>
                        </MinMenuItem>
                        <MinMenuItem :color="'#1e40af'" :title="'睡眠质量'" :count="'6h 30m'">
                            <template #message>
                                <span style="font-size: 18px;">深度睡眠2h</span>
                            </template>
                        </MinMenuItem> -->
                    </div>
                </div>
        </div>
    </van-pull-refresh>
    
</template>
<script setup>
import MaxMenuItem from '../components/MaxMenuItem.vue';
import {useRouter} from "vue-router"
import { xueyaStore } from "../stores/xueyaStore.js"
import {medicineTaskStore} from "../stores/medicineStore.js"
import { computed,ref } from 'vue'

/* 路由与仓库 */
const router = useRouter()
const xyStore = xueyaStore()
const yprwStore = medicineTaskStore()

// 今天是星期几
const weekDay = computed(() => {
    const now = new Date()
    return now.toLocaleDateString('zh-CN', { weekday: 'long' })
})
const showPushRefreshLoading = ref(false) // 展示下拉刷新加载中状态
// 下拉刷新触发
function onRefresh() {
    window.location.reload()
    showPushRefreshLoading.value = false;
}
</script>
<style scoped>
.van-pull-refresh {
    height: calc(100vh - 50px);
    overflow: visible;
}
#home{
    padding-top: calc(env(safe-area-inset-top));
}
.title {
    font-size: 25px;
    font-weight: 700;
    margin: 10px 0;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.head {
    width: 36px;
    height: 36px;
}
.container{
    /* min-height: 750px; */
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.min-menu-item{
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 两列等宽 */
    gap: 10px;
}
.week{
    font-size: 18px;
    font-weight: 700;
    color: #1989fa;
}
</style>