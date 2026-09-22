<template>
  <div class="notice">
    <van-nav-bar title="通知帮助" @click-left="router.back()" safe-area-inset-top placeholder fixed>
      <template #left>
        <van-icon name="arrow-left" size="18" color="#000000" />
      </template>
    </van-nav-bar>
    <div class="content">
      <div class="paragraph" v-for="(item,outerIndex) in contentArr" :key="outerIndex">
        <p class="text" v-for="(text,indexP) in item.texts" :key="indexP">{{ text }}</p>
        <van-image
        v-for="(imageUrl,innerIndex) in item.images"
            :key="innerIndex"
            width="100"
            height="100"
            :src="imageUrl"
            @click="handleImageClick(outerIndex,innerIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

/* 路由与仓库 */
const router = useRouter()


/* 数据 */
// 段落内容与图片
const contentArr = [
    {
        texts: ['若需要通知，打开应用时确定允许通知','若需要通知时有提示音，在应用的通知管理中勾选 锁屏通知、打开铃声'],
        images: ['/images/help/notice/1.webp','/images/help/notice/2.webp']
    },
    {
        texts: ['若需要在应用切换到后台/锁屏/息屏时还能接收通知，在应用的耗电管理中，打开 允许完全后台行为'],
        images: ['/images/help/notice/3.webp']
    },
    {
        texts: ['若需要息屏时也能看到通知','1.在系统设置中的 通知与状态栏 中的 锁屏通知 中开启 锁屏来通知时亮屏','2.在系统的电池设置中，找到耗电优化，关闭该应用的耗电优化'],
        images: ['/images/help/notice/4.webp','/images/help/notice/5.webp','/images/help/notice/6.webp']
    },
    {
        texts: ['注意：','1.服药任务之间的间隔时间不要小于10分钟，否则，频繁发送通知，会造成通知失败','2.服药计划中的第一次服药提醒时间必须大于当前时间2分钟，否则有可能服药通知会失效或延迟','3.首次拒绝通知权限后，若需使用通知，请前往应用的通知权限中手动打开或重启应用授权打开'],
        images: ['/images/help/takeMedicine/99.webp']
    }
]
// 所有图片
const allImages = contentArr.flatMap(item => item.images)
// 预览图片
function handleImageClick(outerIndex, innerIndex) {
    // 获取当前图片的索引
    let globalIndex = 0
    for (let i = 0; i < outerIndex; i++) {
        globalIndex += contentArr[i].images.length
    }
    globalIndex += innerIndex
    
    // 预览当前图片
    showImagePreview({
        images: allImages,
        startPosition: globalIndex,
        showIndex:false
    })
}
</script>

<style scoped>
.content {
  margin: 10px;
}
.text{
    font-size: 14px;
}
</style>