import { createRouter, createWebHashHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from "../store/user";
import {remainingRouter} from "@/router/module/remaining";
import {AuthService} from "@/api/auth/auth";
import {transformRoutes} from "@/utils/route";

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  routes: remainingRouter
})

// 重置路由
export const resetRouter = () => {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: remainingRouter
  })
  // @ts-ignore
  router.matcher = newRouter.matcher
}


// 动态添加路由
export const addRoutes = async () => {
  try {
    const userStore = useUserStore()
    if (!userStore.hasGetRouters) {
      // 获取路由数据（如果还没有获取过）
      const res = await AuthService.getRouters()
      userStore.routers = res.data
      userStore.hasGetRouters = true
    }
    if (router.getRoutes().length <= 7) {
      // 转换路由配置
      const transformedRoutes =  transformRoutes(userStore.routers)
      // 添加路由
      transformedRoutes.forEach(route => {
        router.addRoute(route)
      })
    }
    console.log(router.getRoutes().length)
  } catch (error) {
    // 获取信息失败，清除token并跳转到登录页
    const userStore = useUserStore()
    router.push('/login')
  }
}

/**
 * Router 前置拦截
 * 
 * 1.验证 token 存在, 并且有效, 否则 -> login.vue
 * 2.验证 permission 存在, 否则 -> 403.vue
 * 3.验证 router 是否存在, 否则 -> 404.vue
 * 
 * @param to 目标
 * @param from 来至 
 */
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start();

  const userStore = useUserStore();
  if (userStore.token) {
    await addRoutes()
    next()
  } else {
    // 未登录
    if (to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }

})

router.afterEach(() => {
  NProgress.done();
})

router.onError((error) => {
  console.error('路由错误:', error);
});


export default router