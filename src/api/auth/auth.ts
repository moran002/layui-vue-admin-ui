import Http from '@/api/http';

export class AuthService {
  // 登录
  static login(loginForm: any) {
    return Http.post('/auth/login', loginForm)
  }

  // 获取菜单
  static getUserRouters() {
    return Http.get('/auth/userRouters')
  }

  // 获取菜单
  static getRouters() {
    return Http.get('/auth/routers')
  }

  // 获取用户信息
  static getUserInfo() {
    return Http.get('/auth/userInfo')
  }

  // 获取权限
  static getPermissions() {
    return Http.get('/auth/permissions')
  }

  // 登出
  static logout() {
    return Http.post('/auth/logout')
  }
}
