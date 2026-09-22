import {cancel,sendNotification,cancelAll} from '@choochmeque/tauri-plugin-notifications-api'
// 计算背景色（混合白色）
export const getBackgroundColor = (color, lightness = 0.85) => {
  let r, g, b
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    } else {
      throw new Error('Invalid HEX color format')
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g)
    if (match && match.length >= 3) {
      r = parseInt(match[0])
      g = parseInt(match[1])
      b = parseInt(match[2])
    } else {
      throw new Error('Invalid RGB color format')
    }
  } else {
    throw new Error('Unsupported color format. Use HEX or RGB.')
  }

  const mix = (channel) =>
    Math.round(channel * (1 - lightness) + 255 * lightness)
  const bgR = mix(r)
  const bgG = mix(g)
  const bgB = mix(b)

  const toHex = (c) => c.toString(16).padStart(2, '0')
  return `#${toHex(bgR)}${toHex(bgG)}${toHex(bgB)}`
}

// 整理血压记录首页展示的分组卡片大概数据（平均高压、平均低压、平均心率、总数、记录开始时间、记录结束时间）
export const groupCardSummaryData = (records) => {
  const recordsLength = records.length
  if (recordsLength) {
    const averageSbp =
      Math.floor(
        records.reduce((sum, item) => sum + item.sbp, 0) / recordsLength
      ) || 0
    const averageDbp =
      Math.floor(
        records.reduce((sum, item) => sum + item.dbp, 0) / recordsLength
      ) || 0
    const averageHr =
      Math.floor(
        records.reduce((sum, item) => sum + item.hr, 0) / recordsLength
      ) || 0
    const starRecordTime = records.reduce((previousItem, item) =>
      Date.parse(item.dateTime) < Date.parse(previousItem.dateTime)
        ? item
        : previousItem
    ).dateTime
    const endRecordTime = records.reduce((previousItem, item) =>
      Date.parse(item.dateTime) > Date.parse(previousItem.dateTime)
        ? item
        : previousItem
    ).dateTime
    const data = {
      averageSbp: averageSbp,
      averageDbp: averageDbp,
      averageHr: averageHr,
      totality: recordsLength,
      startRecordTime: starRecordTime,
      endRecordTime: endRecordTime
    }
    return data
  } else {
    const data = {
      averageSbp: 0,
      averageDbp: 0,
      averageHr: 0,
      totality: recordsLength,
      startRecordTime: '',
      endRecordTime: ''
    }
    return data
  }
}
// 整理血压记录详情页展示的总结数据（）
export const detailsSummaryData = (records) => {
  const recordsLength = records.length
  if (recordsLength) {
    const averageSbp =
      Math.floor(
        records.reduce((sum, item) => sum + item.sbp, 0) / recordsLength
      ) || 0
    const averageDbp =
      Math.floor(
        records.reduce((sum, item) => sum + item.dbp, 0) / recordsLength
      ) || 0
    const averageHr =
      Math.floor(
        records.reduce((sum, item) => sum + item.hr, 0) / recordsLength
      ) || 0
    const maxSbpRecord = records.reduce((previousItem, item) =>
      item.sbp > previousItem.sbp ? item : previousItem
    )
    const maxDbpRecord = records.reduce((previousItem, item) =>
      item.dbp > previousItem.dbp ? item : previousItem
    )

    const minSbpRecord = records.reduce((previousItem, item) =>
      item.sbp < previousItem.sbp ? item : previousItem
    )
    const minDbpRecord = records.reduce((previousItem, item) =>
      item.dbp < previousItem.dbp ? item : previousItem
    )

    const starRecordTime = records.reduce((previousItem, item) =>
      Date.parse(item.dateTime) < Date.parse(previousItem.dateTime)
        ? item
        : previousItem
    ).dateTime
    const endRecordTime = records.reduce((previousItem, item) =>
      Date.parse(item.dateTime) > Date.parse(previousItem.dateTime)
        ? item
        : previousItem
    ).dateTime
    const data = {
      averageSbp: averageSbp,
      averageDbp: averageDbp,
      averageHr: averageHr,
      maxSbpRecord: maxSbpRecord,
      maxDbpRecord: maxDbpRecord,
      minSbpRecord: minSbpRecord,
      minDbpRecord: minDbpRecord,
      totality: recordsLength,
      starRecordTime: starRecordTime,
      endRecordTime: endRecordTime
    }
    return data
  } else {
    const data = {
      averageSbp: 0,
      averageDbp: 0,
      averageHr: 0,
      maxSbpRecord: {},
      maxDbpRecord: {},
      minSbpRecord: {},
      minDbpRecord: {},
      totality: recordsLength,
      starRecordTime: '',
      endRecordTime: ''
    }
    return data
  }
}
// 格式化日期时间 2525-10-01日12时30分02秒
export const formatDateTime = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}时${minutes}分${s}秒`
}
// 格式化日期时间 20251001123002
export const formatDateTime2 = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}${m}${day}${h}${minutes}${s}`
}
// 格式化日期时间 2525-10-01
export const formatDateTime3 = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
// 格式化日期时间 2525-10-01 12:30:02
export const formatDateTime4 = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${minutes}:${s}`
}
// 判断当前时间是否大于指定时间字符串，时间字符串格式为12:30:00
export function isNowBeforeTime(timeStr) {
  const now = new Date()
  const [hours, minutes, seconds] = timeStr.split(':').map(Number)

  // 克隆当前日期，避免修改原对象
  const targetTime = new Date(now)
  targetTime.setHours(hours, minutes, seconds, 0) // 毫秒设为0，精确到秒级比较

  // 比较时间戳
  return now > targetTime
}
// 判断血压状态
export const bpStatus = (sbp, dbp) => {
  // 1. 先判断低血压
  if (sbp < 90 || dbp < 60) return '低血压'
  // 2. 再判断高血压等级（从高到低）
  if (sbp >= 180 || dbp >= 110) return '3级'
  if ((sbp >= 160 && sbp <= 179) || (dbp >= 100 && dbp <= 109)) return '2级'
  if ((sbp >= 140 && sbp <= 159) || (dbp >= 90 && dbp <= 99)) return '1级'
  // 3. 然后判断偏高（正常高值）
  if ((sbp >= 120 && sbp <= 139) || (dbp >= 80 && dbp <= 89)) return '偏高'
  // 4. 最后正常
  if (sbp >= 90 && sbp < 120 && dbp >= 60 && dbp < 80) return '正常'
  // 兜底（若都不满足）
  return '正常'
}
// 统计总数、低血压、正常、高血压数量，平均、最高、最低血压记录
export const BPstatisticsCardData = (records) => {
  const total = records.length
  let low = 0
  let normal = 0
  let high = 0
  // 高压、低压平均
  const averageSbp =
    Math.floor(records.reduce((sum, item) => sum + item.sbp, 0) / total) || 0
  const averageDbp =
    Math.floor(records.reduce((sum, item) => sum + item.dbp, 0) / total) || 0
  // 低压、正常、高压数量
  records.forEach((record) => {
    const state = bpStatus(record.sbp, record.dbp)
    if (state === '低血压') low += 1
    else if (state === '正常' || state === '偏高') normal += 1
    else if (state === '1级' || state === '2级' || state === '3级') high += 1
  })

  return {
    total: total,
    normal: normal,
    high: high,
    low: low,
    avgBp: { sbp: averageSbp, dbp: averageDbp }
  }
}
// 获取设备类型
export function getDeviceType() {
  const ua = navigator.userAgent
  const width = window.innerWidth

  // 1. 通过 User-Agent 粗略判断
  const isMobileUA =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(ua)

  // 2. 结合屏幕宽度进行判断 (常用断点)
  const isMobileWidth = width < 768
  const isTabletWidth = width >= 768 && width < 1024

  // 3. 检测是否支持触摸
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // 综合判断逻辑
  if (isMobileUA || isMobileWidth) {
    // 进一步区分是手机还是大屏手机/平板
    if (isTabletUA || isTabletWidth) {
      return 'tablet'
    }
    return 'mobile'
  }

  if (isTabletUA || isTabletWidth) {
    return 'tablet'
  }

  // 默认为桌面设备
  return 'desktop'
}
/**
 * 通用百分比计算（自动让数量相同的项百分比相等，总和严格为 100）
 * @param {number} total       总记录数
 * @param {number[]} counts    各项数量数组（任意长度）
 * @param {number} decimals    保留小数位数，默认 2
 * @returns {number[]} 各百分比数值（数字，不带 %）
 */
export function calcPercentages(total, counts, decimals = 2) {
  if (total === 0) return counts.map(() => 0)

  const factor = Math.pow(10, decimals)
  const totalParts = factor * 100 // 100% 拆成 totalParts 份（每份 0.01%）
  const n = counts.length

  // ----- 1. 先用标准最大余数法为每个项分配份数 -----
  const parts = new Array(n)
  const remainders = new Array(n)
  let sumParts = 0

  for (let i = 0; i < n; i++) {
    const numerator = counts[i] * totalParts
    const floor = Math.floor(numerator / total)
    const rem = numerator % total
    parts[i] = floor
    remainders[i] = rem
    sumParts += floor
  }

  let remaining = totalParts - sumParts
  const indices = Array.from({ length: n }, (_, i) => i)
  indices.sort((a, b) => remainders[b] - remainders[a])

  for (let i = 0; i < remaining; i++) {
    parts[indices[i]] += 1
  }

  // ----- 2. 按数量值分组，强制组内相等 -----
  const groups = new Map()
  counts.forEach((v, i) => {
    if (!groups.has(v)) groups.set(v, [])
    groups.get(v).push(i)
  })

  // 先让每组内的份数变为平均值（四舍五入）
  for (const [value, idxs] of groups) {
    const sum = idxs.reduce((s, i) => s + parts[i], 0)
    const avg = Math.round(sum / idxs.length)
    for (const i of idxs) {
      parts[i] = avg
    }
  }

  // ----- 3. 调整总和，确保等于 totalParts -----
  let currentSum = parts.reduce((a, b) => a + b, 0)
  let attempts = 0
  const groupEntries = Array.from(groups.entries())

  while (currentSum !== totalParts && attempts < 20) {
    const diff = totalParts - currentSum
    // 选择一个组（优先选择最大的组或第一个组）
    const [value, idxs] = groupEntries[0]
    const groupSize = idxs.length

    if (Math.abs(diff) >= groupSize) {
      // 整体增减
      const delta = diff > 0 ? 1 : -1
      for (const i of idxs) {
        parts[i] += delta
      }
      currentSum += delta * groupSize
    } else {
      // diff 不足以整体增减，将差额加到组内第一个索引，然后重新平均
      parts[idxs[0]] += diff
      const sum = idxs.reduce((s, i) => s + parts[i], 0)
      const avg = Math.round(sum / groupSize)
      for (const i of idxs) {
        parts[i] = avg
      }
      currentSum = parts.reduce((a, b) => a + b, 0)
    }
    attempts++
  }

  // 极端情况：如果仍有误差，强制修正（将剩余差额加到第一组）
  if (currentSum !== totalParts) {
    const diff = totalParts - currentSum
    const [value, idxs] = groupEntries[0]
    parts[idxs[0]] += diff
    const sum = idxs.reduce((s, i) => s + parts[i], 0)
    const avg = Math.round(sum / idxs.length)
    for (const i of idxs) parts[i] = avg
  }

  // 返回百分比数字（份数 / factor）
  return parts.map((p) => p / factor)
}
// 获取唯一id
export function getId() {
  return crypto.randomUUID()
}
// 检查日期字符串是否为xxxx-xx-xx格式并且是否有效
export function checkDate(value) {
  // 1. 严格格式校验：必须为 YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return '日期格式不对'
  }

  // 2. 拆解年月日
  const [year, month, day] = value.split('-').map(Number)

  // 3. 合法性校验（含月份范围、各月天数、闰年）
  // 先校验月份是否在 1~12
  if (month < 1 || month > 12) {
    return '日期不合法'
  }

  // 利用 Date 对象校验日期是否存在（防止自动进位）
  const date = new Date(year, month - 1, day)
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  return isValid ? '日期符合规范' : '日期不合法'
}
// 检查时间字符串是否为xx:xx:xx格式并且是否有效
export function checkTime(value) {
  // 1. 格式必须为 HH:mm:ss（两位小时、分钟、秒，用冒号分隔）
  const regex = /^\d{2}:\d{2}:\d{2}$/
  if (!regex.test(value)) {
    return '时间格式不对'
  }

  // 2. 拆解为数字
  const [hour, minute, second] = value.split(':').map(Number)

  // 3. 校验范围
  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return '时间不合法'
  }

  return '时间符合规范'
}
/* 
生成不重复名称
输入参数：
  nameArray：包含所有名称的数组
  name：初始名称
输出参数：不重复的名称，根据重复名称，自动添加数字后缀，如：张三 1
*/
export function createName(nameArray, name) {
  const nameSet = new Set(nameArray)
  let counter = 1
  let newName = name

  if (!nameSet.has(newName)) {
    return newName
  } else {
    // 重复则递增数字，名称与数字之间加一个空格
    while (nameSet.has(newName)) {
      // 核心改动：这里加了个空格
      newName = `${name} ${counter}`
      counter++
    }
    return newName
  }
}
/**
 * 生成通知提示
 * @param {String} channelId - 通知渠道id
 * @param {Number} id - 通知id，必须唯一
 * @param {String} title - 通知标题
 * @param {String} largeBody - 通知正文
 * @param {String} noticeTime - 通知时间，格式如：2026-08-20:12:30:30
 */
export async function addNotice(channelId, id, title, largeBody, noticeTime) {
  const noticeTimeDate = new Date(noticeTime.replace(' ', 'T') + '+08:00')
  await sendNotification({
    channelId: channelId, // 通知渠道id
    id: id, // 通知id，用于取消通知
    title: title, // 通知标题
    largeBody: largeBody, // 通知内容，多行文本
    icon: 'tz', // 自定义图标
    autoCancel: true, // 点击通知，通知消失
    schedule: { 
      at: { 
        date: noticeTimeDate.toISOString() , // 通知触发时间
        repeat: false, // 不重复触发通知
        allowWhileIdle: true // 省电模式下也能触发通知
      }
    }
  })
}
/*
 * 取消指定通知
 * @param {Array} noticeIdArr // 要取消通知的通知id数组
 */
export async function cancelNotice(noticeIdArr) {
  await cancel(noticeIdArr) // 传入任务ID数组
}
/**
 * 清空所有通知
 */
export async function cancelAllNotice() {
  await cancelAll()
}
/**
 * 判断药品是否过期
 * @param {String} expirationDateStr - 有效期字符串，格式如：2026-08-24
 * @returns - 药品状态，未过期 / 临期 / 已过期
 */
export function isExpired(expirationDateStr) {
  const now = new Date()
  const expirationDate = new Date(expirationDateStr)
  const diffTime = expirationDate.getTime() - now.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays > 10) return "未过期"
  else if (diffDays > 0 && diffDays <= 10) return '临期'
  else return '已过期'
}
/**
 * 计算当前时间距离明天0点1分的时间差
 * @returns - 距离明天0点1分的时间差
 */
export function getTimeToMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(0, 1, 0, 0) // 设置为今天的 00:01:00.000
  // 如果当前时间已经过了今天的0点，则目标时间设为明天的0点
  if (now > midnight) {
    midnight.setDate(midnight.getDate() + 1)
  }
  return midnight.getTime() - now.getTime()
}
/**
 * 定时器，每天执行一次
 */
export class DailyTaskScheduler1{
    /**
     * 定时器实例
     * @param {Number} hour 小时，正整数类型，(0-23)
     * @param {Number} minute 分钟，正整数类型，（0-59）
     * @param {Number} second 秒，正整数类型，（0-59） 
     * @param {Function} task 需要执行的任务函数
     */
    constructor(hour,minute,second,task) {
      this.hour = hour
      this.minute = minute
      this.second = second
      this.task = task
      this.timeoutId = null
      this.running = false
    }
    /**
     * 当前时间距离设置的定时的时间差，毫秒
     * @returns 时间差，毫秒
     */
    #getDelay() {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(this.hour, this.minute, this.second, 0) // 设置为今天的指定时间
    // 如果当前时间已经过了今天的指定时间，则目标时间设为明天的指定时间
    if (now > midnight) {
        midnight.setDate(midnight.getDate() + 1)
    }
    return midnight.getTime() - now.getTime()
    }
    /**
     * 创建一个定时器
     */
    #createTimer() {
        const delay = this.#getDelay()
        this.timeoutId = setTimeout(async () => {
            // 执行任务
            await this.task()
            // 递归调度下一次（明天同一时间）
            this.#createTimer()
        }, delay)
    }
    /**
     * 启动定时器
     */
    startTimer() {
        // 如果有任务，先停止
        this.stopTimer()
        this.running = true
        this.#createTimer()
    }
    /**
     * 停止定时器
     */
    stopTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        this.timeoutId = null
        }
        this.running = false
    }
    /**
     * 定时器是否正在运行
     * @returns 定时器状态，true / false
     */
    isRunninig() {
        return this.running
    }
}
/**
 * 定时器，只执行一次
 */
export class DailyTaskScheduler2{
    /**
     * 定时器实例
     * @param {Number} year 年，正整数类型
     * @param {Number} month 月，正整数类型，(1-12)
     * @param {Number} day 日，正整数类型，(符合每月的天数规定)
     * @param {Number} hour 小时，正整数类型，(0-23)
     * @param {Number} minute 分钟，正整数类型，（0-59）
     * @param {Number} second 秒，正整数类型，（0-59） 
     * @param {Function} task 需要执行的任务函数
     */
    constructor(year, month, day, hour,minute,second,task) {
      this.year = year
      this.month = month
      this.day = day
      this.hour = hour
      this.minute = minute
      this.second = second
      this.task = task
      this.timeoutId = null
      this.running = false
    }
    /**
     * 当前时间距离设置的定时的时间差，毫秒
     * @returns 时间差，毫秒
     */
    #getDelay() {
      const now = new Date()
      const executeTime = new Date(this.year,this.month,this.day,this.hour,this.minute,this.second)
      return executeTime.getTime() - now.getTime()
    }
    /**
     * 创建一个定时器
     */
    #createTimer() {
        const delay = this.#getDelay()
        this.timeoutId = setTimeout(async () => {
            // 执行任务
            await this.task()
        }, delay)
    }
    /**
     * 启动定时器
     */
    startTimer() {
        // 如果有任务，先停止
        this.stopTimer()
        this.running = true
        this.#createTimer()
    }
    /**
     * 停止定时器
     */
    stopTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        this.timeoutId = null
        }
        this.running = false
    }
    /**
     * 定时器是否正在运行
     * @returns 定时器状态，true / false
     */
    isRunninig() {
        return this.running
    }
}
/**
 * 根据输入的时间字符串，获取对应的时间段名称
 * @param {*} timeStr 需要判断时间字符串，如：12:30:30
 * @returns {String} 时间段名称，如：早晨、上午、下午、晚上、错误
 */
export function getTimeName(timeStr) {
  const defaultPeriods = [
    { start: 0, end: 8, label: '早晨' },
    { start: 8, end: 12, label: '上午' },
    { start: 12, end: 18, label: '下午' },
    { start: 18, end: 23, label: '晚上' }
  ]
  const hour = Number(timeStr.split(':')[0])
  for (const p of defaultPeriods) {
    if (hour >= p.start && hour < p.end) {
      return p.label
    }
  }
  return '错误'
}
/**
 * 图片 base64 转 Uint8Array
 * @param {String} base64 base64的图片字符串数据
 * @returns Uint8Array格式的二进制数据
 */
export async function base64ToUint8Array(base64) {
  const dataUrl = base64.startsWith('data:')
    ? base64
    : `data:image/jpeg;base64,${base64}`
  const res = await fetch(dataUrl)
  const buf = await res.arrayBuffer()
  return new Uint8Array(buf)
}
