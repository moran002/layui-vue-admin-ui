const modules = import.meta.glob(`@/views/**/*.vue`);
/**
 * 将后端返回的路由配置转换为前端可用的路由配置
 * @param routes 后端返回的路由配置
 */
export const transformRoutes = (routes: any[]): any[] => {
  const transformedRoutes = routes.map(route => {
    const transformedRoute: any = { 
      path: route.path,
      meta: {
        ...route.meta,
      },
      children: []
    }
    
    // 如果有component字段，将其转换为动态导入
    if (route.component) {
      // 处理组件路径
      if (route.component === 'BasicLayout') {
        transformedRoute.component = () => import('@/layouts/BasicLayout.vue')
      } else {
        // 直接使用 route.component 作为导入路径
        const componentPath = route.component
        // 使用动态导入
        transformedRoute.component = modules[`/src/views${componentPath}`]
      }

    }
    
    // 递归处理子路由
    if (route.children && route.children.length) {
      // 过滤掉没有 path 的子路由（这些是权限按钮）
      const validChildren = route.children.filter((child: any) => child.path)
      if (validChildren.length > 0) {
        transformedRoute.children = transformRoutes(validChildren)
      }
    }
    
    return transformedRoute
  })

  return transformedRoutes
} 