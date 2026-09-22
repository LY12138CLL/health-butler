<template>
  <div class="bp">
    <van-nav-bar title="用药帮助" @click-left="router.back()" safe-area-inset-top placeholder fixed>
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
        texts: ['药品状态划分标准：','未过期：有效期>10天','临期：有效期1-10天','过期：有效期<=0天'],
        images: ['/images/help/takeMedicine/1.webp']
    },
    {
        texts: ['进入用药管理页面'],
        images: ['/images/help/takeMedicine/1.webp']
    },
    {
        texts: ['进入药品管理页面'],
        images: ['/images/help/takeMedicine/2.webp']
    },
    {
        texts: ['药品管理页面，展示每种药品，点击可以查看该药品详情','只要药品有对应的服药计划，则显示该药品还能服用多久'],
        images: ['/images/help/takeMedicine/3.webp','/images/help/takeMedicine/13.webp']
    },
    {
        texts: ['药品管理，点击右上角三个点，展开更多功能'],
        images: ['/images/help/takeMedicine/4.webp']
    },
    {
        texts: ['某一分类的药品，点击右上角三个点，展开更多功能','右滑单盒药品，可编辑/删除'],
        images: ['/images/help/takeMedicine/5.webp']
    },
    {
        texts: ['添加药品'],
        images: ['/images/help/takeMedicine/6.webp']
    },
    {
        texts: ['进入任务管理页面'],
        images: ['/images/help/takeMedicine/7.webp']
    },
    {
        texts: ['当天任务，右滑单条任务，可编辑/删除'],
        images: ['/images/help/takeMedicine/8.webp']
    },
    {
        texts: ['历史任务，右滑单条任务，可删除'],
        images: ['/images/help/takeMedicine/9.webp']
    },
    {
        texts: ['计划管理，右滑单条计划，可编辑/删除'],
        images: ['/images/help/takeMedicine/10.webp']
    },
    {
        texts: ['任务管理，点击右上角三个点，展示更多功能'],
        images: ['/images/help/takeMedicine/11.webp']
    },
    {
        texts: ['添加计划'],
        images: ['/images/help/takeMedicine/12.webp']
    },
    {
        texts: ['注意：','1.服药任务在提醒时间的3小时后会失效，任务状态将会改变为 已过期', '2.当库存药品不足下次服用时，则不会生成任务'],
        images: ['/images/help/takeMedicine/14.webp']
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