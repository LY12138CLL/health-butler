<!-- 设置后台运行 -->
<template>
    <div id="background">
        <van-nav-bar title="后台运行引导" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="container">
            <MenuCard @click="toAppDetails" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="前往应用详情" :isShowIcon="false"></MenuCard>
        </div>
        <div class="guidance">
            <div class="paragraph" v-for="(item,outerIndex) in contentArr" :key="outerIndex">
                <p class="text" v-for="(text,indexP) in item.texts" :key="indexP">{{ text }}</p>
                <van-image
                    v-for="(imageUrl,innerIndex) in item.images"
                    :key="innerIndex"
                    fit="contain"
                    :src="imageUrl"
                />
        </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MenuCard from '../../components/MenuCard.vue'
import {openAppDetails} from "tauri-plugin-lingyi-toolbox"
/* 路由与仓库 */
const router = useRouter()

const contentArr = [
    {
        texts: ['第1步，前往应用详情，点击上方菜单前往或手动前往'],
        images: ['/images/powerConsumptionManagement/1.webp']
    },
    {
        texts: ['第2步，点击耗电管理 或 省电管理，只要是关于电池的选项'],
        images: ['/images/powerConsumptionManagement/2.webp']
    },
    {
        texts: ['第3步，开启允许后台行为的开关，点击允许'],
        images: ['/images/powerConsumptionManagement/3.webp']
    }
]
// 前往应用详情
async function toAppDetails() {
    await openAppDetails()
}
</script>
<style scoped>
.container,.guidance{
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.content {
  margin: 10px;
}
.text{
    font-size: 14px;
}
:deep(img){
    border: 1px solid #d3d5d6;
    border-radius: 5px;
}
</style>