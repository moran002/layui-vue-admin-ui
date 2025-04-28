<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row space="10">
          <lay-col :md="4">
            <lay-form-item label="账号:" label-width="80" size="sm">
              <lay-input
                  v-model="queryForm.account"
                  placeholder="请输入"
                  :allow-clear="true"
                  size="sm"
                  style="width: 100%"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4" v-show="isExpand">
            <lay-form-item label="昵称:" label-width="80" size="sm">
              <lay-input
                  v-model="queryForm.nickName"
                  placeholder="请输入"
                  :allow-clear="true"
                  size="sm"
                  style="width: 100%"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4" v-show="isExpand">
            <lay-form-item label="手机号:" label-width="80" size="sm">
              <lay-input
                  v-model="queryForm.mobile"
                  placeholder="请输入"
                  :allow-clear="true"
                  size="sm"
                  style="width: 100%"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4" v-show="isExpand">
            <lay-form-item label="角色:" label-width="80" size="sm">
              <lay-input
                  v-model="queryForm.roleId"
                  placeholder="请输入"
                  :allow-clear="true"
                  size="sm"
                  style="width: 100%"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button
                  style="margin-left: 20px"
                  border="blue"
                  size="sm"
                  @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset">
                重置
              </lay-button>
              <lay-button size="sm" type="link" @click="isExpand = !isExpand">
                {{ isExpand ? '收起' : '展开' }}
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>

    <div class="table-box">
      <lay-table
          :page="page"
          :height="'100%'"
          :columns="columns"
          :loading="loading"
          :default-toolbar="['filter']"
          :data-source="list"
          @change="change"
          :id="list.id"
      >
        <template #status="{ row }">
          <lay-switch
              :model-value="row.status"
              @change="changeStatus($event, row)"
          ></lay-switch>
        </template>
        <template #avatar="{ row }">
          <lay-avatar radius="true">{{row.nickName}}</lay-avatar>
        </template>

        <template v-slot:toolbar>
          <lay-button
              size="sm"
              type="primary"
              @click="updateTable('新增', null)"
          >
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button
          >
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
              size="xs"
              type="primary"
              @click="updateTable('编辑', row)"
          >编辑
          </lay-button
          >
          <lay-popconfirm
              content="确定要删除此用户吗?"
              @confirm="confirm"
              @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
            >删除
            </lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <update-user ref="editRef" @fetchData="fetchData"/>
  </lay-container>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {queryForm, list, loading, page, columns, isExpand} from './model/user';
import {UserService} from "@/api/system/user";
import UpdateUser from "@/views/system/user/component/updateUser.vue";

const editRef = ref<any>();
// =============== 更新 ===============//
const updateTable = (row: any) => {
  editRef.value.showEdit(row)
}
const passwordRef = ref<any>();

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

// 新增/编辑

onMounted(() => {
  fetchData();
})
</script>

<style scoped>
.user-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.top-search {
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
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

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}

.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>