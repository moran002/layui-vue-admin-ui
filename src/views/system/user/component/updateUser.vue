<template>
  <lay-layer
      v-model="update"
      :title="title"
      :area="['70%', '100%']"
      :shade="true"
      :shade-close="false"
      :resize="false"
      class="form-layer"
  >
    <div class="form-container">
      <lay-json-schema-form
          :model="updateParams"
          :schema="updateSchema"
          class="custom-form"
      ></lay-json-schema-form>

      <div class="form-actions">
        <lay-space>
          <lay-button type="primary" size="lg" @click="save">
            <lay-icon type="ok"></lay-icon>
            提交
          </lay-button>
          <lay-button size="lg" @click="cancel">
            <lay-icon type="close"></lay-icon>
            取消
          </lay-button>
        </lay-space>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">

import {RoleService} from "@/api/system/role";
import {UserService} from "@/api/system/user";
import {layer} from "@layui/layui-vue";
import {reactive, ref} from "vue";


const showEdit = (row: any) => {
  findRoles();
  if (!row) {
    title.value = '添加'
  } else {
    title.value = '编辑'
    updateParams.value = JSON.parse(JSON.stringify(row))
  }
  update.value = true;
}

const findRoles = async () => {
  const res = await RoleService.simpleList();
  options.value = res.data;
}

const cancel = async () => {
  title.value = '';
  update.value = false;
  updateParams.value = {
    id: '',
    account: '',
    nickName: '',
    email: '',
    mobile: '',
    roleIds: [],
  }
}
const emits = defineEmits(['fetchData']);
const save = () => {
  if (updateParams.value.id) {
    UserService.update(updateParams.value).then((res) => {
      update.value = false;
      if (res.code === 200) {
        layer.msg(res.msg, {icon: 1, time: 1000})
        emits('fetchData')
      }
    })
  }else {
    UserService.create(updateParams.value).then((res) => {
      update.value = false;
      if (res.code === 200) {
        layer.msg(res.msg, {icon: 1, time: 1000})
        emits('fetchData')
      }
    })
  }
}
defineExpose({showEdit})

const update = ref(false);
const title = ref("");
const updateParams = ref({
  id: '',
  account: '',
  nickName: '',
  email: '',
  mobile: '',
  roleIds: [],
})
const options = ref({
  label: '',
  value: '',
})
const updateSchema = reactive({
  account: {
    label: '账号',
    type: 'input',
    required: true,
    props: {
      type: 'text',
      placeholder: '请输入账号',
    },
    colProps: {
      md: 12,
      xs: 24
    }
  },
  nickName: {
    label: '昵称',
    type: 'input',
    required: true,
    props: {
      type: 'text',
      placeholder: '请输入昵称',
    },
    colProps: {
      md: 12,
      xs: 24
    }
  },
  mobile: {
    label: '手机号',
    type: 'input',
    props: {
      type: 'tel',
      placeholder: '请输入手机号',
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    ],
    colProps: {
      md: 12,
      xs: 24
    }
  },
  email: {
    label: '邮箱',
    type: 'input',
    props: {
      type: 'email',
      placeholder: '请输入邮箱',
    },
    rules: [
      { type: 'email', message: '请输入正确的邮箱格式' }
    ],
    colProps: {
      md: 12,
      xs: 24
    }
  },
  remark: {
    label: '备注',
    type: 'textarea',
    props: {
      placeholder: '请输入备注',
      rows: 3
    },
    colProps: {
      span: 24
    }
  },
  roleIds: {
    label: '角色',
    type: 'select',
    required: true,
    props: {
      multiple: true,
      options: options,
      placeholder: '请选择角色'
    },
    colProps: {
      span: 24
    }
  },
});
</script>

<style scoped>
.form-layer {
  display: flex;
  flex-direction: column;
}

.form-container {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-form {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.custom-form::-webkit-scrollbar {
  width: 6px;
}

.custom-form::-webkit-scrollbar-thumb {
  background-color: #e6e6e6;
  border-radius: 3px;
}

.form-actions {
  padding: 20px 0;
  border-top: 1px solid #f2f2f2;
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 992px) {
  .form-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 10px;
  }

  .form-actions {
    padding: 15px 0;
  }
}
</style>