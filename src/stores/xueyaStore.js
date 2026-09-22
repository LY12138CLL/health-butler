import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import {addBPrecord, deleteBPrecord, updateBPrecordGroup, selectAllBPrecord, deleteAllBPrecord} from "../utils/optionData"
import {addBPgroup,deleteBPgroup,selectAllBPgroup,deleteAllBPrecordGroup} from "../utils/optionData"
import {bpStatus} from "../utils/tools"
// 血压记录仓库
export const xueyaStore = defineStore('xueyaStore',() => {
    /* 定义数据 */
    const records = ref([])
    /* 定义修改数据的方法 */
    // 添加记录
    const addRecord = async (data) => {
        // 后台添加记录
        const result = await addBPrecord(data)
        if (result === "添加成功") {
            // 本地重新请求记录（因为添加的记录没有id）
            getAllRecord()
        }
        return result
    }
    // 删除记录
    const deleteRecord = async (recordId) => {
        // 后台删除记录
        const result = await deleteBPrecord(recordId)
        if (result === "删除成功") {
            // 本地删除记录
            records.value = records.value.filter(item => item.id !== recordId)
        }
        return result
    }
    // 修改所属分组
    const changeGroup = async (recordId, newGroupId, newGroupName) => {
        // 后台修改
        const result = await updateBPrecordGroup(recordId,newGroupId,newGroupName)
        if (result === "修改成功") {
            // 本地修改
            records.value = records.value.map(item => {
                if (item.id === recordId) {
                    item.groupId = newGroupId
                    item.groupName = newGroupName
                }
                return item
            })
        }
        return result
        
    }
    // 获取所有记录
    const getAllRecord = async () => {
        // 后台请求的数据
        const result = await selectAllBPrecord()
        if (result.messgae === "查询成功") {
            const data = result.result
            // 整理字段
            const data2 = organizeData(data)
            records.value = data2
        }
        
    }
    // 删除所有血压记录
    const deleteAllRecord = async () => {
        const result = await deleteAllBPrecord()
        if (result === "清空成功") {
            records.value = []
        }
        return result
    }
    // 每日提示信息
    const promptMessage = computed(() => {
        // 筛选出今日血压记录
        const todayData = records.value.filter(item => new Date(item.dateTime).toDateString() === new Date().toDateString())
        // 今日血压状态
        let statusObject = {
            dxy: 0,
            zc: 0,
            pg: 0,
            yj: 0,
            ej: 0,
            sj: 0
        }
        // 统计今日血压状态次数
        todayData.forEach(item => {
            const status = bpStatus(item.sbp,item.dbp)
            if (status === "低血压") statusObject.dxy += 1
            else if (status === "正常") statusObject.zc += 1
            else if (status === "偏高") statusObject.pg += 1
            else if (status === "1级") statusObject.yj += 1
            else if (status === "2级") statusObject.ej += 1
            else if (status === "3级") statusObject.sj += 1
        })
        // 关键提示信息列表
        let gjinfoList = []
        // 生成管家提示信息
        if (statusObject.zc === todayData.length && todayData.length > 0) {
            gjinfoList.push("血压全部正常")
        } else {
            if (statusObject.dxy > 0) {
                gjinfoList.push(`低血压${statusObject.dxy}次`)
            }
            if (statusObject.pg > 0) {
                gjinfoList.push(`血压偏高${statusObject.pg}次`)
            }
            if (statusObject.yj > 0) {
                gjinfoList.push(`高血压1级${statusObject.yj}次`)
            }
            if (statusObject.ej > 0) {
                gjinfoList.push(`高血压2级${statusObject.ej}次`)
            }
            if (statusObject.sj > 0) {
                gjinfoList.push(`高血压3级${statusObject.sj}次`)
            }
        }
        const todayNumber = todayData.length
        // 今日没有血压记录
        if (todayNumber === 0) {
            return "今天暂无记录"
        }
        else {
            return `今天已记录${todayNumber}次，${gjinfoList.join("、")}`
        }
    })
    /* 处理数据 */
    const organizeData = (data) => {
        return data.map(item => {
            return {
                id: item.id,
                sbp: item.sbp,
                dbp: item.dbp,
                hr: item.hr,
                notes: item.notes,
                dateTime: item.date_time,
                groupId: item.group_id,
                groupName: item.group_name
            }
        })
    }
    /* 返回需要的数据、计算属性、方法 */
    return {
        records,
        addRecord,
        deleteRecord,
        changeGroup,
        getAllRecord,
        deleteAllRecord,
        promptMessage
    }
})
// 分组仓库
export const groupStrore = defineStore('groupStrore',() => {
    /* 定义数据 */
    const groups = ref([])
    /* 定义修改数据方法 */
    // 添加分组
    const addGroup = async (groupId,groupName) => {
        // 判断分组名是否重复
        if (isGroupNameRepeat(groupName)) {
            return "添加失败，分组名重复"
        }
        // 后台添加分组
        const result = await addBPgroup(groupId, groupName)
        if (result === "添加成功") {
            // 本地重新获取所有分组
            getAllGroup()
        }
        return result
    }
    // 删除分组
    const deleteGroup = async (groupId) => {
        // 后台删除分组
        const result = await deleteBPgroup(groupId)
        if (result === "删除成功") {
            // 本地删除分组
            groups.value = groups.value.filter(item => item.id !== groupId)
        }
        return result
    }
    // 删除所有分组
    const deleteAllGroups = async () => {
        const result = await deleteAllBPrecordGroup()
        if (result === "清空成功") {
            groups.value = []
        }
        return result
    }
    // 获取所有分组
    const getAllGroup = async () => {
        // 后台获取
        const result = await selectAllBPgroup()
        if (result.messgae === "查询成功") {
            const data = result.result
            // 整理数据
            const data2 = organizeData(data)
            // 存储到本地
            groups.value = data2
        }
        return result.messgae
    }
    /* 整理数据 */
    const organizeData = (data) => {
        return data.map(item => {
            return {
                name: item.group_name,
                id: item.group_id
            }
        })
    }
    // 判断分组名是否重复
    const isGroupNameRepeat = (groupName) => {
        let result = false
        for (const item of groups.value) {
            if (item.name === groupName) {
                result = true
                break
            }
        }
        return result
    }
    /* 返回需要的数据、计算属性、方法 */
    return {
        groups,
        addGroup,
        deleteGroup,
        getAllGroup,
        deleteAllGroups
    }
})