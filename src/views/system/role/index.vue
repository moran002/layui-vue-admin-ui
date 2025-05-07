<template>
  <lay-container fluid="true" class="role-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row space="10">
          <lay-col :md="4">
            <lay-form-item label="名称:" label-width="80" size="sm">
              <lay-input v-model="queryRole.name" placeholder="请输入" :allow-clear="true" size="sm"
                         style="width: 100%">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button style="margin-left: 20px" border="blue" size="sm" @click="toSearch">
                查询
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div>
      <lay-table class="table-box" :page="queryRole" :height="'100%'" :columns="columns" :loading="loading"
                 :default-toolbar="['filter']" :data-source="list" @change="change" :autoColsWidth="true">
        <template v-slot:toolbar>
          <lay-button v-permission="['system:role:create']" type="primary" @click="updateTable(null)">
            <lay-icon class="layui-icon-addition">
            </lay-icon>
            新增
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button v-permission="['system:role:update']" size="xs" border="green" border-style="dashed"
                      @click="updateTable(row)"          >编辑
          </lay-button>
          <lay-button v-permission="['system:role:permission']" size="xs" border="blue" border-style="dashed"
                      @click="updatePermissionMenu(row)">分配权限
          </lay-button>
          <lay-button v-permission="['system:role:del']" size="xs" border="blue" border-style="dashed"
                      @click="delById(row.id)">删除
          </lay-button>
        </template>
      </lay-table>
    </div>

    <update-role ref="editRef" @fetchData="fetchData"/>
    <permission-role-menu ref="permissionRef" @fetchData="fetchData"/>
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {layer} from '@layui/layui-vue'
import UpdateRole from "@/views/system/role/component/updateRole.vue";
import PermissionRoleMenu from "@/views/system/role/component/permissionRoleMenu.vue";
import {RoleService} from "@/api/system/role";
import {loading, list, queryRole, columns} from "@/views/system/role/model/role"

const editRef = ref<any>();
const permissionRef = ref<any>();
const fetchData = async () => {
  loading.value = true;
  let res = await RoleService.list(queryRole.value);
  list.value = res.data;
  queryRole.value.total = res.total;
  loading.value = false;
}

const toSearch = () => {
  queryRole.value.pageNo = 1;
  fetchData();
}

const change = async (page: any) => {
  queryRole.value.pageNo = page.current
  queryRole.value.pageSize = page.limit
  await fetchData();
}

onMounted(() => {
  fetchData();
})
// =============== 更新 ===============//
const updateTable = async (row: any) => {
  editRef.value.showEdit(row);
}
// =============== 分配权限 ===============//
const updatePermissionMenu = async (row: any) => {
  permissionRef.value.showPermissionMenu(row);
}
// =============== 删除 ===============//
const delById = (roleId: any) => {
  layer.confirm("确认要删除吗?",
      {
        btn: [
          {
            text: '确定', callback: (id) => {
              RoleService.del(roleId).then((res) => {
                if (res.code == 200) {
                  layer.msg("删除成功");
                  fetchData();
                } else {
                  layer.msg("删除失败");
                }
                layer.close(id);
              })
            }
          },
          {
            text: '取消', callback: (id) => {
              layer.msg("取消");
              layer.close(id);
            }
          }
        ]
      }
  );
}
</script>

<style scoped>
.role-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: 700px;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>