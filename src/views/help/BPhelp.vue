<template>
  <div class="bp">
    <van-nav-bar title="血压帮助" @click-left="router.back()" safe-area-inset-top placeholder fixed>
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
        texts: ['血压状态分类：','低血压：高压<90或低压<60','正常：高压90-119或者低压60-79','偏高：高压120-139或者低压80-89','1级：高压140-159或者低压90-99','2级：高压160-179或者低压100-109','3级：高压>=180或者低压>=110'],
        images: ['/images/help/bp/0.webp']
    },
    {
        texts: ['进入血压记录页面'],
        images: ['/images/help/bp/1.webp']
    },
    {
        texts: ['血压记录页面首页，包含所有基本功能，展示所有血压分组'],
        images: ['/images/help/bp/2.webp']
    },
    {
        texts: ['点击右上角三个点，展示更多功能'],
        images: ['/images/help/bp/3.webp']
    },
    {
        texts: ['添加分组'],
        images: ['/images/help/bp/4.webp']
    },
    {
        texts: ['添加血压记录'],
        images: ['/images/help/bp/5.webp']
    },
    {
        texts: ['全部血压记录，右滑单条血压记录，展示删除按钮，可以删除该条血压记录'],
        images: ['/images/help/bp/6.webp']
    },
    {
        texts: ['某一分组的血压记录，右滑单条血压记录，展示删除按钮，可以删除该条血压记录'],
        images: ['/images/help/bp/7.webp']
    },
    {
        texts: ['导入血压记录：','1.血压记录表文件格式为xlsx','2.血压记录必须在第一个工作表中','3.所有血压必须符合如图所示的模板格式，且内容为文本格式','4.模板中的每列数据，A：日期，B：时间，C：高压，D：低压，E：脉率'],
        images: ['/images/help/bp/9.webp']
    },
    {
        texts: ['全部或分组血压记录页面中，点击右上角三个点，可以展示更多功能'],
        images: ['/images/help/bp/8.webp']
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