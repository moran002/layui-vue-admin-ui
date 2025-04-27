import BasicLayout from '../../layouts/BasicLayout.vue';
import Login from '../../views/login/index.vue';


export default [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    component: Login,
    meta: { title: '登录页面' },
  },
  {
    path: '/index',
    redirect: '/index/index',
    component: BasicLayout,
    meta: { title: '工作空间' },
    children: [
      {
        path: '/index/index',
        name: 'Workbench',
        component: () => import('@/views/index/index/index.vue'),
        meta: { title: '工作台', requireAuth: true, affix: true, closable: false },
      }
    ]
  }, {
    path: '/system',
    component: BasicLayout,
    meta: { title: '系统管理' },
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', requireAuth: true },
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', requireAuth: true },
      },
      {
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', requireAuth: true },
      }
    ]
  },
  {
    path: '/error',
    component: BasicLayout,
    meta: { title: '错误页面' },
    children: [
      {
        path: '/error/401',
        component: () => import('@/views/error/401.vue'),
        meta: { title: '401' },
      },
      {
        path: '/error/403',
        component: () => import('@/views/error/403.vue'),
        meta: { title: '403' },
      },
      {
        path: '/error/404',
        component: () => import('@/views/error/404.vue'),
        meta: { title: '404' },
      },
      {
        path: '/error/500',
        component: () => import('@/views/error/500.vue'),
        meta: { title: '500' },
      }
    ]
  }


]
