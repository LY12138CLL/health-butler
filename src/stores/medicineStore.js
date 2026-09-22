import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {getId,formatDateTime3,isNowBeforeTime} from '../utils/tools'
import {
  addMedicineDataBase,deleteMedicineDataBase,deleteTypeMedicineDataBase,updateMedicineDataBase,
  getAllMedicineDataBase,getAllReserveDataBase,addReserveDataBase,updateReserveDataBase,
  deleteReserveDataBase,deleteAllMedicineDataBase,deleteAllReserveDataBase,addTaskDataBase,
  deleteTaskDataBase,deleteStatusTaskDataBase,deleteAllTaskDataBase,deleteplanIdTaskDataBase,
  deleteMedicineTypeIdTaskDataBase,updateTaskDataBase,getAllTaskDataBase,addPlanDataBase,
  deletePlanDataBase,deleteMedicineTypeIdPlanDataBase,deleteAllPlanDataBase,updatePlanDataBase,
  getAllPlanDataBase
} from '../utils/optionData'
export const medicineStore = defineStore('medicineStore', () => {
  // 数据
  const medicineData = ref([]) // 每盒药品信息
  const remainingMedicineData = ref([]) // 剩余药品信息
  const normsUnit = ref([
    '片',
    '粒',
    '喷',
    '毫升',
    '袋',
    '丸',
    '支',
    '克',
    '毫克'
  ]) // 规格单位

  /* 修改数据的方法 */
  // 添加药品
  async function addMedicine(medicineId,name,norms,normsUnit,manufacturer,productionDate,expirationDate,notes,typeid,price) {
    // 后台添加
    const result = await addMedicineDataBase(
      medicineId,
      name,
      norms,
      normsUnit,
      manufacturer,
      productionDate,
      expirationDate,
      notes,
      typeid,
      price
    )
    if (result === '添加成功') {
      // 前端添加
      medicineData.value.push({
        medicineId,
        name,
        norms,
        normsUnit,
        manufacturer,
        productionDate,
        expirationDate,
        notes,
        typeid,
        price
      })
      return '添加成功'
    }
    return '添加失败1'
  }
  // 删除药品
  async function deleteMedicine(medicineId) {
    // 后台删除
    const result = await deleteMedicineDataBase(medicineId)
    if (result === '删除成功') {
      // 前端删除
      medicineData.value = medicineData.value.filter(
        (item) => item.medicineId !== medicineId
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 删除所有指定分类的药品
  async function deleteTypeMediciine(typeid) {
    // 后台删除
    const result = await deleteTypeMedicineDataBase(typeid)
    if (result === '删除成功') {
      medicineData.value = medicineData.value.filter(
        (item) => item.typeid !== typeid
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 修改药品
  async function updateMedicine(
    medicineId,
    name,
    norms,
    normsUnit,
    manufacturer,
    productionDate,
    expirationDate,
    notes,
    typeid,
    price
  ) {
    // 后台修改
    const result = await updateMedicineDataBase(
      medicineId,
      name,
      norms,
      normsUnit,
      manufacturer,
      productionDate,
      expirationDate,
      notes,
      typeid,
      price
    )
    if (result === '修改成功') {
      // 前端修改
      for (let i = 0; i < medicineData.value.length; i++) {
        if (medicineData.value[i].medicineId === medicineId) {
          medicineData.value[i] = {
            medicineId,
            name,
            norms,
            normsUnit,
            manufacturer,
            productionDate,
            expirationDate,
            notes,
            typeid,
            price
          }
          break
        }
      }
      return '更新成功'
    }
    return '更新失败'
  }
  // 获取所有药品
  async function getAllMedicine() {
    const result = await getAllMedicineDataBase()
    medicineData.value = []
    if (result.messgae === '查询成功') {
      result.result.forEach((item) => {
        medicineData.value.push({
          medicineId: item.medicine_id,
          name: item.name,
          norms: item.norms,
          normsUnit: item.norms_unit,
          manufacturer: item.manufacturer,
          productionDate: item.production_date,
          expirationDate: item.expiration_date,
          notes: item.notes,
          typeid: item.type_id,
          price: item.price
        })
      })
    }
  }
  // 获取每种药品数据
  async function getAllRemainingMedicine() {
    const result = await getAllReserveDataBase()
    if (result.messgae === '查询成功') {
      remainingMedicineData.value = []
      result.result.forEach((item) => {
        remainingMedicineData.value.push({
          typeid: item.type_id,
          name: item.name,
          norms: item.norms,
          normsUnit: item.norms_unit,
          surplus: item.surplus,
          manufacturer: item.manufacturer,
          total: item.total
        })
      })
    }
  }
  // 添加剩余药品
  async function addRemainingMedicine(typeid,name,norms,normsUnit,surplus,manufacturer,total) {
    // 后台添加
    const result = await addReserveDataBase(
      typeid,
      name,
      norms,
      normsUnit,
      surplus,
      manufacturer,
      total
    )
    if (result === '添加成功') {
      // 前端修改
      remainingMedicineData.value.push({
        typeid,
        name,
        norms,
        normsUnit,
        surplus,
        manufacturer,
        total
      })
      return '添加成功'
    }
    return '添加失败'
  }
  // 修改剩余药品数量，参数count为需要添加的药品数量
  async function updateRemainingMedicine(typeid, count) {
    for (const data of remainingMedicineData.value) {
      if (data.typeid === typeid) {
        const normalNumber = Number(data.norms) // 规格中的数量
        const normalUnity = data.normsUnit // 规格中的单位

        data.total = Number(data.total) + Number(count) // 将入库的药片数量添加到总数量中
        const total = data.total // 总药片数量
        const surplusBoxNumber = Math.floor(total / normalNumber) // 剩余数量中的盒数
        const surplusPillsNumber = total % normalNumber // 剩余数量中的片数
        let surplusText = ''
        // 总数为0，则展示0片
        // 剩余盒数为0，剩余片数大于0，则展示 x片
        // 如果剩余盒数大于0，剩余片数位0，则展示x盒
        // 如果剩余盒数大于0，剩余片数大于0，则展示x盒x片
        if (total === 0) surplusText = '0' + normalUnity
        else if (surplusBoxNumber === 0 && surplusPillsNumber > 0)
          surplusText = surplusPillsNumber + normalUnity
        else if (surplusBoxNumber > 0 && surplusPillsNumber === 0)
          surplusText = surplusBoxNumber + '盒'
        else if (surplusBoxNumber > 0 && surplusPillsNumber > 0)
          surplusText = `${surplusBoxNumber}盒${surplusPillsNumber}${normalUnity}`
        else surplusText = '出错'
        // 后端修改
        const result = await updateReserveDataBase(
          data.typeid,
          data.name,
          data.norms,
          normalUnity,
          surplusText,
          data.manufacturer,
          data.total
        )
        if (result === '修改成功') {
          // 前端修改
          data.surplus = surplusText
          return '修改成功'
        } else {
          return '修改失败'
        }
      }
    }
  }
  // 删除指定类型剩余药品
  async function deleteTypeRemainingMedicine(typeid) {
    // 后台删除
    const result = await deleteReserveDataBase(typeid)
    if (result === '删除成功') {
      // 前端删除
      remainingMedicineData.value = remainingMedicineData.value.filter(
        (item) => item.typeid !== typeid
      )
      return '删除成功'
    } else {
      return '删除失败'
    }
  }
  // 清空所有药品记录
  async function deleteAllMedicine() {
    // 前端删除
    const result1 = await deleteAllMedicineDataBase() // 删除所有药品
    const result2 = await deleteAllReserveDataBase() // 删除所有库存
    if (result1 === '清空成功' && result2 === '清空成功') {
      medicineData.value = []
      remainingMedicineData.value = []
      return '清空成功'
    } else {
      return '清空失败'
    }
  }
  // 初始化
  async function init() {
    await getAllMedicine()
    await getAllRemainingMedicine()
  }
  // 计算属性
  // 返回需要的数据、计算属性、方法
  return {
    medicineData,
    remainingMedicineData,
    normsUnit,
    addMedicine,
    deleteMedicine,
    deleteAllMedicine,
    updateMedicine,
    getAllMedicine,
    addRemainingMedicine,
    deleteTypeRemainingMedicine,
    updateRemainingMedicine,
    getAllRemainingMedicine,
    deleteTypeMediciine,
    init
  }
})
export const medicineTaskStore = defineStore('medicineTaskStore', () => {
  // 数据
  const medicineTask = ref([]) // 服药任务
  const medicinePlan = ref([]) // 服药计划
  const medicineTaskNoticeId = ref([])// 未执行的服药任务通知id，用于取消所有服药通知
  // 添加任务
  async function addTask(
    taskId,
    name,
    message,
    noticeTime,
    medicineTypeId,
    planId,
    takeMedicineNumber,
    normsUnit,
    confirmTime,
    status
  ) {
    // 后台添加
    const result = await addTaskDataBase(
      taskId,
      name,
      message,
      noticeTime,
      medicineTypeId,
      planId,
      takeMedicineNumber,
      normsUnit,
      confirmTime,
      status
    )
    if (result === '添加成功') {
      medicineTask.value.push({
        taskId,
        name,
        message,
        noticeTime,
        medicineTypeId,
        planId,
        takeMedicineNumber,
        normsUnit,
        confirmTime,
        status
      })
      return '添加成功'
    }
    return '添加失败'
  }
  // 删除任务
  async function deleteTask(taskId) {
    // 后台删除
    const result = await deleteTaskDataBase(taskId)
    if (result === '删除成功') {
      // 前端删除
      medicineTask.value = medicineTask.value.filter(
        (item) => item.taskId !== taskId
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 清空指定状态的任务
  async function deleteStatusTask(status) {
    // 后端删除
    const result = await deleteStatusTaskDataBase(status)
    if (result === '删除成功') {
      // 前段删除
      medicineTask.value = medicineTask.value.filter(
        (item) => item.status !== status
      )
      return '清空成功'
    }
    return '清空失败'
  }
  // 清空任务
  async function deleteAllTask() {
    // 后台清空
    const result = await deleteAllTaskDataBase()
    if (result === '清空成功') {
      medicineTask.value = []
      return '清空成功'
    } else {
      return '清空失败'
    }
  }
  // 删除所有指定planId且未执行的任务
  async function deleteThisTask(planId) {
    // 后台删除
    const result = await deleteplanIdTaskDataBase(planId)
    if (result === '删除成功') {
      // 前端删除
      medicineTask.value = medicineTask.value.filter(
        (item) => !(item.planId === planId && item.status === '未执行')
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 删除所有指定medicineTypeId且未执行的任务
  async function deleteMedicineTypeIdTask(medicineTypeId) {
    // 后台删除
    const result = await deleteMedicineTypeIdTaskDataBase(medicineTypeId)
    if (result === '删除成功') {
      medicineTask.value = medicineTask.value.filter(
        (item) => item.medicineTypeId !== medicineTypeId
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 修改任务
  async function updateTask(
    taskId,
    name,
    message,
    noticeTime,
    medicineTypeId,
    planId,
    takeMedicineNumber,
    normsUnit,
    confirmTime,
    status
  ) {
    // 后台修改
    const result = await updateTaskDataBase(
      taskId,
      name,
      message,
      noticeTime,
      medicineTypeId,
      planId,
      takeMedicineNumber,
      normsUnit,
      confirmTime,
      status
    )
    if (result === '修改成功') {
      const index = medicineTask.value.findIndex(
        (task) => task.taskId === taskId
      )
      if (index !== -1) {
        medicineTask.value[index] = {
          taskId,
          name,
          message,
          noticeTime,
          medicineTypeId,
          planId,
          takeMedicineNumber,
          normsUnit,
          confirmTime,
          status
        }
        return '更新成功'
      } else {
        return '更新失败'
      }
    }
    return '更新失败'
  }
  // 获取所有任务
  async function getAllTask() {
    // 后台获取
    const result = await getAllTaskDataBase()
    if (result.messgae === '查询成功') {
      // 前端赋值
      medicineTask.value = []
      result.result.forEach((item) => {
        medicineTask.value.push({
          taskId: item.task_id,
          name: item.name,
          message: item.message,
          noticeTime: item.notice_time,
          medicineTypeId: item.medicineType_id,
          planId: item.plan_id,
          takeMedicineNumber: item.takeMedicine_number,
          normsUnit: item.norms_unit,
          confirmTime: item.confirm_time,
          status: item.status
        })
      })
    }
  }
  // 添加计划
  async function addPlan(
    planId,
    name,
    noticeTime,
    startTime,
    endTime,
    implementWeek,
    message,
    medicineTypeId,
    takeMedicineNumber,
    normsUnit
  ) {
    // 后台添加
    const result = await addPlanDataBase(
      planId,
      name,
      noticeTime,
      startTime,
      endTime,
      implementWeek,
      message,
      medicineTypeId,
      takeMedicineNumber,
      normsUnit
    )
    if (result === '添加成功') {
      // 前端添加
      medicinePlan.value.push({
        planId,
        name,
        noticeTime,
        startTime,
        endTime,
        implementWeek,
        message,
        medicineTypeId,
        takeMedicineNumber,
        normsUnit
      })
      await createTask(planId)
      return '添加成功'
    }
    return '添加失败'
  }
  // 删除计划
  async function deletePlan(planId) {
    // 后台删除
    const result = await deletePlanDataBase(planId)
    if (result === '删除成功') {
      // 前端删除
      medicinePlan.value = medicinePlan.value.filter(
        (item) => item.planId !== planId
      )
      createAllTask()
      return '删除成功'
    }
    return '删除失败'
  }
  // 删除所有指定medicineTypeId的计划
  async function deleteMedicineTypeIdPlan(medicineTypeId) {
    // 后台删除
    const result = await deleteMedicineTypeIdPlanDataBase(medicineTypeId)
    if (result === '删除成功') {
      // 前端删除
      medicinePlan.value = medicinePlan.value.filter(
        (item) => item.medicineTypeId !== medicineTypeId
      )
      return '删除成功'
    }
    return '删除失败'
  }
  // 清空计划
  async function deleteAllPlan() {
    // 后台删除
    const result = await deleteAllPlanDataBase()
    if (result === '清空成功') {
      // 前端删除
      medicinePlan.value = []
      return '清空成功'
    }
    return '清空失败'
  }
  // 修改计划
  async function updatePlan(
    planId,
    name,
    noticeTime,
    startTime,
    endTime,
    implementWeek,
    message,
    medicineTypeId,
    takeMedicineNumber,
    normsUnit
  ) {
    const result = await updatePlanDataBase(
      planId,
      name,
      noticeTime,
      startTime,
      endTime,
      implementWeek,
      message,
      medicineTypeId,
      takeMedicineNumber,
      normsUnit
    )
    if (result === '修改成功') {
      const index = medicinePlan.value.findIndex(
        (plan) => plan.planId === planId
      )
      if (index !== -1) {
        medicinePlan.value[index] = {
          planId,
          name,
          noticeTime,
          startTime,
          endTime,
          implementWeek,
          message,
          medicineTypeId,
          takeMedicineNumber,
          normsUnit
        }
        await deleteThisTask(planId)
        await createTask(planId)
        return '更新成功'
      } else {
        return '更新失败'
      }
    }
    return '更新失败'
  }
  // 获取所有计划
  async function getAllPlan() {
    // 后台获取
    const result = await getAllPlanDataBase()
    if (result.messgae === '查询成功') {
      // 前端赋值
      medicinePlan.value = []
      result.result.forEach((item) => {
        medicinePlan.value.push({
          planId: item.plan_id,
          name: item.name,
          noticeTime: item.notice_time,
          startTime: item.start_time,
          endTime: item.end_time,
          implementWeek: item.implement_week,
          message: item.message,
          medicineTypeId: item.medicineType_id,
          takeMedicineNumber: item.takeMedicine_number,
          normsUnit: item.norms_unit
        })
      })
    }
    // medicinePlan.value = [
    //     {
    //         "planId": "a2b281bf-7099-4d49-bb4a-e4a9e83c5ada",//         "name": "优甲乐",//         "noticeTime": "19:40:04",//         "startTime": "2026-08-14 20:40:04",//         "endTime": "2026-08-15 18:40:04",//         "implementWeek": "星期一、星期二、星期三、星期四、星期五、星期六、星期日",//         "message": "饭后服用",//         "medicineTypeId": "123",//         "takeMedicineNumber": "1.75",//         "normsUnit": "片"
    //     }
    // ]
  }
  // 根据计划id生成今天的任务
  async function createTask(planId) {
    const nowDate = new Date() // 当前日期
    const todayWeek = nowDate.toLocaleDateString('zh-CN', { weekday: 'long' }) // 今天的周
    // 获取当前计划信息
    const plan = medicinePlan.value.filter((item) => item.planId === planId)[0]
    // 判断该计划的 计划结束时间是否大于等于当前时间并且提醒星期是否是当前星期的计划
    const isMeet =
      new Date(plan.endTime) >= nowDate &&
      plan.implementWeek.includes(todayWeek)
    // 该计划的今日任务是否已经生成
    const isAlreadyCreateTask = medicineTask.value.some(
      (task) =>
        task.planId === plan.planId &&
        task.noticeTime === formatDateTime3(new Date()) + ' ' + plan.noticeTime
    )
    // 判断该计划关联的药品中的药品数量是否还能满足服用
    const isMeet2 = medicineStore().remainingMedicineData.some(
      (item) =>
        item.typeid === plan.medicineTypeId &&
        Number(item.total) >= Number(plan.takeMedicineNumber)
    )
    // 判断当前时间小于计划提醒时间
    const isMeet3 = isNowBeforeTime(plan.noticeTime)
    if (isMeet && !isAlreadyCreateTask && isMeet2 && !isMeet3) {
      // 生成并添加任务
      // 生成任务的提醒时间noticeTime
      const taskNoticeTime = formatDateTime3(new Date()) + ' ' + plan.noticeTime
      const taskId = getId()
      // 后台添加
      await addTaskDataBase(
        taskId,
        plan.name,
        plan.message,
        taskNoticeTime,
        plan.medicineTypeId,
        plan.planId,
        plan.takeMedicineNumber,
        plan.normsUnit,
        '',
        '未执行'
      )
      // 前端添加任务
      medicineTask.value.push({
        taskId: taskId,
        name: plan.name,
        message: plan.message,
        noticeTime: taskNoticeTime,
        medicineTypeId: plan.medicineTypeId,
        planId: plan.planId,
        takeMedicineNumber: plan.takeMedicineNumber,
        normsUnit: plan.normsUnit,
        confirmTime: '',
        status: '未执行'
      })
    }
  }
  // 生成所有计划的今天任务
  async function createAllTask() {
    for (const plan of medicinePlan.value) {
      const planId = plan.planId
      await createTask(planId)
    }
  }
  // 标记过期任务
  async function markOverdueTask() {
    // 标记今天的任务并且提醒时间超过3小时的任务的status为 过期
    for (const task of medicineTask.value) {
      if (
        task.status === '未执行' &&
        new Date() >
          ((d) => (d.setHours(d.getHours() + 3), d))(new Date(task.noticeTime))
      ) {
        // 后台标记
        await updateTaskDataBase(
          task.taskId,
          task.name,
          task.message,
          task.noticeTime,
          task.medicineTypeId,
          task.planId,
          task.takeMedicineNumber,
          task.normsUnit,
          task.confirmTime,
          task.status
        )
        // 前端标记
        task.status = '已过期'
      }
    }
  }
  /**
   * 计算指定id的药品还能服用多少天（不算今天）
   * @param {String} typeid 药品id
   * @returns {Number} 还能服用的天数
   */
  function getRemainingDays(typeid) {
  // 1. 检查是否有该药品的计划
  const drugPlans = medicinePlan.value.filter(p => p.medicineTypeId === typeid);
  if (drugPlans.length === 0) return -1; // 无计划，返回-1

  // 2. 查找库存
  const stockItem = medicineStore().remainingMedicineData.find(r => r.typeid === typeid);
  if (!stockItem) return 0;
  let stock = parseFloat(stockItem.total) || 0;
  if (stock <= 0) return 0;

  // 3. 获取今天和明天
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekDays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const todayWeekName = weekDays[today.getDay()];

  // 4. 扣除今天一整天的剂量
  let todayDose = 0;
  for (const plan of drugPlans) {
    const planDays = plan.implementWeek.split(/[、，,]/).map(s => s.trim()).filter(Boolean);
    if (planDays.includes(todayWeekName)) {
      todayDose += parseFloat(plan.takeMedicineNumber) || 0;
    }
  }
  stock -= todayDose;
  if (stock < 0) stock = 0;

  // 5. 从明天开始模拟
  let days = 0;
  let currentDate = new Date(tomorrow);

  while (stock > 0) {
    const dayOfWeek = weekDays[currentDate.getDay()];
    let dailyDose = 0;
    for (const plan of drugPlans) {
      const planDays = plan.implementWeek.split(/[、，,]/).map(s => s.trim()).filter(Boolean);
      if (planDays.includes(dayOfWeek)) {
        dailyDose += parseFloat(plan.takeMedicineNumber) || 0;
      }
    }

    if (dailyDose === 0) {
      days++;
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    if (stock >= dailyDose) {
      stock -= dailyDose;
      days++;
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      break;
    }
  }

  return days;
  }
  // 每日示信息
  const promptMessage = computed(() => {
    const tasks = medicineTask.value.filter(
      (item) =>
        new Date(item.noticeTime).toDateString() ===
          new Date().toDateString() && item.status === '未执行'
    )
    if (tasks.length > 0) {
      const newTasks = [...tasks].sort(
        (a, b) => new Date(a.noticeTime) - new Date(b.noticeTime)
      )
      return '今天' + newTasks[0].noticeTime.split(' ')[1] + '服药'
    } else {
      return '今天暂无服药任务'
    }
  })
  // 初始化
  async function init() {
    await getAllTask()
    await getAllPlan()
    await createAllTask()
    await markOverdueTask()
  }
  return {
    medicineTask,
    medicinePlan,
    medicineTaskNoticeId,
    addTask,
    deleteTask,
    deleteAllTask,
    deleteStatusTask,
    updateTask,
    getAllTask,
    addPlan,
    deletePlan,
    deleteAllPlan,
    updatePlan,
    getAllPlan,
    deleteMedicineTypeIdTask,
    deleteMedicineTypeIdPlan,
    deleteThisTask,
    promptMessage,
    init,
    getRemainingDays
  }
})
