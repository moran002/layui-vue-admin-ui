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

import {update, title, options, updateSchema, updateParams} from "@/views/system/user/model/updateUser";
import {RoleService} from "@/api/system/role";
import {UserService} from "@/api/system/user";
import {layer} from "@layui/layui-vue";


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
</script>

<style scoped>

</style>