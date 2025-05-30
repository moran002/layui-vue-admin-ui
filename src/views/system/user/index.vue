<template>
  <lay-container fluid="true" class="user-box">
    <lay-card class="search-card">
      <lay-form>
        <lay-row :gutter="20">
          <lay-col :md="6" :sm="12" :xs="24">
            <lay-form-item label="账号:" label-width="80">
              <lay-input v-model="queryForm.account" placeholder="请输入" :allow-clear="true">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24" v-show="isExpand">
            <lay-form-item label="昵称:" label-width="80">
              <lay-input v-model="queryForm.nickName" placeholder="请输入" :allow-clear="true">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24" v-show="isExpand">
            <lay-form-item label="手机号:" label-width="80">
              <lay-input v-model="queryForm.mobile" placeholder="请输入" :allow-clear="true">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24" v-show="isExpand">
            <lay-form-item label="角色:" label-width="80">
              <lay-input v-model="queryForm.roleId" placeholder="请输入" :allow-clear="true">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24" class="action-col">
            <lay-form-item>
              <lay-space>
                <lay-button border="blue" @click="toSearch">
                  查询
                </lay-button>
                <lay-button @click="toReset">
                  重置
                </lay-button>
                <lay-button type="link" @click="isExpand = !isExpand">
                  {{ isExpand ? '收起' : '展开' }}
                  <lay-icon :type="isExpand ? 'up' : 'down'"></lay-icon>
                </lay-button>
              </lay-space>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>

    <lay-card class="table-card">
      <lay-table
          :page="page"
          :columns="columns"
          :loading="loading"
          :default-toolbar="['filter']"
          :data-source="list"
          @change="change"
          :even="true"
          :auto-cols-width="true">

        <template #status="{ row }">
          <lay-switch :model-value="row.status" @change="changeStatus($event, row)">
          </lay-switch>
        </template>
        <template #avatar="{ row }">
          <lay-avatar radius="true">{{ row.nickName }}</lay-avatar>
        </template>

        <template v-slot:toolbar>
          <lay-space>
            <lay-button v-permission="['system:user:create']" type="primary" @click="updateTable(null)">
              <lay-icon type="addition"></lay-icon>
              新增
            </lay-button>
          </lay-space>
        </template>

        <template v-slot:operator="{ row }">
          <lay-space>
            <lay-button v-permission="['system:user:update']" size="sm" border="green" border-style="dashed" @click="updateTable(row)">
              编辑
            </lay-button>
            <lay-button v-permission="['system:user:password']" size="sm" border="blue" border-style="dashed" @click="passwordTable(row)">
              重置密码
            </lay-button>
            <lay-button v-permission="['system:user:del']" size="sm" border="red" border-style="dashed" @click="delUser(row.id)">
              删除
            </lay-button>
          </lay-space>
        </template>
      </lay-table>
    </lay-card>

    <update-user ref="editRef" @fetchData="fetchData"/>
    <password-user ref="passwordRef"/>
  </lay-container>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {UserService} from "@/api/system/user";
import UpdateUser from "@/views/system/user/component/updateUser.vue";
import {layer} from "@layui/layui-vue";
import PasswordUser from "@/views/system/user/component/passwordUser.vue";

const editRef = ref<any>();
// =============== 删除 ===============//
const delUser = (userId: string) => {
  layer.confirm("确认要删除吗?",
      {
        btn: [
          {
            text: '确定', callback: (id) => {
              UserService.del(userId).then((res) => {
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
// =============== 更新 ===============//
const updateTable = (row: any) => {
  editRef.value.showEdit(row)
}
// =============== 重置密码 ===============//
const passwordRef = ref<any>();
const passwordTable = (row: any) => {
  passwordRef.value.showPassword(row)
}
// =============== 状态变更 ===============//
const changeStatus = (isChecked: boolean, row: any) => {
  row.status = isChecked;
  UserService.status(row).then((res) => {
    if (res.code === 200) {
      layer.msg(res.msg, {icon: 1, time: 1000})
    }
  })
}

// =============== 基础查询 ===============//
function toReset() {
  queryForm.value = {
    pageNo: 1,
    pageSize: 10,
    account: '',
    nickName: '',
    mobile: '',
  }
}

function toSearch() {
  queryForm.value.pageNo = 1
  fetchData()
}

const change = async (page: any) => {
  queryForm.value.pageNo = page.current
  queryForm.value.pageSize = page.limit
  await fetchData();
}

const fetchData = async () => {
  loading.value = true;
  await UserService.list(queryForm.value).then((res) => {
    list.value = res.data;
    page.value.total = res.total;
    loading.value = false;
  });
}
// 列表
const loading = ref(false);
const list = ref([])
const page = ref({
  page: 1,
  pageSize: 10,
  total: '',
  layout: ['count', 'prev', 'page', 'next', 'limits', 'refresh', 'skip'],
})

const columns =  ref([
  {title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center'},
  {title: '姓名', width: '80px', key: 'nickName', align: 'center'},
  // {title: '头像', width: '50px', key: 'avatar', align: 'center', customSlot: 'avatar'},
  {title: '手机号', width: '90px', key: 'mobile', align: 'center'},
  {title: '邮箱', width: '120px', key: 'email', align: 'center'},
  {title: '状态', width: '80px', key: 'status', align: 'center', customSlot: 'status'},
  {title: '签名', width: '260px', key: 'remark'},
  {title: '时间', width: '120px', key: 'createTime', align: 'center'},
  {
    title: '操作',
    width: '120px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])

const isExpand = ref(false)
const queryForm = ref({
  pageNo: 1,
  pageSize: 10,
  account: '',
  nickName: '',
  mobile: '',
})


onMounted(() => {
  fetchData();
})
</script>

<style scoped>
.user-box {
  padding: 15px;
  height: calc(100vh - 110px);
  box-sizing: border-box;
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
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.action-col {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .user-box {
    padding: 10px;
    height: calc(100vh - 90px);
  }

  .search-card, .table-card {
    border-radius: 2px;
  }
}
</style>