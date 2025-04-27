<template>
  <lay-container fluid="true" class="menu-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="菜单名称" label-width="80">
              <lay-input
                v-model="searchQuery.name"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="菜单地址" label-width="80">
              <lay-input
                v-model="searchQuery.address"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="权限标识" label-width="80">
              <lay-input
                v-model="searchQuery.identifying"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="20">
              <lay-button
                style="margin-left: 20px"
                type="normal"
                size="sm"
                @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset"> 重置 </lay-button>
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
        :columns="columns6"
        :data-source="dataSource6"
        :default-toolbar="true"
        :default-expand-all="defaultExpandAll6"
        :expand-index="1"
      >
        <template #toolbar>
          <lay-button type="primary" size="sm" @click="getCheckData6"
            >获取选中数据</lay-button
          >
          <lay-button
            size="sm"
            @click="changeVisible11('新建', null)"
            type="normal"
          >
            新建
          </lay-button>
          <lay-button size="sm" @click="expandAll6(true)">展开全部</lay-button>
          <lay-button size="sm" @click="expandAll6(false)">折叠全部</lay-button>
        </template>
        <template #name="{ row }">
          <lay-icon :class="row.icon"></lay-icon> &nbsp;&nbsp;
          {{ row.name }}
        </template>
        <template #option="{ row }">
          <lay-button
            @click="changeVisible11('新建', null)"
            size="xs"
            border="blue"
            border-style="dashed"
          >
            添加
          </lay-button>
          <lay-button
            @click="changeVisible11('修改', row)"
            size="xs"
            border="green"
            border-style="dashed"
          >
            修改
          </lay-button>
          <lay-button
            @click="toRemove"
            size="xs"
            border="red"
            border-style="dashed"
          >
            删除
          </lay-button>
        </template>
        <template #type="{ row }">
          <div v-show="row.type == '目录'">
            <lay-tag color="#165DFF" variant="light">目录</lay-tag>
          </div>
          <div v-show="row.type == '菜单'">
            <lay-tag color="#2dc570" variant="light">菜单</lay-tag>
          </div>
          <div v-show="row.type == '外链'">
            <lay-tag color="#F5319D" variant="light">外链</lay-tag>
          </div>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['700px', '370px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-row>
            <lay-col md="12">
              <lay-form-item label="菜单名称" prop="name">
                <lay-input v-model="model11.name"></lay-input>
              </lay-form-item>
              <lay-form-item label="路由路径" prop="routePath">
                <lay-input v-model="model11.routePath"></lay-input>
              </lay-form-item>
              <lay-form-item label="组件路径" prop="compontPath">
                <lay-input v-model="model11.compontPath"></lay-input>
              </lay-form-item>
              <lay-form-item label="图标" prop="icon">
                <lay-input v-model="model11.icon"></lay-input>
              </lay-form-item>
            </lay-col>
            <lay-col md="12">
              <lay-form-item label="排序" prop="sort">
                <lay-input-number
                  style="width: 100%"
                  v-model="model11.sort"
                  position="right"
                ></lay-input-number>
              </lay-form-item>
              <lay-form-item label="是否显示" prop="isShow">
                <lay-select v-model="model11.isShow" style="width: 100%">
                  <lay-select-option value="是" label="是"></lay-select-option>
                  <lay-select-option value="否" label="否"></lay-select-option>
                </lay-select>
              </lay-form-item>

              <lay-form-item label="类型" prop="type">
                <lay-input v-model="model11.type"></lay-input>
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 97%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit"
            >保存</lay-button
          >
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { layer } from '@layui/layui-vue'
const searchQuery = ref({
  address: '',
  identifying: '',
  name: ''
})

function toReset() {
  searchQuery.value = {
    address: '',
    identifying: '',
    name: ''
  }
}

function toSearch() {
  page.current = 1
  change(page)
}
const change = (page: any) => {
  loading.value = true
  setTimeout(() => {
    //
    loading.value = false
  }, 1000)
}
const page = reactive({ current: 1, limit: 10, total: 100 })
const loading = ref(false)
const tableRef6 = ref()

const columns6 = [
  {
    fixed: 'left',
    type: 'checkbox',
    title: '复选'
  },

  {
    title: '菜单名称',
    key: 'name',
    customSlot: 'name'
  },
  {
    title: '路由地址',
    key: 'routePath'
  },
  {
    title: '组件路径',
    key: 'compontPath'
  },
  {
    title: '排序',
    width: '120px',
    key: 'sort'
  },
  {
    title: '可见',
    key: 'isShow'
  },
  {
    title: '类型',
    key: 'type',
    customSlot: 'type'
  },
  {
    title: '操作',
    key: 'option',
    customSlot: 'option'
  }
]

const dataSource6 = [
  {
    id: '10001',
    name: '工作空间',
    type: '目录',
    icon: 'layui-icon-home',
    age: 0,
    routePath: '/index',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10009',
        name: '工作台',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-util',
        routePath: '/index/index',
        compontPath: '/index/index',
        isShow: '是'
      }
    ]
  },
  {
    id: '10005',
    icon: 'layui-icon-unlink',
    name: '异常页面',
    type: '目录',
    sort: 5,
    routePath: '/error',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10021',
        name: '403',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-not-found',
        routePath: '/error/403',
        compontPath: '/error/403',
        isShow: '是'
      },
      {
        id: '10022',
        name: '404',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-not-found',
        routePath: '/error/404',
        compontPath: '/error/404',
        isShow: '是'
      },
      {
        id: '10022',
        name: '500',
        type: '菜单',
        sort: 3,
        icon: 'layui-icon-not-found',
        routePath: '/error/500',
        compontPath: '/error/500',
        isShow: '是'
      }
    ]
  },
  {
    id: '10008',
    name: '系统管理',
    type: '目录',
    sort: 10,
    icon: 'layui-icon-set',
    routePath: '/system',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10027',
        name: '用户管理',
        type: '菜单',
        icon: 'layui-icon-home',
        sort: 1,
        routePath: '/system/user',
        compontPath: '/system/user',
        isShow: '是'
      },
      {
        id: '10028',
        name: '角色管理',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-group',
        routePath: '/system/role',
        compontPath: '/system/role',
        isShow: '是'
      },
      {
        id: '10028',
        name: '机构管理',
        type: '菜单',
        sort: 3,
        icon: 'layui-icon-transfer',
        routePath: '/system/organization',
        compontPath: '/system/organization',
        isShow: '是'
      }
    ]
  }
]

const getCheckData6 = function () {
  layer.msg(tableRef6.value.getCheckData())
}

const defaultExpandAll6 = ref(false)

const expandAll6 = function (flag: any) {
  defaultExpandAll6.value = flag
}
const model11 = ref({
  name: '',
  type: '',
  sort: 0,
  icon: '',
  routePath: '',
  compontPath: '',
  isShow: '是'
})
const layFormRef11 = ref()
const visible11 = ref(false)

const title = ref('新增')
const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    let info = JSON.parse(JSON.stringify(row))
    model11.value = info
  } else {
    model11.value = {
      name: '',
      type: '',
      sort: 0,
      icon: '',
      routePath: '',
      compontPath: '',
      isShow: '是'
    }
  }
  visible11.value = !visible11.value
}
const submit11 = function () {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    layer.open({
      type: 1,
      title: '表单提交结果',
      content: `<div style="padding: 10px"><p>是否通过 : ${isValidate}</p> <p>表单数据 : ${JSON.stringify(
        model
      )} </p> <p>错误信息 : ${JSON.stringify(errors)}</p></div>`,
      shade: false,
      isHtmlFragment: true,
      btn: [
        {
          text: '确认',
          callback(index: number) {
            layer.close(index)
          }
        }
      ],
      area: '500px'
    })
  })
}
// 清除校验
const clearValidate11 = function () {
  layFormRef11.value.clearValidate()
}
// 重置表单
const reset11 = function () {
  layFormRef11.value.reset()
}
function toRemove() {
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          layer.msg('您已成功删除')
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.msg('您已取消操作')
          layer.close(id)
        }
      }
    ]
  })
}
function toSubmit() {
  layer.msg('保存成功！', { icon: 1, time: 1000 })
  visible11.value = false
}
function toCancel() {
  visible11.value = false
}
</script>

<style scoped>
.menu-box {
  width: calc(100vw - 220px);
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
.table-style {
  margin-top: 10px;
}
.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>