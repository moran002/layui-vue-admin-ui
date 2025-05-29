<template>
  <div class="global-tab" v-if="appStore.tab">
    <lay-tab
      :modelValue="currentPath"
      :allowClose="true"
      @change="to"
      @close="close"
    >
      <template :key="tab" v-for="tab in tabs">
        <lay-tab-item :id="tab.id" :title="tab.title" :closable="tab.closable">
          <template #title>
            <span class="dot"></span>
            {{ tab.title }}
          </template>
        </lay-tab-item>
      </template>
    </lay-tab>
    <lay-dropdown>
      <lay-icon type="layui-icon-down" :class=" appStore.tagsTheme == 'designer' ? 'designer-last-icon' : ''"></lay-icon>
      <template #content>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeAll"
            >关闭全部</lay-dropdown-menu-item
          >
        </lay-dropdown-menu>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeOther"
            >关闭其他</lay-dropdown-menu-item
          >
        </lay-dropdown-menu>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeCurrent"
            >关闭当前</lay-dropdown-menu-item
          >
        </lay-dropdown-menu>
      </template>
    </lay-dropdown>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlobalTab'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useTab } from '../composable/useTab'

const appStore = useAppStore()
const route = useRoute()

const { tabs, to, close, closeAll, closeOther, closeCurrent, currentPath } =
  useTab()
function toChangPage(id: any) {
  to(id)
}
</script>

<style lang="less">
.global-tab {
  display: flex;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 999;
  transition: all 0.3s ease;
}

.global-tab .layui-tab {
  flex-grow: 1;
  width: calc(100% - 40px);
}

.global-tab .layui-tab .layui-tab-bar {
  border: none;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.global-tab .layui-tab .layui-tab-bar.prev {
  border-left: none;
}

.global-tab > i {
  width: 40px;
  background: white;
  height: 100%;
  line-height: 40px;
  text-align: center;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
}

.global-tab .layui-tab .dot {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.1);
  margin-right: 8px;
  border-radius: 50px;
  height: 8px;
  width: 8px;
  transition: all 0.3s ease;
}

.global-tab .layui-tab .layui-this .dot {
  background-color: var(--global-primary-color);
}

.global-tab .layui-tab .layui-tab-close {
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04) !important;
    color: var(--global-primary-color) !important;
  }
}

.designer {
  display: flex;
  width: calc(100% - 15px);
  height: 37px;
  position: relative;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: all 0.3s ease;

  .layui-tab .layui-tab-bar {
    height: 32px;
    line-height: 32px;
    margin-top: 5px;
    transition: all 0.3s ease;
  }

  .layui-tab .layui-tab-bar.prev {
    border-left: none;
    height: 32px;
    line-height: 32px;
    margin-top: 5px;
  }

  box-shadow: none;
  z-index: 999;
  
  .designer-tab {
    display: inline-block;
    flex-grow: 1;
    width: 100%;
    padding-left: 15px;
  }
  
  .designer-tab-item {
    display: inline-block;
    height: 32px !important;
    line-height: 32px !important;
    padding: 0px 10px;
    margin-top: 5px;
    background-color: #fff;
    border-radius: 4px;
    margin-right: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  
  .dot {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.1);
    margin-right: 8px;
    border-radius: 50px;
    height: 8px;
    width: 8px;
    transition: all 0.3s ease;
  }

  .designer-close {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 20px;
    margin-left: 8px;
    top: 1px;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--global-primary-color);
    }
  }
}

.dot-this {
  background-color: var(--global-primary-color) !important;
}

.designer-last-icon {
  width: 32px !important;
  height: 32px !important;
  background: white;
  margin-top: 5px;
  line-height: 32px !important;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.02);
  }
}
</style>
