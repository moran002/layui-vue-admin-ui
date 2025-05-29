<template>
  <lay-config-provider
      :themeVariable="appStore.themeVariable"
      :theme="appStore.theme"
      :locales="locales"
      :locale="appStore.locale"
  >
    <lay-layout
        :class="[
        appStore.tab ? 'has-tab' : '',
        appStore.collapse ? 'collapse' : '',
        appStore.greyMode ? 'grey-mode' : ''
      ]"
    >
      <!-- 遮盖层 -->
      <div
          v-if="!appStore.collapse"
          class="layui-layer-shade hidden-sm-and-up"
          @click="collapse"
      ></div>
      <!-- 核心菜单  -->
      <lay-side
          :width="sideWidth"
          :class="appStore.sideTheme == 'dark' ? 'dark changeBgc' : 'light'"
      >
        <!--右上角-->
        <lay-logo v-if="appStore.logo">Layui Vue Vite</lay-logo>
        <div class="side-menu-wrapper">
          <div
              class="side-menu1"
              v-if="appStore.subfield && appStore.subfieldPosition == 'side'"
          >
            <global-main-menu
                :collapse="true"
                :menus="mainMenus"
                :selectedKey="mainSelectedKey"
                @changeSelectedKey="changeMainSelectedKey"
            ></global-main-menu>
          </div>
          <div class="side-menu2">
            <global-menu
                :collapse="appStore.collapse"
                :menus="menus"
                :openKeys="openKeys"
                :selectedKey="selectedKey"
                @changeOpenKeys="changeOpenKeys"
                @changeSelectedKey="changeSelectedKey"
            ></global-menu>
          </div>
        </div>
      </lay-side>
      <lay-layout style="width: 0px">
        <!-- 布局头部 -->
        <lay-header style="display: flex">
          <lay-menu class="layui-layout-left">
            <lay-menu-item @click="collapse">
              <lay-icon
                  v-if="appStore.collapse"
                  type="layui-icon-spread-left"
              ></lay-icon>
              <lay-icon v-else type="layui-icon-shrink-right"></lay-icon>
            </lay-menu-item>
            <lay-menu-item class="hidden-xs-only" @click="refresh">
              <lay-icon type="layui-icon-refresh-one"></lay-icon>
            </lay-menu-item>
            <lay-menu-item
                class="hidden-xs-only"
                v-if="appStore.breadcrumb"
                style="padding: 0px 15px"
            >
              <GlobalBreadcrumb></GlobalBreadcrumb>
            </lay-menu-item>
          </lay-menu>
          <!-- 菜单分组 -->
          <lay-menu
              v-if="appStore.subfield && appStore.subfieldPosition == 'head'"
              class="layui-nav-center"
              :selectedKey="mainSelectedKey"
              @changeSelectedKey="changeMainSelectedKey"
          >
            <template v-for="(menu, index) in mainMenus" :key="index">
              <lay-menu-item :id="menu.id" v-if="index < 4">
                <template #title>{{ menu.title }}</template>
              </lay-menu-item>
            </template>
          </lay-menu>
          <lay-dropdown
              v-if="appStore.subfield && appStore.subfieldPosition == 'head'"
              trigger="hover"
              placement="bottom"
          >
            <lay-icon
                type="layui-icon-more"
                style="padding: 0px 15px"
            ></lay-icon>
            <template #content>
              <lay-dropdown-menu>
                <template v-for="(menu, index) in mainMenus">
                  <lay-dropdown-menu-item
                      :key="menu.id"
                      v-if="index >= 4"
                      @click="changeMainSelectedKey(menu.id)"
                  >{{ menu.title }}
                  </lay-dropdown-menu-item>
                </template>
              </lay-dropdown-menu>
            </template>
          </lay-dropdown>
          <lay-menu class="layui-layout-right">
            <lay-menu-item>
              <lay-fullscreen v-slot="{ toggle, isFullscreen }">
                <lay-icon
                    @click="toggle()"
                    :type="
                    isFullscreen
                      ? 'layui-icon-screen-restore'
                      : 'layui-icon-screen-full'
                  "
                ></lay-icon>
              </lay-fullscreen>
            </lay-menu-item>
            <lay-menu-item>
              <global-message-tab :flag="flag">
                <lay-icon
                    type="layui-icon-notice"
                    @click="changeDropdown"
                ></lay-icon>
              </global-message-tab>
            </lay-menu-item>
            <lay-menu-item>
              <lay-dropdown placement="bottom">
                <lay-avatar>{{ userInfoStore.userInfo.nickName }}</lay-avatar>
                <template #content>
                  <lay-dropdown-menu>
                    <lay-dropdown-menu-item @click="logOut">
                      <template #default>注销登录</template>
                    </lay-dropdown-menu-item>
                  </lay-dropdown-menu>
                </template>
              </lay-dropdown>
            </lay-menu-item>
            <lay-menu-item @click="changeVisible">
              <lay-icon type="layui-icon-more-vertical"></lay-icon>
            </lay-menu-item>
          </lay-menu>
        </lay-header>
        <lay-body>
          <global-tab
              :class="
              appStore.tagsTheme == 'concise'
                ? ''
                : appStore.tagsTheme == 'underpainting'
                ? 'underpainting'
                : 'designer'
            "
          >
          </global-tab>
          <global-content></global-content>
        </lay-body>
        <lay-footer></lay-footer>
      </lay-layout>
    </lay-layout>
    <global-setup v-model="visible"></global-setup>
  </lay-config-provider>
</template>

<script lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useAppStore} from '../store/app'
import {useUserStore} from '../store/user'
import GlobalSetup from './global/GlobalSetup.vue'
import GlobalContent from './global/GlobalContent.vue'
import GlobalBreadcrumb from './global/GlobalBreadcrumb.vue'
import GlobalTab from './global/GlobalTab.vue'
import GlobalMenu from './global/GlobalMenu.vue'
import GlobalMainMenu from './global/GlobalMainMenu.vue'
import GlobalMessageTab from './global/GlobalMessageTab.vue'
import {useRouter} from 'vue-router'
import {useMenu} from './composable/useMenu'
import zh_CN from '../lang/zh_CN'
import en_US from '../lang/en_US'
import {AuthService} from "@/api/auth/auth";
import {resetRouter} from "@/router";

export default {
  components: {
    GlobalSetup,
    GlobalContent,
    GlobalTab,
    GlobalMenu,
    GlobalBreadcrumb,
    GlobalMainMenu,
    GlobalMessageTab
  },
  setup() {
    const appStore = useAppStore()
    const userInfoStore = useUserStore()
    const fullscreenRef = ref()
    const visible = ref(false)
    const sideWidth = computed(() =>
        appStore.collapse
            ? '60px'
            : appStore.subfield && appStore.subfieldPosition == 'side'
                ? '280px'
                : '220px'
    )
    const router = useRouter()

    const {
      selectedKey,
      openKeys,
      menus,
      mainMenus,
      mainSelectedKey,
      changeMainSelectedKey,
      changeSelectedKey,
      changeOpenKeys
    } = useMenu()

    onMounted(() => {
      if (document.body.clientWidth < 768) {
        appStore.collapse = true
      }
      userInfoStore.loadMenus()
      userInfoStore.loadPermissions()
    })

    const changeVisible = () => {
      visible.value = !visible.value
    }

    const currentIndex = ref('1')

    const collapse = () => {
      appStore.collapse = !appStore.collapse
    }

    const refresh = () => {
      appStore.routerAlive = false
      setTimeout(function () {
        appStore.routerAlive = true
      }, 500)
    }

    const logOut = () => {
      AuthService.logout().then((res) => {
        if (res.code == 200) {
          const userInfoStore = useUserStore()
          userInfoStore.token = ''
          userInfoStore.userInfo = {}
          userInfoStore.hasGetRouters = false
          resetRouter()
          router.push('/login')
        }
      })
    }

    const locales = [
      {name: 'zh_CN', locale: zh_CN, merge: true},
      {name: 'en_US', locale: en_US, merge: true}
    ]

    function toUserInfo() {
      router.push('/enrollee/profile')
    }

    function toSystemSet() {
      router.push('/system/menu')
    }

    const flag = ref(false)

    function changeDropdown() {
      flag.value = !flag.value
    }

    return {
      sideWidth,
      mainSelectedKey,
      fullscreenRef,
      appStore,
      visible,
      menus,
      mainMenus,
      userInfoStore,
      currentIndex,
      selectedKey,
      openKeys,
      collapse,
      changeOpenKeys,
      changeSelectedKey,
      changeMainSelectedKey,
      changeVisible,
      refresh,
      logOut,
      locales,
      toUserInfo,
      toSystemSet,
      changeDropdown,
      flag
    }
  }
}
</script>

<style lang="less">
@media screen and (max-width: 767px) {
  .layui-side {
    position: absolute;
    height: 100vh;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
  }
}

/* Header styling improvements */
.layui-header {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: #fff;
  transition: all 0.3s ease;
  
  .layui-nav-item {
    .layui-icon {
      color: #666;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--global-primary-color);
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }
}

/* Side menu improvements */
.side-menu-wrapper {
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 52px);
  display: flex;
  transition: all 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}

.light .side-menu-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.side-menu1 {
  width: 60px;
  flex: 0 0 60px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.light .side-menu1 {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.side-menu2 {
  flex: 1;
  transition: all 0.3s ease;
}

/* Theme improvements */
.changeBgc {
  background-color: #171717 !important;
  transition: background-color 0.3s ease;
}

.grey-mode {
  filter: grayscale(1);
  transition: filter 0.3s ease;
}

/* Tab styling improvements */
.underpainting {
  .layui-tab-title {
    .layui-this {
      color: var(--global-primary-color) !important;
      border-bottom: 2px solid var(--global-primary-color) !important;
      background-color: rgba(0, 155, 142, 0.08) !important;
      transition: all 0.3s ease;

      .layui-icon {
        color: var(--global-primary-color) !important;
      }
    }
  }
}

.designer {
  padding-left: 5px;
  box-sizing: border-box;

  .layui-tab-head {
    background-color: transparent !important;
  }

  .layui-tab-title {
    background-color: transparent !important;

    > li {
      background-color: #fff;
      margin: 5px 0 0 5px;
      border-radius: 4px;
      height: 32px !important;
      line-height: 32px !important;
      transition: all 0.3s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      
      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

/* Avatar and dropdown improvements */
.layui-avatar {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

/* Fullscreen button improvements */
.layui-icon-screen-full,
.layui-icon-screen-restore {
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
}
</style>
