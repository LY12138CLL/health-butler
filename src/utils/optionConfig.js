// 操作配置文件
import { exists, BaseDirectory,readTextFile,writeTextFile,remove } from '@tauri-apps/plugin-fs'

const configFileName = "config.json"
const configDefaultContent = {
    takeMedicineNoticeAudio: "take_medicine_notice_putonghua",
    oldTakeMedicineNoticeAudio: "",
    avatartPath: ""
}
/**
 * 初始化配置文件
 * @returns 初始化结果
 */
export async function initConfig() {
   if (!await checkConfigExists()) {
        await writeConfig(configDefaultContent)
   }  
}
// 检查配置文件是否存在
async function checkConfigExists() {
    try{
        const configExists = await exists(configFileName, { baseDir: BaseDirectory.AppConfig })
        return configExists
    } catch {
        return false
    }
}
/**
 * 写入配置文件
 * @param {Object} data 配置文件所有数据
 * @returns 写入结果
 */
export async function writeConfig(data) {
    try{
        await writeTextFile(configFileName,JSON.stringify(data),{ baseDir: BaseDirectory.AppConfig })
        return true
    } catch{
        return false
    } 
}
/**
 * 读取配置文件
 * @returns 读取的结果，{result: 读取结果，布尔类型，data: 配置文件内容，对象类型}
 */
export async function readConfig() {
    try{
        const config = await readTextFile(configFileName,{ baseDir: BaseDirectory.AppConfig })
        return {result: true, data: JSON.parse(config)}
    } catch{
        return {result: false, data: {}}
    }
}
/**
 * 删除配置文件
 * @returns 删除结果
 */
export async function deleteConfig() {
    try{
        await remove(configFileName,{ baseDir: BaseDirectory.AppConfig })
        return true
    } catch{
        return false
    }
}
/**
 * 重置配置表
 * @returns 重置结果
 */
export async function resetConfig() {
    try{
        const deleteResult = await deleteConfig()
        if (deleteResult) {
            const writeResult = await writeConfig(configDefaultContent)
            return writeResult
        }
        return false
    } catch {
        return false
    }
}