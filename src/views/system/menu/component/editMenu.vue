<template>
  <lay-layer v-model="edit" :title="title" :area="['70%', '90%']" :shade="0.3">
    <div class="menu-edit-container">
      <lay-json-schema-form 
        :model="updateMenu" 
        :schema="schema"
        :validate="validate"
        class="menu-form"
      ></lay-json-schema-form>
      <div class="form-actions">
        <lay-button type="primary" @click="handleSave" :loading="loading">提交</lay-button>
        <lay-button size="sm" @click="handleCancel">取消</lay-button>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { layer } from "@layui/layui-vue";
import { MenuService } from "@/api/system/menu";
import { reactive, ref, defineExpose } from "vue";

// 定义组件事件
const emit = defineEmits(['fetchData']);

// 响应式状态
const edit = ref(false);
const loading = ref(false);
const title = ref('');
const updateMenu = ref({
  id: '',
  parentId: '',
  name: '',
  title: '',
  type: 1,
  sort: 0,
  icon: '',
  path: '',
  component: '',
  isShow: true,
  api: '',
});

// 表单验证规则
const validate = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单标识', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
};

// 表单配置
const schema = reactive({
  parentId: {
    label: '上级菜单',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入上级菜单ID',
    }
  },
  name: {
    label: '菜单标识',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入菜单标识',
    }
  },
  title: {
    label: '菜单名称',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入菜单名称',
    }
  },
  path: {
    label: '路由路径',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入路由路径',
    }
  },
  component: {
    label: '组件路径',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入组件路径',
    }
  },
  api: {
    label: '接口地址',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入接口地址',
    }
  },
  icon: {
    label: '图标',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入图标名称',
    }
  },
  sort: {
    label: '排序',
    type: 'input',
    props: {
      type: 'number',
      min: 0,
      max: 999,
      placeholder: '请输入排序号',
    }
  },
  isShow: {
    label: '是否显示',
    type: 'switch',
    props: {
      layText: ['显示', '隐藏']
    }
  },
  type: {
    label: '菜单类型',
    type: 'radio',
    props: {
      options: [
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "按钮",
          value: 2,
        },
      ]
    }
  },
});

// 显示编辑弹窗
const showEdit = async (type: number, row: any) => {
  edit.value = true;
  if (type === 0) {
    title.value = "新增菜单";
  } else if (type === 1) {
    title.value = "新增子菜单";
    updateMenu.value.parentId = row.id;
  } else {
    title.value = "编辑菜单";
    updateMenu.value = JSON.parse(JSON.stringify(row));
  }
};

// 取消编辑
const handleCancel = () => {
  updateMenu.value = {
    id: '',
    parentId: '',
    name: '',
    title: '',
    type: 1,
    sort: 0,
    icon: '',
    path: '',
    component: '',
    isShow: true,
    api: '',
  };
  title.value = '';
  edit.value = false;
};

// 保存菜单
const handleSave = async () => {
  try {
    loading.value = true;
    const { code, msg } = updateMenu.value.id
      ? await MenuService.update(updateMenu.value)
      : await MenuService.create(updateMenu.value);

    if (code === 200) {
      layer.msg('保存成功！', { icon: 1, time: 1000 });
      handleCancel();
      emit('fetchData');
    } else {
      layer.msg(msg, { icon: 2, time: 1000 });
    }
  } catch (error) {
    layer.msg('操作失败，请重试', { icon: 2, time: 1000 });
  } finally {
    loading.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  showEdit
});
</script>

<style scoped>
.menu-edit-container {
  padding: 20px;
}

.menu-form {
  margin-bottom: 20px;
}

.form-actions {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-actions .layui-btn {
  margin: 0 10px;
}
</style>