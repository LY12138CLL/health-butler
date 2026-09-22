<!-- 指定分组简略信息 -->
<template>
    <div class="card">
        <div class="left">
            <!-- <h6>{{ props.groupData.groupName }}</h6> -->
            <span class="title">{{ props.groupData.groupName }}</span>
            <div class="average">
                <span class="label">平均</span>
                <span class="data sbp">{{ props.groupData.averageSbp }}</span>
                <span class="data">&nbsp;/&nbsp;</span>
                <span class="data dbp">{{ props.groupData.averageDbp }}</span>
                <span class="hr"><van-icon name="like" color="red"/>{{ props.groupData.averageHr }}</span>
            </div>
            <div class="start_time">
                <span class="label">开始时间</span>
                <span class="date">{{ props.groupData.startRecordTime }}</span>
            </div>
            <div class="end_time">
                <span class="label">最新时间</span>
                <span class="date">{{ props.groupData.endRecordTime }}</span>
            </div>
        </div>
        <div class="right">
            <van-tag color="#f3f4f6" text-color="#9bb3d2" class="number">{{ props.groupData.totality }}</van-tag>
            <span class="delete" @click.stop="deleteGroup"><van-icon name="delete-o" size="18px"/>删除分组</span>
        </div>
        
    </div>
</template>
<script setup>
/* 父子组件数据传递 */
// 接收父组件数据
const props = defineProps({
    groupData: Object
})
// 子传父事件名称
const emit = defineEmits(['delete'])


/* 功能函数 */
//  删除分组
function deleteGroup() {
    if (props.groupData.groupId === "null") {
        return
    }
    showConfirmDialog({
        message:
            '是否删除该分组，分组内数据将移动到未分组',
        })
        .then(() => {
            emit("delete",props.groupData.groupId)
        })
        .catch(() => {
            // on cancel
    })
}

</script>
<style scoped>
*{
    margin: 0;
    padding: 0;
}
.card {
    /* height: 120px; */
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
}
.title{
    font-size: 20px;
    font-weight: bold;
}
.left,.right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.left{
    gap: 10px;
}
.label {
    font-size: 16px;
    /* font-weight: 600; */
    margin-right: 5px;
}
.data {
    font-size: 15px;
    font-weight: bold;
}
.delete{
    font-size: 16px;
    color: #c2c6ce;
}
.right{
    align-items: flex-end; /* 垂直居中 */
}
.right>span{
    color: #393939;
    font-size: 13px;
}
.sbp{
    color: red;
}
.dbp{
    color: #4f7cff;
}
.hr{
    font-size: 15px;
    font-weight: bold;
    color: #34c759;
    margin-left: 20px;
}
.date {
    font-size: 15px;
    color: #9e9e8b;
}
.average,.start_time,.end_time{
    display: flex;
    align-items: center;
}
</style>