<template>
  <lay-container fluid="true" class="container">
    <!-- 搜索卡片 -->
    <lay-card class="search-card">
      <lay-form>
        <lay-row :gutter="20">
          <lay-col :md="6" :sm="12" :xs="24">
            <lay-form-item label="类型:" label-width="80">
              <lay-input
                  v-model="query.type"
                  placeholder="请输入字典类型"
                  :allow-clear="true"
                  size="sm"
              ></lay-input>
            </lay-form-item>
          </lay-col>

          <lay-col :md="6" :sm="12" :xs="24">
            <lay-form-item label="名称:" label-width="80">
              <lay-input
                  v-model="query.name"
                  placeholder="请输入字典名称"
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
          :page="query"
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
              v-permission="['system:dict:create']"
              size="sm"
              type="primary"
              @click="updateTable(null)"
          >
            <lay-icon type="addition"></lay-icon>
            新增字典
          </lay-button>
        </template>

        <template v-slot:operator="{ row }">
          <lay-space>
            <lay-button
                v-permission="['system:dict:query']"
                size="sm"
                border="green"
                border-style="dashed"
                @click="detailsTable(row)"
            >
              <lay-icon type="edit"></lay-icon>
              详情
            </lay-button>
            <lay-button
                v-permission="['system:dict:update']"
                size="sm"
                border="green"
                border-style="dashed"
                @click="updateTable(row)"
            >
              <lay-icon type="edit"></lay-icon>
              编辑
            </lay-button>
            <lay-button
                v-permission="['system:dict:del']"
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
    <update-dict ref="editRef" @fetchData="fetchData"/>
    <details-data ref="detailsRef" />
  </lay-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { layer } from '@layui/layui-vue'
import UpdateDict from "@/views/system/dict/component/updateDict.vue";
import {DictService} from "@/api/system/dict";
import DetailsData from "@/views/system/dict/component/detailsData.vue";

// 组件引用
const editRef = ref<any>();
const detailsRef = ref<any>();

// 数据状态
const loading = ref(true);
const list = ref([]);
const query = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  name: '',
  type: '',
});

// 表格列配置
const columns = [
  { title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center' },
  { title: '字典名称', width: '120px', key: 'name', align: 'center' },
  { title: '字典类型', width: '260px', key: 'type', ellipsis: true },
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
    const res = await DictService.list(query.value);
    list.value = res.data;
    query.value.total = res.total;
  } catch (error) {
    layer.msg("获取数据失败", { icon: 2 });
  } finally {
    loading.value = false;
  }
};

// 搜索相关
const toSearch = () => {
  query.value.pageNo = 1;
  fetchData();
};

const resetSearch = () => {
  query.value = {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    name: '',
    type: ''
  };
  fetchData();
};

// 分页变化
const change = async (page: any) => {
  query.value.pageNo = page.current;
  query.value.pageSize = page.limit;
  await fetchData();
};

// 表格操作
const updateTable = (row: any) => {
  editRef.value.showEdit(row);
};

// 表格操作
const detailsTable = (row: any) => {
  detailsRef.value.showEdit(row);
};

const delById = (dictId: any) => {
  layer.confirm("确认要删除该角色吗?", {
    title: '删除确认',
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          try {
            const res = await DictService.del(dictId);
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
.container {
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
  .container {
    padding: 10px;
    height: calc(100vh - 90px);
  }

  .search-card, .table-card {
    border-radius: 2px;
  }
}
</style>