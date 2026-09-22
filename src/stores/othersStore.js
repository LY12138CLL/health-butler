import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getVersion } from '@tauri-apps/api/app'
import {readConfig,writeConfig,initConfig,resetConfig} from "../utils/optionConfig"
import {getAvatarPath,saveAvatar,initAvatar,resetAvatar,writeAvatar} from "../utils/optionAvatar"
import {convertFileSrc } from "@tauri-apps/api/core"
import {base64ToUint8Array} from "../utils/tools"
// 其它
export const othersStore = defineStore('othersStore',() => {
    // 上次app更新时间
    const lastUpdateTime = ref(0)
    // app更新间隔时间，1分钟，单位毫秒
    const appUpdateIntervalTime = 1 * 60 * 1000
    // 文件保存目录
    const fileSavePath = '/storage/emulated/0/Download'
    const version = ref("") // 版本号，如0.0.1
    // 配置文件内容
    const configContent = ref({})
    // 获取当前版本号
    async function getAppVersion() {
        const result = await getVersion()
        version.value = result
    }
    // 读取配置文件内容
    async function readConfigFileContent() {
        const result = await readConfig()
        if (result.result) {
            configContent.value = result.data
        }
    }
    // 更新配置文件内容
    async function updateConfigFileContent(data) {
        const result = await writeConfig(data)
        if (result) {
            await readConfigFileContent()
            return "修改成功"
        }
        else return "修改失败"
    }
    // 重置配置文件内容
    async function resetConfigFileContent() {
        const result = await resetConfig()
        if (result) {
            await readConfigFileContent()
            return true
        }
        else return false
    }
    // 获取头像
    async function getAvatarUrl() {
        const path = await getAvatarPath()
        if (path !== "") {
            if (path === "/images/avatar/userAvatar1.webp") {
                return path
            }
            return convertFileSrc(path)
        }
        return ""
        
    }
    // 保存头像
    async function saveAvatarImage(path) {
        const result = await saveAvatar(path)
        return result
    }
    // 写入头像
    async function writeAvatarImage(base64Data) {
        const data = await base64ToUint8Array(base64Data)
        const writeResult = await writeAvatar(data)
        return writeResult
    }
    // 重置头像
    async function resetAvatarImage() {
        const result = await resetAvatar()
        return result
    }
    // 初始化
    async function init() {
        await getAppVersion()
        await initConfig()
        await readConfigFileContent()
        await initAvatar()
    }
    return {
        lastUpdateTime,
        appUpdateIntervalTime,
        fileSavePath,
        version,
        configContent,
        updateConfigFileContent,
        init,
        resetConfigFileContent,
        getAvatarUrl,
        saveAvatarImage,
        resetAvatarImage,
        writeAvatarImage
    }
})