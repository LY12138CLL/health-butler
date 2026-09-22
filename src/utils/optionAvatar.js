// 操作头像
import { BaseDirectory,remove,copyFile,mkdir,exists,writeFile } from '@tauri-apps/plugin-fs'
import { appCacheDir,appDataDir } from '@tauri-apps/api/path'
import {readConfig,writeConfig} from "../utils/optionConfig"
const dir = "avatar"
const name = "avatar"
const defaultAvatar = '/images/avatar/userAvatar1.webp'
const filePath = dir + "/" + name


/**
 * 初始化头像
 * @returns 初始化结果
 */
export async function initAvatar() {
    const readResult = await readConfig()
    if (readResult.result) {
        let configContent = readResult.data
        if (configContent.avatartPath === "" || !await isExists(configContent.avatartPath,BaseDirectory.AppData)) {
            // 写入默认头像路径
            configContent.avatartPath = defaultAvatar
            const writeResult = await writeConfig(configContent)
            if (writeResult) {
                return true
            }
            return false
        }
        return true
    }
    return false
}
/**
 * 获取头像路径
 * @returns 头像所在的路径
 */
export async function getAvatarPath() {
    const readResult = await readConfig()
    if (readResult.result) {
        return readResult.data.avatartPath
    }
    else return ""
}
/**
 * 保存头像
 * @param {String} path 需要保存的头像的绝对路径
 * @returns 是否保存成功
 */
export async function saveAvatar(path) {
    try {
        const readResult = await readConfig()
        await createDir()
        const formatName = path.split('.').at(-1)
        const fromPath = await getRelativePath(path, await appCacheDir()) // 解析出缓存中图片的相对路径
        const filePath2 = filePath + "." + formatName
        await copyFile(fromPath,filePath2,{
            fromPathBaseDir: BaseDirectory.AppCache, // 源文件的基础目录
            toPathBaseDir: BaseDirectory.AppData,    // 目标文件的基础目录
        })
        // 存储保存后的绝对路径
        const savePath = await appDataDir() + "/" + filePath + "." + formatName
        // 读取配置表
        if (readResult.result) {
            // 删除缓存中的头像
            const deleteResult1 = await deleteFile(fromPath,BaseDirectory.AppCache)
            if (!deleteResult1) return false
            // 写入最新的avatartPath
            let configContent = readResult.data
            configContent.avatartPath = savePath
            const writeResult = await writeConfig(configContent)
            if (writeResult) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    } catch(error) {
        return false
    }
}
/**
 * 重置头像
 * @returns 重置结果
 */
export async function resetAvatar() {
    try{
        const readResult = await readConfig()
        if (readResult.result) {
            // 写入默认头像路径
            let configContent = readResult.data
            configContent.avatartPath = defaultAvatar
            const writeResult = await writeConfig(configContent)
            if (writeResult) {
                return true
            }
            return false
        }
        return false
    } catch {
        return false
    }
}
/**
 * 写入头像照片
 * @param {Uint8Array} data 图片二进制数据
 * @returns 写入结果
 */
export async function writeAvatar(data) {
    try{
        await writeFile(filePath+".jpeg", data, {
        baseDir: BaseDirectory.AppData,
        })
        const readResult = await readConfig()
        if (readResult.result) {
            let configContent = readResult.data
            
            // 写入默认头像路径
            configContent.avatartPath = await appDataDir() + "/" + filePath+".jpeg"
            const writeResult = await writeConfig(configContent)
            if (writeResult) {
                return true
            }
            return false
        }
        return false
    } catch {
        return false
    }
}

/**
 * 删除头像图片
 * @returns 删除结果
 */
async function deleteAvatar() {
    try{
        const readResult = await readConfig()
        if (readResult.result) {
            await remove(readResult.data.avatartPath,{ baseDir: BaseDirectory.AppData })
            return true
        }
        return false
    } catch{
        return false
    }
}
/**
 * 清空缓存目录
 * @returns 清空结果
 */
async function deleteFile(filePath,dir) {
    try{
        await remove(filePath, { baseDir: dir })
       return true
    } catch(e){
        return false
    }
}
/**
 * 解析文件相对路径
 * @param {String} fullPath 文件的绝对路径
 * @param {*} baseDir 相对路径之前的目录
 * @returns 相对路径
 */
async function getRelativePath(fullPath, baseDir) {
    // 处理可能的 file:// 前缀（某些平台可能返回）
    fullPath = fullPath.replace(/^file:\/\//, '')
    baseDir = baseDir.replace(/^file:\/\//, '')
    // 确保 baseDir 以 / 结尾，方便截取
    const base = baseDir.endsWith('/') ? baseDir : baseDir + '/'
    if (fullPath.startsWith(base)) {
        return fullPath.slice(base.length) // 得到 picked_images/xxx.jpg
    }
    return ""
}
// 创建头像文件夹
async function createDir() {
     // 创建avatar文件夹，如果存在则不创建
    await mkdir(dir, {
        baseDir: BaseDirectory.AppData,
        recursive: true
    })
}
// 判断文件是否存在
export async function isExists(path, dir) {
    if (path === defaultAvatar) return true
    const result = await exists(path, {
        baseDir: dir,
    })
    return result
}
