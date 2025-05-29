<template>
  <lay-container fluid="true" class="role-container">
    <!-- 搜索卡片 -->
    <lay-card class="search-card">
      <lay-form>
        <lay-row :gutter="20">
          <lay-col :md="6" :sm="12" :xs="24">
            <lay-form-item label="名称:" label-width="80">
              <lay-input
                  v-model="queryRole.name"
                  placeholder="请输入角色名称"
                  :allow-clear="true"
                  size="sm"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24" class="action-col">
            <lay-form-item>
              <lay-space>
                <lay-button border="blue" size="sm" @click="toSearch">
                  <lay-icon type="search"></lay-icon>
                  查询
                </lay-button>
                <lay-button size="sm" @click="resetSearch">
                  <lay-icon type="refresh"></lay-icon>
                  重置
                </lay-button>
              </lay-space>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>

    <!-- 表格卡片 -->
    <lay-card class="table-card">
      <lay-table
          :page="queryRole"
          :height="'100%'"
          :columns="columns"
          :loading="loading"
          :data-source="list"
          @change="change"
          :auto-cols-width="true"
          :even="true"
          :resize="true"
      >
        <template v-slot:toolbar>
          <lay-button
              v-permission="['system:role:create']"
              size="sm"
              type="primary"
              @click="updateTable(null)"
          >
            <lay-icon type="addition"></lay-icon>
            新增角色
          </lay-button>
        </template>

        <template v-slot:operator="{ row }">
          <lay-space>
            <lay-button
                v-permission="['system:role:update']"
                size="sm"
                border="green"
                border-style="dashed"
                @click="updateTable(row)"
            >
              <lay-icon type="edit"></lay-icon>
              编辑
            </lay-button>
            <lay-button
                v-permission="['system:role:permission']"
                size="sm"
                border="blue"
                border-style="dashed"
                @click="updatePermissionMenu(row)"
            >
              <lay-icon type="user"></lay-icon>
              分配权限
            </lay-button>
            <lay-button
                v-permission="['system:role:del']"
                size="sm"
                border="red"
                border-style="dashed"
                @click="delById(row.id)"
            >
              <lay-icon type="delete"></lay-icon>
              删除
            </lay-button>
          </lay-space>
        </template>
      </lay-table>
    </lay-card>

    <!-- 子组件 -->
    <update-role ref="editRef" @fetchData="fetchData"/>
    <permission-role-menu ref="permissionRef" @fetchData="fetchData"/>
  </lay-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { layer } from '@layui/layui-vue'
import UpdateRole from "@/views/system/role/component/updateRole.vue";
import PermissionRoleMenu from "@/views/system/role/component/permissionRoleMenu.vue";
import { RoleService } from "@/api/system/role";

// 组件引用
const editRef = ref<any>();
const permissionRef = ref<any>();

// 数据状态
const loading = ref(true);
const list = ref([]);
const queryRole = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  name: '',
});

// 表格列配置
const columns = [
  { title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center' },
  { title: '角色名称', width: '120px', key: 'name', align: 'center' },
  { title: '备注', width: '260px', key: 'remark', ellipsis: true },
  { title: '创建时间', width: '160px', key: 'createTime', align: 'center' },
  {
    title: '操作',
    width: '220px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right',
    align: 'center'
  }
];

// 生命周期钩子
onMounted(() => {
  fetchData();
});

// 数据获取
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await RoleService.list(queryRole.value);
    list.value = res.data;
    queryRole.value.total = res.total;
  } catch (error) {
    layer.msg("获取数据失败", { icon: 2 });
  } finally {
    loading.value = false;
  }
};

// 搜索相关
const toSearch = () => {
  queryRole.value.pageNo = 1;
  fetchData();
};

const resetSearch = () => {
  queryRole.value = {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    name: ''
  };
  fetchData();
};

// 分页变化
const change = async (page: any) => {
  queryRole.value.pageNo = page.current;
  queryRole.value.pageSize = page.limit;
  await fetchData();
};

// 表格操作
const updateTable = (row: any) => {
  editRef.value.showEdit(row);
};

const updatePermissionMenu = (row: any) => {
  permissionRef.value.showPermissionMenu(row);
};

const delById = (roleId: any) => {
  layer.confirm("确认要删除该角色吗?", {
    title: '删除确认',
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          try {
            const res = await RoleService.del(roleId);
            if (res.code === 200) {
              layer.msg("删除成功", { icon: 1 });
              fetchData();
            } else {
              layer.msg(res.msg || "删除失败", { icon: 2 });
            }
          } catch (error) {
            layer.msg("删除失败", { icon: 2 });
          } finally {
            layer.close(id);
          }
        }
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id);
        }
      }
    ]
  });
};
</script>

<style scoped>
.role-container {
  padding: 15px;
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-card {
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.table-card {
  flex: 1;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.action-col {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .role-container {
    padding: 10px;
    height: calc(100vh - 90px);
  }

  .search-card, .table-card {
    border-radius: 2px;
  }
}
</style>