<!-- 帮助页面 -->
<template>
    <div id="help">
        <van-nav-bar title="关于" @click-left="router.back()" safe-area-inset-top placeholder fixed>
            <template #left>
                <van-icon name="arrow-left" size="18" color="#000000" />
            </template>
        </van-nav-bar>
        <div class="container">
            <div class="header">
                <van-image
                    width="50"
                    height="50"
                    src="tauri.svg"
                />
                <span class="title">健康管家</span>
                <span class="ver">版本号 {{ otherStore.version }}</span>
            </div>
            
            <div class="menus">
                <MenuCard @click="router.push('/aboutintroduction')" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="简介" :isShowIcon="false"></MenuCard>
                <MenuCard @click="update" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="更新" :isShowIcon="false"></MenuCard>
                <MenuCard @click="problemFeedback" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="问题反馈" :isShowIcon="false"></MenuCard>
                <MenuCard @click="router.push('/abouttip')" icon-background-color="#ff0000" icon-class-prefix="" iconName="" name="打赏" :isShowIcon="false"></MenuCard>
            </div> 
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import MenuCard from '../../components/MenuCard.vue'
import {othersStore} from "../../stores/othersStore.js"
import {updateApp} from "../../utils/updateApp.js"
/* 路由与仓库 */
const router = useRouter()
const otherStore = othersStore()

// 更新
async function update() {
    if (new Date() - otherStore.lastUpdateTime < otherStore.appUpdateIntervalTime) {
        showToast('不要频繁更新')
    }
    else {
        const loadingToast = showToast({message: '检查中...',type: 'loading',duration:0})
        const result = await updateApp()
        loadingToast.close()
        otherStore.lastUpdateTime = new Date()
        if (result === "暂无新版本") return showDialog({ message: '暂无新版本' })
        else if(result === "检查失败") return showDialog({ message: '检查失败，请稍后重试' })
    }
}
// 问题反馈
function problemFeedback() {
    showDialog({ message: '发送问题与图片到邮箱或qq，604872832、604872832@qq.com' })
}
</script>
<style scoped>
.container{
margin: 10px;
}
.menus{
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.header{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.title{
    font-size: 20px;
    font-weight: bold;
}
.ver{
    font-size: 14px;
}
</style>