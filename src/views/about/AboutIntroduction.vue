<template>
    <div id="introduction">
        <van-nav-bar title="简介" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="content">
            <p>本应用不收集任何数据，所有数据均在本地存储，只有更新时才会联网，大家可以放心使用。</p>
            <p>本应用主要是本人方便记录血压与服药管理，所以血糖模块还没开发，后续可能会添加。</p>
            <p>在使用过程中，如果发现问题，可以发送问题与对应图片到qq或邮箱</p>
            <p>开发者：
                <span class="info">凌毅</span>
            </p>
            <p>联系方式，
                邮箱：<span class="info">604872832@qq.com</span>，
                qq：<span class="info">604872832</span>
            </p>
            <p>最后，希望各位健康平安，永远用不到本应用</p>
            <van-image src="/images/other/1.gif" />
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
.info{
    color: #1989fa;
}
</style>