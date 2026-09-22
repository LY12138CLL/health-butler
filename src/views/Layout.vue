<template>
    <div id="layout">
        <div class="continer">
            <router-view></router-view>
        </div>
        <div class="tabbar">
            <van-tabbar v-model="active" active-color="#6abf8a" route safe-area-inset-bottom>
                <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
                <van-tabbar-item icon-prefix="my-icon" icon="tongji" to="/statistics">统计</van-tabbar-item>
                <van-tabbar-item icon="user" to="/user">我的</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

/* 数据 */
const active = ref(0)


/* 功能函数 */

</script>
<style scoped>

.continer{
    margin-left: 10px;
    margin-right: 10px;
    background-color: #f5f7fa;
}
</style>