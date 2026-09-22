<!-- 帮助页面 -->
<template>
    <div id="help">
        <van-nav-bar title="帮助" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="container">
            <MenuCard @click="router.push('/bphelp')" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="血压记录"></MenuCard>
            <MenuCard icon-background-color="#10b981" icon-class-prefix="" iconName="" name="血糖记录"></MenuCard>
            <MenuCard @click="router.push('/takemedicinehelp')" icon-background-color="#f97316" icon-class-prefix="" iconName="" name="用药管理"></MenuCard>
            <MenuCard @click="router.push('/noticehelp')" icon-background-color="#1989fa" icon-class-prefix="" iconName="" name="通知提醒"></MenuCard>

        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MenuCard from '../../components/MenuCard.vue'
/* 路由与仓库 */
const router = useRouter()
</script>
<style scoped>
.container{
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
</style>