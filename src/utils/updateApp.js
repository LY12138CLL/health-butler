/**
 * 更新app
 * 原理：将最新版本存储在gitee的公开仓库的发行版中，通过网络请求，获取最新的发行版本号，与本地版本号对比，如果大于，则打开默认浏览器下载最新版本
 * tauri插件：plugin-intent（执行Android Intent命令，比如可以打开浏览器），http（发送网络请求）
 * 前端依赖：cheerio（解析html，提取信息）
 */
import { fetch } from '@tauri-apps/plugin-http'
import { getVersion } from '@tauri-apps/api/app'
import * as cheerio from 'cheerio'
import {openBrowser} from "tauri-plugin-lingyi-toolbox"

// 更新版本
export async function updateApp() {
  // 获取当前版本号，如0.0.1
  const nowVersion = await getVersion()
  // 获取最新版本号
  const result = await getNewVersion()
  if (result.status === "检查失败") return "检查失败"
  else {
    // 是否有新版本
    if(isNewVersion(nowVersion,result.version)) {
        // 是否更新
        showConfirmDialog({
          message: `新版本${result.version.replace('v','')}，是否更新`, 
          }).then(async () => {
              // 打开浏览器下载最新版本
              await downloadApp(result.version)
          }).catch(() => {
              // on cancel
          });
    }
    else {
      return "暂无新版本"
    }
  }
}
// 判断本地版本号是否大于最新版本号
function isNewVersion(oldVersion,newVersion) {
  const p1 = Number(oldVersion.replace(/\D/g, ''))
  const p2 = Number(newVersion.replace(/\D/g, ''))
  if (p2 > p1) return true
  return false // 相等不算大于
}
// 获取最新版本号
async function getNewVersion() {
  let status = ""
  let version = ""
  try {
    // 请求服务器，超时时间1分钟
    const response = await fetch('https://gitee.com/lingyi2/health-butler-release-version/releases',{connectTimeout: 60000})
    // 解析html
    const html = await response.text()
    const $ = cheerio.load(html)
    // 获取版本号
    const result = $('ul.releases-sidebar-list li:first-child a').attr('data-tag')
    // 判断获取结果是否为版本号v0.0.1格式
    if (/^v\d+\.\d+\.\d+$/.test(result)) {
      version = result
      status = "检查成功"
    }
    else status = "检查失败"
    } catch (error) {
      status = "检查失败"
  }
  return {status,version}
}
// 打开默认浏览器，下载最新版本
async function downloadApp(version) {
  await openBrowser(`https://gitee.com/lingyi2/health-butler-release-version/releases/download/${version}/健康管家.apk`)
}