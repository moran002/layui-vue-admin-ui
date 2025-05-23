<template>
  <lay-layer v-model="permissionMenu" title="分配权限" :area="['70%', '90%']">
    <div style="height: 80%; overflow: auto">
      <lay-tree
          style="margin-left: 40px"
          :tail-node-icon="false"
          :data="menus"
          :showCheckbox="true"
          v-model:checkedKeys="menuIds"
          v-model:expandKeys="updateRole.menuIds"
      >
        <template #title="{ data }">
          <lay-icon :class="data.icon"></lay-icon>
          {{ data.title }}
        </template>
      </lay-tree>
    </div>
    <lay-line></lay-line>
    <div style="width: 100%; text-align: center">
      <lay-button type="primary"  @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import {layer} from "@layui/layui-vue";
import {permissionMenu, updateRole, menuIds, menus} from "@/views/system/role/model/permissionRole"
import {MenuService} from "@/api/system/menu";
import {RoleService} from "@/api/system/role";
import {ref} from "vue";


const showPermissionMenu = async (row: any) => {
  await findMenus();
  permissionMenu.value = true;
  if (!row) {
    layer.msg('请选择样具体角色', {icon: 2, time: 1000})
  } else {
    menuIds.value = row.menuIds
    updateRole.value = JSON.parse(JSON.stringify(row))
  }
}

const findMenus = async () => {
  let res = await MenuService.simpleList();
  menus.value = res.data;
}
const cancel = () => {
  permissionMenu.value = false;
  updateRole.value = {
    id: '',
    menuIds:[],
  }
  menuIds.value = []
}

const emits = defineEmits(['fetchData']);
const save = () => {
  updateRole.value.menuIds = menuIds.value;
  RoleService.permission(updateRole.value).then(({code, msg}) => {
    if (code === 200) {
      layer.msg('保存成功！', {icon: 1, time: 1000})
      permissionMenu.value = false;
      cancel();
      emits('fetchData')
    } else {
      layer.msg(msg, {icon: 2, time: 1000})
    }
  })
}

defineExpose({showPermissionMenu});

const permissionMenu = ref(false);
const menuIds = ref([]);
const menus = ref([])
const updateRole= ref({
  id: '',
  menuIds: [],
})
</script>

<style scoped>

</style>