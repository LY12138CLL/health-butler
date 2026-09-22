// 数据库连接
import Database from '@tauri-apps/plugin-sql'

let dbInstance = null
let initialized = false
// 获取数据库连接
async function getDatabase() {
  if (!initialized) {
    dbInstance = await Database.load('sqlite:health.db')
    initialized = true
    // 初始化表（可以在这里调用建表逻辑）
    await initBPrecordTables(dbInstance)
  }
  return dbInstance
}
// 初始化血压表、分组表
async function initBPrecordTables(db) {
  // 血压表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS BPrecord (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sbp INTEGER NOT NULL,
      dbp INTEGER NOT NULL,
      hr INTEGER NOT NULL,
      notes TEXT NOT NULL,
      date_time TEXT NOT NULL,
      group_id TEXT NOT NULL,
      group_name TEXT NOT NULL
    )
  `)
  // 分组表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS BPrecordGroup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL,
      group_name TEXT NOT NULL
    )
  `)
  // 药品表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicine (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id TEXT NOT NULL,
      name TEXT NOT NULL,
      norms TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      production_date TEXT NOT NULL,
      expiration_date TEXT NOT NULL,
      notes TEXT NOT NULL,
      type_id TEXT NOT NULL,
      price TEXT NOT NULL
    )
  `)
  // 药品库存表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicineReserve (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_id TEXT NOT NULL,
      name TEXT NOT NULL,
      norms TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      surplus TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      total
    )
  `)
  // 服药任务表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicineTask (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      notice_time TEXT NOT NULL,
      medicineType_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      takeMedicine_number TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      confirm_time TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `)
  // 服药计划表，不存在创建
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicinePlan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id TEXT NOT NULL,
      name TEXT NOT NULL,
      notice_time TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      implement_week TEXT NOT NULL,
      message TEXT NOT NULL,
      medicineType_id TEXT NOT NULL,
      takeMedicine_number TEXT NOT NULL,
      norms_unit TEXT NOT NULL
    )
  `)
}
// 添加分组
export async function addBPgroup(group_id, group_name) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO BPrecordGroup (group_id, group_name) VALUES('${group_id}', '${group_name}')`)
    return "添加成功"
  } catch(e) {
    console.log(e)
    return "添加失败"
  }
}
// 删除分组
export async function deleteBPgroup(group_id) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM BPrecordGroup WHERE group_id='${group_id}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 查询所有分组
export async function selectAllBPgroup() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM BPrecordGroup`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
}

// 添加血压记录
export async function addBPrecord({ sbp, dbp, hr, notes, date_time, group_id, group_name }) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO BPrecord (sbp, dbp, hr, notes, date_time, group_id, group_name) VALUES(${sbp}, ${dbp}, ${hr}, '${notes}', '${date_time}', '${group_id}', '${group_name}')`)
    return "添加成功"
  } catch(e) {
    return "添加失败"
  }
}
// 删除血压记录
export async function deleteBPrecord(record_id) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM BPrecord WHERE id=${record_id}`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 修改血压记录分组
export async function updateBPrecordGroup(record_id,new_group_id,new_group_name) {
  try {
    const db = await getDatabase()
    await db.execute(`UPDATE BPrecord SET group_id='${new_group_id}', group_name='${new_group_name}' WHERE id='${record_id}'`)
    return "修改成功"
  }
  catch(e) {
    return "修改失败"
  }
}
// 查询所有血压记录
export async function selectAllBPrecord() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM BPrecord`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
}
// 删除所有血压记录
export async function deleteAllBPrecord() {
  try {
    const db = await getDatabase()
    // 清空血压表
    await db.execute(`
    DROP TABLE IF EXISTS BPrecord
    `)
    await db.execute(`
      CREATE TABLE BPrecord (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
      sbp INTEGER NOT NULL,
      dbp INTEGER NOT NULL,
      hr INTEGER NOT NULL,
      notes TEXT NOT NULL,
      date_time TEXT NOT NULL,
      group_id TEXT NOT NULL,
      group_name TEXT NOT NULL
      )
    `)
    return "清空成功"
  }
  catch(e) {
    return "清空失败"
  }
}
// 删除所有分组
export async function deleteAllBPrecordGroup() {
  try {
    const db = await getDatabase()
    // 清空分组表
    await db.execute(`
      DROP TABLE IF EXISTS BPrecordGroup
      `)
    await db.execute(`
      CREATE TABLE BPrecordGroup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL,
      group_name TEXT NOT NULL
      )
    `) 
    return "清空成功"
  }
  catch(e) {
    return "清空失败"
  }
  
}

// 添加药品
export async function addMedicineDataBase(medicineId,name,norms,normsUnit,manufacturer,productionDate,expirationDate,notes,typeid,price) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO medicine (medicine_id, name, norms,norms_unit,manufacturer,production_date,expiration_date,notes,type_id,price) VALUES('${medicineId}','${name}','${norms}','${normsUnit}','${manufacturer}','${productionDate}','${expirationDate}','${notes}','${typeid}','${price}')`)
    return "添加成功"
  } catch(e) {
    console.log(e)
    return "添加失败"
  }
}
// 删除药品
export async function deleteMedicineDataBase(medicineId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicine WHERE medicine_id='${medicineId}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除所有指定分类的药品
export async function deleteTypeMedicineDataBase(typeid) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicine WHERE type_id='${typeid}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除所有药品
export async function deleteAllMedicineDataBase() {
  try {
    const db = await getDatabase()
    // 清空血压表
    await db.execute(`DROP TABLE IF EXISTS medicine`)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS medicine (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id TEXT NOT NULL,
      name TEXT NOT NULL,
      norms TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      production_date TEXT NOT NULL,
      expiration_date TEXT NOT NULL,
      notes TEXT NOT NULL,
      type_id TEXT NOT NULL,
      price TEXT NOT NULL
    )
    `)
    return "清空成功"
  }
  catch(e) {
    return "清空失败"
  }
}
// 修改药品
export async function updateMedicineDataBase(medicineId,name,norms,normsUnit,manufacturer,productionDate,expirationDate,notes,typeid,price) {
  try {
    const db = await getDatabase()
    await db.execute(`UPDATE medicine SET name='${name}',norms='${norms}',norms_unit='${normsUnit}',manufacturer='${manufacturer}', production_date='${productionDate}', expiration_date='${expirationDate}', notes='${notes}', type_id='${typeid}', price='${price}' WHERE medicine_id='${medicineId}'`)
    return "修改成功"
  }
  catch(e) {
    return "修改失败"
  }
}
// 获取所有药品
export async function getAllMedicineDataBase() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM medicine`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
} 

// 添加库存
export async function addReserveDataBase(typeid,name,norms,normsUnit,surplus,manufacturer,total) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO medicineReserve (type_id,name,norms,norms_unit,surplus,manufacturer,total) VALUES('${typeid}','${name}','${norms}','${normsUnit}','${surplus}','${manufacturer}','${total}')`)
    return "添加成功"
  } catch(e) {
    console.log(e)
    return "添加失败"
  }
}
// 删除库存
export async function deleteReserveDataBase(typeid) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicineReserve WHERE type_id='${typeid}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除所有库存
export async function deleteAllReserveDataBase() {
  try {
    const db = await getDatabase()
    // 清空血压表
    await db.execute(`
    DROP TABLE IF EXISTS medicineReserve
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS medicineReserve (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_id TEXT NOT NULL,
      name TEXT NOT NULL,
      norms TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      surplus TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      total TEXT NOT NULL
    )
    `)
    return "清空成功"
  }
  catch(e) {
    return "清空失败"
  }
}
// 修改库存
export async function updateReserveDataBase(typeid,name,norms,normsUnit,surplus,manufacturer,total) {
  try {
    const db = await getDatabase()
    await db.execute(`UPDATE medicineReserve SET  name='${name}',norms='${norms}',norms_unit='${normsUnit}',surplus='${surplus}',manufacturer='${manufacturer}',total='${total}' WHERE type_id='${typeid}'`)
    return "修改成功"
  }
  catch(e) {
    console.log(e)
    return "修改失败"
  }
}
// 获取所有库存
export async function getAllReserveDataBase() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM medicineReserve`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
}

// 添加任务
export async function addTaskDataBase(taskId, name, message, noticeTime, medicineTypeId, planId, takeMedicineNumber, normsUnit, confirmTime, status) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO medicineTask (task_id, name, message, notice_time, medicineType_id, plan_id, takeMedicine_number, norms_unit, confirm_time, status) VALUES('${taskId}','${name}','${message}','${noticeTime}','${medicineTypeId}','${planId}','${takeMedicineNumber}','${normsUnit}','${confirmTime}','${status}')`)
    return "添加成功"
  } catch(e) {
    return "添加失败"
  }
}
// 删除任务
export async function deleteTaskDataBase(taskId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicineTask WHERE task_id='${taskId}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除指定状态任务
export async function deleteStatusTaskDataBase(status) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicineTask WHERE status='${status}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除指定planId且未执行的任务
export async function deleteplanIdTaskDataBase(planId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicineTask WHERE plan_id='${planId}' AND status='${'未执行'}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除指定medicineTypeId且未执行的任务
export async function deleteMedicineTypeIdTaskDataBase(medicineTypeId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicineTask WHERE medicineType_id='${medicineTypeId}' AND status='${'未执行'}'`)
    return "删除成功"
  } catch(e) {
    console.log(e)
    return "删除失败"
  }
}
// 删除所有任务
export async function deleteAllTaskDataBase() {
  try {
    const db = await getDatabase()
    // 清空血压表
    await db.execute(`
    DROP TABLE IF EXISTS medicineTask
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS medicineTask (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      notice_time TEXT NOT NULL,
      medicineType_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      takeMedicine_number TEXT NOT NULL,
      norms_unit TEXT NOT NULL,
      confirm_time TEXT NOT NULL,
      status TEXT NOT NULL
    )
    `)
    return "清空成功"
  }
  catch(e) {
    console.log(e)
    return "清空失败"
  }
}
// 修改任务
export async function updateTaskDataBase(taskId, name, message, noticeTime, medicineTypeId, planId, takeMedicineNumber,normsUnit , confirmTime, status) {
  try {
    const db = await getDatabase()
    await db.execute(`UPDATE medicineTask SET  name='${name}',message='${message}',notice_time='${noticeTime}',medicineType_id='${medicineTypeId}',plan_id='${planId}',takeMedicine_number='${takeMedicineNumber}',norms_unit='${normsUnit}',confirm_time='${confirmTime}',status='${status}' WHERE task_id='${taskId}'`)
    return "修改成功"
  }
  catch(e) {
    return "修改失败"
  }
}
// 获取所有任务
export async function getAllTaskDataBase() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM medicineTask`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
}

// 添加计划
export async function addPlanDataBase(planId, name,noticeTime, startTime, endTime, implementWeek, message, medicineTypeId,takeMedicineNumber,normsUnit) {
  try {
    const db = await getDatabase()
    await db.execute(`INSERT INTO medicinePlan (plan_id, name,notice_time, start_time, end_time, implement_week, message, medicineType_id,takeMedicine_number,norms_unit) VALUES('${planId}','${name}','${noticeTime}','${startTime}','${endTime}','${implementWeek}','${message}','${medicineTypeId}','${takeMedicineNumber}','${normsUnit}')`)
    return "添加成功"
  } catch(e) {
    console.log(e)
    return "添加失败"
  }
}
// 删除计划
export async function deletePlanDataBase(planId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicinePlan WHERE plan_id='${planId}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除所有指定medicineTypeId的计划
export async function deleteMedicineTypeIdPlanDataBase(medicineTypeId) {
  try {
    const db = await getDatabase()
    await db.execute(`DELETE FROM medicinePlan WHERE medicineType_id='${medicineTypeId}'`)
    return "删除成功"
  } catch(e) {
    return "删除失败"
  }
}
// 删除所有计划
export async function deleteAllPlanDataBase() {
  try {
    const db = await getDatabase()
    // 清空血压表
    await db.execute(`
    DROP TABLE IF EXISTS medicinePlan
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS medicinePlan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id TEXT NOT NULL,
      name TEXT NOT NULL,
      notice_time TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      implement_week TEXT NOT NULL,
      message TEXT NOT NULL,
      medicineType_id TEXT NOT NULL,
      takeMedicine_number TEXT NOT NULL,
      norms_unit TEXT NOT NULL
    )
    `)
    return "清空成功"
  }
  catch(e) {
    return "清空失败"
  }
}
// 修改计划
export async function updatePlanDataBase(planId, name,noticeTime, startTime, endTime, implementWeek, message, medicineTypeId,takeMedicineNumber,normsUnit) {
  try {
    const db = await getDatabase()
    await db.execute(`UPDATE medicinePlan SET  name='${name}',notice_time='${noticeTime}',start_time='${startTime}',end_time='${endTime}',implement_week='${implementWeek}',message='${message}',medicineType_id='${medicineTypeId}',takeMedicine_number='${takeMedicineNumber}',norms_unit='${normsUnit}'WHERE plan_id='${planId}'`)
    return "修改成功"
  }
  catch(e) {
    return "修改失败"
  }
}
// 获取所有任务
export async function getAllPlanDataBase() {
  try {
    const db = await getDatabase()
    const result = await db.select(`SELECT * FROM medicinePlan`)
    return {messgae: "查询成功", result:result}
  }
  catch(e) {
    return {messgae: "查询失败", result:{}}
  }
}