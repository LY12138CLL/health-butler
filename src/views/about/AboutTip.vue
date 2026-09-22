<template>
    <div id="tip">
        <van-nav-bar title="打赏" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="content">
            <van-image src="/images/other/2.webp" />
            <van-image src="/images/other/3.webp" />
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

/* 路由与仓库 */
const router = useRouter()
</script>
<style scoped>
.content{
    margin: 10px;
    display: flex;
    flex-direction: column;
}
p{
    font-size: 14px;
}
</style>