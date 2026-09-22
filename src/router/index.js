import { path } from '@tauri-apps/api'
import { createRouter,createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: '/statistics',
        component: () => import('../views/Statistics.vue'),
      },
      {
        path: '/user',
        component: () => import('../views/User.vue'),
      },
      
    ],
    redirect: '/home'
  },
  // 血压记录
  {
    path: '/bphome',
    component: () => import('../views/BP/BPhome.vue')
  },
  {
    path: '/bpgrouprecord',
    component: () => import('../views/BP/BPgroupRecord.vue')
  },
  {
    path: '/bpgallrecord',
    component: () => import('../views/BP/BPallRecord.vue')
  }, 
  // 服药管理
  {
    path: '/medicinehome',
    component: () => import('../views/Medicine/MedicineHome.vue')
  },
  {
    path: '/medicinemanage',
    component: () => import('../views/Medicine/MedicineManage.vue')
  },
  {
    path: '/medicindetails',
    component: () => import('../views/Medicine/MedicineDetalis.vue')
  },
  {
    path: '/takemanage',
    component: () => import('../views/Medicine/TakeManage.vue')
  },
  {
    path: '/editask',
    component: () => import('../views/Medicine/EditTask.vue'),
  },
  {
    path: '/addeditplan',
    component: () => import('../views/Medicine/AddEditPlan.vue'),
  },
  {
    path: '/addeditmedicine',
    component: () => import('../views/Medicine/AddEditMedicine.vue'),
  },
  {
    path: '/settinghome',
    component: () => import('../views/setting/SettingHome.vue'),
  },
  {
    path: '/helphome',
    component: () => import('../views/help/HelpHome.vue'),
  },
  {
    path: '/bphelp',
    component: () => import('../views/help/BPhelp.vue'),
  },
  {
    path: '/takemedicinehelp',
    component: () => import('../views/help/TakeMedicineHelp.vue'),
  },
  ,
  {
    path: '/noticehelp',
    component: () => import('../views/help/NoticeHelp.vue'),
  },
  {
    path: '/abouthome',
    component: () => import('../views/about/AboutHome.vue'),
  },
  {
    path: '/aboutintroduction',
    component: () => import('../views/about/AboutIntroduction.vue'),
  },
  {
    path: '/abouttip',
    component: () => import('../views/about/AboutTip.vue'),
  },
  {
    path: '/runbackground',
    component: () => import('../views/setting/RunBackground.vue'),
  },
  {
    path: '/noticeaudio',
    component: () => import('../views/setting/NoticeAudio.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 每次路由切换后滚动到顶部
    return { top: 0 }
  }
})


export default router


