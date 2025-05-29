<template>
  <lay-container fluid="true" class="menu-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label-width="20">
              <lay-button
                  style="margin-left: 20px"
                  border="blue" 
                  size="sm"
                  :loading="loading"
                  @click="fetchData"
              >
                <lay-icon class="layui-icon-refresh"></lay-icon>
                刷新
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box">
      <lay-table
          :height="`100%`"
          ref="tableRef6"
          :loading="loading"
          children-column-name="children"
          :columns="columns"
          :data-source="list"
          :default-toolbar="false"
          :expand-index="1"
          :default-expand-all="false"
      >
        <template v-slot:toolbar>
          <lay-button 
              v-permission="['system:menu:create']" 
              @click="updateTable(0, null)" 
              size="sm" 
              type="primary"
          >
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
        </template>
        <template #title="{ row }">
          <lay-icon :class="row.icon"></lay-icon> &nbsp;&nbsp;
          {{ row.title }}
        </template>
        <template #option="{ row }">
          <lay-button 
              v-permission="['system:menu:create']"
              @click="updateTable(1, row)"
              size="xs"
              border="green"
              border-style="dashed"
          >
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
          <lay-button 
              v-permission="['system:menu:update']"
              @click="updateTable(2, row)"
              size="xs"
              border="green"
              border-style="dashed"
          >
            <lay-icon class="layui-icon-edit"></lay-icon>
            修改
          </lay-button>
          <lay-button 
              v-permission="['system:menu:del']"
              @click="delById(row)"
              size="xs"
              border="red"
              border-style="dashed"
          >
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template #type="{ row }">
          <lay-tag :color="row.type === 1 ? '#165DFF' : '#2dc570'" variant="light">
            {{ row.type === 1 ? '菜单' : '按钮' }}
          </lay-tag>
        </template>

        <template #isShow="{ row }">
          <lay-tag :color="row.isShow ? '#165DFF' : '#2dc570'" variant="light">
            {{ row.isShow ? '是' : '否' }}
          </lay-tag>
        </template>
      </lay-table>
    </div>
    <edit-menu ref="editRef" @fetch-data="fetchData"/>
  </lay-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { layer } from '@layui/layui-vue'
import EditMenu from "@/views/system/menu/component/editMenu.vue"
import { MenuService } from "@/api/system/menu"

interface MenuItem {
  id: number
  title: string
  path: string
  component: string
  sort: number
  isShow: boolean
  type: number
  api: string
  createTime: string
  icon?: string
  children?: MenuItem[]
}

interface TableColumn {
  title: string
  key: string
  width?: string
  align?: string
  customSlot?: string
}

const editRef = ref<any>()
const loading = ref(false)
const list = ref<MenuItem[]>([])

const fetchData = async () => {
  try {
    loading.value = true
    const res = await MenuService.list()
    list.value = res.data
  } catch (error) {
    layer.msg('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

const updateTable = (type: number, row: MenuItem | null) => {
  editRef.value.showEdit(type, row)
}

const delById = (row: MenuItem) => {
  layer.confirm('确定要删除该菜单吗？删除后不可恢复！', {
    title: '警告',
    btn: [
      {
        text: '确定',
        callback: async (id: string) => {
          try {
            await MenuService.del(row.id)
            layer.msg('删除成功')
            layer.close(id)
            await fetchData()
          } catch (error) {
            layer.msg('删除失败')
          }
        }
      },
      {
        text: '取消',
        callback: (id: string) => {
          layer.close(id)
        }
      }
    ]
  })
}

const columns: TableColumn[] = [
  { title: '主键', key: 'id', width: '70px', align: 'center' },
  { title: '菜单名称', key: 'title', customSlot: 'title', width: '200px' },
  { title: '路由地址', key: 'path', width: '150px', align: 'center' },
  { title: '组件路径', key: 'component', width: '150px', align: 'center' },
  { title: '排序', width: '70px', key: 'sort', align: 'center' },
  { title: '可见', key: 'isShow', customSlot: 'isShow', width: '80px', align: 'center' },
  { title: '类型', key: 'type', customSlot: 'type', width: '80px', align: 'center' },
  { title: 'API', key: 'api', width: '150px', align: 'center' },
  { title: '创建时间', key: 'createTime', width: '160px', align: 'center' },
  { title: '操作', key: 'option', customSlot: 'option', width: '180px', align: 'center' }
]

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.menu-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: calc(100% - 60px);
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.layui-btn) {
  margin-right: 8px;
}

:deep(.layui-btn:last-child) {
  margin-right: 0;
}
</style>