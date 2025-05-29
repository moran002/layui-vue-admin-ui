<template>
  <lay-layer 
    v-model="permissionMenu" 
    title="分配权限" 
    :area="['70%', '90%']"
    class="permission-menu-layer"
  >
    <div class="tree-container">
      <lay-tree
        :data="menus"
        :showCheckbox="true"
        :tail-node-icon="false"
        v-model:checkedKeys="menuIds"
        v-model:expandKeys="updateRole.menuIds"
        class="permission-tree"
      >
        <template #title="{ data }">
          <lay-icon :class="data.icon"></lay-icon>
          <span class="menu-title">{{ data.title }}</span>
        </template>
      </lay-tree>
    </div>
    <lay-line></lay-line>
    <div class="action-container">
      <lay-space>
        <lay-button type="primary" @click="save">
          <lay-icon type="ok"></lay-icon>
          提交
        </lay-button>
        <lay-button @click="cancel">
          <lay-icon type="close"></lay-icon>
          取消
        </lay-button>
      </lay-space>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { layer } from "@layui/layui-vue";
import { MenuService } from "@/api/system/menu";
import { RoleService } from "@/api/system/role";
import { ref, reactive } from "vue";

// Types
interface MenuItem {
  id: string | number;
  title: string;
  icon?: string;
  children?: MenuItem[];
}

interface Role {
  id: string | number;
  menuIds: (string | number)[];
  [key: string]: any;
}

// State
const permissionMenu = ref(false);
const menuIds = ref<(string | number)[]>([]);
const menus = ref<MenuItem[]>([]);
const updateRole = ref<Role>({
  id: '',
  menuIds: [],
});

// Emits
const emits = defineEmits(['fetchData']);

// Methods
const showPermissionMenu = async (row: Role) => {
  try {
    await findMenus();
    permissionMenu.value = true;
    
    if (!row) {
      layer.msg('请选择具体角色', { icon: 2, time: 1000 });
      return;
    }
    
    menuIds.value = row.menuIds || [];
    updateRole.value = JSON.parse(JSON.stringify(row));
  } catch (error) {
    layer.msg('加载菜单失败', { icon: 2, time: 1000 });
  }
};

const findMenus = async () => {
  try {
    const res = await MenuService.simpleList();
    menus.value = res.data;
  } catch (error) {
    layer.msg('获取菜单列表失败', { icon: 2, time: 1000 });
    throw error;
  }
};

const cancel = () => {
  permissionMenu.value = false;
  resetState();
};

const resetState = () => {
  updateRole.value = {
    id: '',
    menuIds: [],
  };
  menuIds.value = [];
};

const save = async () => {
  try {
    updateRole.value.menuIds = menuIds.value;
    const { code, msg } = await RoleService.permission(updateRole.value);
    
    if (code === 200) {
      layer.msg('保存成功！', { icon: 1, time: 1000 });
      permissionMenu.value = false;
      resetState();
      emits('fetchData');
    } else {
      layer.msg(msg || '保存失败', { icon: 2, time: 1000 });
    }
  } catch (error) {
    layer.msg('保存失败，请重试', { icon: 2, time: 1000 });
  }
};

defineExpose({ showPermissionMenu });
</script>

<style scoped>
.permission-menu-layer {
  display: flex;
  flex-direction: column;
}

.tree-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  min-height: 300px;
}

.permission-tree {
  margin-left: 20px;
}

.menu-title {
  margin-left: 8px;
}

.action-container {
  padding: 15px;
  text-align: center;
  background-color: #fafafa;
}

/* Scrollbar styling */
.tree-container::-webkit-scrollbar {
  width: 6px;
}

.tree-container::-webkit-scrollbar-thumb {
  background-color: #e6e6e6;
  border-radius: 3px;
}

.tree-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tree-container {
    padding: 15px;
  }
  
  .permission-tree {
    margin-left: 10px;
  }
}
</style>