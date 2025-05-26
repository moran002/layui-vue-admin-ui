<template>
  <lay-container fluid="true" class="log-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row space="10">
          <lay-col :md="4">
            <lay-form-item label="类型:" label-width="80" size="sm">
              <lay-input v-model="queryForm.type" placeholder="请输入" :allow-clear="true"
                         size="sm" style="width: 100%">
              </lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="用户:" label-width="80" size="sm">
              <lay-input v-model="queryForm.nickName" placeholder="请输入" :allow-clear="true"
                         size="sm" style="width: 100%">
              </lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button style="margin-left: 20px" border="blue" size="sm" @click="toSearch">
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset">
                重置
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>

    <lay-table class="table-box"  :page="page" :height="'100%'" :columns="columns" :loading="loading"
               :data-source="list" @change="change" :id="list.id" :even="true" :autoColsWidth="true">
    </lay-table>
  </lay-container>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {LogService} from "@/api/system/log";

// =============== 基础查询 ===============//
function toReset() {
  queryForm.value = {
    pageNo: 1,
    pageSize: 10,
    type: '',
    nickName: '',
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
  await LogService.list(queryForm.value).then((res) => {
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

const columns = ref([
  {title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center'},
  {title: '类型', width: '80px', key: 'type', align: 'center'},
  {title: '用户', width: '90px', key: 'nickName', align: 'center'},
  {title: '操作内容', width: '120px', key: 'action', align: 'center'},
  {title: '用户 IP', width: '80px', key: 'userIp', align: 'center'},
  {title: '浏览器', width: '260px', key: 'userAgent', align: 'center'},
  {title: '时间', width: '120px', key: 'createTime', align: 'center'},
])

const queryForm = ref({
  pageNo: 1,
  pageSize: 10,
  type: '',
  nickName: '',
})


onMounted(() => {
  fetchData();
})
</script>

<style scoped>
.log-box {
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
  overflow: auto;
  background-color: #fff;
}
</style>