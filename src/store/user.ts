import { defineStore } from 'pinia'
import {AuthService} from "@/api/auth/auth";

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      token: '',
      userInfo: {},
      permissions: [],
      menus: [],
      hasGetRouters: false,
    }
  },
  actions: {
    async loadMenus(){
      const { data, code } = await AuthService.getUserRouters();
      if(code == 200) {
        this.menus = data;
      }
    },
    async loadPermissions(){
      const { data, code } = await AuthService.getPermissions();
      if(code == 200) {
        this.permissions = data;
      }
    },
    async loadUserInfo(){
      const { data, code } = await AuthService.getUserInfo();
      if(code == 200) {
        this.userInfo = data;
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'permissions', 'menus' ],
  }
})