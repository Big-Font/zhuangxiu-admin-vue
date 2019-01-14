import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '管理面板', icon: 'example' },
    }]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/api',
    name: 'user',
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path: 'api',
        name: 'apiUser',
        component: () => import('@/views/fontUser/index'),
        meta: { title: 'm站', icon: 'people' }
      },
      {
        path: 'admin',
        name: 'adminUser',
        component: () => import('@/views/adminUser/index'),
        meta: { title: '后台管理', icon: 'user' }
      }
    ]
  },
  // banner管理模块
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/banner'),
        meta: { title: 'banner管理', icon: 'drag' }
      }
    ]
  },
  // 装修案例管理
  {
    path: '/caseList',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'caseListList',
        component: () => import('@/views/caseList'),
        meta: { title: '装修案例', icon: 'form' }
      }
    ]
  },
  // 资讯管理模块
  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'articleList',
        component: () => import('@/views/article'),
        meta: { title: '资讯管理', icon: 'international' }
      }
    ]
  },
  // 秒杀活动管理
  {
    path: '/spike',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'spikeList',
        component: () => import('@/views/spike'),
        meta: { title: '秒杀活动', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

