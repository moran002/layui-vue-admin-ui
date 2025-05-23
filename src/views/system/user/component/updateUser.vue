<template>
  <lay-layer v-model="update" :title="title" :area="['70%', '100%']">
    <lay-json-schema-form :model="updateParams" :schema="updateSchema" ></lay-json-schema-form>
    <div style="width: 100%; text-align: center">
      <lay-button type="primary" @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
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
    props: {
      type: 'text',
      placeholder: '请输入账号',
    },
    colProps: {
      md: 12,
    }
  },
  nickName: {
    label: '昵称',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入昵称',
    },
    colProps: {
      md: 12
    }
  },
  mobile: {
    label: '手机号',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入手机号',
    },
    colProps: {
      md: 12
    }
  },
  email: {
    label: '邮箱',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入邮箱',
    },
    colProps: {
      md: 12,
    }
  },
  remark: {
    label: '备注',
    type: 'textarea',
    props: {
      placeholder: '请输入备注',
    },
    colProps: {
      md: 20,
    }
  },
  roleIds: {
    label: '角色',
    type: 'select',
    props: {
      multiple: true,
      options: options,
    }
  },
})
</script>

<style scoped>

</style>