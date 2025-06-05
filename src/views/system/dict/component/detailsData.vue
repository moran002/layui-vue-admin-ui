<template>
  <lay-layer
      v-model="details"
      :title="titleText"
      :shade="true"
      :shade-close="false"
      :resize="false"
      class="edit-layer"
  >
    <!-- 表格卡片 -->
    <lay-card class="table-card">
      <lay-table
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
  </lay-layer>

  <update-data ref="updateRef" @fetchData="fetchData"/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {layer} from '@layui/layui-vue'
import {DictService} from "@/api/system/dict";
import UpdateData from "@/views/system/dict/component/updateData.vue";


// 表单状态
const details = ref(false);

// 计算标题文本
const titleText = "字典详情";
const query = ref({
  dictType: '',
});
// 表格列配置
const columns = [
  { title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center' },
  { title: '字典标签', width: '120px', key: 'label', align: 'center' },
  { title: '字典键值', width: '260px', key: 'value', ellipsis: true },
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
// 显示编辑表单
const showEdit = (row: any) => {
  query.value.dictType = row.type
  fetchData()
  details.value = true
};

// 数据状态
const loading = ref(true);
const list = ref([]);
const updateRef = ref<any>();
// 数据获取
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await DictService.dataList(query.value);
    list.value = res.data;
  } catch (error) {
    layer.msg("获取数据失败", {icon: 2});
  } finally {
    loading.value = false;
  }
};

// 表格操作
const updateTable = (row: any) => {
  updateRef.value.showEdit(row, query.value.dictType);
};
const delById = (dataId: any) => {
  layer.confirm("确认要删除该角色吗?", {
    title: '删除确认',
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          try {
            const res = await DictService.delData(dataId);
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
defineExpose({showEdit});
</script>

<style scoped>
.edit-layer {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-card {
  padding: 16px;
  height: 100%;
  background-color: #fff;
}

:deep(.layui-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.layui-table-header) {
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.layui-table-tool) {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

:deep(.layui-btn) {
  transition: all 0.3s ease;
  border-radius: 4px;
}

:deep(.layui-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.layui-table-cell) {
  padding: 12px 8px;
}

:deep(.layui-table-row:hover) {
  background-color: #fafafa;
}

:deep(.layui-space) {
  gap: 8px;
}

:deep(.layui-icon) {
  margin-right: 4px;
}

@media (max-width: 768px) {
  .table-card {
    padding: 12px;
  }
  
  :deep(.layui-table-tool) {
    padding: 8px 0;
    margin-bottom: 12px;
  }
  
  :deep(.layui-table-cell) {
    padding: 8px 4px;
  }
}
</style>